// ===========================================================================
// EDIT THIS FILE. Every fact, word and photo on the website comes from here.
//
// Change the text between the quotes, save, and commit. Cloudflare rebuilds
// the site in about a minute. Leave a value as '' to hide it.
//
// Everything here is an example for a made-up business, "Graft & Grain".
// The phone numbers are Ofcom drama numbers and the emails use example.co.uk.
// Replace all of it with your own facts.
// ===========================================================================

export const site = {
  // Your real web address, with no slash at the end.
  url: 'https://www.example.co.uk',

  // false: search engines are told to stay away (good while you test on workers.dev).
  // true: the site is open to Google, Bing and AI search. Set it when your domain works.
  live: false,

  name: 'Graft & Grain',
  // A few words under the name in the header. Leave '' for none.
  strapline: 'Joinery & kitchens',
  legalName: 'Graft & Grain Joinery Ltd', // As registered. A sole trader can use their own name.
  companyNumber: '', // Companies House number, for example '01234567'. Leave '' if you have none.
  registeredIn: 'England and Wales',
  founded: '2009', // The year you started. Leave '' to hide it.

  // THE BRAND COLOUR. One colour for buttons, highlights and the favicon.
  // A bright colour (like this amber) gets dark text on top; a dark colour gets
  // white text. The build works this out for you and warns you if it cannot.
  brandColour: '#f5b301',

  // The big headline on the home page: what you do and where. Keep it short.
  heroTitle: 'Kitchens and joinery, made in Kelderton.',
  // One or two sentences under the headline.
  heroLead:
    'We draw, make and fit hand-built kitchens, staircases and fitted furniture. The people who make it in our workshop are the people who fit it in your home.',
  // One sentence a customer would say out loud: what you do, for whom, and where.
  tagline: 'Hand-made kitchens, staircases and fitted furniture for homes in and around Kelderton.',
  description:
    'Graft & Grain makes and fits hand-built kitchens, staircases, wardrobes and utility rooms in Kelderton and 25 miles around. Free survey, fixed prices and a 10-year guarantee.',

  // The schema.org type that fits best, for Google. For example 'HomeAndConstructionBusiness',
  // 'GeneralContractor', 'Plumber', 'Electrician', 'HairSalon', or plain 'LocalBusiness'.
  schemaType: 'HomeAndConstructionBusiness',
  // A rough price level for Google: '£', '££' or '£££'.
  priceRange: '££',

  // Contact details. 01632 960xxx and 07700 900xxx are Ofcom numbers kept for
  // TV and fiction: replace them with yours.
  phone: '01632 960418',
  // A mobile number for WhatsApp. Leave '' to hide the WhatsApp buttons.
  whatsapp: '07700 900418',
  email: 'hello@example.co.uk',
  address: {
    street: 'Unit 3, Tanner’s Yard',
    town: 'Kelderton',
    county: '',
    postcode: 'KD4 7RT',
  },
  // Your map position, for Google, with 5 decimal places. Leave '' if you work from home.
  geo: { lat: '', lng: '' },
  // A link to your business on Google Maps, for the "Get directions" button. Leave '' to hide it.
  directionsUrl: '',
  // A short line for the footer and for Google.
  areaServed: 'Kelderton and 25 miles around',
  // When you reply. It shows next to the form and on the thank-you page.
  replyPromise: 'We reply within one working day.',

  // Opening hours, one line each. The format is fixed: two-letter days, 24-hour times.
  hours: [
    { days: 'Mo-Fr', opens: '08:00', closes: '17:30', label: 'Monday to Friday', time: '8am to 5:30pm' },
    { days: 'Sa', opens: '09:00', closes: '13:00', label: 'Saturday', time: '9am to 1pm' },
  ],

  // Your Google rating. Copy the numbers from your Google Business Profile.
  // url: the link to your reviews on Google. Leave score '' to hide the rating.
  rating: { score: '4.9', count: '127', url: '' },

  // Your profiles elsewhere. Delete the lines you do not use.
  social: [
    // { name: 'Instagram', url: 'https://www.instagram.com/your-name' },
    // { name: 'Facebook', url: 'https://www.facebook.com/your-page' },
    // { name: 'Houzz', url: 'https://www.houzz.co.uk/your-page' },
  ],

  // The picture that shows when someone shares your site on WhatsApp, Facebook or
  // LinkedIn: a 1200 x 630 JPG in public/img. Leave '' for none.
  shareImage: '/img/share.jpg',
};

