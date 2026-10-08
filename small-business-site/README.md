# Small business website

![The Graft & Grain example site: a dark hero with a headline, a kitchen photo and a yellow "Get a free quote" button.](https://raw.githubusercontent.com/17-Things/cloudflare-starters/main/screenshots/small-business-site.jpg)

For a trade or local service business that wants several pages, a quote
form and every fact kept in one file.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/17-Things/cloudflare-starters/tree/main/small-business-site)

The site comes filled in for a made-up joinery and kitchen workshop,
Graft & Grain. You change one file, `src/site.mjs`, to make it yours.

## What you get

- **Pages:** home, services and prices, our work, about, contact, a "thank
  you" page, privacy, cookies and a "page not found" page.
- **A before-and-after slider.** Drag it, or use the arrow keys. Without
  JavaScript the two photos show side by side.
- **A two-step quote form.** Step 1: the visitor picks the job. Step 2: name,
  email, phone, postcode and message. It checks each field and lists any
  problems at the top. A "Get a quote" button on each service picks that job
  for the visitor.
- **An inbox for enquiries.** Each enquiry is saved in Cloudflare KV, a free
  store. You read them at `/enquiries`, behind a password.
- **Email of each enquiry (optional)**, through Cloudflare Email Routing.
- **Spam checks:** a hidden field, a timing check and a limit of 8 messages an
  hour from one connection.
- Your phone number, WhatsApp and Google rating; big numbers, services with
  "from" prices, a gallery of projects, reviews, accreditations, a drawn map
  of the towns you cover, and questions and answers.
- Opening hours on the contact page, with today's row marked and an "open
  now" status.
- On phones, a bar at the bottom with **Call**, **WhatsApp** and **Get a quote**.
- Dark mode, print styles, keyboard access and screen-reader labels.
- For search engines and AI assistants: `sitemap.xml`, `robots.txt`,
  `llms.txt`, structured data and share cards for WhatsApp and Facebook.
- Redirects from your old web addresses.
- A cookie banner, added only if you turn on Google Analytics, Google Ads or
  the Meta Pixel.

## What the Deploy button does

1. It copies this folder into a new repository in your GitHub or GitLab account.
2. It creates the KV store for enquiries.
3. It asks for one secret, `ADMIN_PASSWORD`, then puts the site live on a free
   `workers.dev` address.

You need a free Cloudflare account and a free GitHub or GitLab account.

## Make it yours

Every word, number and photo on the site comes from **`src/site.mjs`**. Open
it in your new repository on GitHub and press the pencil icon to edit it.
Change the text between the quotes, then commit. Cloudflare rebuilds the site
and puts it live in about a minute.

The top of the file looks like this:

```js
export const site = {
  url: 'https://www.example.co.uk',
  live: false,
  name: 'Graft & Grain',
  strapline: 'Joinery & kitchens',
  founded: '2009',
  brandColour: '#f5b301',
  phone: '01632 960418',
  whatsapp: '07700 900418',
  email: 'hello@example.co.uk',
  address: { street: 'Unit 3, Tanner’s Yard', town: 'Kelderton', county: '', postcode: 'KD4 7RT' },
  // ...hours, rating and more
};
```

To change the phone number, change `'01632 960418'` to your number. Every page
updates. Leave a value as `''` to hide it: `whatsapp: ''` removes every
WhatsApp button.

The file has these blocks, in this order. Each block has a short note above it.

| Block | What it controls |
|---|---|
| `site` | Name, headline, phone, WhatsApp, email, address, hours, Google rating, web address, brand colour |
| `photos` | Every photo: the file, a description, and which part to keep when cropped |
| `stats` | The big numbers under the headline |
| `services` | Each service: name, summary, "from" price, what is included, photo |
| `steps` | The four "How we work" steps |
| `beforeAfter` | The two photos in the slider, and their labels |
| `projects` | The projects on the "Our work" page |
| `reviews` | Two or three customer quotes (first name and town only) |
| `accreditations` | Qualifications, insurance and guarantees |
| `towns` | The areas you cover, and where each sits on the map |
| `about` | The About page story and your team |
| `faqs` | Questions and answers |
| `nav`, `redirects`, `analytics` | The menu, old web addresses, optional analytics |

Do not use real customer names or reviews without permission. Copy your star
rating and review count from your Google Business Profile.

### Your colour

Set `brandColour` in `site`, for example `'#2b6a6c'`. The build picks dark or
white text to go on it, and redraws the browser-tab icon. If your colour is
hard to read, the build prints a warning.

