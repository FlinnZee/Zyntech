# ZynTECH — Company Portfolio

Futuristic single-page portfolio for **ZynTECH**, a full-spectrum IT solutions agency.

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
| Add / edit a **testimonial** | `testimonials: [...]` — copy an existing block, paste, edit |
| Add / remove a **service** | `services: [...]` (icons: `system, web, mobile, security, saas, uiux, video, social, cloud`) |
| Add a new **project** | `projects: [...]` (`accent: "a" | "b" | "c" | "d"` changes card colours) |
| Team bios, skills, links | `team: [...]` |
| Team **profile photos** | drop the image in `assets/team/` and set `photo:` in `team: [...]` — missing file shows the initials badge instead |
| Email / phone / location | `brand: {...}` |
| Hero headline & rotating words | `hero: {...}` |
| Stats counters | `stats: [...]` |
| The Creator Mode teaser band | `homeBand: {...}` in `creator-data.js` |

### Creator Mode — `js/creator-data.js`

| What you want to change | Where in `creator-data.js` |
|---|---|
| Monthly package prices & contents | `packages.tracks[].tiers[...]` |
| Which package is flagged "Most popular" | `popular: true` (use it on one tier only) |
| Which track shows first | `packages.defaultTrack` — `"edit"` or `"production"` |
| One-off shoot bundles | `bundles: [...]` |
| Fixed-scope project packages | `projects: [...]` |
| À la carte rates | `aLaCarte: [...]` (grouped by `category`) |
| FAQ questions & answers | `faq: [...]` |
| WhatsApp number / enquiry emails | `contact: {...}` |

> **Prices are plain numbers** — write `72000`, not `"LKR 72,000"`. The page formats
> them for you so the currency style stays identical everywhere. Optional flags:
> `from: true` → "From LKR 65,000" · `unit: "hr"` → "LKR 4,500 / hr" ·
> `display: "+40%"` (with `price: null`) → shown instead of a price.

No build step. No dependencies. Plain HTML/CSS/JS — works anywhere.

---

## 🌍 Sharing the site (permanent link)

This repo is designed for **GitHub Pages** (free hosting):

1. Push this repo to GitHub.
2. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
3. Your site is live at `https://<username>.github.io/Zyntech/` — share that link anywhere, forever.

Every `git push` updates the live site automatically within a minute.

> Alternative: drag the folder into [Netlify Drop](https://app.netlify.com/drop) or connect the repo to [Vercel](https://vercel.com) for a custom domain later (e.g. `zyntech.lk`).

---

## 📬 Contact form

The form opens the visitor's mail app pre-filled (`mailto:` — zero backend, works on a static host).
Want messages delivered without a mail app? Create a free [Formspree](https://formspree.io) form and
in `js/main.js` (section 13) replace the mailto logic with a `fetch` POST to your Formspree endpoint.

---

## 🗂 Structure

```
index.html            homepage skeleton (sections + SVG icon sprite)
creator/index.html    Creator Mode page, served at /creator
css/style.css         futuristic dark-chrome theme, all effects styling
js/data.js            ← homepage content (edit this one)
js/creator-data.js    ← Creator Mode content & prices (edit this one)
js/main.js            shared engine (cursor, particles, tilt, slider, reveals…)
js/creator.js         Creator Mode rendering, track toggle, accordions
assets/               logo mark + favicon (SVG, scale to any size)
```

`main.js` runs on both pages and renders only the blocks it finds, so adding a
new page means copying the nav/footer shell and pointing it at the right data file.

## ⚡ Features

- Lenis smooth scrolling + GSAP ScrollTrigger motion (word-split title reveals, scrub parallax) with an IntersectionObserver fallback if the CDN is unreachable
- Ambient aurora background, animated film grain, services marquee, animated logo equalizer bars
- Particle constellation hero with mouse repulsion
- Custom glow cursor, magnetic buttons, 3D tilt + spotlight cards, shine-sweep buttons
- Typing rotator, animated counters, testimonial slider (auto/arrows/dots/swipe)
- Creator Mode page with an accessible track toggle (`role="tablist"`, arrow keys) and
  keyboard-operable accordions; tier row scroll-snaps on mobile
- Fully responsive (desktop → tablet → mobile), `prefers-reduced-motion` respected
- No build step — plain HTML/CSS/JS, GSAP/Lenis via CDN

---

© ZynTECH. Designed & developed by **Theekshana Nirmal**.
