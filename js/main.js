/* ============================================================
   ZynTECH: Site Engine
   Renders content from js/data.js and runs the interactions:
   the chapter-coloured header, the masthead crossfade, the
   project sheet, the process diagram, the testimonial switcher
   and the brief builder in Contact.
   You normally don't need to edit this file. Edit data.js.
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const B = SITE.brand;
  const people = Object.fromEntries(SITE.team.map((m) => [m.id, m]));
  const firstName = (id) => (people[id] ? people[id].name.split(" ")[0] : "");
  const ledBy = (lead) =>
    lead === "both"
      ? SITE.team.map((m) => m.name.split(" ")[0]).join(" and ")
      : firstName(lead);

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

  /* ─────────────────────────────────────────────
     2. INTERFACE FRAGMENTS (the work, drawn in HTML)
  ───────────────────────────────────────────── */
  const icon = {
    prev: '<svg viewBox="0 0 24 24"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM4 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>',
  };

  // Nyx's "seen" receipt: two drawn ticks
  const seen = '<svg class="ui-nyx__seen" viewBox="0 0 20 12" aria-label="Seen"><path d="M1 6.5l3.2 3.2L11 2.5M8.5 9.2l.5.5L16 2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const fragments = {
    nyx: () => `
      <div class="ui ui--dark ui-nyx" data-ui>
        <div class="ui-nyx__bar">
          <b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 3.2A9 9 0 1 0 20.8 15 7.2 7.2 0 0 1 15.5 3.2z"/></svg>Nyx</b>
          <span class="ui-nyx__dots"><i></i><i></i><i></i></span>
        </div>
        <div class="ui-nyx__body">
          <div class="ui-nyx__side"><i class="is-on"></i><i></i><i></i><i></i></div>
          <div class="ui-nyx__chat">
            <div class="ui-nyx__who"><i></i><div><b>Aria Vale</b><span>Active now</span></div></div>
            <p class="m">have you tried the new themes?</p>
            <p class="m m--out">vortex goes hard. full neon grid ${seen}</p>
            <p class="m m--voice"><span class="ui-nyx__wave">${[30, 60, 90, 50, 75, 40, 85, 55, 35, 65, 45].map((h) => `<i style="height:${h}%"></i>`).join("")}</span>0:06</p>
            <p class="m m--out">this app really feels alive ${seen}</p>
          </div>
        </div>
      </div>`,
    carelink: () => `
      <div class="ui ui--light ui-care" data-ui>
        <div class="ui-care__head"><b>CareLink</b><span>This week</span></div>
        <div class="ui-care__days">
          <span>Mon<b>14</b></span><span>Tue<b>15</b></span><span class="is-on">Wed<b>16</b></span><span>Thu<b>17</b></span><span>Fri<b>18</b></span>
        </div>
        <ul class="ui-care__visits">
          <li><time>08:30</time><div><b>Morning visit</b><span>Mrs. Perera, Kandy Road</span></div><em>Done</em></li>
          <li><time>12:00</time><div><b>Medication round</b><span>3 of 4 given</span></div><em class="due">Due</em></li>
          <li><time>16:30</time><div><b>Physio session</b><span>Assigned to Nimal</span></div><em class="next">Next</em></li>
        </ul>
        <p class="ui-care__note">Care record shared with 2 family members</p>
      </div>`,
    api: () => `
      <div class="ui ui--dark ui-api" data-ui>
        <div class="ui-api__head"><b>api / production</b><span class="live">Live</span></div>
        <div class="ui-api__stats">
          <div><span>Concurrent users</span><b>500K+</b></div>
          <div><span>p95 response</span><b>&lt; 1 s</b></div>
        </div>
        <svg class="ui-api__chart" viewBox="0 0 200 64" aria-hidden="true">
          <path d="M0 52 L14 50 L28 46 L42 47 L56 40 L70 34 L84 30 L98 22 L112 18 L126 20 L140 12 L154 10 L168 14 L182 8 L200 6 L200 64 L0 64 Z" fill="#ffc53d" fill-opacity="0.16"/>
          <path d="M0 52 L14 50 L28 46 L42 47 L56 40 L70 34 L84 30 L98 22 L112 18 L126 20 L140 12 L154 10 L168 14 L182 8 L200 6" fill="none" stroke="#ffc53d" stroke-width="2"/>
        </svg>
        <div class="ui-api__axis"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span></div>
        <ul class="ui-api__routes">
          <li><code>GET /v2/feed</code><span>200</span></li>
          <li><code>POST /v2/events</code><span>201</span></li>
        </ul>
      </div>`,
    assistant: () => `
      <div class="ui ui--light ui-chat" data-ui>
        <div class="ui-chat__head"><b>Assistant</b><span>Online</span></div>
        <p class="msg msg--user">Can I move my appointment to Friday?</p>
        <p class="msg msg--bot">Sure. Friday has 10:30 or 14:00 free. Which suits you?</p>
        <div class="ui-chat__intent"><span>Intent</span><b>Reschedule</b><span>0.94</span></div>
        <div class="ui-chat__chips"><span>10:30</span><span>14:00</span></div>
      </div>`,
    wave: () => `
      <div class="ui ui--dark ui-wave" data-ui>
        <div class="ui-wave__art" aria-hidden="true">
          ${[38, 64, 48, 82, 56, 70, 42].map((h) => `<i style="height:${h}%"></i>`).join("")}
        </div>
        <div class="ui-wave__meta"><b>Night Drive</b><span>Coastal Lights</span></div>
        <div class="ui-wave__bar"><i style="width:38%"></i></div>
        <div class="ui-wave__time"><span>1:24</span><span>3:41</span></div>
        <div class="ui-wave__controls">${icon.prev}<span class="play">${icon.pause}</span>${icon.next}</div>
      </div>`,
    atmos: () => `
      <div class="ui ui-atmos" data-ui>
        <div class="ui-atmos__place"><b>Colombo</b><span>Thursday</span></div>
        <div class="ui-atmos__now"><b>29°</b><span>Humid, thunderstorms after 16:00</span></div>
        <ul class="ui-atmos__hours">
          <li class="is-now"><span>Now</span><b>29°</b></li><li><span>13</span><b>30°</b></li><li><span>14</span><b>30°</b></li>
          <li><span>15</span><b>28°</b></li><li><span>16</span><b>26°</b></li><li><span>17</span><b>25°</b></li>
        </ul>
        <div class="ui-atmos__meta"><span>Humidity 78%</span><span>Wind 14 km/h</span></div>
      </div>`,
    hanzy: () => `
      <div class="ui ui--dark ui-edit" data-ui>
        <div class="ui-edit__viewer"><span class="ui-edit__card">HANZY</span><span class="ui-edit__tc">00:01:24:12</span></div>
        <div class="ui-edit__tracks">
          <div class="trk"><span>V2</span><i class="c-title" style="left:30%;width:18%"></i></div>
          <div class="trk"><span>V1</span><i style="left:0;width:27%"></i><i style="left:28%;width:34%"></i><i style="left:63%;width:30%"></i></div>
          <div class="trk"><span>A1</span><i class="c-audio" style="left:0;width:92%"></i></div>
          <div class="trk"><span>A2</span><i class="c-audio" style="left:12%;width:40%"></i></div>
          <b class="ui-edit__head" style="left:41%"></b>
        </div>
      </div>`,
  };
  const fragmentFor = (p) =>
    (fragments[p.ui] || (() => `<div class="ui ui-card" data-ui><b>${esc(p.title)}</b></div>`))();
  const groundFor = { nyx: "paper", api: "surface-2", assistant: "amber", carelink: "surface", wave: "surface-2", hanzy: "paper", atmos: "surface" };

  /* ─────────────────────────────────────────────
     3. MASTHEAD
  ───────────────────────────────────────────── */
  const H = SITE.hero;

  $("#heroTitle").innerHTML = H.title
    .map((line, i) => `<span class="line"><span data-line style="--i:${i}">${esc(line)}</span></span>`)
    .join("");
  $("#heroStandfirst").textContent = H.standfirst;
  $("#heroPrimary").textContent = H.primary.label;
  $("#heroPrimary").href = H.primary.href;
  $("#heroSecondary").textContent = H.secondary.label;
  $("#heroSecondary").href = H.secondary.href;
  $("#heroFacts").innerHTML = H.facts
    .map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`)
    .join("");

  const rotator = $("#rotator");
  rotator.classList.add("rotator");
  rotator.innerHTML =
    H.rotating
      .map(
        (img, i) =>
          `<img src="${esc(img.src)}" alt="${esc(img.alt)}" width="1800" height="1200"${i === 0 ? ' class="is-on" fetchpriority="high"' : ' loading="lazy"'} decoding="async">`
      )
      .join("") + `<figcaption class="mosaic__cap" id="rotatorCap"><b>Colombo after dark</b>Where we work</figcaption>`;

  const personCell = (el, m) => {
    if (!m) return;
    el.innerHTML = `
      <img src="${esc(m.photo)}" alt="Portrait of ${esc(m.name)}" width="800" height="1000" style="object-position:${esc(m.position || "50% 30%")}" decoding="async">
      <figcaption class="mosaic__cap"><b>${esc(m.name)}</b>${esc(m.short)}</figcaption>`;
    el.tabIndex = 0;
  };
  personCell($("#cellA"), SITE.team[0]);
  personCell($("#cellB"), SITE.team[1]);

  $("#cellFigure").innerHTML = `
    <span class="mosaic__figure">${esc(H.figure.value)}</span>
    <span class="mosaic__figure-text">${esc(H.figure.text)}</span>`;

  $("#cellCode").innerHTML = `<pre aria-hidden="true"><code><span class="c-cmd">$ git push origin main</span>