`public/apple-touch-icon.png` (the icon on a phone's home screen) is a
picture, so it keeps the amber. Replace it with your own 180 × 180 PNG.

### Your photos

1. Upload your photo to `public/img/`. On GitHub: open the folder, then
   **Add file → Upload files**. A JPG or WebP about 1600 pixels wide works best.
2. In `src/site.mjs`, find the photo in the `photos` block. Change `src` to
   your file, for example `src: '/img/our-kitchen.jpg'`.
3. Change `alt` to describe your photo in a few plain words.
4. If the crop cuts off the important part, change `focus`. `'50% 50%'` keeps
   the middle, `'50% 100%'` keeps the bottom and `'0% 50%'` keeps the left.
5. Delete that photo's line in `public/img/CREDITS.md`, and delete the old
   example files.

The example photos come from Pexels and Unsplash. They are **not** covered by
the MIT licence. Replace them with photos of your own work.

`site.shareImage` is the picture that shows when someone shares your link.
Make it a 1200 × 630 JPG.

### Let an AI assistant do the edits

Copy this prompt into ChatGPT, Claude or a similar assistant, then paste the
whole of `src/site.mjs` after it:

> Here is the `src/site.mjs` file from my website template. Rewrite the values
> for my business. Keep every key name, comma and quote mark exactly as they
> are. Do not add or remove blocks. Write in short, plain UK English sentences.
> Keep the `id` values lower case with no spaces. Only use facts I give you;
> where you do not know a fact, leave a clear placeholder in capitals.
> My business is: [what you do, where, since when, prices, phone, email,
> address, opening hours, towns you cover, qualifications, team].

Paste the answer back into `src/site.mjs` and commit. If the site does not
update, open the Cloudflare dashboard → **Workers & Pages** → your site →
**Deployments** to see the error. It is usually a missing comma or quote mark.

### Analytics (optional)

- **Cloudflare Web Analytics** counts visits without cookies, so it needs no
  banner. In the dashboard open **Web Analytics → Add a site**, then put the
  token in `analytics.cloudflareToken`.
- **Google Analytics 4, Google Ads or the Meta Pixel** set cookies. If you add
  any of their IDs in `analytics`, the build adds a cookie banner with equal
  "Accept all" and "Reject all" buttons. The tags load only after the visitor
  agrees.

The privacy notice is a short starting point, not legal advice. Check it
against the [ICO's advice for small organisations](https://ico.org.uk/for-organisations/advice-for-small-organisations/).

## Passwords and keys

| Name | What it is | Where to set it |
|---|---|---|
| `ADMIN_PASSWORD` | The password for `/enquiries`. Use any user name with it. The page stays locked until you change it from the default. | The Deploy button asks for it. To change it later: Cloudflare dashboard → **Workers & Pages** → your site → **Settings → Variables and Secrets**. |
| `ENQUIRY_TO` | Optional. The inbox that gets a copy of each enquiry. | `vars` in `wrangler.jsonc` |
| `ENQUIRY_FROM` | Optional. The sender, on your own domain, for example `Website <website@example.co.uk>`. | `vars` in `wrangler.jsonc` |

To read your enquiries, go to `https://<your-site>/enquiries` and sign in.
You see the newest 50 first, with a link to older ones.

### Email each enquiry to you (optional)

Each enquiry is always saved. To get a copy by email, use Cloudflare Email
Routing. It is free, but your domain must use Cloudflare first.

1. In the dashboard, open your domain → **Email → Email Routing**. Turn it on
   and add your inbox as a destination address. Click the link in the email
   that Cloudflare sends you.
2. In `wrangler.jsonc`, remove the `//` from the `send_email` line and put in
   your inbox.
3. In the same file, set `ENQUIRY_TO` and `ENQUIRY_FROM`.
4. Commit. The next enquiry also arrives by email.

### Work on your own computer (optional)

You need Node.js 20 or later.

```bash
npm install
cp .dev.vars.example .dev.vars   # then set your own ADMIN_PASSWORD
npm run dev                      # builds and serves on http://localhost:8787
npm run check:site               # with dev running: checks links, photos, headings and structured data
npm run deploy                   # builds and deploys
```

## Costs and limits

- The pages are files. Visits to them are free and unlimited.
- The form and the inbox use a Worker. The free plan allows 100,000 Worker
  requests a day.
- KV allows 100,000 reads and 1,000 writes a day, and 1 GB of storage. Each
  enquiry uses two writes, so the form can take about 500 enquiries a day.
- Email Routing is free.

Checked October 2026:
[Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/),
[KV limits](https://developers.cloudflare.com/kv/platform/limits/).

## Connect your domain

1. In the Cloudflare dashboard, open **Workers & Pages**, select your site,
   then **Settings → Domains & Routes → Add → Custom domain**. Your domain must
   already use Cloudflare for its DNS.
2. In `src/site.mjs`, set `url` to your address (for example
   `https://www.example.co.uk`) and set `live` to `true`. Commit.
3. Submit `https://<your-domain>/sitemap.xml` in Google Search Console and
   Bing Webmaster Tools.

> **Warning: moving your domain's DNS to Cloudflare can stop your email.**
> Before you change your nameservers, check that every **MX** and **TXT**
> record from your old DNS is also in Cloudflare's DNS list. This matters most
> if your email comes from Google Workspace, Microsoft 365 or your old host.
> If one record is missing, email to your domain stops arriving.

**Why `live` starts as `false`:** until you set `live: true`, every page tells
search engines to stay away. This stops Google listing your temporary
`workers.dev` address in place of your real domain.

**Moving from another website builder:** list your old addresses, such as
`/about-us.html`, under `redirects` in `src/site.mjs`. The build turns them
into permanent (301) redirects, so old links still work.

## Files

```
src/
  site.mjs          EDIT THIS: every fact, word and photo
  pages.mjs         The sections on each page, in order
  layout.mjs        Header, footer, phone bar and meta tags
  styles.css        The design ("CHANGE THESE" block at the top)
  main.js           The form checks and the slider
  consent.js        The cookie banner (only used with GA4, Ads or Meta)
  build.mjs         Builds the pages into dist/
worker/index.js     Saves enquiries, the /enquiries inbox and the optional email
public/
  img/              Photos, and CREDITS.md for the placeholders
  fonts/            Geist and Geist Mono, with their licences
scripts/check.mjs   The checks that `npm run check:site` runs
wrangler.jsonc      Cloudflare settings: KV store, email and variables
.dev.vars.example   The password for local testing
```

The fonts are stored in `public/fonts/`, so no visitor data goes to Google.

---

Made by [17 Things](https://17things.co.uk/cloudflare-free-plan). The code is
under the MIT licence. The photos in `public/img/` and the fonts in
`public/fonts/` are not: see `public/img/CREDITS.md` and the licence files in
`public/fonts/`.
