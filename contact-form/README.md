# One-page website with a contact form

![The Fernlea Counselling example site: a calm headline, an arched photo of a quiet room and a "Book a free 20-minute call" button.](https://raw.githubusercontent.com/17-Things/cloudflare-starters/main/screenshots/contact-form.jpg)

For a counsellor, therapist or other quiet, personal service that wants
people to get in touch through a safe, simple form.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/17-Things/cloudflare-starters/tree/main/contact-form)

The site comes filled in for a made-up practice, Fernlea Counselling. You
change the words and photos to make it yours.

## What you get

- **A contact form** with name, email, phone (optional), a topic (optional)
  and a message. It checks each box when the visitor leaves it and explains
  any problem in plain words. It sends without leaving the page, then says
  "Thank you, Sam" and what happens next.
- **A spam check** with Turnstile, Cloudflare's free check that a visitor is a
  person, plus a hidden field that catches bots.
- **Every message saved** in a free Cloudflare D1 database.
- **An inbox at `/messages`**, behind a password. It shows the newest 200
  messages. You can search them, reply by email or call with one tap, and mark
  each one as replied so the **Waiting** list shows only what is left.
- A "thank you" page for visitors whose browser blocks scripts.
- Topic buttons ("Anxiety and worry", "Grief and loss"...) that fill in the
  form's topic for the visitor.
- Three session types with prices, a note on lower-cost places, client quotes,
  a section about the room, an about section and questions and answers.
- Opening hours with today's row marked and an **"Open now"** badge.
- A one-breath exercise for anxious visitors.
- On phones, a bar at the bottom with **Call** and **Book a free call**.
- Dark mode, a print layout, a privacy page, a "page not found" page,
  structured data for Google, a sharing preview image and security headers.

## What the Deploy button does

1. It copies this folder into a new repository in your GitHub or GitLab account.
2. It creates the D1 database and sets up its table.
3. It asks for your Turnstile keys and a password, then puts the site live on
   a free `workers.dev` address.

You need a free Cloudflare account and a free GitHub or GitLab account.

## Make it yours

Most of the site is in one file: **`public/index.html`**. You can edit it on
GitHub in your browser. Each time you save (commit), the site updates in about
a minute.

### 1. Your business facts

At the top of `public/index.html` there is an **EDIT ME** block. It lists each
fact the page uses now: name, phone, mobile for texts, email, address, prices
and web address. Find each old value and replace it **everywhere** in the file.

For example, to change the phone number, replace both forms of it:

```
01632 960418      →  01234 567890      (the number people see)
+441632960418     →  +441234567890     (the number in links: +44, no first 0, no spaces)
```

### 2. Your words

Every line with words to change ends with `<!-- edit -->`. Change the text
between the tags. Keep the tags, and keep every `class="..."` and `id="..."`.
Only use client quotes that clients agreed you can share.

### 3. The places that are easy to miss

| What | Where |
|---|---|
| Google's business facts (name, address, phone, prices, hours) | The structured data block (`application/ld+json`) in the `<head>` of `index.html` |
| Opening hours | The table under `OPENING HOURS` in `index.html`. The `data-open` and `data-close` times (24-hour clock) drive the "Open now" badge |
| Your web address | `index.html` (the `canonical` and `og:` lines), `privacy.html`, `public/robots.txt` and `public/sitemap.xml` |
| The other pages | `public/thanks.html`, `public/404.html` and `public/privacy.html`: lines that end with `<!-- edit -->` |

### 4. Your colour

Open `public/styles.css` and change `--brand` near the top
(now `#355e45`). The other colours are worked out from it. Pick a dark colour,
because the buttons put white text on it: it needs 4.5:1 contrast or more.
`npm run check` warns you if it is too light.

Then put the same colour in these places:

| File | What to change |
|---|---|
| `public/favicon.svg` | The `fill` colour (the icon in the browser tab) |
| `public/site.webmanifest` | `theme_color` |
| `public/apple-touch-icon.png`, `public/icon-512.png` | Replace them with 180 × 180 and 512 × 512 PNGs of your icon |

### 5. Your photos

The photos are **placeholders** from Pexels. They are not covered by the MIT
licence. Replace them with your own: your room, your desk, your view. Real
photos build more trust than stock ones.

