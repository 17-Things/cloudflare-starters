// The pages. The words come from site.mjs; this file only arranges them.
// To add a page: write a function like about() below and add it to `pages` at the end.
import { site, services, reasons, about as aboutText, faqs, enquiryTypes, COOKIE_TRACKING, analytics } from './site.mjs';
import { page, esc, abs, ids, crumbsHtml, phoneLink, emailLink, addressLine } from './layout.mjs';

const HOME = { name: 'Home', href: '/' };

function hero({ crumbs, title, lede, actions = '' }) {
  return `<section class="hero"><div class="wrap">${crumbsHtml(crumbs)}<h1>${title}</h1>${lede ? `<p class="lede">${lede}</p>` : ''}${actions}</div></section>`;
}

const ctaButtons = () =>
  `<p class="btn-row"><a class="btn" href="/contact/">Get in touch</a>${site.phone ? ` <a class="btn btn-quiet" href="tel:${site.phone.replace(/[^\d+]/g, '').replace(/^0/, '+44')}">Call ${esc(site.phone)}</a>` : ''}</p>`;

function serviceLd(s) {
  return {
    '@type': 'Service',
    '@id': abs(`/services/#${s.id}`),
    name: s.name,
    description: s.summary,
    url: abs(`/services/#${s.id}`),
    provider: { '@id': ids.org },
    ...(site.areaServed ? { areaServed: site.areaServed } : {}),
  };
}

