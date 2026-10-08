# Small business website on Cloudflare

A fast, plain website for a UK small business. It has a home page, a services
page, an about page, a contact page with an enquiry form, and a privacy and
cookie notice. It runs on Cloudflare's free plan.

- The pages are files, so every visit is free and unlimited.
- The enquiry form saves every message in a free **KV** store. You read them at
  `/enquiries`, behind a password.
- Each page has a title, a description, a canonical address and structured data
  (JSON-LD) for Google. The build also makes `sitemap.xml`, `robots.txt` and
  `llms.txt` for AI assistants.
- No framework and no runtime dependencies. Node 20 or later builds it.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/17-Things/cloudflare-starters/tree/main/small-business-site)

## What the button does

1. Copies this folder into a new repository in your GitHub or GitLab account.
2. Creates the KV store for enquiries.
3. Asks for one secret, `ADMIN_PASSWORD`, then puts the site live on a free
   `workers.dev` address.

You need a free Cloudflare account and a GitHub or GitLab account.

## Make it yours: edit one file

Open **`src/site.mjs`** in your new repository. GitHub lets you edit it in the
browser. Every fact on the website is in this file: the business name, the
tagline, phone, email, address, opening hours, services, the about text and
the questions and answers. Every value is a placeholder. Change them, then
commit. Cloudflare rebuilds the site and puts it live in about a minute.

You do not need to touch the other files. If you want to:

| To change | Edit |
|---|---|
| Colours and spacing | `src/styles.css` (the colours are at the top) |
| The layout of a page, or add a page | `src/pages.mjs` |
| Header, footer, meta tags | `src/layout.mjs` |
| Photos and other files | put them in `public/`; `public/img/placeholder.svg` marks where a photo goes |

The site uses your device's own fonts, so there are no font files to license
or load.

## Read your enquiries

Go to `https://<your-site>/enquiries`. Sign in with any user name and your
`ADMIN_PASSWORD`. You see the newest 50 enquiries first, with a link to older
ones. Each email address is a link, so you can reply from your own mail.

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
npm run check:site               # with dev running: checks links, h1s and JSON-LD
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

Made by [17 Things](https://17things.co.uk/cloudflare-free-plan). MIT licence.
