# One-page business website

![The Wren & Rye example site: a big headline, a photo of coffee cups and an "Open now" badge.](https://raw.githubusercontent.com/17-Things/cloudflare-starters/main/screenshots/business-site.jpg)

For a café, shop or salon that needs one good page: what you sell, when you
are open and how to find you.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/17-Things/cloudflare-starters/tree/main/business-site)

The page comes filled in for a made-up bakery, Wren & Rye. You change the
words and photos to make it yours. It is only files, with no code that runs
on a server, so there is nothing to set up and no password to keep.

## What you get

- Your phone number in the header on every screen size.
- An **"Open now"** badge. It reads your opening hours and shows "Open now ·
  closes 4pm" or "Closed now · opens 7.30am tomorrow".
- Your Google rating, with a link to your reviews.
- Four facts, four menu or service cards with photos and "from" prices.
- A **"Today's bakes"** board that you can change every day.
- A photo gallery. Each photo opens large on the same page.
- Three customer quotes.
- An about section with your story.
- Opening hours with today's row marked, your address, a drawn street map
  and a "Get directions" button.
- Questions and answers, and a footer with your contact links.
- On phones, a bar at the bottom with **Call us** and **Directions**.
- Dark mode, a print layout, a "page not found" page, a sharing preview
  image, structured data for Google and security headers.

## What the Deploy button does

1. It copies this folder into a new repository in your GitHub or GitLab account.
2. It puts the site live on a free `workers.dev` address.

You need a free Cloudflare account and a free GitHub or GitLab account.

## Make it yours

Almost everything is in one file: **`public/index.html`**. You can edit it on
GitHub in your browser. Each time you save (commit), the site updates in about
a minute.

### 1. Your business facts

At the top of `public/index.html` there is an **EDIT ME** list. It shows each
value the page uses now: name, phone, email, address, web address, Google
links, social links, rating and the year you opened. Find each old value and
replace it **everywhere** in the file. Most values appear more than once.

For example, to change the phone number, replace both forms of it:

```
01632 960123      →  01234 567890      (the number people see)
+441632960123     →  +441234567890     (the number in links: +44, no first 0, no spaces)
```

### 2. Your words

Every line with words to change ends with `<!-- edit -->`. Change the text
between the tags. Keep the tags, and keep every `class="..."` and `id="..."`.

### 3. Your opening hours

The hours are in **three places**. Change all three:

1. The **HOURS TABLE**. Each day has `data-open` and `data-close` times on
   the 24-hour clock. The "Open now" badge reads these. On a closed day,
   leave both empty.

   ```html
   <tr data-day="2" data-open="07:30" data-close="16:00"><th scope="row">Tuesday</th><td>7.30am to 4pm</td></tr>
   ```

2. The structured data near the end of `<head>` (`openingHoursSpecification`).
3. The short line in the hero badge (search for `data-open-badge`). Visitors
   see this line only if their browser blocks the script.

### 4. Your colour

