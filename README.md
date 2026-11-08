# plutek.co.za

PluTek's website. Static HTML, CSS and JavaScript with a zero-dependency build step.
Design decisions: see [DESIGN.md](DESIGN.md).

## Edit and build

```
src/pages/      one file per page (starts with a JSON meta block: title, description, nav, scripts)
src/partials/   head, header and footer shared by every page
src/assets/     css, js, fonts (self-hosted Inter, Latin subset), img (AVIF + WebP)
src/static/     copied as-is: favicon, og.png, robots.txt, _redirects, manifest
build.mjs       assembles pages into dist/, fingerprints CSS/JS, writes sitemap.xml
netlify.toml    build command, publish dir, security and cache headers
```

```
node build.mjs          # builds into dist/
npx serve dist          # or any static server, to preview locally
```

Never edit `dist/` — it is regenerated on every build and is not committed.

## Forms (Netlify Forms)

Three forms post to Netlify: `consultation`, `contact` and `talent-network` (with CV upload).
After the first deploy:

1. Netlify → Site configuration → Forms: confirm form detection is enabled and the three forms appear.
2. Forms → Form notifications: add an email notification for each form to the inbox you monitor.
3. Check the account plan: credit-based plans include unlimited submissions; legacy Starter is capped at 100/month.

WhatsApp links use +27 62 493 0297.

## Adding a project to the Work page

Copy an `<article class="work-feature">` (client work) or `<article class="demo">` (demo) block in
`src/pages/portfolio.html`. Put screenshots in `src/assets/img/` as AVIF and WebP at 720 and 1280 px wide.
For private work, a 20–40 second muted screen recording (`<video autoplay muted loop playsinline>`) inside
`.frame__view` shows a product better than a still image.

## Deploying

Work happens on a branch; Netlify builds a preview for it. Production updates only when the branch is merged to `main`.
