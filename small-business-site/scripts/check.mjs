// Checks a running site: every page answers 200, has one h1, a description and valid
// JSON-LD, every photo has alt text and a size, and every internal link and file resolves.
// Usage: node scripts/check.mjs http://localhost:8787   (or your live address)
import { redirects } from '../src/site.mjs';

const base = (process.argv[2] || 'http://localhost:8787').replace(/\/$/, '');
const seen = new Map();
const problems = [];
const assets = new Set();
const queue = ['/'];
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
for (const m of sitemap.matchAll(/<loc>[^<]*?(\/[^<]*)<\/loc>/g)) queue.push(new URL(m[1], base).pathname);

while (queue.length) {
  const p = queue.shift();
  if (seen.has(p)) continue;
  const r = await fetch(base + p, { redirect: 'manual' });
  seen.set(p, r.status);
  if (r.status !== 200) { problems.push(`${p} -> ${r.status}`); continue; }
  const html = await r.text();
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) problems.push(`${p}: ${h1} h1`);
  if (!/<meta name="description" content="[^"]{30,}/.test(html)) problems.push(`${p}: short or missing description`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { problems.push(`${p}: bad JSON-LD`); }
  }
  for (const m of html.matchAll(/<img(?![^>]*alt=)[^>]*>/g)) problems.push(`${p}: img without alt`);
  for (const m of html.matchAll(/<img(?![^>]*width=)[^>]*>/g)) problems.push(`${p}: img without width and height`);
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(',')) assets.add(part.trim().split(/\s+/)[0]);
  const og = html.match(/<meta property="og:image" content="([^"]+)"/);
  if (og) assets.add(new URL(og[1]).pathname);
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    if (seen.has(m[1]) || m[1].startsWith('/api')) continue;
    if (/\.\w+$/.test(m[1])) assets.add(m[1]); else queue.push(m[1]);
  }
  for (const m of html.matchAll(/src="(\/[^"]+)"/g)) assets.add(m[1]);
}
for (const a of assets) {
  const r = await fetch(base + a, { method: 'HEAD' });
  if (r.status !== 200) problems.push(`file ${a} -> ${r.status}`);
}
for (const [from, to] of redirects) {
  const r = await fetch(base + from, { redirect: 'manual' });
  if (r.status !== 301 || !r.headers.get('location')?.endsWith(to)) problems.push(`redirect ${from} -> ${r.status} ${r.headers.get('location')}`);
}
const nf = await fetch(base + '/does-not-exist/');
if (nf.status !== 404) problems.push(`404 page returns ${nf.status}`);

console.log(`Checked ${seen.size} pages and ${assets.size} files.`);
console.log(problems.length ? problems.join('\n') : 'No problems found.');
process.exit(problems.length ? 1 : 0);
