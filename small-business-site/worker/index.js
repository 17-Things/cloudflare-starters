/**
 * The only code that runs on the server. Pages are files in dist/, served free.
 * Cloudflare runs this script only for /api/* and /enquiries (see wrangler.jsonc).
 *
 *   POST /api/enquiry   check and save an enquiry, then email it if email is set up
 *   GET  /enquiries     read saved enquiries, behind ADMIN_PASSWORD
 *
 * Every enquiry is saved in the ENQUIRIES KV namespace, so nothing is lost.
 * Email is optional: see "Email each enquiry to you" in README.md.
 */

import { EmailMessage } from 'cloudflare:email';

const LIMITS = { name: 120, email: 200, phone: 40, type: 80, message: 5000, page: 200 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DEFAULT_PASSWORD = 'choose-a-long-password';
const PAGE_SIZE = 50;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/enquiry') {
      if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405, { Allow: 'POST' });
      return handleEnquiry(request, env);
    }
    if (url.pathname === '/enquiries' && request.method === 'GET') return listEnquiries(request, env, url);
    return env.ASSETS.fetch(request);
  },
};

async function handleEnquiry(request, env) {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  const fail = (error, status = 400) =>
    wantsJson ? json({ ok: false, error }, status) : html('Message not sent', `<p>${escapeHtml(error)}</p><p><a href="/contact/">Go back</a></p>`, status);

  let data;
  try {
    data = await request.formData();
  } catch {
    return fail('We could not read the form. Please try again.');
  }
  const get = (k) => String(data.get(k) ?? '').trim().slice(0, LIMITS[k] ?? 200);

  // Spam checks: a hidden field people never fill in, and a form sent impossibly fast.
  // Both pretend to succeed, so a bot learns nothing.
  if (get('website')) return done(wantsJson, request);
  const started = Number(data.get('t'));
  if (started && Date.now() - started < 2500) return done(wantsJson, request);

  const entry = {
    name: get('name'),
    email: get('email'),
    phone: get('phone'),
    type: get('type'),
    message: get('message'),
    page: get('page'),
    receivedAt: new Date().toISOString(),
    country: request.cf?.country || '',
  };
  if (!entry.name || !entry.email || !entry.message) return fail('Please complete your name, email and message.');
  if (!EMAIL_RE.test(entry.email)) return fail('Please check your email address.');

  // Light rate limit: 8 messages an hour from one connection. The IP address is hashed, not stored.
  const ipKey = `rate:${await sha256(request.headers.get('CF-Connecting-IP') || 'unknown')}`;
  const count = Number((await env.ENQUIRIES.get(ipKey)) || 0);
  if (count >= 8) return fail('Too many messages from this connection. Please try again later.', 429);
  await env.ENQUIRIES.put(ipKey, String(count + 1), { expirationTtl: 3600 });

  // Keys sort newest first: the number counts down as time goes on.
  const id = `enquiry:${String(9_999_999_999_999 - Date.now()).padStart(13, '0')}:${crypto.randomUUID().slice(0, 8)}`;
  await env.ENQUIRIES.put(id, JSON.stringify(entry));

  if (env.EMAIL && env.ENQUIRY_TO && env.ENQUIRY_FROM) {
    const sent = await sendEmail(env, entry);
    if (!sent) console.error('Email failed; the enquiry is still saved in KV', id);
  }
  return done(wantsJson, request);
}

