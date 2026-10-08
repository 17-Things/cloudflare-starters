# One-page business website on Cloudflare

A fast, good-looking one-page website for a café, shop or small business.
It comes filled in for a made-up bakery, Wren & Rye, so you can see how a
finished site looks. You then swap in your own words and photos.

It is only files (HTML, CSS, images), so Cloudflare serves it free, with no
limit on visitors. There is no build step.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/17-Things/cloudflare-starters/tree/main/business-site)

## What is on the page

- A header with your phone number on every screen size.
- A hero with what you do and where, two buttons, your Google rating and an
  **"Open now"** badge that works out from your hours if you are open.
- A strip of four short facts.
- Four menu or service cards with photos and "from" prices.
- A **"Today's bakes" chalkboard** that you can change every day.
- A photo gallery. Each photo opens large on the same page.
- Three customer quotes and a link to your Google reviews.
- An about section, opening hours with today highlighted, your address,
  a drawn street map and a "Get directions" button.
- Questions and answers, and a footer.
- On phones, a bar at the bottom with **Call** and **Directions**.

It also has dark mode, a print layout, structured data for Google, a sharing
preview image, a "page not found" page and security headers.

## What the Deploy button does

1. Copies this folder into a new repository in your GitHub or GitLab account.
2. Puts it live on a free `workers.dev` address.

You need a free Cloudflare account and a GitHub or GitLab account.

## Make it yours

You can edit the files in GitHub in your browser. Each save (commit) goes
live in about a minute.

| What to change | File | Where |
|---|---|---|
| Name, phone, email, address, links, rating | `public/index.html` | The **EDIT ME** list at the top. It lists each value. Replace each one everywhere in the file. |
| Words on the page | `public/index.html` | Every line that ends with `<!-- edit -->`. |
| Opening hours | `public/index.html` | Three places: the **HOURS TABLE**, the structured data in `<head>`, and the badge text (`data-open-badge`). |
| Brand colour | `public/styles.css` | `--brand` under **1. CHANGE THESE**, at the very top. |
| Brand colour, phone bar | `public/index.html` and `public/404.html` | The `theme-color` lines. |
| Icon in the browser tab | `public/favicon.svg` | Change both `#9a3412` values to your colour. |
| Not-found page | `public/404.html` | Lines that end with `<!-- edit -->`. |
| Your web address | `public/index.html`, `public/robots.txt`, `public/sitemap.xml` | Replace `https://www.example.co.uk/`. |

Keep every `class="..."` and `id="..."` as it is. To remove a section you do
not need, delete everything from its `<!-- ===== NAME ===== -->` comment to
the closing `</section>` under it.

### Change it with ChatGPT or another AI

Copy `public/index.html` into the chat, then paste this prompt:

> Here is my website's index.html. Change only the values in the EDIT ME
> list and the text on lines that end with `<!-- edit -->`. Keep every HTML
> tag, class and id. Keep the opening hours the same in all three places the
> EDIT ME list names. Use UK English. Give me back the whole file.
> My business is: [name, what you sell, town, phone, email, address, hours].

Paste the answer back into `public/index.html` and save. Then do the same for
`--brand` in `public/styles.css` if you want a new colour. Pick a dark colour:
white text on it must be easy to read. Check it at
[WebAIM's contrast checker](https://webaim.org/resources/contrastchecker/)
(it needs 4.5:1 or more).

### Check your changes

If you have Node.js on your computer, run `npm install` once, then
`npm run check`. It finds broken comments, missing photos, missing alt text
and broken structured data. `npm run dev` shows the site at
`http://localhost:8787`.

## Photos

The photos are **placeholders** from Pexels. They are not part of the MIT
licence. Replace them with photos of your own place, food and team.
Real photos win more trust than stock ones.

Each photo comes in two or three widths in `public/img/`:

| Slot | Files | Shape |
|---|---|---|
| Hero | `hero-480.webp`, `hero-800.webp`, `hero-1200.webp` | Tall, 4:5 |
| Menu cards | `bread-`, `pastries-`, `barista-`, `brunch-` with `480` and `800` | Wide, 4:3 |
| Gallery | `interior-`, `counter-` (tall, 3:4); `buns-`, `latte-` (square) with `480`, `800` and `1200` | As listed |
| About | `about-480.webp`, `about-800.webp` | Tall, 4:5 |
| Sharing preview | `og.jpg` | 1200 × 630 |

**The easy way**: make each photo in [Squoosh](https://squoosh.app/) at the
same width, save it as WebP with the same name, and upload it over the old file.
The page crops each photo to fit, so the shape does not need to be exact.

**If you use new names**: change the `src` and `srcset` lines next to the
`<!-- Placeholder photo -->` comments in `public/index.html`. Also change
each photo's `alt` text to say what your photo shows.

When you replace a photo, delete its line in `public/img/CREDITS.md`.
If you add other stock photos, add a line for each one.

## Fonts

Headings use **Fraunces**, stored in `public/fonts/` so no visitor data goes
to Google. It is free under the SIL Open Font License (`public/fonts/OFL.txt`).
Body text uses the font that is already on each visitor's device.

## Use your own domain

In the Cloudflare dashboard, open **Workers & Pages**, select the Worker,
then **Settings → Domains & Routes → Add → Custom domain**.
Your domain must already be on Cloudflare.

**Before you move your domain's nameservers to Cloudflare, copy your email
records.** If your email comes from Google Workspace, Microsoft 365 or your
old host, check that every MX and TXT record from your old DNS is in
Cloudflare's DNS list before you switch. If one is missing, your email stops.

## Other ways to put it online

The `public` folder is the whole website. You can also drag and drop the
`public` folder (or a zip of it) into **Workers & Pages → Create → Pages →
Upload assets** in the Cloudflare dashboard.

## Limits on the free plan

Requests for files are free and unlimited. A site can have up to 20,000
files, each up to 25 MiB. Source:
[Workers static assets](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/),
checked October 2026.

---

Made by [17 Things](https://17things.co.uk/cloudflare-free-plan). The code is
under the MIT licence. The photos in `public/img/` are not covered by the MIT
licence: see `public/img/CREDITS.md`. The Fraunces font is under the SIL Open
Font License.
