// The pages. The words and photos come from site.mjs; this file only arranges them.
// Each section is one <section> with a comment above it, so you can delete it cleanly.
// To add a page: write a function like aboutPage() below and add it to `pages` at the end.
import {
  site, services, steps, beforeAfter, projects, reviews, accreditations, towns, stats,
  about as aboutText, faqs, enquiryTypes, COOKIE_TRACKING, analytics,
} from './site.mjs';
import {
  page, esc, abs, ids, crumbsHtml, phoneLink, emailLink, addressLine, telHref, waHref,
  picture, ratingBadge, hoursTable, areaMap, icons, stars,
} from './layout.mjs';

const HOME = { name: 'Home', href: '/' };
const tick = '<svg class="tick" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const arrow = '<svg class="arrow" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false"><path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// ---- Shared pieces ---------------------------------------------------------
function pageHero({ crumbs, eyebrow, title, lede, actions = '', extra = '' }) {
  return `<section class="page-hero"><div class="wrap">${crumbsHtml(crumbs)}${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h1>${title}</h1>${lede ? `<p class="lede">${lede}</p>` : ''}${actions}${extra}</div></section>`;
}

function sectionHead({ eyebrow, title, id, lede = '', link = '' }) {
  return `<div class="section-head">
    <div>${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h2 id="${id}">${title}</h2>${lede ? `<p class="lede">${lede}</p>` : ''}</div>
    ${link}
  </div>`;
}

const quoteButtons = (light = false) =>
  `<p class="btn-row"><a class="btn" href="/contact/#quote">Get a free quote</a>${
    site.phone ? `<a class="btn ${light ? 'btn-ghost-light' : 'btn-ghost'}" href="${telHref(site.phone)}">${icons.phone}Call ${esc(site.phone)}</a>` : ''
  }</p>`;

const priceTag = (s) => (s.priceFrom ? `<p class="price"><span>From</span> <strong>${esc(s.priceFrom)}</strong></p>` : '');

function serviceLd(s) {
  const min = Number(String(s.priceFrom || '').replace(/[^\d.]/g, ''));
  return {
    '@type': 'Service',
    '@id': abs(`/services/#${s.id}`),
    name: s.name,
    description: s.summary,
    url: abs(`/services/#${s.id}`),
    provider: { '@id': ids.org },
    ...(towns.length ? { areaServed: towns.map((t) => t.name) } : site.areaServed ? { areaServed: site.areaServed } : {}),
    ...(min
      ? { offers: { '@type': 'Offer', priceCurrency: 'GBP', priceSpecification: { '@type': 'PriceSpecification', minPrice: min, priceCurrency: 'GBP' } } }
      : {}),
  };
}

