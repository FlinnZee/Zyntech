# ZynTECH | Company site

Single-page site for **ZynTECH**, a software and video studio in Sri Lanka, founded by
Theekshana Nirmal and Hansana Wick.

**Live:** enable GitHub Pages (see below) and the site is shareable at a permanent link.

---

## ✏️ How to update the site (no coding needed)

**Every piece of content lives in one file: [`js/data.js`](js/data.js).**

Open it in any text editor, change the text between quotes, save, refresh. That's it.

| What you want to change | Where in `data.js` |
|---|---|
| Headline, intro sentence, the small facts beside it | `hero: {...}` (`title` is the two headline lines) |
| The amber figure in the top picture band | `hero.figure` |
| The photos that slowly change in the top band | `hero.rotating` |
| "One team, not five vendors" section | `about: {...}` |
| A **service practice** (title, list, who leads it, picture) | `services: [...]` (`lead`: `"theekshana"`, `"hansana"` or `"both"`) |
| A **project** in Selected work | `projects: [...]` (`ui` picks the drawn interface; leave it out for a title card) |
| The four process stages | `process: [...]` |
| Team bios, skills, links, photos | `team: [...]` (photos in `assets/team/`, `position` moves the crop) |
| A **testimonial** | `testimonials: [...]` (the current three are samples, replace with real ones) |
| Email, phone, WhatsApp, location | `brand: {...}` |
| Brief builder launch options | `contact.timelines` |
| Picture credits in the footer | `credits: [...]` |

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

```
index.html          page skeleton (sections, header, project sheet)
css/style.css       the "printed annual" theme: tokens, grid, sections, interface drawings
js/data.js          ← ALL editable content (edit this one)
js/main.js          rendering and interactions
assets/team/        founder portraits
assets/img/         Colombo photographs and archive plates (see credits.json)
assets/favicon.svg  flat mark on near-black
```

## ⚡ What's in it

- One typeface (Bricolage Grotesque), one accent (sodium amber), each section its own flat colour chapter
- Masthead mosaic of the founders and Colombo at night, with a slow crossfade
- Header that takes the colour of the section under it and marks where you are
- Services with a pinned index that follows the practice you're reading
- Work tiles drawn as real interface pieces; each opens a project sheet (Esc to close)
- Process diagram built from the logo's equaliser bars, assembling as it scrolls in
- Testimonial switcher, brief builder, full-screen phone menu
- Fully responsive (desktop, tablet, phone), keyboard friendly, `prefers-reduced-motion` respected

---

## 🖼 Picture credits

The Colombo photographs and archive plates come from Wikimedia Commons and The Met (CC0, public
domain, CC BY). Credits are listed in the footer ("Picture credits") and in `assets/img/credits.json`.
Keep the credits while the pictures stay on the site.

---

© ZynTECH. Designed & developed by **Theekshana Nirmal**.
