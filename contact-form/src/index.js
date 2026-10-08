/**
 * The only server code in this site. Cloudflare runs it for /api/* and
 * /messages; every other request is a file, served free.
 *
 *   GET  /api/config        the Turnstile site key, for the form
 *   POST /api/contact       check Turnstile, save the message, go to /thanks
 *                           (or answer with JSON when the page asks for it)
 *   GET  /messages          your inbox, behind ADMIN_PASSWORD
 *   POST /messages/replied  mark a message as replied (or not), same password
 */

const LIMITS = { name: 200, email: 320, phone: 40, topic: 80, message: 5000 };
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9+()\-.\s]{7,40}$/;

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/config' && request.method === 'GET') {
      return Response.json({ siteKey: env.TURNSTILE_SITE_KEY });
    }
    if (pathname === '/api/contact' && request.method === 'POST') {
      return contact(request, env);
    }
    if (pathname === '/messages' && request.method === 'GET') {
      return messages(request, env);
    }
    if (pathname === '/messages/replied' && request.method === 'POST') {
      return markReplied(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

// ---------------------------------------------------------------------------
// The contact form
// ---------------------------------------------------------------------------
async function contact(request, env) {
  // The page sends "Accept: application/json" when JavaScript is on. Without
  // JavaScript, the browser posts the form and we redirect, as before.
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  const fail = (reason, fields = {}) =>
    wantsJson ? Response.json({ ok: false, error: reason, fields }, { status: 422 }) : back(reason);
  const done = () =>
    wantsJson ? Response.json({ ok: true }) : Response.redirect(new URL('/thanks', request.url).toString(), 303);

  let form;
  try {
    form = await request.formData();
  } catch {
    return fail('invalid');
  }

  // A box only robots fill in. Say thanks, save nothing.
  if (clean(form.get('company'), 200)) return done();

  const name = clean(form.get('name'), LIMITS.name);
  const email = clean(form.get('email'), LIMITS.email);
  const phone = clean(form.get('phone'), LIMITS.phone);
  const topic = clean(form.get('topic'), LIMITS.topic);
  const message = clean(form.get('message'), LIMITS.message);

  const fields = {};
  if (!name) fields.name = 'Enter your name';
  if (!email) fields.email = 'Enter your email address';
  else if (!EMAIL.test(email)) fields.email = 'Enter an email address like name@example.com';
  if (phone && !PHONE.test(phone)) fields.phone = 'Enter a phone number, or leave this box empty';
  if (!message) fields.message = 'Write a short message';
  if (Object.keys(fields).length) {
    const onlyEmail = Object.keys(fields).length === 1 && fields.email && email;
    return fail(onlyEmail ? 'email' : 'missing', fields);
  }

  // Turnstile: the token is single-use and expires after five minutes.
  // https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
  const token = form.get('cf-turnstile-response');
  if (typeof token !== 'string' || !token) return fail('spam');
  const check = await fetch(SITEVERIFY, {
    method: 'POST',
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY ?? '',
      response: token,
      remoteip: request.headers.get('CF-Connecting-IP') ?? '',
    }),
  });
  const outcome = await check.json().catch(() => ({ success: false }));
  if (!outcome.success) return fail('spam');

  await env.DB.prepare('INSERT INTO messages (name, email, phone, topic, message) VALUES (?, ?, ?, ?, ?)')
    .bind(name, email, phone || null, topic || null, message)
    .run();

  return done();
}

// ---------------------------------------------------------------------------
// The inbox at /messages
// ---------------------------------------------------------------------------
async function messages(request, env) {
  const locked = guard(request, env);
  if (locked) return locked;

  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim().slice(0, 100);
  const show = url.searchParams.get('show') === 'waiting' ? 'waiting' : 'all';

  const where = [];
  const binds = [];
  if (q) {
    const like = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    where.push("(name LIKE ?1 ESCAPE '\\' OR email LIKE ?1 ESCAPE '\\' OR message LIKE ?1 ESCAPE '\\' OR topic LIKE ?1 ESCAPE '\\')");
    binds.push(like);
  }
  if (show === 'waiting') where.push('replied_at IS NULL');
  const sql = `SELECT id, name, email, phone, topic, message, created_at, replied_at FROM messages
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY id DESC LIMIT 200`;

  const [{ results }, counts] = await Promise.all([
    env.DB.prepare(sql).bind(...binds).all(),
    env.DB.prepare('SELECT COUNT(*) AS total, SUM(CASE WHEN replied_at IS NULL THEN 1 ELSE 0 END) AS waiting FROM messages').first(),
  ]);
  const total = counts?.total ?? 0;
  const waiting = counts?.waiting ?? 0;
  const params = new URLSearchParams({ ...(q && { q }), ...(show === 'waiting' && { show }) }).toString();
  const returnTo = params ? `/messages?${params}` : '/messages';

  const cards = results.length
    ? results.map((m) => card(m, returnTo)).join('\n')
    : `<div class="inbox-empty"><h2>${q ? 'Nothing matches that search' : 'No messages yet'}</h2><p>${
        q ? 'Try a different word, or clear the search.' : 'When someone sends the form, their message appears here.'
      }</p></div>`;

  const tab = (value, label, count) =>
    `<a href="/messages?${new URLSearchParams({ ...(q && { q }), ...(value === 'waiting' && { show: value }) })}"${
      show === value ? ' aria-current="page"' : ''
    }>${label} <span>${count}</span></a>`;

  return html(`<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Messages</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="inbox-page">
<a class="skip-link" href="#main">Skip to messages</a>
<header class="site-header is-scrolled"><div class="wrap">
  <a class="brand" href="/"><span class="brand-name">Messages <small>From your contact form</small></span></a>
  <a class="button button--ghost" href="/">View site</a>
</div></header>
<main id="main" class="wrap inbox">
  <div class="inbox-head">
    <h1>Your messages</h1>
    <p>${waiting ? `${waiting} waiting for a reply.` : 'You are all caught up.'} The newest 200 show first. Times are UK time.</p>
  </div>
  <div class="inbox-tools">
    <form class="inbox-search" method="get" action="/messages" role="search">
      <label for="q" class="visually-hidden">Search messages</label>
      <input id="q" name="q" type="search" value="${escape(q)}" placeholder="Search by name, email or words">
      ${show === 'waiting' ? '<input type="hidden" name="show" value="waiting">' : ''}
      <button class="button" type="submit">Search</button>
    </form>
    <nav class="inbox-tabs" aria-label="Filter">${tab('all', 'All', total)}${tab('waiting', 'Waiting', waiting)}</nav>
  </div>
  <div class="inbox-list">${cards}</div>
</main>
</body>
</html>`);
}

