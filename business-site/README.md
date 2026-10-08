# One-page business website on Cloudflare

A plain, fast, one-page website for a small business. It is only files, so
Cloudflare serves it free, with no limit on visitors.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/17-Things/cloudflare-starters/tree/main/business-site)

## What the button does

1. Copies this folder into a new repository in your GitHub or GitLab account.
2. Builds it and puts it live on a free `workers.dev` address.

You need a free Cloudflare account and a GitHub or GitLab account.

## Make it yours

1. Open `public/index.html` in your new repository. GitHub lets you edit it in the browser.
2. Change the title, the description, the headings and the text. Every line in it is a placeholder.
3. Save (commit). Cloudflare rebuilds and puts the new version live in about a minute.

## Use your own domain

In the Cloudflare dashboard, open **Workers & Pages**, select the Worker,
then **Settings → Domains & Routes → Add → Custom domain**.
Your domain must already be on Cloudflare.

**Before you move your domain's nameservers to Cloudflare, copy your email
records.** If your email comes from Google Workspace, Microsoft 365 or your
old host, check that every MX and TXT record from your old DNS is in
Cloudflare's DNS list before you switch. If one is missing, your email stops.

## Limits on the free plan

Requests for files are free and unlimited. A site can have up to 20,000
files, each up to 25 MiB. Source:
[Workers static assets](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/),
checked October 2026.

---

Made by [17 Things](https://17things.co.uk/cloudflare-free-plan). MIT licence.
