# A calm one-page website with a contact form, on Cloudflare

A one-page website for a counsellor, therapist or any quiet, personal
service. The contact form is the star:

- It checks each box when the visitor leaves it, and explains any problem in plain words.
- It sends without leaving the page, then says "Thank you, Sam" and what happens next.
- It stops spam with **Turnstile**, Cloudflare's free check that a visitor is a person.
- It saves every message in a free **D1** database.
- It gives you an inbox at `/messages`, behind a password. You can search it and mark messages as replied.

It also has real photos, a light and a dark look, opening hours with an
"Open now" badge, and a one-breath exercise for anxious visitors.

All of it runs on Cloudflare's free plan. The business in it, **Fernlea
Counselling**, is made up. Replace it with yours.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/17-Things/cloudflare-starters/tree/main/contact-form)

## What the button does

1. Copies this folder into a new repository in your GitHub or GitLab account.
2. Creates the D1 database and sets up its table.
3. Asks for two secrets, then puts the site live on a free `workers.dev` address.

## The two secrets

- **TURNSTILE_SECRET_KEY**: the default is Cloudflare's always-pass test key, so the
  form works at once. Before you go live, open **Turnstile** in the Cloudflare
  dashboard, add a widget for your domain, and put its secret key here and its site
  key in the `TURNSTILE_SITE_KEY` variable.
- **ADMIN_PASSWORD**: the password for `/messages`. The user name can be anything.
  The page stays locked until you change it from the default.

## Read your messages

Go to `https://<your-site>/messages` and sign in with the password. The newest
200 messages show first. For each one you can:

- reply by email or call back, with one tap
- mark it as replied, so the **Waiting** list shows only what is left
- search by name, email address or any word

## Make it yours

You change four things. You do not need to touch any code.

| What | File | Where |
|---|---|---|
| Your business facts | `public/index.html` | The **EDIT ME** block at the top (lines 4 to 28) lists every fact. Lines you can change end in `<!-- edit -->`. |
| Your brand colour | `public/styles.css` | Line 7: `--brand: #2b6a6c;`. Every other colour is worked out from it. |
| Your photos | `public/img/` | See **Photos** below. |
| The other pages | `public/thanks.html`, `public/404.html`, `public/privacy.html` | The same facts appear in the header and footer. Lines you can change end in `<!-- edit -->`. |

Also change these, which are easy to miss:

- **Google's business facts**: the JSON-LD block in `index.html` (it starts at line 63).
  It holds your name, address, phone, prices and opening hours.
- **Opening hours**: the table under `OPENING HOURS` in `index.html`. The
  `data-open` and `data-close` times drive the "Open now" badge.
- **Your web address**: in `index.html` (the `canonical` and `og:` lines),
  `privacy.html`, `public/robots.txt` and `public/sitemap.xml`.
- **The favicon colour**: `public/favicon.svg`, line 3.
- **Client quotes**: only use words that clients agreed you can share.

Commit, and Cloudflare puts the new version live in about a minute.

Then run `npm run check`. It finds common mistakes: a missing image, an image
with no alt text, a broken link, broken JSON-LD, or a brand colour that is too
light for white text.

### Ask ChatGPT or Claude to do it

Paste `public/index.html` and this prompt:

> Here is my website's index.html. Change only the text in the EDIT ME block,
> the lines marked `<!-- edit -->`, and the JSON-LD block. Keep every class
> name, id and tag. Keep sentences short and in UK English. My business is:
> [name, what you do, town, address, phone, mobile for texts, email, prices,
> opening hours, a few lines about you].

Then do the same for `thanks.html`, `404.html` and `privacy.html`. To change
the colour, ask for "a darker shade that has at least 4.5:1 contrast with white".

## Photos

The photos are placeholders from Pexels. **They are not covered by the MIT
licence.** See `public/img/CREDITS.md` for who took each one. Please replace
them with your own: your room, your desk, your view. Real photos build more
trust than stock ones.

To swap a photo:

1. Make WebP files at the widths in the file names (for example `tea-480.webp`
   and `tea-800.webp`). Free tool: [Squoosh](https://squoosh.app).
2. Save them in `public/img/` with the same names. The page picks them up.
3. Change the photo's `alt` text in the HTML so it describes your photo.
4. Update `public/img/CREDITS.md`.

Any shape of photo works: the page crops it to fit.

## Fonts

The fonts are Manrope and Newsreader. They live in `public/fonts/`, under the
SIL Open Font Licence (see the `OFL-*.txt` files there). The site loads them
from your own address, not from Google.

## Use your own domain

In the Cloudflare dashboard, open **Workers & Pages**, select the Worker, then
**Settings → Domains & Routes → Add → Custom domain**.

**Before you move your domain's nameservers to Cloudflare, copy your email
records.** Check that every MX and TXT record from your old DNS is in
Cloudflare's DNS list before you switch. If one is missing, your email stops.

## Run it on your computer

```bash
npm install
cp .dev.vars.example .dev.vars   # then set a password in .dev.vars
npm run dev                      # sets up a local database, then starts the site
```

## Limits on the free plan

The pages are files: free and unlimited. The form uses the Worker, which allows
100,000 requests a day on the free plan, and D1, which allows 5 GB. A small
business will not come near either. Checked October 2026:
[Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).

---

Made by [17 Things](https://17things.co.uk/cloudflare-free-plan). Code under
the MIT licence. Photos in `public/img/` are not covered by the MIT licence;
see `public/img/CREDITS.md`.