build    <span class="c-ok">passed</span>   41s
tests    <span class="c-ok">passed</span>
deploy   carelink v2.4
<span class="c-live">live</span>     aws ap-south-1
<span class="c-cmd">$ </span></code></pre>`;

  $$("#mosaic [data-cell]").forEach((c, i) => c.style.setProperty("--i", i));

  // Signature move: the city slowly changes its light
  const frames = $$("img", rotator);
  if (frames.length > 1 && !reducedMotion) {
    let at = 0;
    setInterval(() => {
      if (document.hidden) return;
      frames[at].classList.remove("is-on");
      at = (at + 1) % frames.length;
      frames[at].classList.add("is-on");
    }, 6200);
  }

  /* ─────────────────────────────────────────────
     4. INTRO
  ───────────────────────────────────────────── */
  const A = SITE.about;
  const introTitle = $("#aboutTitle");
  introTitle.classList.add("lines");
  introTitle.innerHTML = `
    <span class="line l1"><span data-line style="--i:0">${esc(A.title[0])}</span></span>
    <span class="line l2"><span class="ink" data-line style="--i:1">${esc(A.title[1])}</span><span class="on-photo" data-line style="--i:1" aria-hidden="true">${esc(A.title[1])}</span></span>`;
  $("#aboutLead").textContent = A.lead;
  $("#aboutPoints").innerHTML = A.points
    .map((p, i) => `<li data-reveal style="--i:${i + 1}"><b>${esc(p.title)}</b>${esc(p.text)}</li>`)
    .join("");
  const photo = (p, w, h, eager) => `
    <div class="frame"><img src="${esc(p.src)}" alt="${esc(p.alt)}" width="${w}" height="${h}"${eager ? "" : ' loading="lazy"'} decoding="async"></div>
    <figcaption>${esc(p.caption)}</figcaption>`;
  $("#aboutPhoto").innerHTML = photo(A.photo, 1800, 1200);
  $("#aboutPhotoSmall").innerHTML = photo(A.photoSmall, 1100, 1467);

  // The second line of the heading crosses onto the photograph: one copy in ink
  // on the paper, one in paper colour on the picture, cut at the photo's edge.
  const l2 = $(".l2", introTitle);
  const introFrame = $("#aboutPhoto .frame");
  function cutTitle() {
    const cut = introFrame.getBoundingClientRect().left - l2.getBoundingClientRect().left;
    introTitle.style.setProperty("--cut", `${Math.max(0, Math.round(cut))}px`);
  }
  cutTitle();
  window.addEventListener("resize", cutTitle);
  if (document.fonts) document.fonts.ready.then(cutTitle);

  /* ─────────────────────────────────────────────
     5. SERVICES
  ───────────────────────────────────────────── */
  $("#servicesTitle").textContent = SITE.servicesTitle;
  $("#servicesIntro").textContent = SITE.servicesIntro;
  $("#servicesList").innerHTML =
    `<p class="services__intro services__intro--phone">${esc(SITE.servicesIntro)}</p>` +
    SITE.services
      .map((s, i) => {
        const plate = s.plate
          ? `<figure class="service__plate" data-open>
               <div class="frame"><img src="${esc(s.plate.src)}" alt="${esc(s.plate.alt)}" width="800" height="1067" loading="lazy" decoding="async" style="object-position:${esc(s.plate.position || "50% 50%")}"></div>
               <figcaption>${esc(s.plate.caption)}</figcaption>
             </figure>`
          : "";
        return `
        <article class="service" id="practice-${i}">
          <div class="service__row">
            ${plate}
            <div class="service__text">
              <h3 data-reveal>${esc(s.title)}</h3>
              <p class="service__lead" data-reveal style="--i:1">Led by ${esc(ledBy(s.lead))}</p>
              <ul class="service__items">${s.items.map((t, i) => `<li data-reveal style="--i:${i + 2}">${esc(t)}</li>`).join("")}</ul>
            </div>
          </div>
        </article>`;
      })
      .join("");

  // The pinned column lists the practices and follows the one being read
  const practiceLinks = SITE.services.map((s, i) => `<a href="#practice-${i}" data-practice="${i}">${esc(s.title)}</a>`);
  $("#servicesIndex").innerHTML = practiceLinks.join("");
  const indexLinks = $$("#servicesIndex a");
  const practiceIo = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const at = e.target.id.replace("practice-", "");
        indexLinks.forEach((a) => a.classList.toggle("is-current", a.dataset.practice === at));
      }
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  $$(".service").forEach((el) => practiceIo.observe(el));
  indexLinks[0] && indexLinks[0].classList.add("is-current");

  /* ─────────────────────────────────────────────
     5b. CREATOR MODE doorway (content lives in js/creator-data.js)
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
    const facts = prices.length
      ? [{ label: "From", value: `LKR ${new Intl.NumberFormat("en-US").format(Math.min(...prices))} a month` }]
      : [];
    facts.push(...(cb.facts || []));
    $("#creatorFacts").innerHTML = facts
      .map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`)
      .join("");
    const sentence = (w) => w.charAt(0) + w.slice(1).toLowerCase();
    $("#creatorStrip").innerHTML = ((CREATOR.photos && CREATOR.photos.strip) || [])
      .slice(0, 3)
      .map(
        (p, i) => `
        <figure class="creator__frame" data-open style="--i:${i}">
          <div class="frame"><img src="${esc(p.src.replace(/^\.\.\//, ""))}" alt="${esc(p.alt)}" width="600" height="750" loading="lazy" decoding="async"></div>
          <figcaption>${esc(sentence(p.label || ""))}</figcaption>
        </figure>`
      )
      .join("");
  } else if (creatorBand) {
    creatorBand.remove();
  }

  /* ─────────────────────────────────────────────
     6. WORK + PROJECT SHEET
  ───────────────────────────────────────────── */
  // Seven slots: flagship and title on top, a full middle row, a staggered last row
  const shapes = ["wide", "tall", "tall", "wide", "tall", "tall", "wide"];
  const workGrid = $("#workGrid");
  const words = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
  const count = words[SITE.projects.length] || SITE.projects.length;
  $("#workTitle").innerHTML =
    SITE.workTitle.map((w) => `<span style="display:block">${esc(w)}</span>`).join("") +
    `<p class="work__count">${count} recent projects. Open one for the details.</p>`;

  let talls = 0;
  workGrid.insertAdjacentHTML(
    "beforeend",
    SITE.projects
      .map((p, i) => {
        const shape = shapes[i % shapes.length];
        const side = shape === "tall" ? (talls++ % 2 ? "is-right" : "is-left") : "";
        return `
        <button class="tile tile--${shape} ${side}" type="button" data-project="${i}" data-ground="${groundFor[p.ui] || "surface"}" data-reveal style="--i:${i % 2}" aria-haspopup="dialog">
          <span class="tile__art">${fragmentFor(p)}<span class="tile__more" aria-hidden="true">View project</span></span>
          <span class="tile__cap"><span class="tile__name">${esc(p.title)}</span><span class="tile__cat">${esc(p.category)}</span></span>
        </button>`;
      })
      .join("")
  );

  const sheet = $("#projectSheet");
  let lastTile = null;
  workGrid.addEventListener("click", (e) => {
    const tile = e.target.closest(".tile");
    if (!tile) return;
    const p = SITE.projects[+tile.dataset.project];
    lastTile = tile;
    const art = $("#sheetArt");
    art.innerHTML = fragmentFor(p);
    art.dataset.ground = groundFor[p.ui] || "surface";
    $("#sheetCat").textContent = p.category;
    $("#sheetTitle").textContent = p.title;
    $("#sheetBody").textContent = p.text;
    $("#sheetFacts").innerHTML = `
      <dt>Stack</dt><dd>${esc(p.stack.join(", "))}</dd>
      <dt>Led by</dt><dd>${esc(people[p.lead] ? people[p.lead].name : ledBy(p.lead))}</dd>`;
    const open = $("#sheetLink");
    open.hidden = !p.link;
    if (p.link) {
      open.href = p.link;
      open.textContent = p.linkLabel || `Open ${p.title}`;
    }
    if (typeof sheet.showModal === "function") sheet.showModal();
    else sheet.setAttribute("open", "");
  });
  const closeSheet = () => {
    if (sheet.open) sheet.close();
  };
  $("#sheetClose").addEventListener("click", closeSheet);
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet) closeSheet();          // click on the backdrop
  });
  sheet.addEventListener("close", () => lastTile && lastTile.focus({ preventScroll: true }));
  $("#sheetCta").addEventListener("click", () => {
    lastTile = null;
    closeSheet();
  });

  /* ─────────────────────────────────────────────
     7. PROCESS: the mark's equaliser bars, from scattered to ordered
  ───────────────────────────────────────────── */
  $("#processTitle").innerHTML = SITE.processTitle.map((w) => `<span style="display:block">${esc(w)}</span>`).join("");
  $("#processIntro").textContent = SITE.processIntro;
  $("#processSteps").innerHTML = SITE.process
    .map((s, i) => `<li data-reveal style="--i:${i}"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`)
    .join("");

  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function drawProcess() {
    const svg = $("#processSvg");
    const vertical = window.matchMedia("(max-width: 700px)").matches;
    const mode = vertical ? "v" : "h";
    if (svg.dataset.mode === mode) return;
    svg.dataset.mode = mode;

    const r = rng(1434);
    const bars = [];
    const add = (x, y, w, h, cls, order) => bars.push({ x, y, w, h, cls, order });

    if (!vertical) {
      const W = 1350, Hh = 300, Z = W / 4, bw = 11;
      svg.setAttribute("viewBox", `0 0 ${W} ${Hh}`);
      for (let i = 0; i < 42; i++) {                     // discover: loose and scattered
        const h = 10 + r() * 30;
        add(8 + r() * (Z - 40), 16 + r() * (Hh - 60), bw, h, r() < 0.7 ? "b-pale" : "b-mid", 0);
      }
      for (let i = 0; i < 40; i++) {                     // design: gathering toward the line
        const t = i / 39, spread = 110 * (1 - t) + 18;
        const h = 18 + r() * 26;
        add(Z + 6 + t * (Z - 26) + (r() - 0.5) * 8, Hh / 2 - h / 2 + (r() - 0.5) * spread * 2, bw, h, "b-mid", 1);
      }
      const step3 = bw + 2, n3 = Math.floor((Z - 24) / step3);
      for (let i = 0; i < n3; i++) add(2 * Z + 10 + i * step3, Hh / 2 - 33, bw, 66, "b-ink", 2);   // build: one tight band
      const n4 = 24, gap4 = (Z - 20 - n4 * bw) / (n4 - 1);
      for (let i = 0; i < n4; i++) {                     // launch and grow: ordered, rising
        const h = 34 + i * 8.2 + Math.sin(i * 1.3) * 10;
        add(3 * Z + 14 + i * (bw + gap4), Hh - 24 - h, bw, h, "b-amber", 3);
      }
    } else {
      const W = 300, Hh = 880, Z = Hh / 4, bw = 9;
      svg.setAttribute("viewBox", `0 0 ${W} ${Hh}`);
      for (let i = 0; i < 34; i++) add(6 + r() * (W - 20), 10 + r() * (Z - 50), bw, 10 + r() * 26, r() < 0.7 ? "b-pale" : "b-mid", 0);
      for (let i = 0; i < 30; i++) {
        const t = i / 29, spread = 120 * (1 - t) + 20;
        add(W / 2 + (r() - 0.5) * spread * 2, Z + 10 + t * (Z - 60), bw, 16 + r() * 22, "b-mid", 1);
      }
      for (let i = 0; i < 12; i++) add(W / 2 - 78 + i * 13, 2 * Z + 30, bw, Z - 70, "b-ink", 2);
      for (let i = 0; i < 16; i++) {
        const h = 30 + i * 8 + Math.sin(i * 1.3) * 8;
        add(12 + i * 17.6, Hh - 16 - h, bw, h, "b-amber", 3);
      }
    }

    svg.querySelectorAll("rect").forEach((n) => n.remove());
    const span = vertical ? 880 : 1350;
    const frag = bars
      .map((b, i) => {
        const pos = vertical ? b.y : b.x;
        const d = Math.round((pos / span) * 420);
        const tx = b.order ? -Math.round(30 + r() * 90) : 0;
        const ty = Math.round((r() - 0.5) * (b.order ? 90 : 30));
        const vx = vertical ? ty : tx, vy = vertical ? tx : ty;
        return `<rect class="${b.cls}" x="${b.x.toFixed(1)}" y="${b.y.toFixed(1)}" width="${b.w}" height="${b.h.toFixed(1)}" style="--tx:${vx}px;--ty:${vy}px;--d:${d}ms;--p:${(i % 7) * 160}ms"/>`;
      })
      .join("");
    svg.insertAdjacentHTML("beforeend", frag);
  }
  drawProcess();
  window.addEventListener("resize", drawProcess);

  /* ─────────────────────────────────────────────
     8. TEAM
  ───────────────────────────────────────────── */
  $("#teamTitle").textContent = SITE.teamTitle;
  $("#teamIntro").textContent = SITE.teamIntro;
  $("#teamPeople").innerHTML = SITE.team
    .map((m) => {
      const links = [];
      if (m.links.email) links.push(`<a class="link" href="mailto:${esc(m.links.email)}">Email</a>`);
      if (m.links.github) links.push(`<a class="link" href="${esc(m.links.github)}" target="_blank" rel="noopener">GitHub</a>`);
      if (m.links.linkedin) links.push(`<a class="link" href="${esc(m.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
      return `
      <article class="person">
        <figure class="person__photo" data-open>
          <div class="frame person__frame"><img src="${esc(m.photo)}" alt="Portrait of ${esc(m.name)}" width="800" height="1000" loading="lazy" decoding="async" style="object-position:${esc(m.position || "50% 30%")}"></div>
        </figure>
        <div class="person__text">
          <h3 class="person__name" data-reveal>${esc(m.name)}</h3>
          <p class="person__role" data-reveal style="--i:1">${esc(m.role)}</p>
          <p class="person__bio" data-reveal style="--i:2">${esc(m.bio)}</p>
          <p class="person__skills" data-reveal style="--i:3">${esc(m.skills.join(", "))}</p>
          <p class="person__links" data-reveal style="--i:4">${links.join("")}</p>
        </div>
      </article>`;
    })
    .join("");

  /* ─────────────────────────────────────────────
     9. TESTIMONIALS
  ───────────────────────────────────────────── */
  $("#voicesTitle").textContent = SITE.testimonialsTitle;
  const quoteEl = $("#voicesQuote");
  const namesEl = $("#voicesNames");
  namesEl.innerHTML = SITE.testimonials
    .map(
      (t, i) =>
        `<button class="voice-name" type="button" data-i="${i}" aria-pressed="${i === 0}"><b>${esc(t.name)}</b><span>${esc(t.role)}</span></button>`
    )
    .join("");
  const setQuote = (i) => `“${SITE.testimonials[i].quote}”`;
  quoteEl.textContent = setQuote(0);
  let quoteAt = 0;
  namesEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".voice-name");
    if (!btn || +btn.dataset.i === quoteAt) return;
    quoteAt = +btn.dataset.i;
    $$(".voice-name", namesEl).forEach((b) => b.setAttribute("aria-pressed", b === btn));
    if (reducedMotion) return void (quoteEl.textContent = setQuote(quoteAt));
    quoteEl.classList.add("is-out");
    setTimeout(() => {
      quoteEl.textContent = setQuote(quoteAt);
      quoteEl.classList.remove("is-out");
    }, 240);
  });

  /* ─────────────────────────────────────────────
     10. CONTACT: the brief builder
  ───────────────────────────────────────────── */
  const C = SITE.contact;
  $("#contactTitle").textContent = C.title;
  $("#contactSentence").textContent = C.sentence;
  $("#contactNote").textContent = `${C.note} ${B.location}, ${B.timezone}.`;

  $("#briefNeeds").innerHTML = SITE.services
    .map(
      (s, i) =>
        `<label class="chip"><input type="checkbox" name="need" value="${esc(s.title)}" data-lead="${esc(s.lead)}" id="need${i}"><span>${esc(s.title)}</span></label>`
    )
    .join("");
  $("#briefWhen").innerHTML = C.timelines
    .map(
      (t, i) =>
        `<label class="chip"><input type="radio" name="when" value="${esc(t)}" id="when${i}"><span>${esc(t)}</span></label>`
    )
    .join("");
  $("#briefWho").innerHTML = SITE.team
    .map(
      (m) => `
      <div class="who" data-person="${esc(m.id)}">
        <img src="${esc(m.photo)}" alt="" width="88" height="88" loading="lazy" style="object-position:${esc(m.position || "50% 30%")}">
        <div><b>${esc(m.name)}</b><span>${esc(m.short)}</span></div>
      </div>`
    )
    .join("");

  const brief = $("#brief");
  const listWords = (arr) =>
    arr.length < 2 ? arr.join("") : `${arr.slice(0, -1).join(", ")} and ${arr[arr.length - 1]}`;

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
     11. FOOTER
  ───────────────────────────────────────────── */
  const tel = B.phone.replace(/\s/g, "");
  $("#footerNote").textContent = SITE.footer.note;
  $("#footerReach").textContent = `${B.location}, ${B.reach.toLowerCase()}.`;
  $("#menuReach").textContent = `${B.location}, ${B.reach.toLowerCase()}.`;
  $("#footerPhone").textContent = B.phone;
  $("#footerPhone").href = `tel:${tel}`;
  const elsewhere = [`<a class="link" href="mailto:${esc(B.email)}">${esc(B.email)}</a>`, `<a class="link" href="https://wa.me/${esc(B.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`];
  if (typeof CREATOR !== "undefined") elsewhere.push(`<a class="link" href="creator/">Creator Mode</a>`);
  SITE.team.forEach((m) => {
    if (m.links.github) elsewhere.push(`<a class="link" href="${esc(m.links.github)}" target="_blank" rel="noopener">GitHub</a>`);
    if (m.links.linkedin) elsewhere.push(`<a class="link" href="${esc(m.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
  });
  $("#footerLinks").innerHTML = elsewhere.join("");
  $("#footerCredits").innerHTML = SITE.credits
    .map(
      (c) =>
        `<li><a href="${esc(c.page)}" target="_blank" rel="noopener">${esc(c.title)}</a>, ${esc(c.creator)}, <a href="${esc(c.licenseUrl)}" target="_blank" rel="noopener">${esc(c.license)}</a></li>`
    )
    .join("");
  $("#footerCopy").textContent = `© ${SITE.footer.year} ${B.name}. ${SITE.footer.credit}.`;

  /* ─────────────────────────────────────────────
     12. HEADER: colour by chapter, current link, menu
  ───────────────────────────────────────────── */
  const bar = $("#bar");
  const chapters = $$("main > section, footer.close");
  const barLinks = $$(".bar__link");
  let ticking = false;
  function onScroll() {
    ticking = false;
    const line = bar.offsetHeight + 2;           // just under the bar, where a nav jump lands a section
    let theme = "dark", current = "";
    for (const s of chapters) {
      const r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) {
        theme = s.dataset.theme || "dark";
        current = s.id;
        break;
      }
    }
    bar.dataset.theme = theme;
    barLinks.forEach((l) => l.classList.toggle("is-current", l.getAttribute("href") === `#${current}`));
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  const menu = $("#menu");
  const menuButton = $("#menuButton");
  $$(".menu__nav a", menu).forEach((a, i) => a.style.setProperty("--i", i));
  function setMenu(open) {
    menu.hidden = !open;
    menu.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", open);
    menuButton.textContent = open ? "Close" : "Menu";
    document.body.style.overflow = open ? "hidden" : "";
    if (open) bar.dataset.theme = "dark";
    else onScroll();
  }
  menuButton.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) setMenu(false); });

  /* ─────────────────────────────────────────────
     13. ENTRANCES (once, as each part enters)
  ───────────────────────────────────────────── */
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
        if (e.target.id === "processSvg") setTimeout(() => e.target.classList.add("is-live"), 1600);
      }
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0 }
  );
  $$("[data-reveal], [data-open], #processSvg").forEach((el) => io.observe(el));

  // The intro heading and its photograph arrive together, so the cut always lines up
  const introIo = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    introTitle.classList.add("is-in");
    introIo.disconnect();
  }, { rootMargin: "0px 0px -15% 0px" });
  introIo.observe(introTitle);
})();
