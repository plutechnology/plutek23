# PluTek website — design system

## Idea
PluTek builds digital products from precise, well-made parts. The identity takes the
pixel squares from the original logo and makes them the system: the hero assembles the
P-mark from squares that react to the visitor, and small square units recur as the only
ornament. Everything else stays quiet so the work and the words carry the page.

## Colour
| Token | Hex | Use |
| --- | --- | --- |
| `--ink` | `#0F1117` | Brand charcoal. Primary canvas, body text on light |
| `--ink-raised` | `#171A23` | Raised surfaces on dark (frames, form panels) |
| `--white` | `#FFFFFF` | Brand white. Text on dark, light sections |
| `--mist` | `#F2F2F5` | Cool light grey for alternating light sections (never cream) |
| `--violet` | `#7C3AED` | Brand purple. Primary buttons, focus ring, pixel accents. White text on it passes AA |
| `--violet-soft` | `#B9A2F6` | Purple for text/links on charcoal (AA on `--ink`) |

Purple is used as a signal (action, focus, the mark), never as a background wash.
One soft radial glow sits behind the hero mark; there are no other gradients.

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

## Components
`button` (primary violet / quiet outline) · `link-arrow` · `frame` (browser frame for screenshots or video) ·
`index-row` (service row) · `step` (process) · `field` (label, input, hint, error) · `chip` (radio/checkbox pill) ·
`notice` (form success/error).
