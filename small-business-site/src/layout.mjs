// The HTML shell for every page: meta tags, JSON-LD, header and footer.
import { SITE_URL, INDEXABLE, COOKIE_TRACKING, site, nav, analytics } from './site.mjs';

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const abs = (path) => SITE_URL + path;

// Filled in by build.mjs with fingerprinted file names.
export const ASSETS = { css: '/styles.css', js: '/main.js', consent: '/consent.js' };

export const ids = {
  org: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
};

const telHref = (n) => 'tel:' + n.replace(/[^\d+]/g, '').replace(/^0/, '+44');
export const phoneLink = () => (site.phone ? `<a href="${telHref(site.phone)}">${esc(site.phone)}</a>` : '');
export const emailLink = () => (site.email ? `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>` : '');
export const addressLine = () => Object.values(site.address).filter(Boolean).join(', ');

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
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.email ? { email: site.email } : {}),
    ...(hasAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: a.street,
            addressLocality: a.town,
            addressRegion: a.county,
            postalCode: a.postcode,
            addressCountry: 'GB',
          },
        }
      : {}),
    ...(site.areaServed ? { areaServed: site.areaServed } : {}),
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

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
function expandDays(spec) {
  const out = [];
  for (const part of spec.split(',')) {
    const [from, to = from] = part.trim().split('-');
    for (let i = DAYS.indexOf(from); i >= 0 && i <= DAYS.indexOf(to); i++) out.push(DAY_NAMES[i]);
  }
  return out;
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

function header(path) {
  const cur = (href) => (path === href || (href !== '/' && path.startsWith(href)) ? ' aria-current="page"' : '');
  const links = nav.map((n) => `<li><a href="${n.href}"${cur(n.href)}>${esc(n.label)}</a></li>`).join('');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap nav">
    <a class="brand" href="/">${esc(site.name)}</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu">Menu</button>
    <nav aria-label="Main"><ul class="nav-links" id="menu" data-open="false">${links}</ul></nav>
  </div>
</header>`;
}

function footer() {
  const company = [
    `© ${new Date().getFullYear()} ${esc(site.legalName || site.name)}`,
    site.companyNumber ? `Registered in ${esc(site.registeredIn)}, company number ${esc(site.companyNumber)}` : '',
  ].filter(Boolean).join('. ');
  const contact = [phoneLink(), emailLink()].filter(Boolean).join(' · ');
  const social = site.social.map((s) => `<a href="${esc(s.url)}" rel="me noopener">${esc(s.name)}</a>`).join(' · ');
  return `<footer class="site-footer">
  <div class="wrap">
    <p><strong>${esc(site.name)}</strong>${site.areaServed ? `. ${esc(site.areaServed)}` : ''}</p>
    ${contact ? `<p>${contact}</p>` : ''}
    ${social ? `<p>${social}</p>` : ''}
    <p>${company}.</p>
    <p><a href="/privacy/">Privacy</a> · <a href="/cookies/">Cookies</a>${COOKIE_TRACKING ? ' · <button type="button" class="linkbtn" data-cc="show-preferencesModal">Cookie settings</button>' : ''}</p>
    <p class="credit">Website template by <a href="https://17things.co.uk/cloudflare-free-plan">17 Things</a>.</p>
  </div>
</footer>`;
}

export function page({ path, title, description, body, graph = [], crumbs, type = 'WebPage', noindex = false }) {
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
    ? `<meta property="og:image" content="${abs(site.shareImage)}">\n<meta name="twitter:card" content="summary_large_image">`
    : '<meta name="twitter:card" content="summary">';
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${url}">
<link rel="stylesheet" href="${ASSETS.css}">
${COOKIE_TRACKING ? '<link rel="stylesheet" href="/vendor/cookieconsent-3.1.0.css">\n' : ''}<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#2f6f4f">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="en_GB">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
${share}
<link rel="alternate" type="text/plain" href="/llms.txt" title="Plain-text summary for AI assistants">
<script type="application/ld+json">${ld}</script>
</head>
<body>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
<script src="${ASSETS.js}" defer></script>
${COOKIE_TRACKING ? `<script src="/vendor/cookieconsent-3.1.0.umd.js" defer></script>\n<script src="${ASSETS.consent}" defer></script>\n` : ''}${
    analytics.cloudflareToken
      ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${esc(analytics.cloudflareToken)}"}'></script>\n`
      : ''
  }</body>
</html>`;
}