function faqLd() {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

// ===== BEFORE AND AFTER SLIDER =====
// Without JavaScript, the two photos show side by side. With it, the visitor drags
// (or uses the arrow keys) to wipe from one to the other.
function beforeAfterSlider() {
  if (!beforeAfter || !beforeAfter.before || !beforeAfter.after) return '';
  const b = beforeAfter;
  return `<figure class="ba" style="--pos:50%">
  <div class="ba-frame">
    <div class="ba-pane ba-after">${picture(b.after, { w: 1600, h: 1067, sizes: '(min-width: 72rem) 70rem, 100vw' })}<span class="ba-label ba-label-after">${esc(b.afterLabel)}</span></div>
    <div class="ba-pane ba-before">${picture(b.before, { w: 1600, h: 1067, sizes: '(min-width: 72rem) 70rem, 100vw' })}<span class="ba-label ba-label-before">${esc(b.beforeLabel)}</span></div>
    <span class="ba-handle" aria-hidden="true"><span></span></span>
    <input class="ba-range" type="range" min="0" max="100" value="50" step="1" aria-label="Compare ${esc(b.beforeLabel.toLowerCase())} with ${esc(b.afterLabel.toLowerCase())}. Left shows more of ${esc(b.afterLabel.toLowerCase())}, right shows more of ${esc(b.beforeLabel.toLowerCase())}." hidden>
  </div>
  ${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}
</figure>`;
}

// ===== REVIEWS =====
function reviewList() {
  return `<ul class="reviews-list" role="list">${reviews
    .map(
      (r) => `<li class="review"><figure>
      ${stars()}
      <blockquote><p>${esc(r.quote)}</p></blockquote>
      <figcaption><strong>${esc(r.name)}</strong>, ${esc(r.town)}${r.job ? `<span>${esc(r.job)}</span>` : ''}</figcaption>
    </figure></li>`
    )
    .join('')}</ul>`;
}

// ===== AREAS WE COVER =====
function areasBlock(headingId = 'areas-title') {
  if (!towns.length) return '';
  return `<div class="areas">
    <div class="areas-copy">
      <p class="eyebrow">Where we work</p>
      <h2 id="${headingId}">Areas we cover</h2>
      <p>We work across ${esc(site.areaServed || towns[0].name)}. These are the places we visit most.</p>
      <ul class="chips" role="list">${towns.map((t, i) => `<li${i === 0 ? ' class="chip-base"' : ''}>${esc(t.name)}${i === 0 ? ' <span>(our workshop)</span>' : ''}</li>`).join('')}</ul>
      <p class="small">Just outside? <a href="/contact/#quote">Ask us</a>. We often say yes.</p>
    </div>
    <div class="areas-map">${areaMap()}</div>
  </div>`;
}

// ===== ACCREDITATIONS =====
function accreditationStrip() {
  if (!accreditations.length) return '';
  return `<ul class="accreditations" role="list">${accreditations
    .map((a) => `<li><span class="badge-mark" aria-hidden="true">${tick}</span><span><strong>${esc(a.title)}</strong> ${esc(a.text)}</span></li>`)
    .join('')}</ul>`;
}

// ===== FAQ =====
function faqBlock() {
  return `<div class="faq">${faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>`;
}

// ===== PROCESS =====
function processSteps(withPhotos = true) {
  return `<ol class="steps" role="list">${steps
    .map(
      (p, i) => `<li class="step-card">
      ${withPhotos && p.photo ? `<div class="step-photo">${picture(p.photo, { w: 600, h: 420, sizes: '(min-width: 60rem) 17rem, (min-width: 40rem) 45vw, 100vw' })}</div>` : ''}
      <p class="step-no" aria-hidden="true">${String(i + 1).padStart(2, '0')}</p>
      <h3><span class="visually-hidden">Step ${i + 1}: </span>${esc(p.title)}</h3>
      <p>${esc(p.text)}</p>
    </li>`
    )
    .join('')}</ol>`;
}

// ---- Home ------------------------------------------------------------------
function home() {
  const [first, ...rest] = services;
  const card = (s, big = false) => `<li class="service-card${big ? ' is-big' : ''}">
    <div class="card-photo">${picture(s.photo, { w: big ? 1200 : 800, h: big ? 900 : 600, sizes: big ? '(min-width: 60rem) 36rem, 100vw' : '(min-width: 60rem) 18rem, (min-width: 40rem) 50vw, 100vw' })}</div>
    <div class="card-body">
      <h3><a href="/services/#${s.id}">${esc(s.name)}</a></h3>
      <p>${esc(s.summary)}</p>
      ${priceTag(s)}
    </div>
  </li>`;
  const gallery = [
    ['library', 'Library shelving around the fireplace, Upper Wray'],
    ['dresser', 'Painted dresser and pan rail, Saltwick'],
    ['staircase', 'Oak and glass staircase, Lowmoor'],
    ['kitchenDetail', 'Shaker doors and a brass tap, Ashby Fold'],
    ['wardrobe', 'A wall of wardrobes, Kelderton'],
  ];
  const body = `
<!-- ===== HERO ===== -->
<section class="hero on-dark" aria-labelledby="hero-title">
  <div class="hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${esc([site.strapline, site.founded && `since ${site.founded}`].filter(Boolean).join(' · '))}</p>
      <h1 id="hero-title">${esc(site.heroTitle)}</h1>
      <p class="lede">${esc(site.heroLead)}</p>
      ${quoteButtons(true)}
      <ul class="proof" role="list">
        ${site.rating?.score ? `<li>${ratingBadge()}</li>` : ''}
        <li>${tick}Free survey and drawings</li>
        <li>${tick}10-year written guarantee</li>
      </ul>
    </div>
    <div class="hero-media">
      ${picture('kitchen', { w: 1600, h: 1067, sizes: '(min-width: 60rem) 50vw, 100vw', eager: true })}
      <p class="photo-tag"><span>Recent work</span> Painted shaker kitchen, Ashby Fold</p>
    </div>
  </div>
  <div class="ruler" aria-hidden="true"></div>
</section>

<!-- ===== STATS ===== -->
<section class="stats" aria-label="${esc(site.name)} in numbers"><div class="wrap">
  <ul class="stats-list" role="list">${stats.map((s) => `<li><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></li>`).join('')}</ul>
</div></section>

<!-- ===== SERVICES ===== -->
<section class="section" aria-labelledby="services-title"><div class="wrap">
  ${sectionHead({ eyebrow: 'What we make', title: 'Made in our workshop. Fitted by the people who made it.', id: 'services-title', link: `<a class="more" href="/services/">All services and prices ${arrow}</a>` })}
  <ul class="service-grid" role="list">${card(first, true)}${rest.map((s) => card(s)).join('')}</ul>
</div></section>

<!-- ===== BEFORE AND AFTER ===== -->
<section class="section on-dark ba-section" aria-labelledby="ba-title"><div class="wrap">
  ${sectionHead({ eyebrow: 'From drawing to fitted', title: 'Drawn to the millimetre, then made to match.', id: 'ba-title', lede: 'Drag the handle, or use the arrow keys, to see the drawing become the kitchen.' })}
  ${beforeAfterSlider()}
</div></section>

<!-- ===== HOW WE WORK ===== -->
<section class="section surface" aria-labelledby="process-title"><div class="wrap">
  ${sectionHead({ eyebrow: 'How we work', title: 'Four steps. One team. No surprises.', id: 'process-title' })}
  ${processSteps()}
</div></section>

<!-- ===== GALLERY ===== -->
<section class="section" aria-labelledby="gallery-title"><div class="wrap">
  ${sectionHead({ eyebrow: 'Recent work', title: 'A few rooms we are proud of', id: 'gallery-title', link: `<a class="more" href="/work/">See the projects ${arrow}</a>` })}
  <ul class="mosaic" role="list">${gallery
    .map(([k, cap], i) => `<li class="m${i + 1}"><figure>${picture(k, { w: i === 0 ? 1200 : 800, h: i === 0 ? 1200 : 600, sizes: i === 0 ? '(min-width: 60rem) 34rem, 100vw' : '(min-width: 60rem) 17rem, 50vw' })}<figcaption>${esc(cap)}</figcaption></figure></li>`)
    .join('')}</ul>
</div></section>

<!-- ===== REVIEWS ===== -->
<section class="section soft" aria-labelledby="reviews-title"><div class="wrap">
  ${sectionHead({ eyebrow: 'What customers say', title: 'Fixed prices that stay fixed', id: 'reviews-title', link: ratingBadge() })}
  ${reviewList()}
  ${accreditationStrip()}
</div></section>

<!-- ===== AREAS ===== -->
<section class="section surface" aria-labelledby="areas-title"><div class="wrap">
  ${areasBlock()}
</div></section>

<!-- ===== FAQ ===== -->
<section class="section" aria-labelledby="faq-title"><div class="wrap faq-wrap">
  ${sectionHead({ eyebrow: 'Questions', title: 'Straight answers', id: 'faq-title', lede: `Something else? ${site.phone ? `Call ${esc(site.phone)} or send` : 'Send'} us a message.` })}
  ${faqBlock()}
</div></section>`;
  return page({
    path: '/',
    title: `${site.name} | Kitchens and joinery in ${site.address.town}`,
    description: site.description,
    body,
    graph: [faqLd()],
    preload: '',
  });
}

// ---- Services --------------------------------------------------------------
function servicesPage() {
  const crumbs = [HOME, { name: 'Services', href: '/services/' }];
  const jump = `<nav class="jump" aria-label="Services on this page"><ul role="list">${services
    .map((s) => `<li><a href="#${s.id}">${esc(s.name)}</a></li>`)
    .join('')}</ul></nav>`;
  const body = `
${pageHero({ crumbs, eyebrow: 'Services and prices', title: 'What we make, and what it costs', lede: 'Every job starts with a free visit and a fixed price in writing. These are our starting prices, so you know where you stand before you call.', extra: jump })}
${services
  .map(
    (s, i) => `<!-- ===== SERVICE: ${esc(s.name)} ===== -->
<section class="section service${i % 2 ? ' surface is-flipped' : ''}" id="${s.id}" aria-labelledby="${s.id}-title"><div class="wrap service-grid-detail">
  <div class="service-photo">${picture(s.photo, { w: 1200, h: 900, sizes: '(min-width: 60rem) 34rem, 100vw' })}</div>
  <div class="service-copy">
    <p class="eyebrow">${String(i + 1).padStart(2, '0')} / ${String(services.length).padStart(2, '0')}</p>
    <h2 id="${s.id}-title">${esc(s.name)}</h2>
    <p class="lede">${esc(s.summary)}</p>
    ${s.detail.map((p) => `<p>${esc(p)}</p>`).join('')}
    ${s.included?.length ? `<h3 class="small-title">What is included</h3><ul class="ticks" role="list">${s.included.map((x) => `<li>${tick}${esc(x)}</li>`).join('')}</ul>` : ''}
    <div class="price-box">
      ${s.priceFrom ? `<p class="price-big"><span>From</span> <strong>${esc(s.priceFrom)}</strong>${s.priceNote ? ` <span class="price-note">${esc(s.priceNote)}</span>` : ''}</p>` : ''}
      ${s.time ? `<p class="price-time">${esc(s.time)}</p>` : ''}
      <p class="btn-row"><a class="btn" href="/contact/?service=${encodeURIComponent(s.id)}#quote">Get a quote<span class="visually-hidden"> for ${esc(s.name.toLowerCase())}</span></a></p>
    </div>
  </div>
</div></section>`
  )
  .join('\n')}
<!-- ===== HOW WE WORK ===== -->
<section class="section on-dark" aria-labelledby="process-title"><div class="wrap">
  ${sectionHead({ eyebrow: 'How we work', title: 'Four steps. One team. No surprises.', id: 'process-title' })}
  ${processSteps(false)}
</div></section>`;
  return page({
    path: '/services/',
    title: 'Services and prices',
    description: `${services.map((s) => `${s.name}${s.priceFrom ? ` from ${s.priceFrom}` : ''}`).join(', ')}. Free survey and fixed prices in ${site.address.town}.`.slice(0, 300),
    body,
    crumbs,
    graph: services.map(serviceLd),
  });
}

// ---- Our work --------------------------------------------------------------
function workPage() {
  const crumbs = [HOME, { name: 'Our work', href: '/work/' }];
  const body = `
${pageHero({ crumbs, eyebrow: 'Our work', title: 'Rooms we have drawn, made and fitted', lede: 'A few recent projects, with the place, the job and how long it took. Ask us and we can put you in touch with the owners.' })}
<!-- ===== BEFORE AND AFTER ===== -->
<section class="section on-dark ba-section" aria-labelledby="ba-title"><div class="wrap">
  ${sectionHead({ eyebrow: 'From drawing to fitted', title: 'See the drawing become the room', id: 'ba-title', lede: 'Drag the handle, or use the arrow keys.' })}
  ${beforeAfterSlider()}
</div></section>
<!-- ===== PROJECTS ===== -->
${projects
  .map(
    (p, i) => `<section class="section project${i % 2 ? ' surface' : ''}" id="${p.id}" aria-labelledby="${p.id}-title"><div class="wrap project-grid${i % 2 ? ' is-flipped' : ''}">
  <div class="project-photos">${p.photos
    .map((k, j) => `<div class="pp${j + 1}">${picture(k, { w: j === 0 ? 1200 : 800, h: j === 0 ? 900 : 800, sizes: j === 0 ? '(min-width: 60rem) 32rem, 100vw' : '(min-width: 60rem) 14rem, 50vw' })}</div>`)
    .join('')}</div>
  <div class="project-copy">
    <p class="eyebrow">${esc(p.place)} · ${esc(p.job)}</p>
    <h2 id="${p.id}-title">${esc(p.title)}</h2>
    <p>${esc(p.text)}</p>
    ${p.facts?.length ? `<ul class="facts" role="list">${p.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
  </div>
</div></section>`
  )
  .join('\n')}
<!-- ===== REVIEWS ===== -->
<section class="section soft" aria-labelledby="reviews-title"><div class="wrap">
  ${sectionHead({ eyebrow: 'What customers say', title: 'In their words', id: 'reviews-title', link: ratingBadge() })}
  ${reviewList()}
</div></section>`;
  return page({
    path: '/work/',
    title: 'Our work',
    description: `Recent kitchens, staircases, wardrobes and utility rooms by ${site.name}, with the place, the job and how long it took.`,
    body,
    crumbs,
    type: 'CollectionPage',
  });
}

// ---- About -----------------------------------------------------------------
function aboutPage() {
  const crumbs = [HOME, { name: 'About', href: '/about/' }];
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('');
  const body = `
${pageHero({ crumbs, eyebrow: `About ${site.name}`, title: esc(aboutText.heading), lede: esc(aboutText.intro) })}
<!-- ===== STORY ===== -->
<section class="section" aria-labelledby="story-title"><div class="wrap story">
  <div class="story-copy">
    <h2 id="story-title">Our story</h2>
    ${aboutText.story.map((p) => `<p>${esc(p)}</p>`).join('')}
    ${aboutText.team?.[0] ? `<p class="signature">${esc(aboutText.team[0].name)}<span>${esc(aboutText.team[0].role)}, ${esc(site.name)}</span></p>` : ''}
  </div>
  <div class="story-photos">
    <div class="sp1">${picture('workbench', { w: 900, h: 1100, sizes: '(min-width: 60rem) 24rem, 100vw' })}</div>
    <div class="sp2">${picture('planing', { w: 800, h: 600, sizes: '(min-width: 60rem) 18rem, 60vw' })}</div>
  </div>
</div></section>
<!-- ===== STATS ===== -->
<section class="stats" aria-label="${esc(site.name)} in numbers"><div class="wrap">
  <ul class="stats-list" role="list">${stats.map((s) => `<li><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></li>`).join('')}</ul>
</div></section>
<!-- ===== TEAM ===== -->
<section class="section" aria-labelledby="team-title"><div class="wrap">
  ${sectionHead({ eyebrow: 'The team', title: 'Who will turn up', id: 'team-title', lede: 'Add a photo of each person if you can. People like to know who is coming to the house.' })}
  <ul class="team" role="list">${aboutText.team
    .map((t) => `<li><span class="avatar" aria-hidden="true">${esc(initials(t.name))}</span><h3>${esc(t.name)}</h3><p class="role">${esc(t.role)}</p><p>${esc(t.text)}</p></li>`)
    .join('')}</ul>
</div></section>
<!-- ===== ACCREDITATIONS ===== -->
<section class="section soft" aria-labelledby="trust-title"><div class="wrap">
  ${sectionHead({ eyebrow: 'Peace of mind', title: 'Qualified, insured and guaranteed', id: 'trust-title' })}
  ${accreditationStrip()}
</div></section>
<!-- ===== AREAS ===== -->
<section class="section surface" aria-labelledby="areas-title"><div class="wrap">${areasBlock()}</div></section>`;
  return page({ path: '/about/', title: 'About us', description: `${aboutText.intro} ${site.description}`.slice(0, 160), body, crumbs, type: 'AboutPage' });
}

// ---- Contact and the quote form ------------------------------------------
function field({ id, name, label, type = 'text', autocomplete = '', required = false, max = 200, hint = '', textarea = false, inputmode = '' }) {
  const describedby = [hint ? `${id}-hint` : '', `${id}-error`].filter(Boolean).join(' ');
  const attrs = `id="${id}" name="${name}"${autocomplete ? ` autocomplete="${autocomplete}"` : ''}${required ? ' required' : ''} maxlength="${max}" aria-describedby="${describedby}"${inputmode ? ` inputmode="${inputmode}"` : ''}`;
  return `<div class="field">
    <label for="${id}">${esc(label)}${required ? '' : ' <span class="opt">(optional)</span>'}</label>
    ${hint ? `<p class="hint" id="${id}-hint">${esc(hint)}</p>` : ''}
    <p class="field-error" id="${id}-error"></p>
    ${textarea ? `<textarea ${attrs} rows="6"></textarea>` : `<input type="${type}" ${attrs}>`}
  </div>`;
}

function enquiryForm() {
  const svc = (name) => services.find((s) => s.name === name);
  const choices = enquiryTypes
    .map((t, i) => {
      const s = svc(t);
      return `<label class="choice" for="f-type-${i}">
        <input type="radio" id="f-type-${i}" name="type" value="${esc(t)}"${s ? ` data-id="${esc(s.id)}"` : ''} required>
        <span class="choice-body"><span class="choice-name">${esc(t)}</span><span class="choice-price">${s?.priceFrom ? `From ${esc(s.priceFrom)}` : 'Tell us below'}</span></span>
      </label>`;
    })
    .join('');
  return `<form id="quote" class="quote js-enquiry" action="/api/enquiry" method="post" novalidate>
  <input type="hidden" name="page" value="">
  <input type="hidden" name="t" value="">
  <div class="hp" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
  <div class="error-summary" tabindex="-1" hidden><h2 class="error-title">There is a problem</h2><ul role="list"></ul></div>
  <fieldset class="step" id="f-type" aria-describedby="f-type-error">
    <legend><span class="step-num" aria-hidden="true">1</span> What can we help with?</legend>
    <p class="field-error" id="f-type-error"></p>
    <div class="choices">${choices}</div>
  </fieldset>
  <fieldset class="step">
    <legend><span class="step-num" aria-hidden="true">2</span> Your details</legend>
    <div class="field-row">
      ${field({ id: 'f-name', name: 'name', label: 'Your name', autocomplete: 'name', required: true, max: 120 })}
      ${field({ id: 'f-email', name: 'email', label: 'Email', type: 'email', autocomplete: 'email', required: true, max: 200 })}
    </div>
    <div class="field-row">
      ${field({ id: 'f-phone', name: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel', max: 40, hint: 'So we can book the survey quickly.' })}
      ${field({ id: 'f-postcode', name: 'postcode', label: 'Postcode', autocomplete: 'postal-code', max: 12, hint: 'So we know you are in our area.' })}
    </div>
    ${field({ id: 'f-msg', name: 'message', label: 'About the job', textarea: true, required: true, max: 5000, hint: 'The room, rough sizes, and when you would like it done. Photos can follow by email.' })}
  </fieldset>
  <div class="submit-row">
    <button class="btn btn-lg" type="submit">Send my enquiry</button>
    <p class="reply-promise">${esc(site.replyPromise)}</p>
  </div>
  <p class="form-note">We use your details only to reply to you. See our <a href="/privacy/">privacy notice</a>.</p>
  <p class="form-status" role="status" aria-live="polite"></p>
</form>`;
}

function contact() {
  const crumbs = [HOME, { name: 'Contact', href: '/contact/' }];
  const body = `
${pageHero({ crumbs, eyebrow: 'Free survey · fixed price', title: 'Get a free quote', lede: `Tell us about the job in two quick steps. ${esc(site.replyPromise)} Or call us. We like talking about timber.` })}
<section class="section contact-section" aria-label="Quote form and contact details"><div class="wrap contact-grid">
  <div class="form-card">${enquiryForm()}</div>
  <div class="contact-aside">
    <h2 id="ways-title" class="aside-title">Rather talk?</h2>
    <ul class="ways" role="list">
      ${site.phone ? `<li><a class="way" href="${telHref(site.phone)}">${icons.phone}<span><strong>Call</strong> ${esc(site.phone)}</span></a></li>` : ''}
      ${site.whatsapp ? `<li><a class="way" href="${waHref(site.whatsapp)}" rel="noopener">${icons.whatsapp}<span><strong>WhatsApp</strong> ${esc(site.whatsapp)}</span></a></li>` : ''}
      ${site.email ? `<li><a class="way" href="mailto:${esc(site.email)}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M3 5h18v14H3z M3 6l9 7 9-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg><span><strong>Email</strong> ${esc(site.email)}</span></a></li>` : ''}
    </ul>
    <h2 class="aside-title">Opening hours</h2>
    ${hoursTable()}
    ${addressLine() ? `<h2 class="aside-title">The workshop</h2><address>${esc(addressLine())}</address><p class="small">Visits by appointment. Come and see your kitchen on the bench.</p>${site.directionsUrl ? `<p><a class="btn btn-ghost btn-sm" href="${esc(site.directionsUrl)}" rel="noopener">Get directions</a></p>` : ''}` : ''}
    <h2 class="aside-title">What happens next</h2>
    <ol class="next" role="list">
      <li>We reply and book a time to visit.</li>
      <li>We measure, talk it through and take photos.</li>
      <li>You get drawings and a fixed price within two weeks.</li>
    </ol>
  </div>
</div></section>
<!-- ===== AREAS ===== -->
<section class="section surface" aria-labelledby="areas-title"><div class="wrap">${areasBlock()}</div></section>`;
  return page({
    path: '/contact/',
    title: 'Get a free quote',
    description: `Ask ${site.name} for a free survey and a fixed-price quote. Call ${site.phone}, WhatsApp or send a message. ${site.replyPromise}`,
    body,
    crumbs,
    type: 'ContactPage',
    cta: false,
  });
}

function thanks() {
  const crumbs = [HOME, { name: 'Contact', href: '/contact/' }, { name: 'Thank you', href: '/contact/thank-you/' }];
  const body = pageHero({
    crumbs,
    eyebrow: 'Message sent',
    title: 'Thank you. We have your message.',
    lede: `${esc(site.replyPromise)} We will suggest a time to visit and measure.`,
    actions: '<p class="btn-row"><a class="btn" href="/work/">See our recent work</a><a class="btn btn-ghost" href="/">Back to the home page</a></p>',
  });
  return page({ path: '/contact/thank-you/', title: 'Thank you', description: `Your message to ${site.name} has been sent. We will reply soon.`, body, crumbs, noindex: true, cta: false });
}

function notFound() {
  const body = `<section class="page-hero not-found"><div class="wrap">
  <p class="big-404" aria-hidden="true">404</p>
  <h1>We measured twice. This page is still not here.</h1>
  <p class="lede">It may have moved, or the link may be wrong. Try one of these.</p>
  <ul class="chips chips-links" role="list"><li><a href="/">Home</a></li><li><a href="/services/">Services and prices</a></li><li><a href="/work/">Our work</a></li><li><a href="/contact/">Get a free quote</a></li></ul>
</div></section>`;
  return page({ path: '/404.html', title: 'Page not found', description: `This page on the ${site.name} website does not exist. Find our services, work and contact details here.`, body, noindex: true });
}

// A short starting point, not legal advice. Check it against the ICO's guidance for small businesses.
function privacy() {
  const crumbs = [HOME, { name: 'Privacy notice', href: '/privacy/' }];
  const who = esc(site.legalName || site.name);
  const body = `
${pageHero({ crumbs, title: 'Privacy notice', lede: 'How we use the personal information you give us.' })}
<section class="section"><div class="wrap prose">
  <p class="note">Template text. Read it, change it to match what you really do, and check it against the <a href="https://ico.org.uk/for-organisations/advice-for-small-organisations/" rel="noopener">ICO's advice for small organisations</a>.</p>
  <h2>Who we are</h2>
  <p>${who}${site.companyNumber ? `, registered in ${esc(site.registeredIn)} (company number ${esc(site.companyNumber)})` : ''}, is responsible for your personal information on this website.${site.email ? ` Contact us at ${emailLink()}.` : ''}</p>
  <h2>What we collect</h2>
  <p>When you use the quote form, we collect your name, email address, phone number and postcode (if you give them), the type of job and your message. We use them only to reply to you and to provide the service you ask about. Our lawful basis is legitimate interests, or steps before a contract.</p>
  <h2>Where it is kept</h2>
  <p>Messages are stored by Cloudflare, Inc., which hosts this website. We keep them for no longer than we need to, and delete enquiries that do not lead to work after 12 months.</p>
  <h2>Your rights</h2>
  <p>You can ask for a copy of your information, ask us to correct or delete it, or object to how we use it. You can also complain to the Information Commissioner's Office at <a href="https://ico.org.uk" rel="noopener">ico.org.uk</a>.</p>
  <h2>Cookies</h2>
  <p>See our <a href="/cookies/">cookie notice</a>.</p>
</div></section>`;
  return page({ path: '/privacy/', title: 'Privacy notice', description: `How ${site.name} uses the personal information you give us through this website.`, body, crumbs, cta: false });
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
${pageHero({ crumbs, title: 'Cookie notice', lede: 'Which cookies this website uses, and why.' })}
<section class="section"><div class="wrap prose">${tracking}${cf}</div></section>`;
  return page({ path: '/cookies/', title: 'Cookie notice', description: `Which cookies the ${site.name} website uses, and how to change your choice.`, body, crumbs, cta: false });
}

export const pages = [
  ['/', home],
  ['/services/', servicesPage],
  ['/work/', workPage],
  ['/about/', aboutPage],
  ['/contact/', contact],
  ['/contact/thank-you/', thanks],
  ['/privacy/', privacy],
  ['/cookies/', cookies],
  ['/404.html', notFound],
];

// Pages that search engines should not list.
export const hidden = ['/contact/thank-you/', '/404.html'];
