/**
 * The only code in this site. Cloudflare runs it for /api/* and /messages;
 * every other request is a file, served free.
 *
 *   GET  /api/config   the Turnstile site key, for the form
 *   POST /api/contact  check Turnstile, save the message, go to /thanks
 *   GET  /messages     the saved messages, behind ADMIN_PASSWORD
 */

const LIMITS = { name: 200, email: 320, message: 5000 };
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

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
    return env.ASSETS.fetch(request);
  },
};

async function contact(request, env) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return back('invalid');
  }

  const name = clean(form.get('name'), LIMITS.name);
  const email = clean(form.get('email'), LIMITS.email);
  const message = clean(form.get('message'), LIMITS.message);
  if (!name || !email || !message || !email.includes('@')) return back('missing');

  // Turnstile: the token is single-use and expires after five minutes.
  // https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
  const token = form.get('cf-turnstile-response');
  if (typeof token !== 'string' || !token) return back('spam');
  const check = await fetch(SITEVERIFY, {
    method: 'POST',
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY ?? '',
      response: token,
      remoteip: request.headers.get('CF-Connecting-IP') ?? '',
    }),
  });
  const outcome = await check.json().catch(() => ({ success: false }));
  if (!outcome.success) return back('spam');

  await env.DB.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)')
    .bind(name, email, message)
    .run();

  return Response.redirect(new URL('/thanks', request.url).toString(), 303);
}

async function messages(request, env) {
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

  const { results } = await env.DB.prepare(
    'SELECT name, email, message, created_at FROM messages ORDER BY id DESC LIMIT 200',
  ).all();

  const rows = results.length
    ? results
        .map(
          (m) => `<article>
  <p class="meta"><strong>${escape(m.name)}</strong> · <a href="mailto:${escape(m.email)}">${escape(m.email)}</a> · ${escape(m.created_at)} UTC</p>
  <p>${escape(m.message).replace(/\n/g, '<br>')}</p>
</article>`,
        )
        .join('\n')
    : '<p>No messages yet.</p>';

  return new Response(
    `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Messages</title>
<style>body{margin:0 auto;max-width:44rem;padding:2rem 1.25rem;font:17px/1.6 system-ui,sans-serif;color:#1d1d1b;background:#fbfaf7}article{background:#fff;border:1px solid #e4e1da;border-radius:4px;padding:1rem 1.25rem;margin:0 0 1rem}.meta{color:#5c5c57;font-size:.9rem;margin:0 0 .5rem}a{color:#2f6f4f}</style>
</head><body><h1>Messages</h1><p>The newest 200, newest first.</p>${rows}</body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );
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
    decoded = atob(header.slice(6));
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
