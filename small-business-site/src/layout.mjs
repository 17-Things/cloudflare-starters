// The HTML shell for every page: meta tags, JSON-LD, header, footer and photos.
// The words come from site.mjs. You rarely need to change this file.
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, INDEXABLE, COOKIE_TRACKING, site, nav, photos, towns, analytics } from './site.mjs';

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const abs = (path) => SITE_URL + path;

// Filled in by build.mjs with fingerprinted file names.
export const ASSETS = { css: '/styles.css', js: '/main.js', consent: '/consent.js' };
export const FONT = '/fonts/geist-latin-wght.woff2';
// The one inline script: it tells the CSS that JavaScript runs. build.mjs adds its hash to the CSP.
export const JS_FLAG = "document.documentElement.classList.add('js')";

export const ids = {
  org: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
};

// ---- Contact links -------------------------------------------------------
export const telHref = (n) => 'tel:' + n.replace(/[^\d+]/g, '').replace(/^0/, '+44');
export const waHref = (n) => 'https://wa.me/' + n.replace(/[^\d]/g, '').replace(/^0/, '44');
export const phoneLink = () => (site.phone ? `<a href="${telHref(site.phone)}">${esc(site.phone)}</a>` : '');
export const emailLink = () => (site.email ? `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>` : '');
export const addressLine = () => Object.values(site.address).filter(Boolean).join(', ');