// ---------------------------------------------------------------------------
// PHOTOS. One line per photo. Each photo lives in public/img/.
//
// To change a photo: upload your own JPG or WebP to public/img/ (about 1600
// pixels wide is best) and change `src` below to its name, for example
// '/img/my-kitchen.jpg'. Then describe it in `alt` for people who cannot see it.
// `focus` says which part of the photo to keep when it is cropped:
// '50% 50%' is the middle, '50% 100%' is the bottom.
//
// The example photos are from Pexels and Unsplash. They are not covered by the
// MIT licence. See public/img/CREDITS.md, and delete a line there when you
// replace that photo.
// ---------------------------------------------------------------------------
export const photos = {
  kitchen: { src: '/img/kitchen.webp', alt: 'A sage green shaker kitchen with brass handles and an oak island', focus: '45% 60%' },
  kitchenDrawing: { src: '/img/kitchen-drawing.webp', alt: 'A line drawing of the same kitchen, as drawn before it was made', focus: '45% 60%' },
  kitchenDetail: { src: '/img/kitchen-detail.webp', alt: 'Close up of green shaker doors, a marble worktop and a brass tap', focus: '50% 70%' },
  staircase: { src: '/img/staircase.webp', alt: 'An oak staircase with a glass balustrade in a bright hallway', focus: '60% 50%' },
  wardrobe: { src: '/img/wardrobe.webp', alt: 'A white fitted wardrobe wall with shelves, drawers and hanging space', focus: '50% 50%' },
  utility: { src: '/img/utility.webp', alt: 'A utility room with a solid wood worktop over the washing machine', focus: '50% 50%' },
  workbench: { src: '/img/workbench.webp', alt: 'Chisels, mallets and a block plane on a workbench covered in shavings', focus: '50% 50%' },
  planing: { src: '/img/planing.webp', alt: 'A joiner’s hands pushing a hand plane along a board', focus: '50% 50%' },
  measuring: { src: '/img/measuring.webp', alt: 'A pencil marking a board next to a yellow tape measure', focus: '40% 50%' },
  library: { src: '/img/library.webp', alt: 'A wall of built-in bookshelves around a tiled fireplace, with two armchairs', focus: '45% 50%' },
  dresser: { src: '/img/dresser.webp', alt: 'A sage green painted dresser with a rail of copper pans above it', focus: '50% 60%' },
  renovation: { src: '/img/renovation.webp', alt: 'A room stripped back to plaster with a stepladder, ready for fitting', focus: '50% 50%' },
};

// Three to five big facts under the headline. Facts work better than adjectives.
export const stats = [
  { value: '2009', label: 'Making in our Kelderton workshop since' },
  { value: '640+', label: 'Rooms drawn, made and fitted' },
  { value: '10 yrs', label: 'Written guarantee on all we make' },
  { value: '£0', label: 'For the survey and first drawings' },
];

