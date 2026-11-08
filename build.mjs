// PluTek site build — zero dependencies, runs on Node 18+.
// Assembles src/pages/*.html with shared partials into dist/, fingerprints CSS/JS
// for long-term caching, copies assets, and writes sitemap.xml.
//
//   node build.mjs           build into dist/
//
// Each page starts with a meta block:
// <!--meta {"title": "...", "description": "...", "nav": "work", "scripts": ["forms"]} -->

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync, existsSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { createHash } from "node:crypto";

const SITE = "https://www.plutek.co.za";
const SRC = "src";
const OUT = "dist";

const read = (p) => readFileSync(p, "utf8");
const hash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 10);

function copyDir(from, to) {
  if (!existsSync(from)) return;
  mkdirSync(to, { recursive: true });
  for (const name of readdirSync(from)) {
    const a = join(from, name), b = join(to, name);
    statSync(a).isDirectory() ? copyDir(a, b) : copyFileSync(a, b);
  }
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Static files that keep their names (robots, redirects, icons, og image).
copyDir(join(SRC, "static"), OUT);
copyDir(join(SRC, "assets", "fonts"), join(OUT, "assets", "fonts"));
copyDir(join(SRC, "assets", "img"), join(OUT, "assets", "img"));

// Fingerprint CSS and JS so they can be cached for a year.
const versioned = {};
for (const dir of ["css", "js"]) {
  const from = join(SRC, "assets", dir);
  mkdirSync(join(OUT, "assets", dir), { recursive: true });
  for (const name of readdirSync(from)) {
    const body = read(join(from, name));
    const ext = extname(name);
    const out = `${name.slice(0, -ext.length)}.${hash(body)}${ext}`;
    writeFileSync(join(OUT, "assets", dir, out), body);
    versioned[`${dir}/${name}`] = `/assets/${dir}/${out}`;
  }
}
const asset = (key) => {
  if (!versioned[key]) throw new Error(`Unknown asset ${key}`);
  return versioned[key];
};

const partial = (name) => read(join(SRC, "partials", `${name}.html`));
const NAV = ["work", "services", "about", "careers", "contact"];

const escapeAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const pages = readdirSync(join(SRC, "pages")).filter((f) => f.endsWith(".html"));
const sitemap = [];
const today = new Date().toISOString().slice(0, 10);

for (const file of pages) {
  const raw = read(join(SRC, "pages", file));
  const m = raw.match(/^<!--meta\s*([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`${file}: missing meta block`);
  const meta = JSON.parse(m[1]);
  const body = raw.slice(m[0].length);
  const path = file === "index.html" ? "/" : `/${file}`;
  const canonical = SITE + path;

  let head = partial("head")
    .replaceAll("{{title}}", escapeAttr(meta.title))
    .replaceAll("{{description}}", escapeAttr(meta.description))
    .replaceAll("{{canonical}}", canonical)
    .replaceAll("{{css}}", asset("css/main.css"))
    .replaceAll("{{robots}}", meta.noindex ? "noindex, follow" : "index, follow")
    .replaceAll("{{jsonld}}", meta.jsonld ? `<script type="application/ld+json">${JSON.stringify(meta.jsonld)}</script>` : "");

  let header = partial("header");
  for (const key of NAV) {
    header = header.replaceAll(`{{current:${key}}}`, meta.nav === key ? ' aria-current="page"' : "");
  }

  const scripts = ["main", ...(meta.scripts || [])]
    .map((s) => `<script src="${asset(`js/${s}.js`)}" defer></script>`)
    .join("\n");

  const html = `${head}
<body class="theme-${meta.theme || "dark"}">
${header}
<main id="main">
${body.trim()}
</main>
${partial("footer").replaceAll("{{year}}", String(new Date().getFullYear()))}
${scripts}
</body>
</html>
`;
  writeFileSync(join(OUT, file), html);
  if (!meta.noindex) sitemap.push({ loc: canonical, priority: meta.priority ?? 0.7 });
}

sitemap.sort((a, b) => b.priority - a.priority);
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority.toFixed(1)}</priority></url>`).join("\n")}
</urlset>
`
);

console.log(`Built ${pages.length} pages into ${OUT}/`);