// ---- Brand colour --------------------------------------------------------
// Works out readable text colours for whatever brandColour is set in site.mjs.
const CHARCOAL = '#1c1b19';
const rgb = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
};
const lum = (hex) => {
  const [r, g, b] = rgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
export function theme() {
  const brand = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(site.brandColour || '') ? site.brandColour : '#f5b301';
  const ink = contrast(brand, CHARCOAL) >= contrast(brand, '#ffffff') ? CHARCOAL : '#ffffff';
  // On the graphite bands the brand colour is used for small text, so it must reach 4.5:1.
  const onDark = contrast(brand, CHARCOAL) >= 4.5 ? brand : '#ffffff';
  return { brand, ink, onDark, inkContrast: contrast(brand, ink) };
}

// ---- Photos --------------------------------------------------------------
// picture('kitchen', { w, h, sizes, eager }) makes a responsive <img>.
// If public/img/kitchen-640.webp and kitchen-1024.webp exist, the browser picks
// the best size. If you upload just one file, it uses that one file.
// w and h set the shape of the slot; CSS crops the photo to fit (object-fit).
export function picture(key, { w = 1200, h = 800, sizes = '100vw', eager = false, cls = '', alt } = {}) {
  const p = photos[key];
  if (!p) throw new Error(`site.mjs: there is no photo called "${key}" in the photos list.`);
  const m = p.src.match(/^(.*)\.(\w+)$/);
  const variants = m ? [640, 1024].map((width) => [`${m[1]}-${width}.${m[2]}`, width]).filter(([f]) => existsSync(join(PUBLIC, f))) : [];
  const srcset = variants.length ? ` srcset="${[...variants.map(([f, width]) => `${f} ${width}w`), `${p.src} 1600w`].join(', ')}" sizes="${sizes}"` : '';
  const loading = eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"';
  const focus = p.focus ? ` style="object-position:${esc(p.focus)}"` : '';
  return `<!-- Example photo: replace it in src/site.mjs (photos). Credits: public/img/CREDITS.md --><img src="${p.src}"${srcset} alt="${esc(alt ?? p.alt)}" width="${w}" height="${h}"${loading}${focus}${cls ? ` class="${cls}"` : ''}>`;
}

// ---- Small pieces used on several pages ------------------------------------
// The dovetail mark next to the name. A dovetail is the joint joiners use for drawers.
export const mark = (size = 28) =>
  `<svg class="mark" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><rect width="32" height="32" rx="5" fill="var(--brand)"/><path d="M8 7h16l-4 8h4v10H8V15h4z" fill="var(--brand-ink)"/></svg>`;

export const stars = () =>
  `<span class="stars" aria-hidden="true">${'<svg viewBox="0 0 20 20" width="16" height="16"><path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3.1-5.4 3.1 1.2-6L1.3 7.8l6.1-.7z"/></svg>'.repeat(5)}</span>`;

export function ratingBadge() {
  const r = site.rating;
  if (!r || !r.score) return '';
  const text = `${esc(r.score)} out of 5 from ${esc(r.count)} Google reviews`;
  const inner = `${stars()}<span><strong>${esc(r.score)}</strong> from ${esc(r.count)} Google reviews</span>`;
  return r.url
    ? `<a class="rating" href="${esc(r.url)}" rel="noopener" aria-label="${text}. Read them on Google">${inner}</a>`
    : `<p class="rating" aria-label="${text}">${inner}</p>`;
}

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export function expandDays(spec) {
  const out = [];
  for (const part of spec.split(',')) {
    const [from, to = from] = part.trim().split('-');
    for (let i = DAYS.indexOf(from); i >= 0 && i <= DAYS.indexOf(to); i++) out.push(DAY_NAMES[i]);
  }
  return out;
}
const dayNumbers = (spec) => expandDays(spec).map((d) => (DAY_NAMES.indexOf(d) + 1) % 7); // JS: Sunday = 0

// The opening hours as a table. main.js marks today's row and adds "Open now".
export function hoursTable() {
  if (!site.hours.length) return '';
  const rows = site.hours
    .map((h) => `<tr data-days="${dayNumbers(h.days).join(',')}" data-opens="${h.opens}" data-closes="${h.closes}"><th scope="row">${esc(h.label)}</th><td>${esc(h.time)}</td></tr>`)
    .join('');
  return `<table class="hours"><caption class="visually-hidden">Opening hours</caption>${rows}<tr class="closed-row"><th scope="row">Other days</th><td>Closed</td></tr></table><p class="open-now" hidden></p>`;
}

// The map of the towns you cover. Drawn as SVG from the towns list in site.mjs.
export function areaMap() {
  if (!towns.length) return '';
  const [base, ...rest] = towns;
  const dot = (t, i) =>
    `<g class="map-town"><circle cx="${t.x * 4}" cy="${t.y * 3}" r="5"/><text x="${t.x * 4 + (t.x > 75 ? -10 : 10)}" y="${t.y * 3 + 4}"${t.x > 75 ? ' text-anchor="end"' : ''}>${esc(t.name)}</text></g>`;
  return `<svg class="area-map" viewBox="0 0 400 300" aria-hidden="true" focusable="false">
  <defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" class="map-grid"/></pattern></defs>
  <rect width="400" height="300" fill="url(#grid)"/>
  <path class="map-river" d="M-10 210 C 60 190, 90 240, 160 215 S 260 150, 300 175 S 380 230, 410 205"/>
  <circle class="map-ring" cx="${base.x * 4}" cy="${base.y * 3}" r="70"/>
  <circle class="map-ring outer" cx="${base.x * 4}" cy="${base.y * 3}" r="135"/>
  ${rest.map(dot).join('')}
  <g class="map-base"><circle cx="${base.x * 4}" cy="${base.y * 3}" r="11"/><path d="M${base.x * 4 - 4} ${base.y * 3 - 5}h8l-2 4h2v6h-8v-6h2z"/><text x="${base.x * 4 + 16}" y="${base.y * 3 + 5}">${esc(base.name)}</text></g>
  <g class="map-north"><path d="M376 16l6 16-6-4-6 4z"/><text x="376" y="46" text-anchor="middle">N</text></g>
</svg>`;
}

// ---- JSON-LD ---------------------------------------------------------------
// The business itself, on every page, so any page can describe who runs the site.
function businessLd() {
  const a = site.address;
  const hasAddress = Object.values(a).some(Boolean);
  return {
    '@type': site.schemaType || 'LocalBusiness',
    '@id': ids.org,
    name: site.name,
    ...(site.legalName ? { legalName: site.legalName } : {}),
    url: SITE_URL + '/',
    description: site.description,
    ...(site.shareImage ? { image: abs(site.shareImage) } : {}),
    logo: abs('/favicon.svg'),
    ...(site.phone ? { telephone: site.phone.replace(/^0/, '+44 ').replace(/\s+/g, ' ') } : {}),
    ...(site.email ? { email: site.email } : {}),
    ...(site.priceRange ? { priceRange: site.priceRange } : {}),
    ...(site.founded ? { foundingDate: site.founded } : {}),
    ...(hasAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: a.street,
            addressLocality: a.town,
            ...(a.county ? { addressRegion: a.county } : {}),
            postalCode: a.postcode,
            addressCountry: 'GB',
          },
        }
      : {}),
    ...(site.geo?.lat && site.geo?.lng ? { geo: { '@type': 'GeoCoordinates', latitude: Number(site.geo.lat), longitude: Number(site.geo.lng) } } : {}),
    ...(towns.length ? { areaServed: towns.map((t) => ({ '@type': 'City', name: t.name })) } : site.areaServed ? { areaServed: site.areaServed } : {}),
    ...(site.schemaType !== 'Organization' && site.hours.length
      ? {
          openingHoursSpecification: site.hours.map((h) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: expandDays(h.days),
            opens: h.opens,
            closes: h.closes,
          })),
        }
      : {}),
    ...(site.companyNumber
      ? { identifier: { '@type': 'PropertyValue', propertyID: 'Companies House company number', value: site.companyNumber } }
      : {}),
    ...(site.social.length ? { sameAs: site.social.map((s) => s.url) } : {}),
  };
}