// ---------------------------------------------------------------------------
// SERVICES. Each one gets a card on the home page, a section on /services/
// and a choice in the quote form.
//   id: a short name for the web address, lower case, no spaces.
//   priceFrom: a real starting price builds trust. Leave '' to hide it.
//   photo: a name from the PHOTOS list above.
// ---------------------------------------------------------------------------
export const services = [
  {
    id: 'kitchens',
    name: 'Hand-made kitchens',
    summary: 'Painted shaker, solid oak or flat slab. Made to fit your room to the millimetre.',
    priceFrom: '£14,500',
    priceNote: 'fitted, for a typical 3 × 4 m kitchen',
    time: 'Made in 6 to 8 weeks. Fitted in 1 to 2 weeks.',
    photo: 'kitchenDetail',
    detail: [
      'We build every cabinet in our workshop from 18 mm birch plywood, not chipboard. Doors are solid timber, hand-painted in any colour you choose.',
      'You get scaled drawings before we cut a thing, and a fixed price in writing. The same two people fit your kitchen from the first day to the last.',
    ],
    included: [
      'Free survey and scaled drawings',
      'Birch ply cabinets with dovetailed drawers',
      'Hand-painted doors in any colour',
      'Worktops, sink and appliances fitted',
      'Plumbing and electrics by our registered trades',
    ],
  },
  {
    id: 'fitted-furniture',
    name: 'Wardrobes and alcove units',
    summary: 'Fitted wardrobes, bookcases and window seats that use every centimetre.',
    priceFrom: '£1,850',
    priceNote: 'for a pair of alcove units',
    time: 'Made in 3 to 4 weeks. Fitted in 1 to 3 days.',
    photo: 'wardrobe',
    detail: [
      'Old houses have walls that lean and floors that slope. We scribe every unit to fit, so there are no gaps and no filler strips.',
      'Choose the inside too: hanging rails, drawers, shoe shelves and lights that come on when the door opens.',
    ],
    included: ['Home visit and design', 'Scribed to your walls and ceiling', 'Soft-close hinges and runners', 'Painted on site to hide every joint'],
  },
  {
    id: 'staircases',
    name: 'Staircases',
    summary: 'New oak staircases, and old ones made safe, quiet and handsome again.',
    priceFrom: '£6,800',
    priceNote: 'for a straight oak staircase, fitted',
    time: 'Made in 5 to 7 weeks. Fitted in 2 to 4 days.',
    photo: 'staircase',
    detail: [
      'We make straight, winder and floating staircases in oak, ash and painted softwood. Every one meets the Building Regulations, and we deal with Building Control for you.',
      'If your stairs only need help, we can replace treads, spindles and handrails, and stop the creaks for good.',
    ],
    included: ['Measured and drawn to the Building Regulations', 'Solid oak, ash or painted softwood', 'Glass, spindle or panelled balustrades', 'Old staircase taken away'],
  },
  {
    id: 'utility-rooms',
    name: 'Utility and boot rooms',
    summary: 'Storage that hides the washing, the boots and the dog bed.',
    priceFrom: '£4,200',
    priceNote: 'fitted, with a solid wood worktop',
    time: 'Made in 4 to 6 weeks. Fitted in 3 to 5 days.',
    photo: 'utility',
    detail: [
      'A good utility room takes the mess out of the kitchen. We plan space for the washing machine, a drying rail, a sink and tall cupboards for the hoover.',
      'Boot rooms get benches, hooks and lockers with air holes, so wet coats dry.',
    ],
    included: ['Planned around your machines', 'Tall cupboards and open shelves', 'Solid oak or iroko worktops', 'Benches, hooks and boot lockers'],
  },
  {
    id: 'joinery',
    name: 'Doors, windows and repairs',
    summary: 'Sash windows, internal doors, skirting and the jobs other trades turn down.',
    priceFrom: '£340',
    priceNote: 'a day for one joiner, plus materials',
    time: 'Most jobs booked within 3 weeks.',
    photo: 'workbench',
    detail: [
      'We repair sash windows, hang doors that close properly, and make matching mouldings for period homes.',
      'Small jobs are welcome. Tell us what you need and we will give you a price before we start.',
    ],
    included: ['Sash window repair and draught-proofing', 'Internal doors hung and fitted', 'Matching skirting and architrave', 'Day rate or fixed price'],
  },
];

