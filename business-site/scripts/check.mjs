// Quick checks for mistakes that are easy to make when you edit the page
// by hand or with ChatGPT. Run: npm run check
// It needs Node.js only. It changes nothing.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const dir = new URL("../public/", import.meta.url).pathname;
let problems = 0;
const fail = (file, msg) => { problems++; console.log(`✗ ${file}: ${msg}`); };

for (const file of ["index.html", "404.html"]) {
  const html = readFileSync(join(dir, file), "utf8");

  // A broken comment shows raw text at the top of the page.
  const beforeHtml = html.slice(0, html.indexOf("<html"));
  const leftover = beforeHtml.replace(/^<!doctype html>/i, "").replace(/<!--[\s\S]*?-->/g, "").trim();
  if (leftover) fail(file, "text outside a comment before <html>. Check the EDIT ME block for a stray -->.");

  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(file, `has ${h1} <h1> headings. Use exactly one.`);

  for (const img of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\balt=/.test(img)) fail(file, `an image has no alt text: ${img.slice(0, 80)}`);
    if (!/\bwidth=/.test(img) || !/\bheight=/.test(img)) fail(file, `an image has no width or height: ${img.slice(0, 80)}`);
  }

  // The security headers in _headers block inline styles and scripts.
  if (/\sstyle="/.test(html)) fail(file, 'uses style="...". Put the style in styles.css instead.');
  if (/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/.test(html)) fail(file, "has an inline <script>. Put it in site.js instead.");

  // Every local file the page points to must exist.
  const refs = [...html.matchAll(/(?:src|href)="(\/[^"#?]*)"/g), ...html.matchAll(/(\/img\/[\w.-]+\.\w+) \d+w/g)].map((m) => m[1]);
  for (const ref of new Set(refs)) {
    const path = ref === "/" ? "index.html" : ref.slice(1);
    if (!existsSync(join(dir, path))) fail(file, `points to ${ref}, but that file is missing.`);
  }

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { fail(file, `the structured data is not valid JSON: ${e.message}`); }
  }
}

if (problems) { console.log(`\n${problems} problem(s) found.`); process.exit(1); }
console.log("✓ All checks passed.");
