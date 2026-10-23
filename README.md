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
| Headline, intro sentence, the small facts beside it | `hero: {...}` (`title` is the two headline lines) |
| The amber figure in the top picture band | `hero.figure` |
| The photos that slowly change in the top band | `hero.rotating` |
| "One team, not five vendors" section | `about: {...}` |
| A **service practice** (title, list, who leads it, picture) | `services: [...]` (`lead`: `"theekshana"`, `"hansana"` or `"both"`) |
| A **project** in Selected work | `projects: [...]` (`ui` picks the drawn interface, leave it out for a title card; `link` adds an "Open" button) |
| The four process stages | `process: [...]` |
| Team bios, skills, links, photos | `team: [...]` (photos in `assets/team/`, `position` moves the crop) |
| A **testimonial** | `testimonials: [...]` (the current three are samples, replace with real ones) |
| Email, phone, WhatsApp, location | `brand: {...}` |
| Brief builder launch options | `contact.timelines` |
| Picture credits in the footer | `credits: [...]` |
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
── Homepage: "printed annual" ──────────────────────────
index.html          page skeleton (sections, header, project sheet)
css/style.css       tokens, grid, sections, interface drawings
js/data.js          ← homepage content (edit this one)
js/main.js          rendering and interactions
assets/team/        founder portraits
assets/img/         Colombo photographs and archive plates (see credits.json)

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

- One typeface (Bricolage Grotesque), one accent (sodium amber), each section its own flat colour chapter
- Masthead mosaic of the founders and Colombo at night, with a slow crossfade
- Header that takes the colour of the section under it and marks where you are
- Services with a pinned index that follows the practice you're reading
- Creator Mode band linking to `/creator`, with its price, turnaround and shoot / set / edit frames
- Work tiles drawn as real interface pieces, Nyx first as the flagship; each opens a project sheet (Esc to close)
- Process diagram built from the logo's equaliser bars, assembling as it scrolls in
- Testimonial switcher, brief builder, full-screen phone menu
- Creator Mode page: warm paper/ink identity, timecode section markers, a sticky timeline
  rail on wide screens, keyboard-operable accordions, a mobile enquiry dock, and a
  tier row that scroll-snaps on phones, plus a print stylesheet
- Fully responsive (desktop, tablet, phone), keyboard friendly, `prefers-reduced-motion` respected

---

## 🖼 Picture credits

The Colombo photographs and archive plates come from Wikimedia Commons and The Met (CC0, public
domain, CC BY). Credits are listed in the footer ("Picture credits") and in `assets/img/credits.json`.
Keep the credits while the pictures stay on the site.

---

© ZynTECH. Designed & developed by **Theekshana Nirmal**.