// HOW WE WORK (steps): four steps from first call to finished room.
export const steps = [
  { title: 'We visit and measure', text: 'A free visit within ten working days. We measure every wall, pipe and socket, and listen to how you use the room.', photo: 'measuring' },
  { title: 'You get drawings and a fixed price', text: 'Scaled drawings and a price in writing. It does not change unless you change the job.', photo: 'kitchenDrawing' },
  { title: 'We make it in our workshop', text: 'Every door and drawer is made by hand in Kelderton. You are welcome to visit and see it on the bench.', photo: 'planing' },
  { title: 'We fit it and tidy up', text: 'The same team fits it. Floors are protected, dust is kept down, and we take every scrap away.', photo: 'renovation' },
];

// BEFORE AND AFTER. The slider on the home and work pages.
// Put your real "before" photo in `before` and the finished room in `after`.
// Both photos should be taken from the same spot, at the same size.
export const beforeAfter = {
  before: 'kitchenDrawing',
  after: 'kitchen',
  beforeLabel: 'The drawing',
  afterLabel: 'The kitchen',
  caption: 'Painted shaker kitchen in Ashby Fold. We drew it in March and fitted it in May.',
};

// PROJECTS for the "Our work" page. Two photos each works best.
export const projects = [
  {
    id: 'ashby-fold-kitchen',
    title: 'A painted shaker kitchen',
    place: 'Ashby Fold',
    job: 'Kitchen with an oak island',
    text: 'The owners wanted a kitchen that felt like it had always been there. We made sage green shaker doors, a larder unit, and an island in oiled oak with seating on one side.',
    facts: ['7 weeks to make', '9 days to fit', 'Hand-painted in sage green'],
    photos: ['kitchen', 'kitchenDetail'],
  },
  {
    id: 'lowmoor-staircase',
    title: 'An oak and glass staircase',
    place: 'Lowmoor',
    job: 'New staircase in a barn conversion',
    text: 'A dark hallway with a closed-in staircase. We opened it up with solid oak treads and a frameless glass balustrade, so light from the landing reaches the front door.',
    facts: ['6 weeks to make', '3 days to fit', 'Building Control signed off'],
    photos: ['staircase', 'planing'],
  },
  {
    id: 'kelderton-wardrobes',
    title: 'A wall of wardrobes',
    place: 'Kelderton',
    job: 'Fitted wardrobes in a Victorian bedroom',
    text: 'The walls were out of square by 30 mm. We scribed a full wall of wardrobes to fit with no gaps, with drawers inside and lights that switch on when the doors open.',
    facts: ['3 weeks to make', '2 days to fit', 'Painted on site'],
    photos: ['wardrobe', 'measuring'],
  },
  {
    id: 'fernley-utility',
    title: 'A utility room that works',
    place: 'Fernley',
    job: 'Utility room with a solid wood worktop',
    text: 'A narrow room with a washing machine, a boiler and nowhere to put anything. We built tall cupboards, a raised worktop in oiled iroko, and a hidden drying rail.',
    facts: ['4 weeks to make', '3 days to fit', 'Boiler boxed in with access panel'],
    photos: ['utility', 'workbench'],
  },
];

// REVIEWS. Copy two or three real ones from Google, with the person's permission.
// Use a first name and town only. These are examples: replace them.
export const reviews = [
  {
    quote: 'They found space we did not know we had and fitted a full larder in it. The kitchen is the best thing we have done to the house.',
    name: 'Hannah',
    town: 'Ashby Fold',
    job: 'Shaker kitchen',
  },
  {
    quote: 'Fixed price, and it stayed fixed. Tom rang every Friday to say where things were. No surprises at all.',
    name: 'Raj',
    town: 'Lowmoor',
    job: 'Kitchen and utility room',
  },
  {
    quote: 'Our old stairs creaked on every step. The new oak staircase is silent and solid, and they left the house cleaner than they found it.',
    name: 'Margaret',
    town: 'Saltwick',
    job: 'Oak staircase',
  },
];

