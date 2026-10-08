// Checks the pages for common mistakes after you (or an AI tool) edit them.
// Run it with: npm run check
// It needs no extra packages.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../public/', import.meta.url).pathname;
const pages = readdirSync(root).filter((f) => f.endsWith('.html'));
const problems = [];
const say = (file, text) => problems.push(`${file}: ${text}`);

for (const file of pages) {
  const html = readFileSync(join(root, file), 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

  if (!/<html lang="en-GB">/.test(html)) say(file, 'the <html> tag needs lang="en-GB"');
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) say(file, `needs exactly one <h1>, found ${h1s}`);
  if (!/<title>[^<]{3,}<\/title>/.test(html)) say(file, 'needs a <title>');

  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="[^"]*"/.test(tag)) say(file, `an image has no alt text: ${tag.slice(0, 80)}…`);
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) say(file, `an image needs width and height: ${tag.slice(0, 80)}…`);
    for (const [, src] of tag.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
      for (const part of src.split(',')) {
        const path = part.trim().split(' ')[0];
        if (path.startsWith('/') && !existsSync(join(root, path))) say(file, `missing image file ${path}`);
      }
    }
  }

  for (const [, href] of html.matchAll(/\shref="([^"]+)"/g)) {
    if (href.startsWith('#') && href.length > 1 && !ids.has(href.slice(1))) say(file, `link to ${href} has no matching id`);
    if (href.startsWith('/') && !href.startsWith('//')) {
      const path = href.split('#')[0].split('?')[0];
      const ok = path === '/' || existsSync(join(root, path)) || existsSync(join(root, `${path}.html`)) || path === '/messages';
      if (!ok) say(file, `link to ${href} goes to a page that does not exist`);
    }
  }

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(json);
      for (const key of ['name', 'address', 'telephone', 'url']) if (!data[key]) say(file, `JSON-LD is missing "${key}"`);
    } catch (e) {
      say(file, `JSON-LD is not valid JSON (${e.message})`);
    }
  }
}

// The brand colour must be dark enough for white button text (4.5:1).
const css = readFileSync(join(root, 'styles.css'), 'utf8');
const brand = css.match(/--brand:\s*(#[0-9a-fA-F]{6})/)?.[1];
if (!brand) {
  problems.push('styles.css: --brand must be a 6-digit hex colour, like #2b6a6c');
} else {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(brand.slice(i, i + 2), 16) / 255));
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const ratio = 1.05 / (lum + 0.05);
  if (ratio < 4.5) problems.push(`styles.css: --brand ${brand} is too light for white text (${ratio.toFixed(2)}:1, needs 4.5:1). Pick a darker shade.`);
}

if (problems.length) {
  console.error(`Found ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`All good: ${pages.length} pages checked.`);
