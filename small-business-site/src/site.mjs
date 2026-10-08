// ---------------------------------------------------------------------------
// EDIT THIS FILE. Every fact on the website comes from here.
// Change the text between the quotes, save, and commit. Cloudflare rebuilds
// the site in about a minute. Leave a value as '' to hide it.
// ---------------------------------------------------------------------------

export const site = {
  // Your real web address, with no slash at the end.
  url: 'https://www.example.co.uk',

  // false: search engines are told to stay away (good while you test on workers.dev).
  // true: the site is open to Google, Bing and AI search. Set it when your domain works.
  live: false,

  name: 'Your Business Name',
  legalName: 'Your Business Name Ltd', // As registered. A sole trader can use their own name.
  companyNumber: '', // Companies House number, for example '01234567'. Leave '' if you have none.
  registeredIn: 'England and Wales',

  // One sentence a customer would say out loud: what you do, for whom, and where.
  tagline: 'Friendly, reliable help for homes and businesses in Your Town.',
  description:
    'Your Business Name helps people in Your Town and nearby with [what you do]. Replace this with two short sentences. Google often shows them under your name.',

  // The schema.org type that fits best: 'LocalBusiness', or a more exact one such as
  // 'Plumber', 'Electrician', 'AccountingService', 'HairSalon', 'Dentist'.
  // Use 'Organization' if customers never visit or call a local base.
  schemaType: 'LocalBusiness',

  // Contact details. 01632 960xxx is an Ofcom number kept for fiction: replace it.
  phone: '01632 960000',
  email: 'hello@example.co.uk',
  address: {
    street: '1 Example Street',
    town: 'Your Town',
    county: 'Your County',
    postcode: 'AB1 2CD',
  },
  areaServed: 'Your Town and the surrounding area',
  // Opening hours, one line each. The format is fixed: two-letter days, 24-hour times.
  hours: [
    { days: 'Mo-Fr', opens: '09:00', closes: '17:30', label: 'Monday to Friday, 9am to 5:30pm' },
    { days: 'Sa', opens: '09:00', closes: '12:00', label: 'Saturday, 9am to 12 noon' },
  ],

  // Your profiles elsewhere. Delete the lines you do not use.
  social: [
    // { name: 'Facebook', url: 'https://www.facebook.com/your-page' },
    // { name: 'Instagram', url: 'https://www.instagram.com/your-name' },
    // { name: 'LinkedIn', url: 'https://www.linkedin.com/company/your-name' },
  ],

  // Optional share image for Facebook, LinkedIn and WhatsApp: a 1200 x 630 JPG or PNG
  // in the public/img folder, for example '/img/share.jpg'. Leave '' for none.
  shareImage: '',
};

// The main services. Each one gets its own section on /services/ and a card on the home page.
export const services = [
  {
    id: 'first-service',
    name: 'Your first service',
    summary: 'One sentence on what the customer gets.',
    detail: [
      'Two or three short sentences on how it works, who it is for, and what it costs or how you price it.',
      'Say what makes you the safe choice: qualifications, insurance, guarantees, response times.',
    ],
  },
  {
    id: 'second-service',
    name: 'Your second service',
    summary: 'One sentence on what the customer gets.',
    detail: ['Describe it in plain words. Answer the questions customers ask you on the phone.'],
  },
  {
    id: 'third-service',
    name: 'Your third service',
    summary: 'One sentence on what the customer gets.',
    detail: ['Describe it in plain words. Delete this service if you offer only two.'],
  },
];

// Three short reasons to choose you. Facts work better than adjectives.
export const reasons = [
  { title: 'Local', text: 'Based in Your Town since 20XX. Replace with your own fact.' },
  { title: 'Qualified', text: 'Name a real qualification, trade body or accreditation.' },
  { title: 'Clear prices', text: 'Say how you quote, and that there are no hidden charges.' },
];

// The About page.
export const about = {
  heading: 'About Your Business Name',
  intro: 'Who you are, in one sentence.',
  story: [
    'How and when the business started. Keep it short and true.',
    'Who does the work, and what they care about. Customers like to know who will turn up.',
    'Any facts that build trust: years in business, number of customers, memberships.',
  ],
};

// Common questions. They show on the home page and help Google and AI assistants answer for you.
export const faqs = [
  { q: 'Which areas do you cover?', a: 'Replace with the towns and postcodes you cover.' },
  { q: 'How much does it cost?', a: 'Give a price, a range, or say how you quote. Customers trust a straight answer.' },
  { q: 'How quickly can you start?', a: 'Say how soon you usually reply and when work can start.' },
];

// The choices in the enquiry form's "What is it about?" list.
export const enquiryTypes = [...services.map((s) => s.name), 'Something else'];

// The menu at the top of every page.
export const nav = [
  { href: '/services/', label: 'Services' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

// Old addresses that should send visitors to a new page (for example after you leave
// another website builder). Each line: [old path, new path]. They become 301 redirects.
export const redirects = [
  // ['/about-us.html', '/about/'],
  // ['/contact-us.html', '/contact/'],
];

// Analytics. All optional and empty by default.
// - cloudflareToken: Cloudflare Web Analytics. No cookies, so no consent banner is needed.
//   Dashboard → Web Analytics → Add a site → copy the token from the snippet.
// - ga4, googleAds, metaPixel: these set cookies. If you fill in any of them, the site
//   adds a cookie banner (vanilla-cookieconsent, MIT) and loads them only after consent.
// Build-time environment variables with the same meaning win over these values:
// CF_BEACON_TOKEN, GA4_ID, GOOGLE_ADS_ID, META_PIXEL_ID.
export const analytics = {
  cloudflareToken: process.env.CF_BEACON_TOKEN ?? '',
  ga4: process.env.GA4_ID ?? '', // G-XXXXXXXXXX
  googleAds: process.env.GOOGLE_ADS_ID ?? '', // AW-XXXXXXXXX
  metaPixel: process.env.META_PIXEL_ID ?? '', // digits only
};

// ---------------------------------------------------------------------------
// You do not need to change anything below this line.
// ---------------------------------------------------------------------------
export const SITE_URL = (process.env.SITE_URL || site.url).replace(/\/$/, '');
export const INDEXABLE = process.env.SITE_INDEXABLE ? process.env.SITE_INDEXABLE === 'true' : site.live;
export const COOKIE_TRACKING = Boolean(analytics.ga4 || analytics.googleAds || analytics.metaPixel);
