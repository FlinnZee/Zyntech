/* ============================================================
   ZynTECH: Site Engine
   Renders the homepage from js/data.js and runs the motion:
   the live signal in the hero, the marquee, the manifesto that
   fills as you read, the pinned work gallery, the stacking
   process cards, the founders' panels, the quote slider and
   the brief builder in Contact.
   Uses GSAP + ScrollTrigger + Lenis when they load (CDN); the
   page stays complete and usable without them.
   You normally don't need to edit this file. Edit data.js.
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduced;
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    root.classList.add("has-gsap");
  }
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");

  const B = SITE.brand;
  const people = Object.fromEntries(SITE.team.map((m) => [m.id, m]));
  const firstName = (id) => (people[id] ? people[id].name.split(" ")[0] : "");
  const ledBy = (lead) => (lead === "both" ? SITE.team.map((m) => m.name.split(" ")[0]).join(" and ") : firstName(lead));
  const listWords = (arr) => (arr.length < 2 ? arr.join("") : `${arr.slice(0, -1).join(", ")} and ${arr[arr.length - 1]}`);

  const ICON = {
    plus: '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M7 0v14M0 7h14" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
    prev: '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M17 9H2M8 3L2 9l6 6" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
    next: '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M1 9h15M10 3l6 6-6 6" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
    close: '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  };

  /* ─────────────────────────────────────────────
     1. LOGO MARK (flat, takes the colour of its text)
  ───────────────────────────────────────────── */
  const logoMark = `
    <svg viewBox="0 0 200 340" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect class="eq eq-t eq-d1" x="52"  y="58"  width="26" height="56"/>
      <rect class="eq eq-t eq-d2" x="87"  y="18"  width="26" height="96"/>
      <rect class="eq eq-t eq-d3" x="122" y="40"  width="26" height="74"/>
      <path d="M46 126 H158 V150 L92 190 H158 V214 H42 V190 L108 150 H46 Z"/>
      <rect class="eq eq-b eq-d3" x="52"  y="226" width="26" height="74"/>
      <rect class="eq eq-b eq-d2" x="87"  y="226" width="26" height="96"/>
      <rect class="eq eq-b eq-d1" x="122" y="226" width="26" height="56"/>
    </svg>`;
  $$("[data-logo-mark]").forEach((el) => (el.innerHTML = logoMark));

  /* split a heading into masked words; lines is an array of strings */
  function splitHeading(el, lines) {
    if (!el) return;
    let i = 0;
    el.innerHTML = lines
      .map((line) =>
        `<span class="br">${line
          .split(" ")
          .map((w) => `<span class="wm"><span style="--i:${i++}">${esc(w)}</span></span>`)
          .join(" ")}</span>`
      )
      .join("");
    el.setAttribute("aria-label", lines.join(" "));
  }

  /* the giant wordmark: one span per letter, sized to fill its width */
  function giant(el) {
    el.innerHTML = `<span class="giant__in">${[..."ZYNTECH"].map((c, i) => `<span class="ch" style="--i:${i}">${c}</span>`).join("")}</span>`;
  }
  function fitGiant(el) {
    const inner = $(".giant__in", el);
    if (!inner) return;
    const cs = getComputedStyle(el);
    const avail = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    el.style.fontSize = "100px";
    const prev = el.style.getPropertyValue("--stretch");
    el.style.setProperty("--stretch", "125%");
    const w = inner.getBoundingClientRect().width;
    el.style.setProperty("--stretch", prev || "125%");
    if (w > 0) el.style.fontSize = `${(avail / w) * 100 * 0.995}px`;
  }

  /* ─────────────────────────────────────────────
     2. INTERFACE DRAWINGS (monochrome pieces of the work)
  ───────────────────────────────────────────── */
  const fragments = {
    api: () => `
      <div class="ui ui-panel" data-ui>
        <div class="ui-row"><b>api / production</b><span class="ui-live">Live</span></div>
        <div class="ui-api__stats">
          <div><span>Concurrent users</span><b>500K+</b></div>
          <div><span>p95 response</span><b>&lt; 1 s</b></div>
        </div>
        <svg class="ui-api__chart" viewBox="0 0 200 60" aria-hidden="true">
          <path d="M0 50 L14 48 L28 44 L42 45 L56 38 L70 32 L84 28 L98 20 L112 16 L126 18 L140 11 L154 9 L168 13 L182 7 L200 5 L200 60 L0 60 Z" fill="#f3f3f1" fill-opacity="0.08"/>
          <path d="M0 50 L14 48 L28 44 L42 45 L56 38 L70 32 L84 28 L98 20 L112 16 L126 18 L140 11 L154 9 L168 13 L182 7 L200 5" fill="none" stroke="#f3f3f1" stroke-width="1.6"/>
        </svg>
        <div class="ui-api__axis"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span></div>
      </div>`,
    carelink: () => `
      <div class="ui ui-panel ui-panel--light" data-ui>
        <div class="ui-row"><b>CareLink</b><span class="ui-muted">This week</span></div>
        <div class="ui-care__days"><span>Mon<b>14</b></span><span>Tue<b>15</b></span><span class="is-on">Wed<b>16</b></span><span>Thu<b>17</b></span><span>Fri<b>18</b></span></div>
        <ul class="ui-care__visits">
          <li><time>08:30</time><div><b>Morning visit</b><span>Home care, ward 2</span></div><em>Done</em></li>
          <li><time>12:00</time><div><b>Medication round</b><span>3 of 4 given</span></div><em>Due</em></li>
          <li><time>16:30</time><div><b>Physio session</b><span>Caregiver assigned</span></div><em class="is-solid">Next</em></li>
        </ul>
      </div>`,
    assistant: () => `
      <div class="ui ui-panel ui-chat" data-ui>
        <div class="ui-row"><b>Assistant</b><span class="ui-live">Online</span></div>
        <p class="msg msg--user">Can I move my appointment to Friday?</p>
        <p class="msg msg--bot">Sure. Friday has 10:30 or 14:00 free. Which suits you?</p>
        <div class="ui-chat__intent"><span class="ui-muted">Intent</span><b>Reschedule</b><span>0.94</span></div>
        <div class="ui-chat__chips"><span>10:30</span><span>14:00</span></div>
      </div>`,
    wave: () => `
      <div class="ui ui-panel ui-wave" data-ui>
        <div class="ui-wave__art" aria-hidden="true">${[38, 64, 48, 82, 56, 70, 42].map((h) => `<i style="height:${h}%"></i>`).join("")}</div>
        <div class="ui-wave__meta"><b>Night Drive</b><span class="ui-muted">Playlist</span></div>
        <div class="ui-wave__bar"><i></i></div>
        <div class="ui-wave__time"><span>1:24</span><span>3:41</span></div>
        <div class="ui-wave__controls">
          <svg viewBox="0 0 24 24"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg>
          <span class="play"><svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg></span>
          <svg viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM4 5v14l11-7z"/></svg>
        </div>
      </div>`,
    hanzy: () => `
      <div class="ui ui-panel" data-ui>
        <div class="ui-edit__viewer"><span class="ui-edit__card">HANZY</span><span class="ui-edit__tc">00:01:24:12</span></div>
        <div class="ui-edit__tracks">
          <div class="trk"><span>V2</span><i class="is-hi" style="--l:28%;--w:18%"></i></div>
          <div class="trk"><span>V1</span><i style="--l:0%;--w:28%"></i><i style="--l:29%;--w:34%"></i><i style="--l:64%;--w:32%"></i></div>
          <div class="trk"><span>A1</span><i class="is-lo" style="--l:0%;--w:96%"></i></div>
          <div class="trk"><span>A2</span><i class="is-lo" style="--l:12%;--w:40%"></i></div>
          <b class="ui-edit__head"></b>
        </div>
      </div>`,
    atmos: () => `
      <div class="ui ui-panel" data-ui>
        <div class="ui-row"><b>Today</b><span class="ui-muted">Thursday</span></div>
        <div class="ui-atmos__now"><b>29°</b><span>Humid, thunderstorms after 16:00</span></div>
        <ul class="ui-atmos__hours">
          <li class="is-now"><span>Now</span><b>29°</b></li><li><span>13</span><b>30°</b></li><li><span>14</span><b>30°</b></li>
          <li><span>15</span><b>28°</b></li><li><span>16</span><b>26°</b></li><li><span>17</span><b>25°</b></li>
        </ul>
      </div>`,
  };
  const mediaFor = (p, eager) =>
    p.image
      ? `<img src="${esc(p.image)}" alt="${esc(p.title)}, screenshot" width="1600" height="1000"${eager ? "" : ' loading="lazy"'} decoding="async">`
      : (fragments[p.ui] || (() => `<div class="ui ui-card" data-ui><b>${esc(p.title)}</b></div>`))();

  /* ─────────────────────────────────────────────
     3. HERO
  ───────────────────────────────────────────── */
  const H = SITE.hero;
  $("#heroTitle").innerHTML = H.title.map((l, i) => `<span class="line"><span style="--i:${i}">${esc(l)}</span></span>`).join("");
  $("#heroSub").textContent = H.sub;
  $("#heroPrimary").textContent = H.primary.label;
  $("#heroPrimary").href = H.primary.href;
  $("#heroSecondary").textContent = H.secondary.label;
  $("#heroSecondary").href = H.secondary.href;
  $("#heroNotes").innerHTML = H.notes.map((n) => `<li>${esc(n)}</li>`).join("");
  const heroWord = $("#heroWord");
  const footWord = $("#footWord");
  giant(heroWord);
  giant(footWord);
  heroWord.style.setProperty("--stretch", "125%");
  footWord.style.setProperty("--stretch", "125%");

  /* ─────────────────────────────────────────────
     4. MARQUEE
  ───────────────────────────────────────────── */
  const marquee = $("#marquee");
  const chunk = SITE.marquee.map((t) => `<span class="marquee__item">${esc(t)}<span class="mark" aria-hidden="true">${logoMark}</span></span>`).join("");
  marquee.innerHTML = chunk + chunk + chunk;

  /* ─────────────────────────────────────────────
     5. MANIFESTO + NUMBERS
  ───────────────────────────────────────────── */
  const manifesto = $("#manifesto");
  manifesto.innerHTML = SITE.manifesto.split(" ").map((w) => `<span class="w">${esc(w)}</span>`).join(" ");
  $("#stats").innerHTML = SITE.stats
    .map((s) => `<li data-reveal><b data-count="${s.value}" data-suffix="${esc(s.suffix)}">${s.value}${esc(s.suffix)}</b><span>${esc(s.label)}</span></li>`)
    .join("");
  $$("#stats li").forEach((li, i) => li.style.setProperty("--i", i));

  /* ─────────────────────────────────────────────
     6. SERVICES: an index that opens line by line
  ───────────────────────────────────────────── */
  splitHeading($("#servicesTitle"), [SITE.servicesTitle]);
  $("#servicesIntro").textContent = SITE.servicesIntro;
  const index = $("#servicesIndex");
  index.innerHTML = SITE.services
    .map(
      (s, i) => `
      <li class="index__item" data-reveal style="--i:${i % 3}">
        <button class="index__row" type="button" aria-expanded="false" aria-controls="svc-${i}">
          <span class="index__title">${esc(s.title)}</span>
          <span class="index__meta"><span>${esc(s.group)}</span><span>Led by ${esc(ledBy(s.lead))}</span></span>
          <span class="index__plus">${ICON.plus}</span>
        </button>
        <div class="index__panel" id="svc-${i}" role="region" aria-label="${esc(s.title)}">
          <div><div class="index__panel-in">
            <p>${esc(s.text)}</p>
            <ul>${s.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          </div></div>
        </div>
      </li>`
    )
    .join("");
  index.addEventListener("click", (e) => {
    const row = e.target.closest(".index__row");
    if (!row) return;
    const item = row.parentElement;
    const open = !item.classList.contains("is-open");
    $$(".index__item.is-open", index).forEach((o) => {
      o.classList.remove("is-open");
      $(".index__row", o).setAttribute("aria-expanded", "false");
    });
    item.classList.toggle("is-open", open);
    row.setAttribute("aria-expanded", String(open));
    setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 620);
  });

  /* ─────────────────────────────────────────────
     7. WORK: the gallery and the project sheet
  ───────────────────────────────────────────── */
  splitHeading($("#workTitle"), SITE.workTitle);
  $("#workIntro").textContent = SITE.workIntro;
  $("#workCount").textContent = `${pad(SITE.projects.length)} projects, ${fine ? "scroll" : "swipe"} through`;
  $("#workTrack").insertAdjacentHTML(
    "beforeend",
    `<div class="work__cards">${SITE.projects
      .map(
        (p, i) => `
        <button class="card" type="button" data-project="${i}" data-cursor="View" aria-haspopup="dialog">
          <span class="card__media${p.image ? " card__media--image" : ""}">${mediaFor(p, i === 0)}</span>
          <span class="card__meta">
            <span class="card__title">${esc(p.title)}</span>
            <span class="card__cat">${esc(p.category)}</span>
            <span class="card__stack">${esc(p.stack.join(", "))}</span>
          </span>
        </button>`
      )
      .join("")}</div>`
  );

  const sheet = $("#projectSheet");
  let lastCard = null;
  $("#sheetClose").innerHTML = ICON.close;
  $("#workTrack").addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const p = SITE.projects[+card.dataset.project];
    lastCard = card;
    const media = $("#sheetMedia");
    media.className = `sheet__media${p.image ? " sheet__media--image" : ""}`;
    media.innerHTML = mediaFor(p, true);
    $("#sheetCat").textContent = p.category;
    $("#sheetTitle").textContent = p.title;
    $("#sheetBody").textContent = p.text;
    $("#sheetFacts").innerHTML = `
      <div><dt>Stack</dt><dd>${esc(p.stack.join(", "))}</dd></div>
      <div><dt>Led by</dt><dd>${esc(people[p.lead] ? people[p.lead].name : ledBy(p.lead))}</dd></div>`;
    const open = $("#sheetLink");
    open.hidden = !p.link;
    if (p.link) {
      open.href = p.link;
      open.textContent = p.linkLabel || `Open ${p.title}`;
    }
    if (typeof sheet.showModal === "function") sheet.showModal();
    else sheet.setAttribute("open", "");
    lenis && lenis.stop();
  });
  const closeSheet = () => sheet.open && sheet.close();
  $("#sheetClose").addEventListener("click", closeSheet);
  sheet.addEventListener("click", (e) => { if (e.target === sheet) closeSheet(); });
  sheet.addEventListener("close", () => {
    lenis && lenis.start();
    if (lastCard) lastCard.focus({ preventScroll: true });
  });
  $("#sheetCta").addEventListener("click", () => { lastCard = null; closeSheet(); });

  /* ─────────────────────────────────────────────
     8. PROCESS: cards that stack as you scroll
  ───────────────────────────────────────────── */
  splitHeading($("#processTitle"), [SITE.processTitle]);
  $("#processIntro").textContent = SITE.processIntro;
  $("#processStack").innerHTML = SITE.process
    .map(
      (s, i) => `
      <li class="stack__card" style="--i:${i}">
        <span class="stack__num" aria-hidden="true">${pad(i + 1)}</span>
        <div class="stack__main"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
        <ul class="stack__items">${s.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </li>`
    )
    .join("");

  /* ─────────────────────────────────────────────
     9. FOUNDERS: two panels, the one you point at opens
  ───────────────────────────────────────────── */
  splitHeading($("#teamTitle"), [SITE.teamTitle]);
  $("#teamIntro").textContent = SITE.teamIntro;
  const duo = $("#teamDuo");
  duo.innerHTML = SITE.team
    .map((m, i) => {
      const links = [];
      if (m.links.email) links.push(`<a class="arrow-link" href="mailto:${esc(m.links.email)}">Email</a>`);
      if (m.links.github) links.push(`<a class="arrow-link" href="${esc(m.links.github)}" target="_blank" rel="noopener">GitHub</a>`);
      if (m.links.linkedin) links.push(`<a class="arrow-link" href="${esc(m.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
      return `
      <article class="person${i === 0 ? " is-open" : ""}" data-reveal style="--i:${i}">
        <img class="person__photo" src="${esc(m.photo)}" alt="Portrait of ${esc(m.name)}" width="900" height="1100" loading="lazy" decoding="async" style="object-position:${esc(m.position || "50% 30%")}">
        <button class="person__toggle" type="button" aria-expanded="${i === 0}" aria-controls="person-${i}" aria-label="${esc(m.name)}, show profile"></button>
        <div class="person__body">
          <p class="person__role">${esc(m.role)}</p>
          <h3 class="person__name">${esc(m.name)}</h3>
          <div class="person__more" id="person-${i}"><div>
            <p class="person__bio">${esc(m.bio)}</p>
            <ul class="person__skills">${m.skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
            <p class="person__links">${links.join("")}</p>
          </div></div>
        </div>
      </article>`;
    })
    .join("");
  const openPerson = (el) => {
    $$(".person", duo).forEach((p) => {
      const on = p === el;
      p.classList.toggle("is-open", on);
      $(".person__toggle", p).setAttribute("aria-expanded", String(on));
    });
  };
  $$(".person", duo).forEach((p) => {
    p.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") openPerson(p); });
    $(".person__toggle", p).addEventListener("click", () => openPerson(p));
    p.addEventListener("focusin", () => openPerson(p));
  });

  /* ─────────────────────────────────────────────
     10. CREATOR MODE doorway (content lives in js/creator-data.js)
  ───────────────────────────────────────────── */
  const creatorBand = $("#creator-mode");
  if (typeof CREATOR !== "undefined" && CREATOR.homeBand) {
    const cb = CREATOR.homeBand;
    $("#creatorTitle").textContent = cb.title;
    $("#creatorText").textContent = cb.text;
    $("#creatorLink").textContent = cb.link;
    const prices = ((CREATOR.packages && CREATOR.packages.tracks) || [])
      .flatMap((t) => t.tiers.map((x) => x.price))
      .filter((n) => typeof n === "number");
    const facts = prices.length ? [{ label: "From", value: `LKR ${new Intl.NumberFormat("en-US").format(Math.min(...prices))} a month` }] : [];
    facts.push(...(cb.facts || []));
    $("#creatorFacts").innerHTML = facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("");
    const ph = CREATOR.photos && CREATOR.photos.hero;
    if (ph) $("#creatorPhoto").innerHTML = `<img src="${esc(ph.src.replace(/^\.\.\//, ""))}" alt="${esc(ph.alt)}" width="1200" height="750" loading="lazy" decoding="async">`;
  } else if (creatorBand) {
    creatorBand.remove();
  }

  /* ─────────────────────────────────────────────
     11. TESTIMONIALS: one quote at a time
  ───────────────────────────────────────────── */
  $("#voicesTitle").textContent = SITE.testimonialsTitle;
  $("#voicesTotal").textContent = SITE.testimonials.length;
  $("#voicesPrev").innerHTML = ICON.prev;
  $("#voicesNext").innerHTML = ICON.next;
  const quote = $("#voicesQuote");
  const who = $("#voicesWho");
  let qAt = 0, qBusy = false;
  const paintQuote = () => {
    const t = SITE.testimonials[qAt];
    quote.innerHTML = `“${t.quote}”`.split(" ").map((w, i) => `<span class="ql"><span style="transition-delay:${i * 18}ms">${esc(w)}</span></span>`).join(" ");
    who.innerHTML = `<b>${esc(t.name)}</b><span>${esc(t.role)}</span>`;
    $("#voicesAt").textContent = qAt + 1;
  };
  paintQuote();
  const goQuote = (d) => {
    if (qBusy) return;
    qAt = (qAt + d + SITE.testimonials.length) % SITE.testimonials.length;
    if (reduced) return paintQuote();
    qBusy = true;
    quote.classList.add("is-out");
    setTimeout(() => {
      paintQuote();
      quote.classList.add("is-out");
      requestAnimationFrame(() => requestAnimationFrame(() => { quote.classList.remove("is-out"); qBusy = false; }));
    }, 420);
  };
  $("#voicesPrev").addEventListener("click", () => goQuote(-1));
  $("#voicesNext").addEventListener("click", () => goQuote(1));
  const stage = $("#voicesStage");
  let dragX = null;
  stage.addEventListener("pointerdown", (e) => (dragX = e.clientX));
  stage.addEventListener("pointerup", (e) => {
    if (dragX == null) return;
    const dx = e.clientX - dragX;
    if (Math.abs(dx) > 50) goQuote(dx < 0 ? 1 : -1);
    dragX = null;
  });
  $("#clients").addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goQuote(1);
    if (e.key === "ArrowLeft") goQuote(-1);
  });

  /* ─────────────────────────────────────────────
     12. CONTACT: the brief builder
  ───────────────────────────────────────────── */
  const C = SITE.contact;
  splitHeading($("#contactTitle"), [C.title]);
  $("#contactSentence").textContent = C.sentence;
  $("#contactNote").textContent = C.note;
  const tel = B.phone.replace(/\s/g, "");
  $("#contactDirect").innerHTML = `
    <div><dt>Email</dt><dd><a class="arrow-link" href="mailto:${esc(B.email)}">${esc(B.email)}</a></dd></div>
    <div><dt>Call or WhatsApp</dt><dd><a href="tel:${esc(tel)}">${esc(B.phone)}</a></dd></div>
    <div><dt>Based in</dt><dd>${esc(B.location)}, ${esc(B.timezone)}</dd></div>`;
  $("#briefNeeds").innerHTML = C.needs
    .map((n, i) => `<label class="chip"><input type="checkbox" name="need" value="${esc(n.label)}" data-lead="${esc(n.lead)}" id="need${i}"><span>${esc(n.label)}</span></label>`)
    .join("");
  $("#briefWhen").innerHTML = C.timelines
    .map((t, i) => `<label class="chip"><input type="radio" name="when" value="${esc(t)}" id="when${i}"><span>${esc(t)}</span></label>`)
    .join("");
  $("#briefWho").innerHTML = SITE.team
    .map(
      (m) => `
      <div class="who" data-person="${esc(m.id)}">
        <img src="${esc(m.photo)}" alt="" width="64" height="64" loading="lazy" style="object-position:${esc(m.position || "50% 30%")}">
        <div><b>${esc(m.name)}</b><span>${esc(m.short)}</span></div>
      </div>`
    )
    .join("");
  const brief = $("#brief");
  function updateBrief() {
    const needs = $$('input[name="need"]:checked', brief);
    const when = $('input[name="when"]:checked', brief);
    const message = $("#briefMessage").value.trim();
    const leads = new Set();
    needs.forEach((n) => (n.dataset.lead === "both" ? SITE.team.forEach((m) => leads.add(m.id)) : leads.add(n.dataset.lead)));
    $$(".who", brief).forEach((w) => w.classList.toggle("is-dim", leads.size > 0 && !leads.has(w.dataset.person)));
    const needNames = needs.map((n) => n.value);
    const answerers = leads.size ? [...leads].map(firstName).filter(Boolean) : SITE.team.map((m) => m.name.split(" ")[0]);
    const whoText = leads.size ? `${listWords(answerers)} will answer this one.` : `${answerers.join(" or ")} will answer.`;
    const whatText = needNames.length ? `You need <b>${esc(listWords(needNames).toLowerCase())}</b>` : "Pick what you need";
    const whenText = when ? `, launching <b>${esc(when.value.toLowerCase())}</b>.` : needNames.length ? "." : " and we’ll shape the rest together.";
    $("#briefSummary").innerHTML = `${whatText}${whenText} ${esc(whoText)}`;
    const lines = [
      `Hi ${listWords(answerers)},`,
      "",
      `What we need: ${needNames.length ? listWords(needNames) : "not sure yet"}`,
      `Launch: ${when ? when.value : "not sure yet"}`,
      "",
      message || "(A few lines about the project.)",
    ];
    const subject = `[${B.name}] Project brief${needNames.length ? `: ${needNames.join(", ")}` : ""}`;
    $("#briefEmail").href = `mailto:${B.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    $("#briefWhatsapp").href = `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }
  brief.addEventListener("change", updateBrief);
  brief.addEventListener("input", updateBrief);
  brief.addEventListener("submit", (e) => e.preventDefault());
  updateBrief();

  /* ─────────────────────────────────────────────
     13. FOOTER
  ───────────────────────────────────────────── */
  $("#footLine").innerHTML = SITE.footer.line.map((l) => `<span>${esc(l)}</span>`).join("");
  $("#footEmail").textContent = B.email;
  $("#footEmail").href = `mailto:${B.email}`;
  const elsewhere = [`<a href="https://wa.me/${esc(B.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`, `<a href="tel:${esc(tel)}">${esc(B.phone)}</a>`];
  SITE.team.forEach((m) => {
    if (m.links.github) elsewhere.push(`<a href="${esc(m.links.github)}" target="_blank" rel="noopener">GitHub</a>`);
    if (m.links.linkedin) elsewhere.push(`<a href="${esc(m.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
  });
  $("#footElsewhere").insertAdjacentHTML("beforeend", elsewhere.join(""));
  $("#footStudio").insertAdjacentHTML("beforeend", `<p>${esc(B.descriptor)}</p><p>${esc(B.location)}, ${esc(B.timezone)}</p><p>${esc(B.reach)}</p>`);
  $("#footCopy").textContent = `© ${SITE.footer.year} ${B.name}. All rights reserved.`;
  $("#footCredit").textContent = SITE.footer.credit;
  $("#menuReach").textContent = `${B.location}, ${B.reach.toLowerCase()}.`;

  /* ─────────────────────────────────────────────
     14. SMOOTH SCROLL + anchors
  ───────────────────────────────────────────── */
  let lenis = null;
  if (hasGsap && fine && window.Lenis) {
    lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    root.classList.add("lenis");
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", id);
  });

  /* ─────────────────────────────────────────────
     15. HEADER: hides on the way down, current link, menu, scramble
  ───────────────────────────────────────────── */
  const nav = $("#nav");
  const navLinks = $$(".nav__links a[href^='#']");
  const sections = ["services", "work", "team", "contact"].map((id) => document.getElementById(id)).filter(Boolean);
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("is-hidden", y > lastY && y > 240 && menu.hidden);
    lastY = y;
    let current = "";
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= innerHeight * 0.35 && r.bottom > innerHeight * 0.35) current = s.id;
    }
    navLinks.forEach((l) => l.classList.toggle("is-current", l.getAttribute("href") === `#${current}`));
  }

  const menu = $("#menu");
  const menuButton = $("#menuButton");
  $$(".menu__nav a", menu).forEach((a, i) => a.style.setProperty("--i", i));
  function setMenu(open) {
    menu.hidden = !open;
    menu.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    $("span", menuButton).textContent = open ? "Close" : "Menu";
    document.body.style.overflow = open ? "hidden" : "";
    if (lenis) open ? lenis.stop() : lenis.start();
    nav.classList.remove("is-hidden");
  }
  menuButton.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) setMenu(false); });
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // code-flavoured hover: the link's letters resolve from noise, left to right
  if (fine && !reduced) {
    const glyphs = "abcdefghijklmnopqrstuvwxyz/#_<>";
    $$("[data-scramble]").forEach((el) => {
      const text = el.textContent;
      let raf = 0;
      el.addEventListener("mouseenter", () => {
        cancelAnimationFrame(raf);
        const t0 = performance.now();
        el.style.width = `${el.getBoundingClientRect().width}px`;
        (function step(now) {
          const p = Math.min((now - t0) / 380, 1);
          const solved = Math.floor(p * text.length);
          el.textContent = [...text].map((c, i) => (i < solved || c === " " ? c : glyphs[(Math.random() * glyphs.length) | 0])).join("");
          if (p < 1) raf = requestAnimationFrame(step);
          else { el.textContent = text; el.style.width = ""; }
        })(t0);
      });
    });
  }

  /* ─────────────────────────────────────────────
     16. CURSOR + MAGNETIC BUTTONS (mouse only)
  ───────────────────────────────────────────── */
  if (fine && !reduced) {
    root.classList.add("has-cursor");
    const cur = $("#cursor");
    cur.classList.add("is-hidden");                    // until the pointer first moves
    const label = $("#cursorLabel");
    let x = -100, y = -100;
    window.addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY;
      cur.classList.remove("is-hidden");
      cur.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }, { passive: true });
    document.addEventListener("pointerover", (e) => {
      const lab = e.target.closest("[data-cursor]");
      const link = e.target.closest("a, button, label, [role='button']");
      cur.classList.toggle("is-label", !!lab);
      cur.classList.toggle("is-link", !lab && !!link);
      label.textContent = lab ? lab.dataset.cursor : "";
    });
    document.addEventListener("pointerleave", () => cur.classList.add("is-hidden"));
    document.addEventListener("pointerenter", () => cur.classList.remove("is-hidden"));

    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.28;
        const dy = (e.clientY - r.top - r.height / 2) * 0.35;
        if (hasGsap) gsap.to(el, { x: dx, y: dy, duration: 0.5, ease: "power3.out" });
        else el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener("pointerleave", () => {
        if (hasGsap) gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
        else el.style.transform = "";
      });
    });
  }

  /* ─────────────────────────────────────────────
     17. THE SIGNAL: the mark's bars as a live waveform.
         The pointer raises the bars near it; scrolling away quiets it.
  ───────────────────────────────────────────── */
  const signal = (function () {
    const canvas = $("#signal");
    const ctx = canvas.getContext("2d");
    const hero = $("#top");
    let w = 0, h = 0, dpr = 1, t = 0, amp = 1, visible = true;
    const ptr = { x: 0, on: false, target: 0, cur: 0 };
    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      const step = w < 600 ? 6 : 7, bw = w < 600 ? 2 : 2.5, gap = 5;
      const n = Math.floor(w / step), off = (w - n * step) / 2;
      const mid = h / 2, maxH = mid - gap;
      const sigma = Math.max(60, w * 0.07);
      for (let i = 0; i < n; i++) {
        const x = off + i * step;
        const u = i / n;
        let v = 0.16 + 0.1 * Math.sin(u * 11 + t * 1.2) + 0.07 * Math.sin(u * 29 - t * 2.3) + 0.05 * Math.sin(u * 61 + t * 3.1);
        v = Math.abs(v);
        const d = x - ptr.cur;
        const near = Math.exp(-(d * d) / (2 * sigma * sigma)) * ptr.target;
        v = Math.min(1, v + near * (0.62 + 0.18 * Math.sin(i * 1.7 + t * 6)));
        const bh = Math.max(1, v * maxH * amp);
        ctx.fillStyle = `rgba(243, 243, 241, ${0.28 + 0.72 * Math.min(1, near * 1.2 + v * 0.6)})`;
        ctx.fillRect(x, mid - gap / 2 - bh, bw, bh);
        ctx.fillRect(x, mid + gap / 2, bw, bh);
      }
    }
    function loop() {
      requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      t += 0.016;
      if (!ptr.on) {                      // no pointer: a slow sweep keeps it alive
        ptr.x = w * (0.5 + 0.35 * Math.sin(t * 0.45));
        ptr.target += (0.55 - ptr.target) * 0.03;
      } else ptr.target += (1 - ptr.target) * 0.08;
      ptr.cur += (ptr.x - ptr.cur) * 0.12;
      draw();
    }
    hero.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      ptr.x = e.clientX - r.left; ptr.on = true;
    }, { passive: true });
    hero.addEventListener("pointerleave", () => (ptr.on = false));
    new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(canvas);
    window.addEventListener("resize", resize);
    resize();
    if (!reduced) { ptr.cur = w / 2; loop(); }
    return { setAmp: (a) => { amp = a; if (reduced) draw(); } };
  })();

  /* ─────────────────────────────────────────────
     18. MARQUEE: drifts on its own, follows the scroll's speed and direction
  ───────────────────────────────────────────── */
  if (!reduced) {
    let mx = 0, dir = -1, vel = 0, prevY = window.scrollY, half = 0;
    const measure = () => (half = marquee.scrollWidth / 3);
    measure();
    window.addEventListener("resize", measure);
    (function tick() {
      requestAnimationFrame(tick);
      const y = window.scrollY, dy = y - prevY;
      prevY = y;
      if (dy) dir = dy > 0 ? -1 : 1;
      vel += (Math.min(40, Math.abs(dy)) - vel) * 0.1;
      mx += dir * (0.6 + vel * 0.35);
      if (mx <= -half) mx += half;
      if (mx > 0) mx -= half;
      marquee.style.transform = `translate3d(${mx}px, 0, 0) skewX(${(-dir * Math.min(vel, 30) * 0.18).toFixed(2)}deg)`;
    })();
  }

  /* ─────────────────────────────────────────────
     19. SCROLL SCENES (GSAP)
  ───────────────────────────────────────────── */
  if (hasGsap) {
    // hero: the wordmark narrows and the signal goes quiet as you leave
    gsap.fromTo(heroWord, { "--stretch": "125%", yPercent: 0 }, {
      "--stretch": "68%", yPercent: 18, ease: "none",
      scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true, onUpdate: (s) => signal.setAmp(1 - s.progress * 0.95) },
    });
    gsap.to(".hero__top", { yPercent: -18, opacity: 0.25, ease: "none", scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true } });

    // manifesto: the sentence fills in as it is read
    gsap.to($$(".w", manifesto), {
      opacity: 1, stagger: 0.12, ease: "none",
      scrollTrigger: { trigger: manifesto, start: "top 78%", end: "bottom 42%", scrub: true },
    });

    // process: each card settles back as the next one lands on it
    const cards = $$(".stack__card");
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      gsap.to(card, {
        scale: 0.94, ease: "none",
        scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
      });
    });

    // creator mode: three lines slide against each other
    const lines = $$("#creatorLines span");
    const lineMoves = [["-14vw", "6vw"], ["12vw", "-6vw"], ["-8vw", "10vw"]];
    lines.forEach((l, i) => {
      gsap.fromTo(l, { x: lineMoves[i][0] }, { x: lineMoves[i][1], ease: "none", scrollTrigger: { trigger: "#creatorLines", start: "top bottom", end: "bottom top", scrub: true } });
    });

    // footer: the wordmark opens up as the curtain lifts
    gsap.fromTo(footWord, { "--stretch": "70%" }, {
      "--stretch": "125%", ease: "none",
      scrollTrigger: { trigger: "#contact", start: "bottom bottom", end: "bottom top", scrub: true },
    });

    // work: vertical scroll drives the gallery sideways on wide screens
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const track = $("#workTrack");
      const bar = $("#workBar");
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: "#workPin", start: "top top", end: () => `+=${dist()}`,
          pin: true, scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (s) => (bar.style.transform = `scaleX(${s.progress})`),
        },
      });
      $$(".card__media img", track).forEach((img) => {
        gsap.fromTo(img, { xPercent: -4, scale: 1.1 }, {
          xPercent: 4, scale: 1.1, ease: "none",
          scrollTrigger: { trigger: img.closest(".card"), containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        });
      });
    });
  } else {
    root.classList.add("no-scenes");
  }

  /* ─────────────────────────────────────────────
     20. ENTRANCES + COUNTERS
  ───────────────────────────────────────────── */
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0 }
  );
  $$("[data-reveal], [data-split]").forEach((el) => io.observe(el));

  const countIo = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        countIo.unobserve(e.target);
        const el = e.target, target = +el.dataset.count, suffix = el.dataset.suffix || "";
        if (reduced) continue;
        const t0 = performance.now();
        (function step(now) {
          const p = Math.min((now - t0) / 1800, 1);
          el.textContent = Math.round(target * (1 - Math.pow(2, -10 * p))) + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        })(t0);
      }
    },
    { threshold: 0.6 }
  );
  $$("[data-count]").forEach((el) => countIo.observe(el));

  /* ─────────────────────────────────────────────
     21. FIT THE WORDMARKS (after the font arrives) and settle the scenes
  ───────────────────────────────────────────── */
  const refit = () => {
    fitGiant(heroWord);
    fitGiant(footWord);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  };
  refit();
  if (document.fonts) document.fonts.ready.then(refit);
  let rt = 0;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(refit, 150); });
  window.addEventListener("load", () => window.ScrollTrigger && ScrollTrigger.refresh());
})();
