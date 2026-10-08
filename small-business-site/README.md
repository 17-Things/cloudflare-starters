# Small business website on Cloudflare

A polished, multi-page website for a UK trade or local business. It runs on
Cloudflare's free plan. The example is a made-up joinery and kitchen workshop,
"Graft & Grain". You change one file to make it yours.

**Pages:** home, services and prices, our work, about, contact (with a quote
form), thank you, privacy, cookies and a 404 page.

**What is on them:**

- A bold home page: headline, photo, Google rating, big numbers, services with
  "from" prices, a gallery, reviews, accreditations, areas you cover and FAQs.
- **A before-and-after slider.** Drag it, or use the arrow keys. Without
  JavaScript the two photos show side by side.
- **A map of the towns you cover**, drawn from your list of towns. No Google
  Maps, so no cookies and no slow embed.
- **A two-step quote form.** Step 1: pick the job from cards that show your
  prices. Step 2: name, email, phone, postcode and message. It checks each
  field when you leave it, lists any problems at the top, and thanks the
  visitor by name. A "Get a quote" button on each service ticks that job for
  them.
- A call bar at the bottom of the screen on phones: Call, WhatsApp, Get a quote.
- Every enquiry is saved in a free **KV** store. You read them at
  `/enquiries`, behind a password.
- Dark mode, print styles, keyboard access and screen-reader labels (WCAG 2.2
  AA). Structured data (JSON-LD) for Google, share cards for WhatsApp and
  Facebook, `sitemap.xml`, `robots.txt` and `llms.txt` for AI assistants.
- No framework, no runtime dependencies, no cookies, no requests to other
  websites. Node 20 or later builds it.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/17-Things/cloudflare-starters/tree/main/small-business-site)

## What the button does

1. Copies this folder into a new repository in your GitHub or GitLab account.
2. Creates the KV store for enquiries.
3. Asks for one secret, `ADMIN_PASSWORD`, then puts the site live on a free
   `workers.dev` address.

You need a free Cloudflare account and a GitHub or GitLab account.

## Make it yours: edit one file

Open **`src/site.mjs`** in your new repository. GitHub lets you edit it in the
browser (press the pencil icon). Every word, number and photo on the website
comes from this file. Change the text between the quotes, then commit.
Cloudflare rebuilds the site and puts it live in about a minute.

The file is in blocks, in this order. Each block has a short note above it.

| Block in `src/site.mjs` | What it controls |
|---|---|
| `site` (top of the file) | Name, headline, phone, WhatsApp, email, address, hours, Google rating, web address |
| `brandColour` (inside `site`) | **The one brand colour** for buttons, highlights and the icon |
| `photos` | Every photo: the file, a description, and which part to keep when cropped |
| `stats` | The big numbers under the headline |
| `services` | Each service: name, summary, "from" price, what is included, photo |
| `steps` | The four "How we work" steps |
| `beforeAfter` | The two photos in the slider, and their labels |
| `projects` | The case studies on the "Our work" page |
| `reviews` | Two or three customer quotes (first name and town only) |
| `accreditations` | Qualifications, insurance and guarantees |
| `towns` | The areas you cover, and where each sits on the little map |
| `about` | The About page story and your team |
| `faqs` | Questions and answers |
| `nav`, `redirects`, `analytics` | Menu, old addresses, optional analytics |

Leave a value as `''` to hide it. For example, set `whatsapp: ''` and every
WhatsApp button goes away.

**Do not** use real customer names or reviews without permission. Copy your
star rating and review count from your Google Business Profile.

### Change the brand colour

Set `brandColour` in `src/site.mjs`, for example `'#2b6a6c'`. The build works
out a readable text colour to go on top of it (dark or white), puts it into
the CSS, and redraws the favicon. If your colour is hard to read, the build
prints a warning.

The small `public/apple-touch-icon.png` (the icon on an iPhone home screen)
is a picture, so it keeps the amber colour. Replace it with your own 180 × 180
PNG if you change the colour.

### Change the photos

1. Upload your photo to `public/img/` (on GitHub: open the folder, then
   **Add file → Upload files**). A JPG or WebP about 1600 pixels wide is best.
   Landscape photos work best.
2. In `src/site.mjs`, find the photo in the `photos` block and change `src`
   to your file, for example `src: '/img/our-kitchen.jpg'`.
3. Change `alt` to describe your photo in a few plain words.
4. If the crop cuts off the important part, change `focus`. `'50% 50%'` keeps
   the middle; `'50% 100%'` keeps the bottom; `'0% 50%'` keeps the left.
5. Delete that photo's line in `public/img/CREDITS.md`, and delete the old
   example files from `public/img/`.

You can upload one size only. If you also upload `name-640.webp` and
`name-1024.webp` next to `name.webp`, phones download the smaller files.

The slider looks best with a real "before" and "after" taken from the same
spot. Add both to `photos`, then name them in `beforeAfter`.

**The example photos are not covered by the MIT licence.** They come from
Pexels and Unsplash. The list is in `public/img/CREDITS.md`. They are there to
show the design. Replace them with photos of your own work: real photos win
more customers.

### Change the share picture

`site.shareImage` is the picture that shows when someone shares your link on
WhatsApp or Facebook. Make a 1200 × 630 JPG of your best work, put it in
`public/img/`, and set its name here.

### Other files (you do not need to touch them)

| To change | Edit |
|---|---|
| Fonts, spacing, colours other than the brand | `src/styles.css` (the "CHANGE THESE" block at the top) |
| The order of sections, or add a page | `src/pages.mjs` (each section has a `<!-- ===== NAME ===== -->` comment) |
| Header, footer, call bar, meta tags | `src/layout.mjs` |
| The form checks and the slider | `src/main.js` |