export function breadcrumbLd(crumbs) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.href) })),
  };
}

export function crumbsHtml(crumbs) {
  if (!crumbs || crumbs.length < 2) return '';
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${crumbs
    .map((c, i) => (i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${c.href}">${esc(c.name)}</a></li>`))
    .join('')}</ol></nav>`;
}

// ---- Header, footer, call-to-action band -----------------------------------
const phoneIcon = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" fill="currentColor"/></svg>';
const waIcon = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.4-3.9-4.5-4-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1 1 2 1.3 2.3 1.4.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" fill="currentColor"/></svg>';
export const icons = { phone: phoneIcon, whatsapp: waIcon };

function header(path) {
  const cur = (href) => (path === href || (href !== '/' && path.startsWith(href)) ? ' aria-current="page"' : '');
  const links = nav.map((n) => `<li><a href="${n.href}"${cur(n.href)}>${esc(n.label)}</a></li>`).join('');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap nav">
    <a class="brand" href="/">${mark(32)}<span class="brand-text"><span class="brand-name">${esc(site.name)}</span>${site.strapline ? `<span class="brand-strap">${esc(site.strapline)}</span>` : ''}</span></a>
    <nav class="main-nav" aria-label="Main"><ul class="nav-links" id="menu">${links}</ul></nav>
    <div class="nav-actions">
      ${site.phone ? `<a class="btn btn-sm btn-ghost header-phone" href="${telHref(site.phone)}">${phoneIcon}<span class="visually-hidden-sm">Call </span><span class="header-number">${esc(site.phone)}</span></a>` : ''}
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><span class="menu-bars" aria-hidden="true"></span>Menu</button>
    </div>
  </div>
</header>`;
}

export function ctaBand() {
  return `<section class="cta-band" aria-labelledby="cta-title"><div class="wrap cta-inner">
  <div>
    <p class="eyebrow">Free survey · fixed price</p>
    <h2 id="cta-title">Tell us about your room. We will come and measure it.</h2>
    <p>${esc(site.replyPromise)} There is no charge for the visit or the first drawings.</p>
  </div>
  <p class="btn-row"><a class="btn btn-dark" href="/contact/#quote">Get a free quote</a>${site.phone ? `<a class="btn btn-outline-dark" href="${telHref(site.phone)}">Call ${esc(site.phone)}</a>` : ''}</p>
</div></section>`;
}

function footer() {
  const company = [
    `© ${new Date().getFullYear()} ${esc(site.legalName || site.name)}`,
    site.companyNumber ? `Registered in ${esc(site.registeredIn)}, company number ${esc(site.companyNumber)}` : '',
  ].filter(Boolean).join('. ');
  const social = site.social.map((s) => `<li><a href="${esc(s.url)}" rel="me noopener">${esc(s.name)}</a></li>`).join('');
  return `<footer class="site-footer on-dark">
  <div class="wrap footer-grid">
    <div class="footer-about">
      <a class="brand" href="/">${mark(32)}<span class="brand-text"><span class="brand-name">${esc(site.name)}</span>${site.strapline ? `<span class="brand-strap">${esc(site.strapline)}</span>` : ''}</span></a>
      <p>${esc(site.tagline)}</p>
      ${ratingBadge()}
    </div>
    <div>
      <h2 class="footer-title">Contact</h2>
      <ul class="plain">
        ${site.phone ? `<li>${phoneLink()}</li>` : ''}
        ${site.whatsapp ? `<li><a href="${waHref(site.whatsapp)}" rel="noopener">WhatsApp ${esc(site.whatsapp)}</a></li>` : ''}
        ${site.email ? `<li>${emailLink()}</li>` : ''}
        ${addressLine() ? `<li>${esc(addressLine())}</li>` : ''}
      </ul>
    </div>
    <div>
      <h2 class="footer-title">Pages</h2>
      <ul class="plain">${nav.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h2 class="footer-title">Opening hours</h2>
      <ul class="plain">${site.hours.map((h) => `<li>${esc(h.label)}: ${esc(h.time)}</li>`).join('')}</ul>
      ${social ? `<h2 class="footer-title">Follow us</h2><ul class="plain">${social}</ul>` : ''}
    </div>
  </div>
  <div class="wrap footer-legal">
    <p>${company}.${site.areaServed ? ` ${esc(site.areaServed)}.` : ''}</p>
    <p><a href="/privacy/">Privacy</a> · <a href="/cookies/">Cookies</a>${COOKIE_TRACKING ? ' · <button type="button" class="linkbtn" data-cc="show-preferencesModal">Cookie settings</button>' : ''} · Website template by <a href="https://17things.co.uk/cloudflare-free-plan">17 Things</a></p>
  </div>
</footer>
${actionBar()}`;
}

// The bar fixed to the bottom of the screen on phones: call, WhatsApp, quote.
function actionBar() {
  const items = [
    site.phone ? `<a href="${telHref(site.phone)}">${phoneIcon}<span>Call</span></a>` : '',
    site.whatsapp ? `<a href="${waHref(site.whatsapp)}" rel="noopener">${waIcon}<span>WhatsApp</span></a>` : '',
    `<a class="action-quote" href="/contact/#quote"><span>Get a quote</span></a>`,
  ].filter(Boolean);
  return `<nav class="action-bar" aria-label="Quick contact">${items.join('')}</nav>`;
}

// ---- The page shell --------------------------------------------------------
export function page({ path, title, description, body, graph = [], crumbs, type = 'WebPage', noindex = false, cta = true, preload = '' }) {
  const url = abs(path);
  const fullTitle = path === '/' ? title : `${title} | ${site.name}`;
  const pageLd = {
    '@type': type,
    '@id': url + '#webpage',
    url,
    name: fullTitle,
    description,
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.org },
    inLanguage: 'en-GB',
  };
  const website = { '@type': 'WebSite', '@id': ids.website, url: SITE_URL + '/', name: site.name, publisher: { '@id': ids.org }, inLanguage: 'en-GB' };
  const all = [businessLd(), website, pageLd, ...(crumbs && crumbs.length > 1 ? [breadcrumbLd(crumbs)] : []), ...graph];
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': all }).replace(/</g, '\\u003c');
  const robots = INDEXABLE && !noindex ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, nofollow';
  const share = site.shareImage
    ? `<meta property="og:image" content="${abs(site.shareImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(site.name)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${abs(site.shareImage)}">`
    : '<meta name="twitter:card" content="summary">';
  const t = theme();
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${url}">
<link rel="preload" href="${FONT}" as="font" type="font/woff2" crossorigin>
${preload}<link rel="stylesheet" href="${ASSETS.css}">
${COOKIE_TRACKING ? '<link rel="stylesheet" href="/vendor/cookieconsent-3.1.0.css">\n' : ''}<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#fafaf8" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#141412" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="en_GB">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
${share}
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<link rel="alternate" type="text/plain" href="/llms.txt" title="Plain-text summary for AI assistants">
<script>${JS_FLAG}</script>
<script type="application/ld+json">${ld}</script>
</head>
<body>
${header(path)}
<main id="main" tabindex="-1">
${body}
</main>
${cta ? ctaBand() : ''}
${footer()}
<script src="${ASSETS.js}" defer></script>
${COOKIE_TRACKING ? `<script src="/vendor/cookieconsent-3.1.0.umd.js" defer></script>\n<script src="${ASSETS.consent}" defer></script>\n` : ''}${
    analytics.cloudflareToken
      ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${esc(analytics.cloudflareToken)}"}'></script>\n`
      : ''
  }</body>
</html>`;
}