function faqLd() {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

function enquiryForm() {
  const opts = enquiryTypes.map((t) => `<option>${esc(t)}</option>`).join('');
  return `<form class="enquiry js-enquiry" action="/api/enquiry" method="post" novalidate>
  <input type="hidden" name="page" value="">
  <input type="hidden" name="t" value="">
  <div class="hp" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
  <label for="f-name">Your name</label><input id="f-name" name="name" type="text" autocomplete="name" required maxlength="120">
  <label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required maxlength="200">
  <label for="f-phone">Phone <span class="opt">(optional)</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel" maxlength="40">
  <label for="f-type">What is it about?</label><select id="f-type" name="type" required><option value="" selected disabled>Choose one</option>${opts}</select>
  <label for="f-msg">Message</label><textarea id="f-msg" name="message" required maxlength="5000"></textarea>
  <p><button class="btn" type="submit">Send</button></p>
  <p class="form-note">We use your details only to reply to you. See our <a href="/privacy/">privacy notice</a>.</p>
  <p class="form-status" role="status" aria-live="polite"></p>
</form>`;
}

function home() {
  const body = `
${hero({ crumbs: [], title: esc(site.name), lede: esc(site.tagline), actions: ctaButtons() })}
<section class="section"><div class="wrap">
  <h2>What we do</h2>
  <ul class="cards">${services
    .map((s) => `<li><h3><a href="/services/#${s.id}">${esc(s.name)}</a></h3><p>${esc(s.summary)}</p></li>`)
    .join('')}</ul>
  <p><a href="/services/">All services</a></p>
</div></section>
<section class="section alt"><div class="wrap">
  <h2>Why choose us</h2>
  <ul class="cards">${reasons.map((r) => `<li><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p></li>`).join('')}</ul>
</div></section>
<section class="section"><div class="wrap">
  <h2>Questions</h2>
  <div class="faq">${faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>
</div></section>
<section class="section alt"><div class="wrap">
  <h2>Get in touch</h2>
  <p>Tell us what you need. We reply within one working day.</p>
  ${ctaButtons()}
</div></section>`;
  return page({
    path: '/',
    title: `${site.name} | ${site.areaServed || 'Home'}`,
    description: site.description,
    body,
    graph: [faqLd()],
  });
}

function servicesPage() {
  const crumbs = [HOME, { name: 'Services', href: '/services/' }];
  const body = `
${hero({ crumbs, title: 'Services', lede: `What ${esc(site.name)} does, and how it works.` })}
${services
  .map(
    (s, i) => `<section class="section${i % 2 ? ' alt' : ''}" id="${s.id}"><div class="wrap">
  <h2>${esc(s.name)}</h2>
  <p class="lede">${esc(s.summary)}</p>
  ${s.detail.map((p) => `<p>${esc(p)}</p>`).join('')}
</div></section>`
  )
  .join('\n')}
<section class="section"><div class="wrap"><h2>Ask for a quote</h2>${ctaButtons()}</div></section>`;
  return page({
    path: '/services/',
    title: 'Services',
    description: `${services.map((s) => s.name).join(', ')}. ${site.areaServed ? `For ${site.areaServed}.` : ''}`.trim(),
    body,
    crumbs,
    graph: services.map(serviceLd),
  });
}

function aboutPage() {
  const crumbs = [HOME, { name: 'About', href: '/about/' }];
  const body = `
${hero({ crumbs, title: esc(aboutText.heading), lede: esc(aboutText.intro) })}
<section class="section"><div class="wrap split">
  <div>${aboutText.story.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
  <figure><img src="/img/placeholder.svg" alt="Placeholder: replace with a photo of you or your team" width="600" height="450" loading="lazy"></figure>
</div></section>
<section class="section alt"><div class="wrap"><h2>Work with us</h2>${ctaButtons()}</div></section>`;
  return page({ path: '/about/', title: 'About us', description: `${aboutText.intro} ${site.description}`.slice(0, 160), body, crumbs, type: 'AboutPage' });
}

function contact() {
  const crumbs = [HOME, { name: 'Contact', href: '/contact/' }];
  const details = [
    site.phone ? `<li>Phone: ${phoneLink()}</li>` : '',
    site.email ? `<li>Email: ${emailLink()}</li>` : '',
    addressLine() ? `<li>Address: ${esc(addressLine())}</li>` : '',
  ].join('');
  const hours = site.hours.length ? `<h2>Opening hours</h2><ul class="plain">${site.hours.map((h) => `<li>${esc(h.label)}</li>`).join('')}</ul>` : '';
  const body = `
${hero({ crumbs, title: 'Contact us', lede: 'Send a message with the form, or call or email. We reply within one working day.' })}
<section class="section"><div class="wrap split">
  <div><h2>Send a message</h2>${enquiryForm()}</div>
  <aside>${details ? `<h2>Other ways to reach us</h2><ul class="plain">${details}</ul>` : ''}${hours}</aside>
</div></section>`;
  return page({ path: '/contact/', title: 'Contact', description: `Contact ${site.name}: send a message, call or email. ${site.areaServed || ''}`.trim(), body, crumbs, type: 'ContactPage' });
}

function thanks() {
  const crumbs = [HOME, { name: 'Contact', href: '/contact/' }, { name: 'Thank you', href: '/contact/thank-you/' }];
  const body = hero({ crumbs, title: 'Thank you', lede: 'We have your message and will reply within one working day.', actions: '<p class="btn-row"><a class="btn" href="/">Back to the home page</a></p>' });
  return page({ path: '/contact/thank-you/', title: 'Thank you', description: `Your message to ${site.name} has been sent.`, body, crumbs, noindex: true });
}

function notFound() {
  const body = hero({ crumbs: [], title: 'Page not found', lede: 'This page has moved or does not exist.', actions: '<p class="btn-row"><a class="btn" href="/">Go to the home page</a></p>' });
  return page({ path: '/404.html', title: 'Page not found', description: 'Page not found.', body, noindex: true });
}

// A short starting point, not legal advice. Check it against the ICO's guidance for small businesses.
function privacy() {
  const crumbs = [HOME, { name: 'Privacy notice', href: '/privacy/' }];
  const who = esc(site.legalName || site.name);
  const body = `
${hero({ crumbs, title: 'Privacy notice', lede: 'How we use the personal information you give us.' })}
<section class="section"><div class="wrap prose">
  <p class="note">Template text. Read it, change it to match what you really do, and check it against the <a href="https://ico.org.uk/for-organisations/advice-for-small-organisations/" rel="noopener">ICO's advice for small organisations</a>.</p>
  <h2>Who we are</h2>
  <p>${who}${site.companyNumber ? `, registered in ${esc(site.registeredIn)} (company number ${esc(site.companyNumber)})` : ''}, is responsible for your personal information on this website.${site.email ? ` Contact us at ${emailLink()}.` : ''}</p>
  <h2>What we collect</h2>
  <p>When you use the contact form, we collect your name, email address, phone number (if you give it) and your message. We use it only to reply to you and to provide the service you ask about. Our lawful basis is legitimate interests, or steps before a contract.</p>
  <h2>Where it is kept</h2>
  <p>Messages are stored by Cloudflare, Inc., which hosts this website. We keep them for no longer than we need to, and delete enquiries that do not lead to work after 12 months.</p>
  <h2>Your rights</h2>
  <p>You can ask for a copy of your information, ask us to correct or delete it, or object to how we use it. You can also complain to the Information Commissioner's Office at <a href="https://ico.org.uk" rel="noopener">ico.org.uk</a>.</p>
  <h2>Cookies</h2>
  <p>See our <a href="/cookies/">cookie notice</a>.</p>
</div></section>`;
  return page({ path: '/privacy/', title: 'Privacy notice', description: `How ${site.name} uses the personal information you give us through this website.`, body, crumbs });
}

function cookies() {
  const crumbs = [HOME, { name: 'Cookies', href: '/cookies/' }];
  const cf = analytics.cloudflareToken
    ? '<h2>Cookie-free visitor counts</h2><p>We count page views with Cloudflare Web Analytics. It sets no cookies and does not follow you across websites.</p>'
    : '';
  const tracking = COOKIE_TRACKING
    ? `<p>Some cookies help us see how people use the site${analytics.googleAds || analytics.metaPixel ? ' and measure our adverts' : ''}. They run only if you allow them.</p>
  <p><button type="button" class="btn" data-cc="show-preferencesModal">Change your cookie settings</button></p>
  <h2>Strictly necessary</h2><p><strong>cc_cookie</strong> (6 months) remembers your cookie choice.</p>
  ${analytics.ga4 ? '<h2>Analytics (only with your consent)</h2><p>Google Analytics 4 sets <strong>_ga</strong> and <strong>_ga_&lt;ID&gt;</strong> (2 years).</p>' : ''}
  ${analytics.googleAds || analytics.metaPixel ? `<h2>Marketing (only with your consent)</h2><p>${[analytics.googleAds ? 'Google Ads sets <strong>_gcl_au</strong> (90 days)' : '', analytics.metaPixel ? 'the Meta Pixel sets <strong>_fbp</strong> (90 days)' : ''].filter(Boolean).join(' and ')}.</p>` : ''}
  <p>You can change your choice at any time with the "Cookie settings" link at the bottom of every page.</p>`
    : '<p>This website does not set any cookies.</p>';
  const body = `
${hero({ crumbs, title: 'Cookie notice', lede: 'Which cookies this website uses, and why.' })}
<section class="section"><div class="wrap prose">${tracking}${cf}</div></section>`;
  return page({ path: '/cookies/', title: 'Cookie notice', description: `Which cookies the ${site.name} website uses, and how to change your choice.`, body, crumbs });
}

export const pages = [
  ['/', home],
  ['/services/', servicesPage],
  ['/about/', aboutPage],
  ['/contact/', contact],
  ['/contact/thank-you/', thanks],
  ['/privacy/', privacy],
  ['/cookies/', cookies],
  ['/404.html', notFound],
];

// Pages that search engines should not list.
export const hidden = ['/contact/thank-you/', '/404.html'];
