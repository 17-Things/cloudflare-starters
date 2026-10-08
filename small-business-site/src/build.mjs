// Builds the site into dist/. No dependencies: run it with `node src/build.mjs` (Node 20+).
import { mkdirSync, rmSync, writeFileSync, readFileSync, cpSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, INDEXABLE, COOKIE_TRACKING, site, services, faqs, redirects, analytics } from './site.mjs';
import { ASSETS } from './layout.mjs';
import { pages, hidden } from './pages.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, 'assets'), { recursive: true });

// Files you add to public/ (images, PDFs, a share image) are copied as they are.
if (existsSync(join(root, 'public'))) cpSync(join(root, 'public'), dist, { recursive: true });

// The cookie banner library is copied only when a cookie-setting tag is in use.
if (COOKIE_TRACKING) cpSync(join(root, 'src/vendor'), join(dist, 'vendor'), { recursive: true });

// Fingerprint the CSS and JS so browsers can cache them for a year.
const bundles = [['css', 'styles.css'], ['js', 'main.js'], ...(COOKIE_TRACKING ? [['consent', 'consent.js']] : [])];
for (const [key, file] of bundles) {
  let src = readFileSync(join(root, 'src', file), 'utf8');
  if (key === 'consent') {
    const ids = { ga4: analytics.ga4, googleAds: analytics.googleAds, metaPixel: analytics.metaPixel };
    src = src.replace('__TRACKING_IDS__', JSON.stringify(ids));
  }
  const hash = createHash('sha256').update(src).digest('hex').slice(0, 10);
  const [base, ext] = file.split('.');
  ASSETS[key] = `/assets/${base}.${hash}.${ext}`;
  writeFileSync(join(dist, ASSETS[key]), src);
}

for (const [path, render] of pages) {
  const file = path.endsWith('.html') ? join(dist, path) : join(dist, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render());
}

// Favicon: the first letter of the business name on a coloured square.
const letter = (site.name.trim()[0] || '•').replace(/[<&>"]/g, '');
writeFileSync(
  join(dist, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#a8461f"/><text x="32" y="44" font-family="system-ui, sans-serif" font-size="36" font-weight="700" fill="#fff" text-anchor="middle">${letter}</text></svg>\n`
);

writeFileSync(
  join(dist, 'site.webmanifest'),
  JSON.stringify({
    name: site.name, short_name: site.name, start_url: '/', display: 'browser', background_color: '#fbfaf7', theme_color: '#a8461f',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  })
);

// Sitemap: every page except the hidden ones.
const listed = pages.map(([p]) => p).filter((p) => !hidden.includes(p));
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${listed
    .map((p) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);

// robots.txt: closed until `live` is true in site.mjs.
const aiBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'];
writeFileSync(
  join(dist, 'robots.txt'),
  INDEXABLE
    ? `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /enquiries\n\n# AI search and answer engines are welcome.\n${aiBots.map((b) => `User-agent: ${b}\nAllow: /\nDisallow: /api/\nDisallow: /enquiries`).join('\n')}\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
    : `# Preview build: not for indexing. Set live: true in src/site.mjs when your domain works.\nUser-agent: *\nDisallow: /\n`
);

// Security headers. The preview build also sends X-Robots-Tag: noindex.
const google = analytics.ga4 || analytics.googleAds;
const meta = analytics.metaPixel;
const cf = analytics.cloudflareToken;
const csp = [
  "default-src 'self'",
  `img-src 'self' data:${google ? ' https://*.google-analytics.com https://*.googletagmanager.com https://*.g.doubleclick.net https://www.google.com https://www.google.co.uk' : ''}${meta ? ' https://www.facebook.com' : ''}`,
  `script-src 'self'${google ? ' https://www.googletagmanager.com' : ''}${meta ? ' https://connect.facebook.net' : ''}${cf ? ' https://static.cloudflareinsights.com' : ''}`,
  "style-src 'self' 'unsafe-inline'",
  `connect-src 'self'${google ? ' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://www.google.com' : ''}${meta ? ' https://www.facebook.com' : ''}${cf ? ' https://cloudflareinsights.com' : ''}`,
  `frame-src ${google ? 'https://td.doubleclick.net https://www.googletagmanager.com' : "'none'"}`,
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join('; ');
writeFileSync(
  join(dist, '_headers'),
  `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: SAMEORIGIN
  Strict-Transport-Security: max-age=31536000
  Content-Security-Policy: ${csp}
${INDEXABLE ? '' : '  X-Robots-Tag: noindex, nofollow\n'}
/assets/*
  Cache-Control: public, max-age=31536000, immutable
`
);

// Redirects from old addresses, only if you listed some in site.mjs.
if (redirects.length) writeFileSync(join(dist, '_redirects'), redirects.map(([from, to]) => `${from} ${to} 301`).join('\n') + '\n');

// llms.txt: a plain summary for AI assistants (https://llmstxt.org).
const a = site.address;
writeFileSync(
  join(dist, 'llms.txt'),
  `# ${site.name}

> ${site.description}

${site.tagline}

## Services

${services.map((s) => `- [${s.name}](${SITE_URL}/services/#${s.id}): ${s.summary}`).join('\n')}

## Questions and answers

${faqs.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}

## Contact

- Contact form: ${SITE_URL}/contact/
${[
  site.phone && `- Phone: ${site.phone}`,
  site.email && `- Email: ${site.email}`,
  Object.values(a).some(Boolean) && `- Address: ${Object.values(a).filter(Boolean).join(', ')}`,
  site.areaServed && `- Area served: ${site.areaServed}`,
  ...site.hours.map((h) => `- Open: ${h.label}`),
  ...site.social.map((s) => `- ${s.name}: ${s.url}`),
]
  .filter(Boolean)
  .join('\n')}
`
);

console.log(`Built ${pages.length} pages into dist/ for ${SITE_URL} (${INDEXABLE ? 'live, indexable' : 'preview, noindex'})`);