// ACCREDITATIONS, insurance and promises. Only list what is true for you.
export const accreditations = [
  { title: 'City & Guilds Level 3', text: 'Every joiner is time-served and qualified.' },
  { title: '£5m public liability', text: 'Fully insured. Ask and we send the certificate.' },
  { title: 'FSC-certified timber', text: 'From well-managed forests, as standard.' },
  { title: '10-year guarantee', text: 'In writing, on everything we make.' },
  { title: 'Protected deposits', text: 'Held in a separate client account until we start.' },
];

// AREAS WE COVER. The towns show as a list and on a small map.
// x and y place each town on the map: 0 to 100, from the left and from the top.
// The first town is your base.
export const towns = [
  { name: 'Kelderton', x: 50, y: 52 },
  { name: 'Ashby Fold', x: 30, y: 30 },
  { name: 'Lowmoor', x: 72, y: 26 },
  { name: 'Saltwick', x: 82, y: 58 },
  { name: 'Brindle Green', x: 22, y: 64 },
  { name: 'Fernley', x: 60, y: 80 },
  { name: 'Hollins Cross', x: 38, y: 84 },
  { name: 'Upper Wray', x: 54, y: 16 },
  { name: 'Thistlebank', x: 12, y: 40 },
];

// The About page.
export const about = {
  heading: 'A joinery workshop, not a showroom',
  intro: 'We are a team of six. We draw, make and fit everything ourselves.',
  story: [
    'Tom Hale started Graft & Grain in 2009 in a single garage on Tanner’s Yard. He had trained as an apprentice joiner and wanted to make kitchens the old way: solid timber, proper joints, and no flat-pack.',
    'The workshop now takes up three units on the yard. We still make every cabinet, door and drawer by hand, and we still fit them ourselves. We do not use subcontractors for joinery.',
    'We take on about 40 rooms a year. That is enough to keep six people busy, and few enough that Tom sees every job.',
  ],
  team: [
    { name: 'Tom Hale', role: 'Founder and lead joiner', text: 'Trained as an apprentice. Surveys most jobs himself.' },
    { name: 'Priya Okafor', role: 'Designer', text: 'Draws every kitchen and staircase before we cut any timber.' },
    { name: 'Dan Mercer', role: 'Fitter', text: 'Fits most of our kitchens. Very tidy.' },
    { name: 'Jess Ward', role: 'Office and diary', text: 'Books your survey and rings you every Friday.' },
  ],
};

// Common questions. They show on the home page. Answer them like you would on the phone.
export const faqs = [
  {
    q: 'How much does a kitchen cost?',
    a: 'Most of our kitchens cost between £14,500 and £32,000, fitted. The price depends on the size, the timber and the worktops. After the survey you get a fixed price in writing.',
  },
  {
    q: 'Do you charge for the survey?',
    a: 'No. The visit and the first drawings are free. We ask for a 25% deposit only when you are happy and want to go ahead.',
  },
  {
    q: 'How long is the wait?',
    a: 'We usually start making 4 to 6 weeks after you approve the drawings. Ring us and we will tell you the next free slot.',
  },
  {
    q: 'Do you do the plumbing, electrics and plastering?',
    a: 'Yes. We bring in a registered gas engineer, an electrician and a plasterer we have worked with for years. You get one price and one person to call.',
  },
  {
    q: 'Can I buy my own appliances or worktops?',
    a: 'Yes. Tell us the models before we draw the kitchen and we will build around them. We fit them at no extra cost.',
  },
  {
    q: 'Which areas do you cover?',
    a: 'Kelderton and about 25 miles around it. See the list of towns on this page. If you are just outside, ask.',
  },
];

// The choices in the quote form's first step.
export const enquiryTypes = [...services.map((s) => s.name), 'Something else'];

// The menu at the top of every page.
export const nav = [
  { href: '/services/', label: 'Services' },
  { href: '/work/', label: 'Our work' },
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