function card(m, returnTo) {
  const replied = Boolean(m.replied_at);
  const when = ukTime(m.created_at);
  const subject = encodeURIComponent('Re: your message');
  const tel = m.phone ? m.phone.replace(/[^0-9+]/g, '') : '';
  return `<article class="message${replied ? ' is-replied' : ''}" aria-labelledby="m${m.id}">
  <div class="message-top">
    <div>
      <h2 id="m${m.id}">${escape(m.name)}</h2>
      <p class="message-meta"><time datetime="${escape(m.created_at)}Z">${escape(when)}</time>${m.topic ? ` · <span class="message-topic">${escape(m.topic)}</span>` : ''}</p>
    </div>
    <span class="message-state">${replied ? 'Replied' : 'Waiting'}</span>
  </div>
  <p class="message-body">${escape(m.message).replace(/\n/g, '<br>')}</p>
  <div class="message-actions">
    <a class="button" href="mailto:${escape(m.email)}?subject=${subject}">Reply to ${escape(m.email)}</a>
    ${tel ? `<a class="button button--ghost" href="tel:${escape(tel)}">Call ${escape(m.phone)}</a>` : ''}
    <form method="post" action="/messages/replied">
      <input type="hidden" name="id" value="${Number(m.id)}">
      <input type="hidden" name="replied" value="${replied ? '0' : '1'}">
      <input type="hidden" name="back" value="${escape(returnTo)}">
      <button class="button button--ghost" type="submit">${replied ? 'Mark as waiting' : 'Mark as replied'}</button>
    </form>
  </div>
</article>`;
}

async function markReplied(request, env) {
  const locked = guard(request, env);
  if (locked) return locked;

  // Only accept this from your own site, so another site cannot press the
  // button for you while you are signed in.
  const origin = request.headers.get('Origin');
  const sameSite = request.headers.get('Sec-Fetch-Site') === 'same-origin' || origin === new URL(request.url).origin;
  if (!sameSite) {
    return new Response('This button only works from your own site.', { status: 403 });
  }

  const form = await request.formData().catch(() => null);
  const id = Number(form?.get('id'));
  if (!Number.isInteger(id) || id < 1) return new Response('Unknown message.', { status: 400 });
  const replied = form.get('replied') === '1';
  await env.DB.prepare(`UPDATE messages SET replied_at = ${replied ? "datetime('now')" : 'NULL'} WHERE id = ?`)
    .bind(id)
    .run();

  // Go back to the same list. Only allow paths inside /messages.
  const wanted = String(form.get('back') || '/messages');
  const safeBack = /^\/messages(\?[^#\s]*)?$/.test(wanted) ? wanted : '/messages';
  return new Response(null, { status: 303, headers: { Location: `${safeBack}#m${id}` } });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Returns a response if the visitor may not see the inbox, or null if they may.
function guard(request, env) {
  const password = env.ADMIN_PASSWORD;
  if (!password || password === 'choose-a-long-password') {
    return new Response(
      'Set the ADMIN_PASSWORD secret first (Cloudflare dashboard → your Worker → Settings → Variables and Secrets).',
      { status: 503 },
    );
  }
  if (!authorised(request.headers.get('Authorization'), password)) {
    return new Response('Sign in to read messages.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Messages", charset="UTF-8"' },
    });
  }
  return null;
}

function html(body) {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Content-Security-Policy':
        "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'none'; font-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      'Referrer-Policy': 'same-origin',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
  });
}

function ukTime(sqlTime) {
  const date = new Date(`${String(sqlTime).replace(' ', 'T')}Z`);
  if (Number.isNaN(date.getTime())) return String(sqlTime);
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function back(reason) {
  return new Response(null, { status: 303, headers: { Location: `/?error=${reason}#contact` } });
}

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function escape(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function authorised(header, password) {
  if (!header?.startsWith('Basic ')) return false;
  let decoded;
  try {
    // Browsers send the password as UTF-8, so decode the bytes as UTF-8.
    const bytes = Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0));
    decoded = new TextDecoder().decode(bytes);
  } catch {
    return false;
  }
  const given = decoded.slice(decoded.indexOf(':') + 1);
  return sameText(given, password);
}

// Compares every character, so the time taken does not reveal how much matched.
function sameText(a, b) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}
