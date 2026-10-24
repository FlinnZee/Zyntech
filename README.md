# ZynTECH | Company site

Site for **ZynTECH**, a software and video studio in Sri Lanka, founded by
Theekshana Nirmal and Hansana Wick. The homepage lives at `/`, and the Creator Mode
social content service has its own page at `/creator`.

**Live:** enable GitHub Pages (see below) and the site is shareable at a permanent link.

---

## ✏️ How to update the site (no coding needed)

**All content lives in two files:**

- [`js/data.js`](js/data.js) — the homepage
- [`js/creator-data.js`](js/creator-data.js) — the Creator Mode page (`/creator`)

Open either in any text editor, change the text between quotes, save, refresh. That's it.

### Homepage — `js/data.js`

| What you want to change | Where in `data.js` |
|---|---|
| Headline, intro sentence, the two small notes | `hero: {...}` (`title` is the two headline lines) |
| The words in the scrolling band | `marquee: [...]` |
| The big statement and the four numbers | `manifesto`, `stats: [...]` |
| A **service line** (title, text, tags, who leads it) | `services: [...]` (`group`: Engineering or Creative; `lead`: `"theekshana"`, `"hansana"` or `"both"`) |
| A **project** in Selected work | `projects: [...]` (`image` for a real screenshot, otherwise `ui` picks the drawn interface; `link` adds a "Visit" button) |
| The four process stages | `process: [...]` (`items` are the three lines on each card) |
| Founder bios, skills, links, photos | `team: [...]` (photos in `assets/team/`, `position` moves the crop) |
| A **testimonial** | `testimonials: [...]` (the current three are samples, replace with real ones) |
| Email, phone, WhatsApp, location | `brand: {...}` |
| Brief builder choices | `contact.needs` and `contact.timelines` |
| The footer's big line | `footer.line` |
| The Creator Mode band on the homepage | `homeBand: {...}` in `creator-data.js` (its "From" price is worked out from the packages) |

### Creator Mode — `js/creator-data.js`

| What you want to change | Where in `creator-data.js` |
|---|---|
| Monthly package prices & contents | `packages.tracks[].tiers[...]` |
| Which package is flagged "Most popular" | `popular: true` (use it on one tier only) |
| Order the two tracks appear in | the order of `packages.tracks[]` |
| One-off shoot bundles | `bundles: [...]` |
| Fixed-scope project packages | `projects: [...]` |
| À la carte rates | `aLaCarte: [...]` (grouped by `category`) |
| FAQ questions & answers | `faq: [...]` |
| WhatsApp number / enquiry emails | `contact: {...}` |

> **Prices are plain numbers** — write `72000`, not `"LKR 72,000"`. The page formats
> them for you so the currency style stays identical everywhere. Optional flags:
> `from: true` → "From LKR 65,000" · `unit: "hr"` → "LKR 4,500 / hr" ·
> `display: "+40%"` (with `price: null`) → shown instead of a price.

No build step. No dependencies. Plain HTML/CSS/JS, works anywhere.

---

## 🌍 Sharing the site (permanent link)

This repo deploys with **GitHub Pages** (free hosting) through `.github/workflows/static.yml`:

1. Push this repo to GitHub.
2. Repo → **Settings → Pages** → Source: **GitHub Actions**.
3. Your site is live at `https://<username>.github.io/Zyntech/`.

Every `git push` to `main` updates the live site within a minute or two.

> Alternative: drag the folder into [Netlify Drop](https://app.netlify.com/drop) or connect the repo to [Vercel](https://vercel.com) for a custom domain later (e.g. `zyntech.lk`).

---

## 📬 Contact: the brief builder

Visitors pick what they need and when it should launch. The page shows which founder will answer,
then writes the email (`mailto:`) and the WhatsApp message (`wa.me`) for them. No backend needed.
Want briefs delivered without a mail app? Create a free [Formspree](https://formspree.io) form and
post the same text to it from `updateBrief()` in `js/main.js`.

---

## 🗂 Structure

The site is **two independent front-ends** that share only the content files.

```
── Homepage: black and white ───────────────────────────
index.html          page skeleton (sections, header, cursor, project sheet)
css/style.css       tokens, grid, sections, interface drawings, motion
js/data.js          ← homepage content (edit this one)
js/main.js          rendering, scroll scenes, interactions
assets/team/        founder portraits
assets/work/        real project screenshots (Nyx)

── Creator Mode: light paper ───────────────────────────
creator/index.html  served at /creator
css/creator.css     paper/ink theme, mono + Inter
js/creator-data.js  ← Creator Mode content & prices (edit this one)
js/creator.js       rendering, timeline rail, accordions
assets/creator/     Creator Mode photographs

assets/favicon.svg  flat mark on near-black
```

**Creator Mode is deliberately its own design system.** It loads no `style.css` and
no homepage script, just its own stylesheet and one script, so changing one page
cannot break the other. The shared pieces are content only: Creator Mode reads
`js/data.js` for the brand name and location in its footer, and the homepage reads
`js/creator-data.js` for its Creator Mode band (in that page's own paper and ink).

## ⚡ What's in it

- Strict black and white, one typeface (Archivo, using its width axis), the logo's equaliser bars as the motif
- Hero: a live waveform of the mark's bars that reacts to the cursor, and a full-width ZYNTECH wordmark that narrows as you scroll away
- A marquee that follows your scroll speed and direction
- A manifesto that fills in word by word as it is read, with counting numbers
- Services as an index: hover or tap a line to open what it covers and who leads it
- Work as a pinned horizontal gallery on desktop (a swipeable row on phones), each project opening a sheet
- Process cards that stack as you scroll
- Founder panels that open on hover (full profiles on phones)
- Creator Mode lines that slide against each other, linking to `/creator`
- Quote slider (arrows, keyboard, drag), brief builder, a footer revealed like a curtain
- Header that inverts over light sections and hides on the way down, a custom cursor, magnetic buttons
- GSAP, ScrollTrigger and Lenis from a CDN; without them (or with reduced motion) the page stays complete and usable
- Fully responsive (desktop, tablet, phone), keyboard friendly, `prefers-reduced-motion` respected

> After editing `css/style.css` or a file in `js/`, bump the `?v=` number on its link in
> `index.html` so returning visitors get the new version instead of a cached one.

---


© ZynTECH. Designed & developed by **Theekshana Nirmal**.
