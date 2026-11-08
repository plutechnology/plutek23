# PluTek website — design system

## Idea
PluTek builds digital products from precise, well-made parts. The identity is built on
the PluTek TP logo: the header and footer use the official mark and wordmark, and the hero
rebuilds the TP mark from squares that react to the visitor, with the logo's pixel cluster in
royal blue. Small square units recur as the only ornament. Everything else stays quiet so the work and the words carry the page.

## Colour
Taken from the PluTek logo and the original site, so the brand stays recognisable.

| Token | Hex | Source | Use |
| --- | --- | --- | --- |
| `--ink` | `#08111F` | Original site background | Primary canvas |
| `--ink-raised` | `#0E1A2C` | Derived | Raised surfaces on dark (frames, panels) |
| `--navy` | `#041C3F` | Logo navy | Text and headings on light sections, selected chips |
| `--blue` | `#0766CE` | Logo royal blue | Primary buttons, CTA band, pixel accents. White text on it: 5.5:1 |
| `--blue-deep` | `#0558B5` | Derived | Hover states, links on light (6.2:1) |
| `--cyan` | `#00BFFF` | Original site accent | Links, focus ring and highlights on dark (8.9:1) |
| `--mist` | `#F1F4F8` | Derived | Cool light sections |
| `--white` | `#FFFFFF` | Brand | Text on dark, light sections |

Blue is used as a signal (action, focus, the mark). One soft radial glow sits behind the hero mark; there are no other gradients.

## Type
- **Inter Display** 500/600 for headings, set tight (-0.035em at display sizes).
- **Inter** 400/500/600 for body and UI, with `cv11` (single-storey a) and `ss03` for character.
- Scale (1.25 minor third on mobile, wider on desktop via `clamp()`): 14 · 16 · 18 · 22 · 28 · 36 · 48 · 64 · 88.
- Body measure capped at 68ch. Sentence case everywhere; no uppercase labels.
- Fonts are self-hosted, Latin-subset WOFF2 (~21 KB each); the two used above the fold are preloaded.

## Layout
- 12-column grid, 1240px max content width, 24px gutters (16px mobile). Content is left-aligned.
- Asymmetric splits (5/7, 4/8). Sections alternate charcoal and light only where content changes register.
- Services are a typographic index of expandable rows, not cards. Work is shown as large framed screenshots.
- Numbering appears only for the process, which is a real sequence.

## Motion
- One orchestrated moment: the hero mark assembling on load. Pointer/touch scatters nearby squares.
- Everything else moves only in answer to the visitor (menu, accordions, form steps, hover on links).
- `prefers-reduced-motion`: the mark renders assembled and still; transitions are removed.

## Logo files
`src/assets/img/logo-{1,2,3}x.png` (horizontal lockup, white, 153×36 at 1x), `mark-560.png` (white mark,
sampled by the hero), favicons in `src/static/`. All cut from the official logo artwork; replace with
SVG exports when available.

## Components
`button` (primary violet / quiet outline) · `link-arrow` · `frame` (browser frame for screenshots or video) ·
`index-row` (service row) · `step` (process) · `field` (label, input, hint, error) · `chip` (radio/checkbox pill) ·
`notice` (form success/error).
