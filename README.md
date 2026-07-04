# ZynTECH — Company Portfolio

Futuristic single-page portfolio for **ZynTECH**, a full-spectrum IT solutions agency.

**Live:** enable GitHub Pages (see below) and the site is shareable at a permanent link.

---

## ✏️ How to update the site (no coding needed)

**Every piece of content lives in one file: [`js/data.js`](js/data.js).**

Open it in any text editor, change the text between quotes, save, refresh. That's it.

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
index.html        page skeleton (sections + SVG icon sprite)
css/style.css     futuristic dark-chrome theme, all effects styling
js/data.js        ← ALL editable content (edit this one)
js/main.js        rendering + effects engine (cursor, particles, tilt, slider…)
assets/           logo mark + favicon (SVG, scale to any size)
```

## ⚡ Features

- Lenis smooth scrolling + GSAP ScrollTrigger motion (word-split title reveals, scrub parallax) with an IntersectionObserver fallback if the CDN is unreachable
- Ambient aurora background, animated film grain, services marquee, animated logo equalizer bars
- Particle constellation hero with mouse repulsion
- Custom glow cursor, magnetic buttons, 3D tilt + spotlight cards, shine-sweep buttons
- Typing rotator, animated counters, testimonial slider (auto/arrows/dots/swipe)
- Fully responsive (desktop → tablet → mobile), `prefers-reduced-motion` respected
- No build step — plain HTML/CSS/JS, GSAP/Lenis via CDN

---

© ZynTECH. Designed & developed by **Theekshana Nirmal**.