// Cloudflare Email Routing. Builds a plain-text email by hand, so there is no dependency.
// https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/
async function sendEmail(env, e) {
  const rows = [['Name', e.name], ['Email', e.email], ['Phone', e.phone], ['About', e.type], ['Sent from', e.page], ['Received', e.receivedAt]]
    .filter(([, v]) => v);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\n${e.message}\n`;
  const subject = `Enquiry: ${e.type || 'General'} from ${e.name}`;
  const b64 = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
  const header = (s) => (/^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${b64(s)}?=`);
  const from = env.ENQUIRY_FROM;
  const fromAddr = (from.match(/<([^>]+)>/) || [, from])[1].trim();
  const fromName = from.includes('<') ? from.split('<')[0].trim().replace(/^"|"$/g, '') : 'Website';
  const raw = [
    `From: ${header(fromName)} <${fromAddr}>`,
    `To: ${env.ENQUIRY_TO}`,
    `Reply-To: ${header(e.name.replace(/[\r\n"]/g, ''))} <${e.email.replace(/[\r\n<>]/g, '')}>`,
    `Subject: ${header(subject.replace(/[\r\n]/g, ' '))}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${fromAddr.split('@')[1]}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64(text).replace(/.{76}/g, '$&\r\n'),
  ].join('\r\n');
  try {
    await env.EMAIL.send(new EmailMessage(fromAddr, env.ENQUIRY_TO, raw));
    return true;
  } catch (err) {
    console.error('Email Routing send failed', err && err.message);
    return false;
  }
}

async function listEnquiries(request, env, url) {
  const password = env.ADMIN_PASSWORD;
  if (!password || password === DEFAULT_PASSWORD) {
    return new Response('Set the ADMIN_PASSWORD secret first (Cloudflare dashboard → your Worker → Settings → Variables and Secrets).', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
  if (!authorised(request.headers.get('Authorization'), password)) {
    return new Response('Sign in to read enquiries.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Enquiries", charset="UTF-8"', 'Cache-Control': 'no-store' },
    });
  }

  const cursor = url.searchParams.get('cursor') || undefined;
  const list = await env.ENQUIRIES.list({ prefix: 'enquiry:', limit: PAGE_SIZE, cursor });
  const entries = await Promise.all(list.keys.map((k) => env.ENQUIRIES.get(k.name, 'json')));
  const items = entries.filter(Boolean).map(
    (e) => `<article>
  <p class="meta"><strong>${escapeHtml(e.name)}</strong> · <a href="mailto:${escapeHtml(e.email)}">${escapeHtml(e.email)}</a>${e.phone ? ` · ${escapeHtml(e.phone)}` : ''} · ${escapeHtml(e.receivedAt.replace('T', ' ').slice(0, 16))} UTC</p>
  ${e.type ? `<p class="meta">About: ${escapeHtml(e.type)}</p>` : ''}
  <p>${escapeHtml(e.message).replace(/\n/g, '<br>')}</p>
</article>`
  );
  const more = list.list_complete ? '' : `<p><a href="/enquiries?cursor=${encodeURIComponent(list.cursor)}">Older enquiries</a></p>`;
  return html('Enquiries', `<h1>Enquiries</h1><p>Newest first, ${PAGE_SIZE} a page.</p>${items.join('\n') || '<p>No enquiries yet.</p>'}${more}`);
}

function done(wantsJson, request) {
  return wantsJson ? json({ ok: true }) : Response.redirect(new URL('/contact/thank-you/', request.url).toString(), 303);
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });
}

function html(title, body, status = 200) {
  return new Response(
    `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)}</title>
<style>body{margin:0 auto;max-width:44rem;padding:2rem 1.25rem;font:17px/1.6 system-ui,sans-serif;color:#1d1d1b;background:#fbfaf7}article{background:#fff;border:1px solid #e4e1da;border-radius:4px;padding:1rem 1.25rem;margin:0 0 1rem}.meta{color:#5c5c57;font-size:.9rem;margin:0 0 .5rem}a{color:#2f6f4f}</style>
</head><body>${body}</body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } }
  );
}

async function sha256(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function authorised(header, password) {
  if (!header?.startsWith('Basic ')) return false;
  let decoded;
  try {
    decoded = new TextDecoder().decode(Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0)));
  } catch {
    return false;
  }
  return sameText(decoded.slice(decoded.indexOf(':') + 1), password);
}

// Compares every character, so the time taken does not reveal how much matched.
function sameText(a, b) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}