1. Make WebP files at the widths in the file names, for example
   `tea-480.webp` and `tea-800.webp`. [Squoosh](https://squoosh.app) is free.
2. Save them in `public/img/` with the same names.
3. Change each photo's `alt` text in the HTML to describe your photo.
4. Delete each replaced photo's line in `public/img/CREDITS.md`.

Any shape of photo works: the page crops it to fit.

### Let an AI assistant do the edits

Copy `public/index.html` into ChatGPT, Claude or a similar assistant, then
paste this prompt:

> Here is my website's index.html. Change only the text in the EDIT ME block,
> the lines marked `<!-- edit -->`, and the JSON-LD block. Keep every class
> name, id and tag. Keep sentences short and in UK English. My business is:
> [name, what you do, town, address, phone, mobile for texts, email, prices,
> opening hours, a few lines about you].

Then do the same for `thanks.html`, `404.html` and `privacy.html`.

### Check your changes

If you have Node.js on your computer, run `npm install` once. Then
`npm run check` finds a missing image, an image with no alt text, a broken
link, broken structured data, or a brand colour that is too light.

## Passwords and keys

| Name | What it is | Where to set it |
|---|---|---|
| `TURNSTILE_SITE_KEY` | The public Turnstile key that shows the spam check on the page | `vars` in `wrangler.jsonc` |
| `TURNSTILE_SECRET_KEY` | The secret Turnstile key that the server uses to check each answer | The Deploy button asks for it. To change it later: Cloudflare dashboard → **Workers & Pages** → your site → **Settings → Variables and Secrets** |
| `ADMIN_PASSWORD` | The password for `/messages`. Use any user name with it. The page stays locked until you change it from the default. | Same as above |

The keys start as Cloudflare's always-pass **test** keys, so the form works at
once. **Replace them before you go live:** in the Cloudflare dashboard open
**Turnstile → Add widget**, add your domain, then copy the site key and the
secret key into the places above.

To read your messages, go to `https://<your-site>/messages` and sign in.

### Work on your own computer (optional)

```bash
npm install
cp .dev.vars.example .dev.vars   # then set a password in .dev.vars
npm run dev                      # sets up a local database, then starts the site
```

## Costs and limits

- The pages are files. Visits to them are free and unlimited.
- The form and the inbox use a Worker. The free plan allows 100,000 Worker
  requests a day.
- D1 allows 5 GB of storage on the free plan.
- Turnstile is free.

Checked October 2026:
[Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).

## Connect your domain

In the Cloudflare dashboard, open **Workers & Pages**, select your site, then
**Settings → Domains & Routes → Add → Custom domain**. Your domain must
already use Cloudflare for its DNS. Then add the domain to your Turnstile
widget too.

> **Warning: moving your domain's DNS to Cloudflare can stop your email.**
> Before you change your nameservers, check that every **MX** and **TXT**
> record from your old DNS is also in Cloudflare's DNS list. This matters most
> if your email comes from Google Workspace, Microsoft 365 or your old host.
> If one record is missing, email to your domain stops arriving.

## Files

```
public/
  index.html        The page, with the EDIT ME block at the top
  styles.css        The design. Change --brand near the top
  app.js            The form checks, Turnstile, the "Open now" badge and the breathing exercise
  thanks.html       The "thank you" page
  privacy.html      The privacy page
  404.html          The "page not found" page
  img/              Photos, and CREDITS.md for the placeholders
  fonts/            Fraunces and Figtree, with their licences
  favicon.svg, apple-touch-icon.png, icon-512.png, site.webmanifest   Icons
  robots.txt, sitemap.xml    For search engines
  _headers          Security headers
src/index.js        Checks Turnstile, saves messages and shows the /messages inbox
migrations/         The database tables
scripts/check.mjs   The checks that `npm run check` runs
wrangler.jsonc      Cloudflare settings: database, Turnstile site key
.dev.vars.example   The secret key and password for local testing
```

The fonts are stored in `public/fonts/`, so no visitor data goes to Google.

---

Made by [17 Things](https://17things.co.uk/cloudflare-free-plan). The code is
under the MIT licence. The photos in `public/img/` and the fonts in
`public/fonts/` are not: see `public/img/CREDITS.md` and the licence files in
`public/fonts/`.
