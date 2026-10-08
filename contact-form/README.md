# One-page business website with a contact form, on Cloudflare

The same plain one-page site as `business-site`, plus a contact form that:

- stops spam with **Turnstile**, Cloudflare's free check that a visitor is a person
- saves every message in a free **D1** database
- shows you the messages at `/messages`, behind a password

All of it runs on Cloudflare's free plan.

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
200 messages show, newest first. Each email address is a link, so you can reply
from your own mail.

## Make it yours

Edit `public/index.html` and `public/thanks.html`. Every line is a placeholder.
Commit, and Cloudflare puts the new version live in about a minute.

## Use your own domain

In the Cloudflare dashboard, open **Workers & Pages**, select the Worker, then
**Settings → Domains & Routes → Add → Custom domain**.

**Before you move your domain's nameservers to Cloudflare, copy your email
records.** Check that every MX and TXT record from your old DNS is in
Cloudflare's DNS list before you switch. If one is missing, your email stops.

## Limits on the free plan

The pages are files: free and unlimited. The form uses the Worker, which allows
100,000 requests a day on the free plan, and D1, which allows 5 GB. A small
business will not come near either. Checked October 2026:
[Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).

---

Made by [17 Things](https://17things.co.uk/cloudflare-free-plan). MIT licence.