The headings use **Bricolage Grotesque**, a free font under the SIL Open Font
License. It is stored in `public/fonts/` with its licence, so it never loads
from Google. The body text uses your device's own font.

## Ask ChatGPT or Claude to make the changes

Copy this prompt, then paste the whole of `src/site.mjs` after it:

> Here is the `src/site.mjs` file from my website template. Rewrite the values
> for my business. Keep every key name, comma and quote mark exactly as they
> are. Do not add or remove blocks. Write in short, plain UK English sentences.
> Keep the `id` values lower case with no spaces. Only use facts I give you;
> where you do not know a fact, leave a clear placeholder in capitals.
> My business is: [what you do, where, since when, prices, phone, email,
> address, opening hours, towns you cover, qualifications, team].

Paste the answer back into `src/site.mjs` on GitHub and commit. If the site
does not update, open the Cloudflare dashboard → **Workers & Pages** → your
Worker → **Deployments** to see the error. It is usually a missing comma or
quote mark.

## Read your enquiries

Go to `https://<your-site>/enquiries`. Sign in with any user name and your
`ADMIN_PASSWORD`. You see the newest 50 enquiries first, with a link to older
ones. Each email address and phone number is a link, so you can reply at once.

The page stays locked until you change `ADMIN_PASSWORD` from its default. To
change it: Cloudflare dashboard → **Workers & Pages** → your Worker →
**Settings → Variables and Secrets**.

The form stops most spam with a hidden field, a timing check and a limit of
8 messages an hour from one connection.

## Email each enquiry to you (optional)

The enquiry is always saved. To also get it by email, use Cloudflare Email
Routing. It is free, but your domain must be on Cloudflare first.

1. In the dashboard, open your domain → **Email → Email Routing**. Turn it on
   and add your inbox as a destination address. Click the link in the email
   that Cloudflare sends you.
2. In `wrangler.jsonc`, remove the `//` from the `send_email` line and put in
   your inbox.
3. In the same file, set `ENQUIRY_TO` to your inbox and `ENQUIRY_FROM` to an
   address on your domain, for example `Website <website@example.co.uk>`.
4. Commit. The next enquiry arrives by email too.

## Go live on your own domain

1. In the Cloudflare dashboard, open **Workers & Pages**, select the Worker,
   then **Settings → Domains & Routes → Add → Custom domain**. Your domain must
   already be on Cloudflare.
2. In `src/site.mjs`, set `url` to your address (for example
   `https://www.example.co.uk`) and set `live` to `true`. Commit.
3. Submit `https://<your-domain>/sitemap.xml` in Google Search Console and
   Bing Webmaster Tools.

**Before you move your domain's nameservers to Cloudflare, copy your email
records.** If your email comes from Google Workspace, Microsoft 365 or your
old host, check that every MX and TXT record from your old DNS is in
Cloudflare's DNS list before you switch. If one is missing, your email stops.

### Why `live` starts as `false`

Until you set `live: true`, every page tells search engines to stay away
(`robots.txt`, a `noindex` tag and an `X-Robots-Tag` header). This stops Google
listing your temporary `workers.dev` address in place of your real domain.

### Moving from another website builder

If your old site had addresses such as `/about-us.html`, list them under
`redirects` in `src/site.mjs`. The build turns them into permanent (301)
redirects, so old links and search results still work.

### About Google and reviews

The site tells Google your business details with structured data. It does not
mark up your reviews as star ratings: Google ignores star ratings that a
business adds about itself. Set `rating.url` to your Google reviews link, so
visitors can read them all.

## Analytics and cookies (optional)

- **Cloudflare Web Analytics** counts visits without cookies, so it needs no
  cookie banner. Dashboard → **Web Analytics → Add a site**, then put the token
  in `analytics.cloudflareToken` in `src/site.mjs`.
- **Google Analytics 4, Google Ads or the Meta Pixel** set cookies. If you add
  any of their IDs in `src/site.mjs`, the build adds a cookie banner
  ([vanilla-cookieconsent](https://github.com/orestbida/cookieconsent), MIT)
  with equal "Accept all" and "Reject all" buttons. The tags load only after
  the visitor agrees. With no IDs, there is no banner and no cookies.

The privacy notice is a short starting point, not legal advice. Check it
against the [ICO's advice for small organisations](https://ico.org.uk/for-organisations/advice-for-small-organisations/).

## Work on your own computer (optional)

```bash
npm install
cp .dev.vars.example .dev.vars   # then set your own ADMIN_PASSWORD
npm run dev                      # builds and serves on http://localhost:8787
npm run check:site               # with dev running: checks links, photos, h1s and JSON-LD
npm run deploy                   # builds and deploys
```

## Limits on the free plan

The pages are files: free and unlimited. The form uses the Worker, which allows
100,000 requests a day on the free plan. KV allows 100,000 reads and 1,000
writes a day, and 1 GB of storage. Each enquiry uses two writes, so the form
can take about 500 enquiries a day. A small business will not come near these
limits. Checked October 2026:
[Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/),
[KV limits](https://developers.cloudflare.com/kv/platform/limits/).

---

Made by [17 Things](https://17things.co.uk/cloudflare-free-plan). Code under
the MIT licence. Photos in `public/img/` are not covered by the MIT licence:
see `public/img/CREDITS.md`. The font in `public/fonts/` is under the SIL Open
Font License.