Open `public/styles.css` and change `--brand` at the very top. Pick a dark
colour, because the buttons put white text on it. Check it at
[WebAIM's contrast checker](https://webaim.org/resources/contrastchecker/):
white on your colour must score 4.5:1 or more.

Then put the same colour in these places:

| File | What to change |
|---|---|
| `public/favicon.svg` | Both `#2a45b0` values (the icon in the browser tab) |
| `public/site.webmanifest` | `theme_color` |
| `public/apple-touch-icon.png` | Replace it with a 180 × 180 PNG of your icon (the icon on a phone's home screen) |

### 5. Your photos

The photos are **placeholders** from Pexels. They are not covered by the MIT
licence. Replace them with photos of your own place, food and team: real
photos win more trust than stock ones.

The easy way: open each photo in [Squoosh](https://squoosh.app/), make it the
same width as the old file, save it as WebP with the **same name**, and upload
it over the old file. The page crops each photo to fit.

| Slot | Files | Shape |
|---|---|---|
| Hero | `hero-480.webp`, `hero-800.webp`, `hero-1200.webp` | Tall, 4:5 |
| Menu cards | `bread-`, `pastries-`, `barista-`, `brunch-`, each `480` and `800` | Wide, 4:3 |
| Gallery | `interior-`, `counter-` (tall, 3:4); `buns-`, `latte-` (square), each `480`, `800` and `1200` | As listed |
| About | `about-480.webp`, `about-800.webp` | Tall, 4:5 |
| Sharing preview | `og.jpg` | 1200 × 630 |

If you use new file names, change the `src` and `srcset` lines next to each
`<!-- Placeholder photo -->` comment. Change each photo's `alt` text to say
what your photo shows. Delete each replaced photo's line in
`public/img/CREDITS.md`.

### 6. The other small files

| File | What to change |
|---|---|
| `public/404.html` | The lines that end with `<!-- edit -->` |
| `public/robots.txt`, `public/sitemap.xml` | Replace `https://www.example.co.uk/` with your web address |

To remove a section you do not need, delete everything from its
`<!-- ===== NAME ===== -->` comment to the `</section>` under it.

### Let an AI assistant do the edits

Copy `public/index.html` into ChatGPT, Claude or a similar assistant, then
paste this prompt:

> Here is my website's index.html. Change only the values in the EDIT ME
> list and the text on lines that end with `<!-- edit -->`. Keep every HTML
> tag, class and id. Keep the opening hours the same in all three places the
> EDIT ME list names. Use UK English. Give me back the whole file.
> My business is: [name, what you sell, town, phone, email, address, hours].

Paste the answer back into `public/index.html` and save.

### Check your changes

If you have Node.js on your computer, run `npm install` once. Then:

- `npm run check` finds broken comments, missing photos, missing alt text
  and broken structured data. It changes nothing.
- `npm run dev` shows the site at `http://localhost:8787`.

## Passwords and keys

None. This site has no form and no server code, so there is nothing secret
to set.

## Costs and limits

- The site runs on Cloudflare's free plan. Visits to files are free and
  unlimited.
- A site can have up to 20,000 files, each up to 25 MiB.

Source: [Workers static assets](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/),
checked October 2026.

## Connect your domain

In the Cloudflare dashboard, open **Workers & Pages**, select this site, then
**Settings → Domains & Routes → Add → Custom domain**. Your domain must
already use Cloudflare for its DNS.

> **Warning: moving your domain's DNS to Cloudflare can stop your email.**
> Before you change your nameservers, check that every **MX** and **TXT**
> record from your old DNS is also in Cloudflare's DNS list. This matters most
> if your email comes from Google Workspace, Microsoft 365 or your old host.
> If one record is missing, email to your domain stops arriving.

You can also put the site online without the Deploy button: in the dashboard,
open **Workers & Pages → Create → Pages → Upload assets** and drop in the
`public` folder, or a zip of it.

## Files

```
public/
  index.html        The page, with the EDIT ME list at the top
  styles.css        The design. Change --brand at the top
  site.js           The "Open now" badge, today's row and the photo viewer
  404.html          The "page not found" page
  img/              Photos, and CREDITS.md for the placeholders
  fonts/            Instrument Serif and Instrument Sans, with their licences
  favicon.svg, apple-touch-icon.png, site.webmanifest   Icons
  robots.txt, sitemap.xml    For search engines
  _headers          Security headers
scripts/check.mjs   The checks that `npm run check` runs
wrangler.jsonc      Tells Cloudflare to serve the public folder
```

The fonts are stored in `public/fonts/`, so no visitor data goes to Google.
They are free under the SIL Open Font License.

---

Made by [17 Things](https://17things.co.uk/cloudflare-free-plan). The code is
under the MIT licence. The photos in `public/img/` and the fonts in
`public/fonts/` are not: see `public/img/CREDITS.md` and the licence files in
`public/fonts/`.
