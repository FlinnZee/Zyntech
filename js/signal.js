/* ============================================================
   ZynTECH: Signal (the 3D homepage)
   Renders the page from js/data.js, then runs one cloud of
   points behind it that becomes each section as you scroll:
   the wordmark, a living waveform, nine service objects, the
   dust around a ring of project screens, a helix, the founders'
   portraits, a camera lens you fly through, a quote mark, an
   orb, and the wordmark again.
   Any element with data-shape="name" marks where a shape takes
   over. You normally don't need to edit this file. Edit data.js.
   ============================================================ */

import * as THREE from "three";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const has3d = root.classList.contains("has-3d");
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = (n) => String(n).padStart(2, "0");
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const up = (src) => (/^(https?:)?\/\//.test(src) || src.startsWith("../") ? src : `../${src}`);

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

/* ════════════════════════════════════════════════════════════
   PART 1: THE PAGE (text, controls, the brief builder)
   ════════════════════════════════════════════════════════════ */

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

function splitHeading(el, lines) {
  if (!el) return;
  let i = 0;
  el.innerHTML = lines
    .map((line) => `<span class="br">${line.split(" ").map((w) => `<span class="wm"><span style="--i:${i++}">${esc(w)}</span></span>`).join(" ")}</span>`)
    .join("");
  el.setAttribute("aria-label", lines.join(" "));
}

/* the drawn interfaces shown in the project sheet for work without a screenshot */
const fragments = {
  api: () => `
    <div class="ui ui-panel" data-ui>
      <div class="ui-row"><b>api / production</b><span class="ui-live">Live</span></div>
      <div class="ui-api__stats"><div><span>Concurrent users</span><b>500K+</b></div><div><span>p95 response</span><b>&lt; 1 s</b></div></div>
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
const mediaFor = (p) =>
  p.image
    ? `<img src="${esc(up(p.image))}" alt="${esc(p.title)}, screenshot" width="1600" height="1000" decoding="async">`
    : (fragments[p.ui] || (() => `<div class="ui ui-card" data-ui><b>${esc(p.title)}</b></div>`))();

/* ── hero ── */
const H = SITE.hero;
$("#heroEyebrow").textContent = `${B.descriptor}, ${B.location}`;
$("#heroTitle").innerHTML = H.title.map((l, i) => `<span class="line"><span style="--i:${i}">${esc(l)}</span></span>`).join("");
$("#heroSub").textContent = H.sub;
$("#heroPrimary").textContent = H.primary.label;
$("#heroPrimary").href = H.primary.href;
$("#heroSecondary").textContent = H.secondary.label;
$("#heroSecondary").href = H.secondary.href;
$("#heroHint").textContent = !has3d ? H.notes[0] : fine ? "Move the cursor through the signal. Scroll to change its shape." : "Touch the signal. Scroll to change its shape.";

/* ── manifesto + numbers ── */
const manifesto = $("#manifesto");
manifesto.innerHTML = SITE.manifesto.split(" ").map((w) => `<span class="w">${esc(w)}</span>`).join(" ");
const manifestoWords = $$(".w", manifesto);
$("#stats").innerHTML = SITE.stats
  .map((s, i) => `<li data-reveal style="--i:${i}"><b data-count="${s.value}" data-suffix="${esc(s.suffix)}">${s.value}${esc(s.suffix)}</b><span>${esc(s.label)}</span></li>`)
  .join("");

/* ── services ── */
splitHeading($("#servicesTitle"), [SITE.servicesTitle]);
$("#servicesIntro").textContent = SITE.servicesIntro;
const svcList = $("#servicesList");
svcList.innerHTML = SITE.services
  .map(
    (s, i) => `
    <li data-i="${i}">
      <button class="svc__row" type="button" aria-expanded="false" aria-controls="svc-${i}">
        <span class="svc__n">${pad(i + 1)}</span><span class="svc__t">${esc(s.title)}</span><span class="svc__g">${esc(s.group)}</span>
      </button>
      <div class="svc__panel" id="svc-${i}" role="region" aria-label="${esc(s.title)}"><div>
        <p>${esc(s.text)} Led by ${esc(ledBy(s.lead))}.</p>
        <ul>${s.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </div></div>
    </li>`
  )
  .join("");
let svcHot = -1, svcOpen = -1;
const paintSvc = () => $$("li[data-i]", svcList).forEach((li) => li.classList.toggle("is-hot", +li.dataset.i === svcHot));
svcList.addEventListener("click", (e) => {
  const row = e.target.closest(".svc__row");
  if (!row) return;
  const li = row.parentElement, i = +li.dataset.i, open = svcOpen !== i;
  $$("li.is-open", svcList).forEach((o) => { o.classList.remove("is-open"); $(".svc__row", o).setAttribute("aria-expanded", "false"); });
  li.classList.toggle("is-open", open);
  row.setAttribute("aria-expanded", String(open));
  svcOpen = open ? i : -1;
  setTimeout(measure, 560);
});
svcList.addEventListener("pointerover", (e) => {
  const li = e.target.closest("li[data-i]");
  if (li && e.pointerType === "mouse") { svcHot = +li.dataset.i; paintSvc(); }
});
svcList.addEventListener("pointerleave", () => { svcHot = -1; paintSvc(); });
svcList.addEventListener("focusin", (e) => { const li = e.target.closest("li[data-i]"); if (li) { svcHot = +li.dataset.i; paintSvc(); } });
svcList.addEventListener("focusout", () => { svcHot = -1; paintSvc(); });

/* ── work ── */
const P = SITE.projects;
$("#workTitle").textContent = SITE.workTitle.join(" ");
$("#workTotal").textContent = pad(P.length);
$("#work").style.setProperty("--work-h", `${P.length * 62 + 100}vh`);
$("#workList").innerHTML = P.map((p, i) => `<li><button type="button" data-go="${i}">${esc(p.title)}</button></li>`).join("");
$("#workStage").insertAdjacentHTML(
  "beforeend",
  `<div class="flat-work">${P.map((p, i) => `<button type="button" data-project="${i}"><b>${esc(p.title)}</b><span>${esc(p.category)}</span></button>`).join("")}</div>`
);
let workAt = -1;
function showWork(i) {
  if (i === workAt) return;
  workAt = i;
  const p = P[i];
  $("#workAt").textContent = pad(i + 1);
  const name = $("#workName"), cat = $("#workCat");
  name.textContent = p.title;
  cat.textContent = `${p.category}. ${p.stack.join(", ")}`;
  [name, cat].forEach((el) => { el.classList.remove("sx-work__swap"); void el.offsetWidth; el.classList.add("sx-work__swap"); });
  $$("#workList button").forEach((b) => b.classList.toggle("is-on", +b.dataset.go === i));
}
showWork(0);
$("#workOpen").addEventListener("click", () => openProject(workAt));
$("#workStage").addEventListener("click", (e) => {
  const flat = e.target.closest("[data-project]");
  if (flat) openProject(+flat.dataset.project);
  const go = e.target.closest("[data-go]");
  if (go) scrollToWork(+go.dataset.go);
});

/* project sheet */
const sheet = $("#projectSheet");
let lastFocus = null;
$("#sheetClose").innerHTML = ICON.close;
function openProject(i) {
  const p = P[i];
  if (!p) return;
  lastFocus = document.activeElement;
  const media = $("#sheetMedia");
  media.className = `sheet__media${p.image ? " sheet__media--image" : ""}`;
  media.innerHTML = mediaFor(p);
  $("#sheetCat").textContent = p.category;
  $("#sheetTitle").textContent = p.title;
  $("#sheetBody").textContent = p.text;
  $("#sheetFacts").innerHTML = `
    <div><dt>Stack</dt><dd>${esc(p.stack.join(", "))}</dd></div>
    <div><dt>Led by</dt><dd>${esc(people[p.lead] ? people[p.lead].name : ledBy(p.lead))}</dd></div>`;
  const open = $("#sheetLink");
  open.hidden = !p.link;
  if (p.link) { open.href = p.link; open.textContent = p.linkLabel || `Open ${p.title}`; }
  if (typeof sheet.showModal === "function") sheet.showModal();
  else sheet.setAttribute("open", "");
  lenis && lenis.stop();
}
const closeSheet = () => sheet.open && sheet.close();
$("#sheetClose").addEventListener("click", closeSheet);
sheet.addEventListener("click", (e) => { if (e.target === sheet) closeSheet(); });
sheet.addEventListener("close", () => { lenis && lenis.start(); if (lastFocus) lastFocus.focus({ preventScroll: true }); });
$("#sheetCta").addEventListener("click", () => { lastFocus = null; closeSheet(); });

/* ── process ── */
splitHeading($("#processTitle"), [SITE.processTitle]);
$("#processIntro").textContent = SITE.processIntro;
$("#steps").innerHTML = SITE.process
  .map(
    (s, i) => `
    <li class="step" data-reveal>
      <span class="step__n" aria-hidden="true">${pad(i + 1)}</span>
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.text)}</p>
      <ul>${s.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    </li>`
  )
  .join("");

/* ── founders: each one gets a block, and the cloud draws their portrait ── */
splitHeading($("#teamTitle"), [SITE.teamTitle]);
$("#teamIntro").textContent = SITE.teamIntro;
$("#founders").innerHTML = SITE.team
  .map((m, i) => {
    const links = [];
    if (m.links.email) links.push(`<a class="arrow-link" href="mailto:${esc(m.links.email)}">Email</a>`);
    if (m.links.github) links.push(`<a class="arrow-link" href="${esc(m.links.github)}" target="_blank" rel="noopener">GitHub</a>`);
    if (m.links.linkedin) links.push(`<a class="arrow-link" href="${esc(m.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
    return `
    <article class="founder" data-shape="face-${i}" aria-label="${esc(m.name)}">
      <div class="founder__card" data-reveal>
        <img class="founder__photo" src="${esc(up(m.photo))}" alt="Portrait of ${esc(m.name)}" width="900" height="1100" loading="lazy" decoding="async" style="object-position:${esc(m.position || "50% 30%")}">
        <p class="founder__role">${esc(m.role)}</p>
        <h3 class="founder__name">${esc(m.name)}</h3>
        <p class="founder__bio">${esc(m.bio)}</p>
        <ul class="founder__skills">${m.skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        <p class="founder__links">${links.join("")}</p>
      </div>
    </article>`;
  })
  .join("");
$(".sx-team__head").dataset.shape = "face-0";

/* ── creator mode ── */
const hasCreator = typeof CREATOR !== "undefined" && CREATOR.homeBand;
if (hasCreator) {
  const cb = CREATOR.homeBand;
  $("#creatorTitle").textContent = cb.title;
  $("#creatorText").textContent = cb.text;
  $("#creatorLink").textContent = cb.link;
  const prices = ((CREATOR.packages && CREATOR.packages.tracks) || []).flatMap((t) => t.tiers.map((x) => x.price)).filter((n) => typeof n === "number");
  const facts = prices.length ? [{ label: "From", value: `LKR ${new Intl.NumberFormat("en-US").format(Math.min(...prices))} a month` }] : [];
  facts.push(...(cb.facts || []));
  $("#creatorFacts").innerHTML = facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("");
} else {
  $("#creator-mode").remove();
}

/* ── testimonials ── */
$("#voicesTitle").textContent = SITE.testimonialsTitle;
$("#voicesTotal").textContent = SITE.testimonials.length;
$("#voicesPrev").innerHTML = ICON.prev;
$("#voicesNext").innerHTML = ICON.next;
const quote = $("#voicesQuote"), who = $("#voicesWho");
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
  signalKick(0.8);
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
let dragX = null;
$("#voicesStage").addEventListener("pointerdown", (e) => (dragX = e.clientX));
$("#voicesStage").addEventListener("pointerup", (e) => {
  if (dragX == null) return;
  const dx = e.clientX - dragX;
  if (Math.abs(dx) > 50) goQuote(dx < 0 ? 1 : -1);
  dragX = null;
});
$("#clients").addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") goQuote(1);
  if (e.key === "ArrowLeft") goQuote(-1);
});

/* ── contact: the brief builder ── */
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
      <img src="${esc(up(m.photo))}" alt="" width="64" height="64" loading="lazy" style="object-position:${esc(m.position || "50% 30%")}">
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
    `Hi ${listWords(answerers)},`, "",
    `What we need: ${needNames.length ? listWords(needNames) : "not sure yet"}`,
    `Launch: ${when ? when.value : "not sure yet"}`, "",
    message || "(A few lines about the project.)",
  ];
  const subject = `[${B.name}] Project brief${needNames.length ? `: ${needNames.join(", ")}` : ""}`;
  $("#briefEmail").href = `mailto:${B.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  $("#briefWhatsapp").href = `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}
brief.addEventListener("change", () => { updateBrief(); signalKick(1); });
brief.addEventListener("input", updateBrief);
brief.addEventListener("submit", (e) => e.preventDefault());
updateBrief();

/* ── footer ── */
$("#footLine").innerHTML = SITE.footer.line.map((l) => `<span>${esc(l)}</span>`).join("");
$("#footEmail").textContent = B.email;
$("#footEmail").href = `mailto:${B.email}`;
const elsewhere = [`<a href="https://wa.me/${esc(B.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`, `<a href="tel:${esc(tel)}">${esc(B.phone)}</a>`];
SITE.team.forEach((m) => {
  if (m.links.github) elsewhere.push(`<a href="${esc(m.links.github)}" target="_blank" rel="noopener">GitHub</a>`);
  if (m.links.linkedin) elsewhere.push(`<a href="${esc(m.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
});
$("#footElsewhere").insertAdjacentHTML("beforeend", elsewhere.join(""));
$("#footStudio").insertAdjacentHTML("beforeend", `<p>${esc(B.descriptor)}</p><p>${esc(B.location)}, ${esc(B.timezone)}</p><p>${esc(B.reach)}</p><p><a href="../">The classic site</a></p>`);
$("#footCopy").textContent = `© ${SITE.footer.year} ${B.name}. All rights reserved.`;
$("#footCredit").textContent = SITE.footer.credit;
$("#menuReach").textContent = `${B.location}, ${B.reach.toLowerCase()}.`;

/* ── smooth scroll + anchors ── */
let lenis = null;
if (!reduced && fine && window.Lenis) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
  root.classList.add("lenis");
}
const scrollToY = (y) => (lenis ? lenis.scrollTo(y, { duration: 1.6 }) : window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" }));
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href");
  if (id.length < 2) return;
  const target = document.querySelector(id);
  if (!target) return;
  e.preventDefault();
  scrollToY(target.getBoundingClientRect().top + window.scrollY - (id === "#top" ? 0 : 0));
  history.replaceState(null, "", id);
});

/* ── header, menu, scramble ── */
const nav = $("#nav");
const navLinks = $$(".nav__links a[href^='#']");
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

/* ── cursor + magnetic buttons ── */
const cur = $("#cursor"), curLabel = $("#cursorLabel");
let canvasLabel = "";
if (fine && !reduced) {
  root.classList.add("has-cursor");
  cur.classList.add("is-hidden");
  window.addEventListener("pointermove", (e) => {
    cur.classList.remove("is-hidden");
    cur.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  }, { passive: true });
  document.addEventListener("pointerover", (e) => {
    const lab = e.target.closest("[data-cursor]");
    const link = e.target.closest("a, button, label, [role='button']");
    cur.classList.toggle("is-label", !!lab);
    cur.classList.toggle("is-link", !lab && !!link);
    curLabel.textContent = lab ? lab.dataset.cursor : "";
  });
  document.addEventListener("pointerleave", () => cur.classList.add("is-hidden"));
  document.addEventListener("pointerenter", () => cur.classList.remove("is-hidden"));
  $$("[data-magnetic]").forEach((el) => {
    el.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), color 320ms ease";
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.28}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });
}
function setCanvasLabel(text) {
  if (text === canvasLabel || !fine) return;
  canvasLabel = text;
  cur.classList.toggle("is-label", !!text);
  curLabel.textContent = text;
}

/* ── entrances + counters ── */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
}, { rootMargin: "0px 0px -8% 0px" });
$$("[data-reveal], [data-split]").forEach((el) => io.observe(el));
const countIo = new IntersectionObserver((entries) => {
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
}, { threshold: 0.6 });
$$("[data-count]").forEach((el) => countIo.observe(el));

/* ── the section rail ── */
const rail = $("#rail");
const railItems = $$("[data-name]");
rail.innerHTML = railItems.map((el, i) => `<a href="#" data-rail="${i}"><span>${esc(el.dataset.name)}</span><i></i></a>`).join("");
rail.addEventListener("click", (e) => {
  const a = e.target.closest("[data-rail]");
  if (!a) return;
  e.preventDefault();
  const el = railItems[+a.dataset.rail];
  scrollToY(el.getBoundingClientRect().top + window.scrollY);
});

/* ════════════════════════════════════════════════════════════
   PART 2: SCROLL BOOKKEEPING (shared by the page and the 3D)
   ════════════════════════════════════════════════════════════ */

let vw = innerWidth, vh = innerHeight;
let marks = [];                 // every [data-shape] element, in page order
let railTops = [];
const slots = {};
const sec = {};                 // cached boxes of the sections the page reads
function box(el) {
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, h: r.height };
}
function measure() {
  vw = innerWidth; vh = innerHeight;
  marks = $$("[data-shape]").map((el) => ({ el, name: el.dataset.shape, light: !!el.closest(".tone-light"), ...box(el) }));
  ["about", "work", "creator-mode", "process", "clients", "services", "team", "contact"].forEach((id) => { const el = document.getElementById(id); if (el) sec[id] = box(el); });
  railTops = railItems.map((el) => box(el).top);
  ["orbSlot", "footSpace"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const r = el.getBoundingClientRect();
    slots[id] = { top: r.top + window.scrollY, left: r.left, w: r.width, h: r.height };
  });
}
measure();
if (document.fonts) document.fonts.ready.then(measure);
window.addEventListener("load", measure);
let mt = 0;
new ResizeObserver(() => { clearTimeout(mt); mt = setTimeout(measure, 120); }).observe(document.body);

const pinProgress = (b, y) => (b ? clamp((y - b.top) / Math.max(1, b.h - vh)) : 0);

function scrollToWork(i) {
  const b = sec.work;
  if (!b) return;
  scrollToY(b.top + (i / Math.max(1, P.length - 1)) * (b.h - vh) + 2);
}

/* where the cloud is between two shapes: pair (a, b) and t */
function scrollState(y) {
  for (let k = marks.length - 1; k >= 1; k--) {
    const start = marks[k].top - vh;
    if (y >= start) {
      const t = (y - start) / (vh * 0.65);
      return t < 1 ? { a: k - 1, b: k, t } : { a: k, b: k, t: 0 };
    }
  }
  return { a: 0, b: 0, t: 0 };
}

let lastY = window.scrollY, railOn = -1;
const railLinks = $$("a", rail);
const creatorStage = $(".sx-creator__stage");
function pageTick(y) {
  // header
  nav.classList.toggle("is-hidden", y > lastY + 1 && y > 240 && menu.hidden);
  if (Math.abs(y - lastY) > 1) lastY = y;
  let current = "";
  for (const id of ["services", "work", "team", "contact"]) {
    const b = sec[id];
    if (b && b.top - y <= vh * 0.35 && b.top + b.h - y > vh * 0.35) current = id;
  }
  navLinks.forEach((l) => l.classList.toggle("is-current", l.getAttribute("href") === `#${current}`));

  // manifesto fills in as it is read
  if (has3d && sec.about) {
    const p = clamp((y - sec.about.top + vh * 0.75) / (sec.about.h * 0.55));
    const lit = Math.round(p * manifestoWords.length);
    manifestoWords.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
  }
  // work: which project is in front
  if (has3d && sec.work) showWork(Math.round(pinProgress(sec.work, y) * (P.length - 1)));
  // creator: the copy hands over to the doorway as you pass through the lens
  if (has3d && sec["creator-mode"]) {
    const p = pinProgress(sec["creator-mode"], y);
    const st = creatorStage;
    st.style.setProperty("--pa", (1 - smooth(0.18, 0.4, p)).toFixed(3));
    const pb = smooth(0.6, 0.8, p);
    st.style.setProperty("--pb", pb.toFixed(3));
    $("#creatorB").classList.toggle("is-on", pb > 0.5);
  }
  // rail
  let on = 0;
  railTops.forEach((top, i) => { if (top - y <= vh * 0.5) on = i; });
  if (on !== railOn) { railOn = on; railLinks.forEach((a, i) => a.classList.toggle("is-on", i === on)); }
}

/* ════════════════════════════════════════════════════════════
   PART 3: THE SIGNAL (Three.js)
   ════════════════════════════════════════════════════════════ */

let kick = 0;
function signalKick(v) { kick = Math.max(kick, v); }

const loaderBar = $("#loaderBar");
const doneLoading = () => root.classList.remove("is-loading");
setTimeout(doneLoading, 6000);                 // never hold the page hostage

function plainLoop() {
  doneLoading();
  (function tick(now) {
    requestAnimationFrame(tick);
    if (lenis) lenis.raf(now || performance.now());
    pageTick(window.scrollY);
  })();
}
if (!has3d) plainLoop();
else {
  try {
    startSignal();
  } catch (err) {
    console.error(err);
    root.classList.remove("has-3d");
    measure();
    plainLoop();
  }
}

function startSignal() {
  const canvas = $("#stage");
  const small = Math.min(innerWidth, innerHeight) < 700 || (navigator.hardwareConcurrency || 8) <= 4;
  const N = small ? 12000 : 24000;
  let dprCap = small ? 1.5 : 1.75;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
  THREE.ColorManagement.enabled = false;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, dprCap));
  const scene = new THREE.Scene();
  const FOV = 35;
  const camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, 0.05, 200);
  const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  const BASE = 10;                              // the resting camera distance

  let view = { w: 0, h: 0, visH: 2 * BASE * TAN, visW: 0, mobile: false, aspect: 1 };
  let need = 3, got = 0;                        // the font and two portraits, plus photos added below
  function bump() { got++; loaderBar.style.transform = `scaleX(${clamp(got / need)})`; }
  const rand = (a = 0, b = 1) => a + Math.random() * (b - a);

  /* ── shape builders: each returns N points as a Float32Array ── */
  const shapes = {};
  const ready = {};

  function fill(fn) {
    const a = new Float32Array(N * 4);
    for (let i = 0; i < N; i++) {
      const p = fn(i);
      a[i * 4] = p[0]; a[i * 4 + 1] = p[1]; a[i * 4 + 2] = p[2]; a[i * 4 + 3] = p.length > 3 ? p[3] : 1;
    }
    return a;
  }
  const sphereDir = () => {
    const u = rand(-1, 1), th = rand(0, Math.PI * 2), s = Math.sqrt(1 - u * u);
    return [s * Math.cos(th), u, s * Math.sin(th)];
  };

  shapes.scatter = fill(() => { const d = sphereDir(), r = 4 + Math.random() * 9; return [d[0] * r, d[1] * r, d[2] * r - 4]; });

  // text sampled from a canvas; width normalised to 2
  function sampleText(lines, { weight = 800, stretch = "ultra-expanded", depth = 0.12, gap = 0.12 } = {}) {
    const fs = 260;
    const c = document.createElement("canvas");
    const x = c.getContext("2d", { willReadFrequently: true });
    const font = `${weight} ${stretch} ${fs}px Archivo, sans-serif`;
    x.font = font;
    if ("fontStretch" in x) x.fontStretch = stretch;
    const widths = lines.map((l) => x.measureText(l).width);
    const lh = fs * (0.82 + gap);
    c.width = Math.ceil(Math.max(...widths) + 40);
    c.height = Math.ceil(lh * lines.length + 40);
    x.font = font;
    if ("fontStretch" in x) x.fontStretch = stretch;
    x.fillStyle = "#fff";
    x.textBaseline = "alphabetic";
    lines.forEach((l, i) => x.fillText(l, (c.width - widths[i]) / 2, 20 + fs * 0.82 + i * lh));
    const { data, width, height } = x.getImageData(0, 0, c.width, c.height);
    const px = [];
    let minX = width, maxX = 0, minY = height, maxY = 0;
    for (let yy = 0; yy < height; yy += 2)
      for (let xx = 0; xx < width; xx += 2)
        if (data[(yy * width + xx) * 4 + 3] > 140) {
          px.push(xx, yy);
          if (xx < minX) minX = xx; if (xx > maxX) maxX = xx; if (yy < minY) minY = yy; if (yy > maxY) maxY = yy;
        }
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, sc = 2 / Math.max(1, maxX - minX);
    const count = px.length / 2;
    return fill(() => {
      const k = (Math.random() * count) | 0;
      return [(px[k * 2] + rand(-1, 1) - cx) * sc, -(px[k * 2 + 1] + rand(-1, 1) - cy) * sc, rand(-depth, depth)];
    });
  }

  shapes.wave = fill(() => [rand(-1, 1), 0, rand(-1, 1)]);

  // nine objects, one per service line, in a 3 x 3 grid (cluster g holds points [g*N/9, (g+1)*N/9))
  const CELL = 1.05;
  const centers = [];
  for (let g = 0; g < 9; g++) centers.push(new THREE.Vector3(((g % 3) - 1) * CELL, (1 - Math.floor(g / 3)) * CELL, 0));
  function boxSurface(w, h, d) {
    const a = [w * h, w * h, h * d, h * d, w * d, w * d], tot = a.reduce((s, v) => s + v, 0);
    let r = Math.random() * tot, f = 0;
    while (r > a[f]) r -= a[f++];
    const u = rand(-0.5, 0.5), v = rand(-0.5, 0.5);
    if (f < 2) return [u * w, v * h, (f ? 0.5 : -0.5) * d];
    if (f < 4) return [(f === 3 ? 0.5 : -0.5) * w, u * h, v * d];
    return [u * w, (f === 5 ? 0.5 : -0.5) * h, v * d];
  }
  const ico = new THREE.IcosahedronGeometry(0.4, 0);
  const icoEdges = new THREE.EdgesGeometry(ico).attributes.position.array;
  const onSegments = (arr) => {
    const k = ((Math.random() * (arr.length / 6)) | 0) * 6, t = Math.random();
    return [lerp(arr[k], arr[k + 3], t), lerp(arr[k + 1], arr[k + 4], t), lerp(arr[k + 2], arr[k + 5], t)];
  };
  const rectEdge = (x0, y0, x1, y1) => {
    const per = 2 * (x1 - x0 + y1 - y0);
    let r = Math.random() * per;
    if (r < x1 - x0) return [x0 + r, y0];
    r -= x1 - x0;
    if (r < y1 - y0) return [x1, y0 + r];
    r -= y1 - y0;
    if (r < x1 - x0) return [x1 - r, y1];
    r -= x1 - x0;
    return [x0, y1 - r];
  };
  const svcMakers = [
    () => boxSurface(0.5, 0.5, 0.5),                                                   // custom systems: a cube
    () => {                                                                            // web platforms: a globe of lines
      const R = 0.37, th = rand(0, Math.PI * 2);
      if (Math.random() < 0.5) { const lat = (((Math.random() * 7) | 0) - 3) * 0.38; return [R * Math.cos(lat) * Math.cos(th), R * Math.sin(lat), R * Math.cos(lat) * Math.sin(th)]; }
      const lon = ((Math.random() * 8) | 0) * (Math.PI / 8);
      return [R * Math.cos(th) * Math.cos(lon), R * Math.sin(th), R * Math.cos(th) * Math.sin(lon)];
    },
    () => (Math.random() < 0.8 ? boxSurface(0.36, 0.7, 0.05) : [rand(-0.03, 0.03), 0.3, 0.03]), // mobile apps: a phone
    () => onSegments(icoEdges),                                                        // security: a crystal
    () => { const r = 0.36 * Math.sqrt(Math.random()), a = rand(0, Math.PI * 2), l = ((Math.random() * 3) | 0) - 1; return [r * Math.cos(a), l * 0.2 + rand(-0.01, 0.01), r * Math.sin(a)]; }, // SaaS: layers
    () => { const u = rand(0, Math.PI * 2), v = rand(0, Math.PI * 2); return [(0.27 + 0.09 * Math.cos(v)) * Math.cos(u), 0.09 * Math.sin(v), (0.27 + 0.09 * Math.cos(v)) * Math.sin(u)]; }, // cloud: a loop
    () => {                                                                            // UI/UX: a wireframe screen
      const r = Math.random();
      const e = r < 0.4 ? rectEdge(-0.42, -0.3, 0.42, 0.3) : r < 0.55 ? rectEdge(-0.42, 0.18, 0.42, 0.3) : r < 0.7 ? rectEdge(-0.42, -0.3, -0.18, 0.18) : r < 0.85 ? rectEdge(-0.12, -0.04, 0.36, 0.12) : rectEdge(-0.12, -0.24, 0.36, -0.1);
      return [e[0], e[1], rand(-0.01, 0.01)];
    },
    () => {                                                                            // video: a film reel
      const r = Math.random(), a = rand(0, Math.PI * 2), z = rand(-0.04, 0.04);
      if (r < 0.45) return [0.38 * Math.cos(a), 0.38 * Math.sin(a), z];
      if (r < 0.55) return [0.06 * Math.cos(a), 0.06 * Math.sin(a), z];
      const h = (Math.random() * 5) | 0, hc = h * (Math.PI * 2 / 5);
      return [0.2 * Math.cos(hc) + 0.09 * Math.cos(a), 0.2 * Math.sin(hc) + 0.09 * Math.sin(a), z];
    },
    () => { const b = (Math.random() * 3) | 0, hh = [0.3, 0.5, 0.74][b], p = boxSurface(0.16, hh, 0.16); return [p[0] + (b - 1) * 0.24, p[1] - 0.37 + hh / 2, p[2]]; }, // growth: rising bars
  ];
  shapes.services = fill((i) => {
    const g = Math.min(8, Math.floor((i * 9) / N));
    const p = svcMakers[g]();
    return [p[0] + centers[g].x, p[1] + centers[g].y, p[2] + centers[g].z];
  });

  // the dust around the ring of screens
  shapes.work = fill(() => {
    const a = rand(0, Math.PI * 2), r = 1 + Math.pow(Math.random(), 2) * 0.6;
    return [Math.cos(a) * r, rand(-0.55, 0.55) * (Math.random() < 0.8 ? 1 : 2.2), Math.sin(a) * r];
  });

  // a double helix with rungs
  shapes.helix = fill(() => {
    const t = Math.random(), turns = 2.6, y = (t - 0.5) * 4;
    if (Math.random() < 0.22) {
      const k = Math.round(t * 34) / 34, ang = k * Math.PI * 2 * turns, s = rand(-1, 1);
      return [Math.cos(ang) * 0.5 * s, (k - 0.5) * 4, Math.sin(ang) * 0.5 * s];
    }
    const strand = Math.random() < 0.5 ? 0 : Math.PI, ang = t * Math.PI * 2 * turns + strand;
    return [Math.cos(ang) * 0.5 + rand(-0.03, 0.03), y + rand(-0.02, 0.02), Math.sin(ang) * 0.5 + rand(-0.03, 0.03)];
  });

  // a camera lens: front rings, a ridged grip, the barrel and an iris (z = -1.2) that opens
  shapes.lens = fill(() => {
    const r = Math.random(), a = rand(0, Math.PI * 2);
    if (r < 0.2) { const ring = [1.0, 1.08, 1.22, 1.4][(Math.random() * 4) | 0]; return [Math.cos(a) * ring, Math.sin(a) * ring, rand(-0.02, 0.02)]; }
    if (r < 0.42) { const ridge = Math.floor(a / (Math.PI / 36)) % 2 ? 1.36 : 1.42; return [Math.cos(a) * ridge, Math.sin(a) * ridge, rand(-0.95, -0.25)]; }
    if (r < 0.55) return [Math.cos(a) * 1.0, Math.sin(a) * 1.0, rand(-1.15, 0)];
    if (r < 0.6) return [Math.cos(a) * 0.62, Math.sin(a) * 0.62, rand(-0.6, -0.1)]; // a glass reflection ring
    const rr = 0.12 + 0.88 * Math.sqrt(Math.random());
    const blade = Math.random() < 0.55;
    const ang = blade ? ((Math.random() * 7) | 0) * (Math.PI * 2 / 7) + (rr - 0.12) * 1.1 : a;
    return [Math.cos(ang) * rr, Math.sin(ang) * rr, -1.2];
  });

  shapes.orb = fill(() => {
    const d = sphereDir(), r = Math.random() < 0.75 ? 1 : Math.cbrt(Math.random()) * 0.9;
    return [d[0] * r, d[1] * r, d[2] * r];
  });

  // portraits: points gather where the photo is lit, with depth from brightness
  // portraits: a halftone grid of the photo, one point per cell, bright where the photo is lit.
  // crops are fractions of the photo (head and shoulders); the ellipse fades out the background
  const FACE_CROP = [
    { x0: 0.24, x1: 0.82, y0: 0.0, y1: 0.71, rx: 0.5, ry: 0.62, cy: 0.46 },
    { x0: 0.24, x1: 0.76, y0: 0.22, y1: 0.74, rx: 0.44, ry: 0.6, cy: 0.5 },
  ];
  function sampleFace(img, crop) {
    const cw = (crop.x1 - crop.x0) * img.naturalWidth, ch = (crop.y1 - crop.y0) * img.naturalHeight;
    const aspect = cw / ch;
    const cols = Math.round(Math.sqrt(N * aspect)), rows = Math.floor(N / cols);
    const grab = (blur) => {
      const c = document.createElement("canvas");
      c.width = cols; c.height = rows;
      const x = c.getContext("2d", { willReadFrequently: true });
      x.imageSmoothingQuality = "high";
      if (blur) x.filter = `blur(${blur}px)`;
      x.drawImage(img, crop.x0 * img.naturalWidth, crop.y0 * img.naturalHeight, cw, ch, 0, 0, cols, rows);
      const d = x.getImageData(0, 0, cols, rows).data, out = new Float32Array(cols * rows);
      for (let i = 0; i < out.length; i++) out[i] = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255;
      return out;
    };
    const lum = grab(0), soft = grab(Math.max(2, cols / 40));
    const n = cols * rows;
    const mask = new Float32Array(n), v = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const ex = ((i % cols) / cols - 0.5) / crop.rx, ey = (Math.floor(i / cols) / rows - crop.cy) / crop.ry;
      mask[i] = smooth(1.0, 0.7, Math.sqrt(ex * ex + ey * ey));
      v[i] = lum[i] + 1.6 * (lum[i] - soft[i]);            // local contrast: eyes, brows and edges stand out
    }
    // stretch the figure's brightness between its 3rd and 99th percentile
    const vals = [];
    for (let i = 0; i < n; i += 3) if (mask[i] > 0.5) vals.push(v[i]);
    vals.sort((a, b) => a - b);
    const lo = vals[Math.floor(vals.length * 0.03)] || 0, hi = vals[Math.floor(vals.length * 0.99)] || 1;
    return fill((i) => {
      if (i >= n) return [rand(-1, 1) * aspect, rand(-1, 1), rand(-0.2, 0.2), 0];
      const col = i % cols, row = Math.floor(i / cols);
      const b = (0.05 + 0.95 * Math.pow(clamp((v[i] - lo) / Math.max(0.05, hi - lo)), 0.9)) * mask[i];
      return [((col + 0.5 + rand(-0.1, 0.1)) / cols - 0.5) * 2 * aspect, -((row + 0.5 + rand(-0.1, 0.1)) / rows - 0.5) * 2, (clamp(soft[i] * 1.4) - 0.5) * 0.4 * mask[i], b];
    });
  }

  /* ── the cloud ── */
  const geo = new THREE.BufferGeometry();
  const posA = new THREE.BufferAttribute(new Float32Array(N * 4), 4).setUsage(THREE.DynamicDrawUsage);
  const posB = new THREE.BufferAttribute(new Float32Array(N * 4), 4).setUsage(THREE.DynamicDrawUsage);
  const aRand = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    aRand[i * 4] = Math.random();                                // morph delay
    aRand[i * 4 + 1] = Math.min(8, Math.floor((i * 9) / N));     // service cluster
    aRand[i * 4 + 2] = Math.random();                            // brightness and size
    aRand[i * 4 + 3] = Math.random();                            // phase
  }
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));   // only sets the draw count
  geo.setAttribute("aPosA", posA);
  geo.setAttribute("aPosB", posB);
  geo.setAttribute("aRand", new THREE.BufferAttribute(aRand, 4));

  const NOISE = /* glsl */ `
    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
      vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
      i=mod289(i);
      vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
      float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
      vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
      vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
      return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }`;

  const uniforms = {
    uTime: { value: 0 }, uT: { value: 0 },
    uIdA: { value: 0 }, uIdB: { value: 0 },
    uMatA: { value: new THREE.Matrix4() }, uMatB: { value: new THREE.Matrix4() },
    uSizeA: { value: 1 }, uSizeB: { value: 1 }, uAlphaA: { value: 1 }, uAlphaB: { value: 1 },
    uScale: { value: 1 }, uDpr: { value: 1 }, uBase: { value: small ? 0.03 : 0.022 },
    uSwirl: { value: 0.9 }, uDof: { value: 0.05 }, uFocusDist: { value: 10 },
    uMouse: { value: new THREE.Vector3(99, 99, 0) }, uMouseAmt: { value: 0 }, uMouseR: { value: 1 },
    uCenters: { value: centers }, uFocus: { value: new Array(9).fill(0) }, uFocusAny: { value: 0 },
    uAp: { value: 0.12 }, uPulse: { value: 0 },
    uInk: { value: new THREE.Color(0xf3f3f1) },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true, depthWrite: false, depthTest: true,
    vertexShader: /* glsl */ `
      uniform float uTime, uT, uIdA, uIdB, uSizeA, uSizeB, uAlphaA, uAlphaB, uScale, uDpr, uBase, uSwirl, uDof, uFocusDist, uMouseAmt, uMouseR, uFocusAny, uAp, uPulse;
      uniform mat4 uMatA, uMatB;
      uniform vec3 uMouse;
      uniform vec3 uCenters[9];
      uniform float uFocus[9];
      attribute vec4 aPosA;
      attribute vec4 aPosB;
      attribute vec4 aRand;
      varying float vAlpha;
      varying float vBlur;
      ${NOISE}
      vec3 anim(vec3 p, float id, out float amul) {
        amul = 1.0;
        if (id == 1.0) {                       // the waveform
          float n = snoise(vec3(p.x * 2.2, p.z * 2.2, uTime * 0.18));
          p.y += 0.045 * sin(p.x * 7.0 + uTime * 1.2) + 0.03 * sin(p.z * 9.0 - uTime * 0.9) + 0.07 * n;
          amul = (1.0 - smoothstep(0.7, 1.0, abs(p.x))) * (1.0 - smoothstep(0.5, 1.0, abs(p.z))) * (0.6 + 0.6 * max(n, 0.0));
        } else if (id == 2.0) {                // the nine service objects
          int g = int(aRand.y + 0.5);
          vec3 c = uCenters[g];
          float f = uFocus[g];
          vec3 q = p - c;
          float a = uTime * 0.35 + aRand.y * 0.7 + f * 0.6;
          q.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * q.xz;
          float b = 0.25 + aRand.y * 0.4;
          q.yz = mat2(cos(b), -sin(b), sin(b), cos(b)) * q.yz;
          q *= 1.0 + 0.5 * f;
          p = c + q;
          p.z += f * 0.6;
          amul = mix(1.0, 0.22 + 0.78 * f, uFocusAny);
        } else if (id == 3.0) {                // the lens: the iris opens
          if (abs(p.z + 1.2) < 0.002) {
            float r = length(p.xy);
            float ang = atan(p.y, p.x) - (1.0 - uAp) * 0.9 + (uAp - 0.12) * 0.6;
            float u = clamp((r - 0.12) / 0.88, 0.0, 1.0);
            float r2 = mix(uAp, 1.0, u);
            p.xy = vec2(cos(ang), sin(ang)) * r2;
            amul = 0.7;
          }
        } else if (id == 4.0) {                // the orb breathes, and jumps when you pick something
          float n = snoise(p * 1.6 + vec3(uTime * 0.25));
          p *= 1.0 + 0.04 * sin(uTime * 1.4) + n * (0.05 + uPulse * 0.4);
        } else if (id == 5.0) {                // portraits: a slow shimmer
          p.z += 0.01 * sin(uTime * 1.3 + aRand.w * 6.2831);
        }
        return p;
      }
      void main() {
        float ma, mb;
        vec3 a = (uMatA * vec4(anim(aPosA.xyz, uIdA, ma), 1.0)).xyz;
        vec3 b = (uMatB * vec4(anim(aPosB.xyz, uIdB, mb), 1.0)).xyz;
        float tl = clamp((uT - aRand.x * 0.35) / 0.65, 0.0, 1.0);
        tl = tl * tl * (3.0 - 2.0 * tl);
        float lit = mix(aPosA.w, aPosB.w, tl);
        float photoW = (uIdA == 5.0 ? 1.0 - tl : 0.0) + (uIdB == 5.0 ? tl : 0.0);
        float jit = mix(0.65 + 0.7 * aRand.z, 1.0, photoW);
        vec3 p = mix(a, b, tl);
        float sw = sin(3.14159 * tl) * uSwirl;
        if (sw > 0.001) {
          vec3 q = p * 0.3 + vec3(0.0, uTime * 0.1, 0.0);
          p += vec3(snoise(q), snoise(q + vec3(17.1, 3.2, 8.4)), snoise(q + vec3(5.7, 11.3, 2.9))) * sw;
        }
        p.xy += 0.012 * vec2(sin(uTime * 0.7 + aRand.w * 6.2831), cos(uTime * 0.6 + aRand.w * 9.0));

        vec3 d = p - uMouse;
        float r = length(d.xy);
        float f = (1.0 - smoothstep(0.0, uMouseR, r)) * uMouseAmt;
        p.xy += normalize(d.xy + vec2(1e-4)) * f * uMouseR * 0.42;
        p.z += f * 0.55;

        vec4 mv = viewMatrix * vec4(p, 1.0);
        float depth = max(0.05, -mv.z);
        float blur = abs(depth - uFocusDist) * uDof;
        float size = uBase * mix(uSizeA, uSizeB, tl) * jit * (0.3 + 0.7 * lit) * (1.0 + blur * 1.6);
        float px = size * uScale / depth;
        gl_PointSize = clamp(px, 1.0, 40.0 * uDpr);
        gl_Position = projectionMatrix * mv;

        float al = mix(uAlphaA * ma, uAlphaB * mb, tl);
        al *= mix(0.45 + 0.55 * aRand.z, 1.0, photoW) * lit / (1.0 + blur * blur * 3.0);
        al *= smoothstep(0.3, 1.8, depth);
        al *= min(1.0, px);
        al *= 1.0 + f * 0.9;
        vAlpha = al;
        vBlur = clamp(blur, 0.0, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uInk;
      varying float vAlpha;
      varying float vBlur;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = 1.0 - smoothstep(0.5 - 0.1 - 0.3 * vBlur, 0.5, d);
        if (a * vAlpha < 0.004) discard;
        gl_FragColor = vec4(uInk, a * vAlpha);
      }`,
  });
  const cloud = new THREE.Points(geo, material);
  cloud.frustumCulled = false;
  scene.add(cloud);

  /* ── the ring of project screens (Work) ── */
  const RING_R = 6;
  const step = (Math.PI * 2) / Math.max(P.length, 6);
  const PANEL_W = RING_R * step * 0.8;
  const PANEL_H = PANEL_W / 1.6;
  const ring = new THREE.Group();
  ring.visible = false;
  scene.add(ring);
  const panels = [];
  const texLoader = new THREE.TextureLoader();
  function poster(p, i) {
    const c = document.createElement("canvas");
    c.width = 1600; c.height = 1000;
    const x = c.getContext("2d");
    x.fillStyle = "#101010"; x.fillRect(0, 0, 1600, 1000);
    x.strokeStyle = "rgba(255,255,255,0.07)"; x.lineWidth = 2;
    for (let gx = 0; gx <= 1600; gx += 100) { x.beginPath(); x.moveTo(gx, 0); x.lineTo(gx, 1000); x.stroke(); }
    for (let gy = 0; gy <= 1000; gy += 100) { x.beginPath(); x.moveTo(0, gy); x.lineTo(1600, gy); x.stroke(); }
    x.fillStyle = "#f3f3f1";
    for (let k = 0; k < 34; k++) {
      const hh = (0.15 + 0.85 * Math.abs(Math.sin(k * 0.55 + i * 1.7) * Math.cos(k * 0.21 + i))) * 300;
      x.fillRect(560 + k * 28, 420 - hh, 12, hh);
      x.globalAlpha = 0.35; x.fillRect(560 + k * 28, 436, 12, hh * 0.6); x.globalAlpha = 1;
    }
    x.fillStyle = "#949494"; x.font = "500 38px Archivo, sans-serif";
    x.fillText(p.category.toUpperCase(), 90, 120);
    x.textAlign = "right"; x.fillText(pad(i + 1), 1510, 120); x.textAlign = "left";
    x.fillStyle = "#f3f3f1";
    let fs = 190;
    x.font = `700 ${fs}px Archivo, sans-serif`;
    while (x.measureText(p.title).width > 1420 && fs > 60) { fs -= 8; x.font = `700 ${fs}px Archivo, sans-serif`; }
    x.fillText(p.title, 86, 820);
    x.fillStyle = "#949494"; x.font = "400 40px Archivo, sans-serif";
    x.fillText(p.stack.join("  /  "), 92, 900);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return t;
  }
  const panelVS = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
  const panelFS = /* glsl */ `
    uniform sampler2D map; uniform float uReveal, uHover, uOpacity, uTime; uniform vec2 uCells;
    varying vec2 vUv;
    void main() {
      vec2 uv = vec2(1.0 - vUv.x, vUv.y);
      vec3 c = texture2D(map, uv).rgb;
      float g = dot(c, vec3(0.299, 0.587, 0.114));
      vec2 cell = uv * uCells;
      vec3 cc = texture2D(map, (floor(cell) + 0.5) / uCells).rgb;
      float gc = dot(cc, vec3(0.299, 0.587, 0.114));
      float rad = 0.5 * sqrt(gc) + 0.04;
      float dotm = 1.0 - smoothstep(rad - 0.08, rad, length(fract(cell) - 0.5));
      vec3 halftone = vec3(dotm) * 0.8;
      vec3 photo = mix(vec3(g), c, uHover);
      float e = uReveal * 1.3 - 0.15;
      float m = smoothstep(e - 0.04, e, uv.x);
      vec3 col = mix(photo, halftone, m);
      float line = (1.0 - smoothstep(0.0, 0.01, abs(uv.x - e))) * step(0.001, uReveal) * step(uReveal, 0.999);
      col += vec3(line);
      vec2 bd = min(uv, 1.0 - uv);
      float frame = 1.0 - smoothstep(0.0, 0.004, min(bd.x, bd.y * 1.6));
      col = mix(col, vec3(1.0), frame * 0.6);
      col *= 0.92 + 0.08 * sin(uv.y * 900.0 + uTime * 4.0);
      gl_FragColor = vec4(col, uOpacity);
    }`;
  P.forEach((p, i) => {
    const center = Math.PI + i * step;
    const g = new THREE.CylinderGeometry(RING_R, RING_R, PANEL_H, 40, 1, true, center - (step * 0.8) / 2, step * 0.8);
    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: poster(p, i) }, uReveal: { value: 0 }, uHover: { value: 0 }, uOpacity: { value: 0 }, uTime: { value: 0 }, uCells: { value: new THREE.Vector2(96, 60) } },
      vertexShader: panelVS, fragmentShader: panelFS, side: THREE.BackSide, transparent: true, depthWrite: false,
    });
    if (p.image) {
      texLoader.load(up(p.image), (t) => { t.anisotropy = 4; mat.uniforms.map.value = t; bump(); });
      need++;
    }
    const mesh = new THREE.Mesh(g, mat);
    mesh.userData.index = i;
    mesh.renderOrder = 2;
    ring.add(mesh);
    panels.push({ mesh, mat, reveal: 0, hover: 0 });
  });

  /* ── the frame you see through the lens (Creator Mode) ── */
  const photoMat = new THREE.ShaderMaterial({
    uniforms: { map: { value: null }, uOpacity: { value: 0 }, uCover: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 } },
    vertexShader: panelVS,
    fragmentShader: /* glsl */ `
      uniform sampler2D map; uniform float uOpacity, uTime; uniform vec2 uCover; varying vec2 vUv;
      void main() {
        vec2 uv = (vUv - 0.5) * uCover + 0.5;
        vec3 c = texture2D(map, uv).rgb;
        float g = dot(c, vec3(0.299, 0.587, 0.114));
        g = smoothstep(0.02, 0.9, g);
        float grain = fract(sin(dot(vUv * 1000.0 + uTime, vec2(12.9898, 78.233))) * 43758.5453) * 0.08;
        float vig = smoothstep(0.85, 0.3, length(vUv - 0.5));
        gl_FragColor = vec4(vec3(g * vig + grain), uOpacity);
      }`,
    transparent: true, depthWrite: false,
  });
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), photoMat);
  photo.visible = false;
  photo.renderOrder = 1;
  scene.add(photo);
  let photoAspect = 1.5;
  const lensPhoto = hasCreator && CREATOR.photos && ((CREATOR.photos.strip && CREATOR.photos.strip[0]) || CREATOR.photos.hero);
  if (lensPhoto) {
    need++;
    texLoader.load(up(lensPhoto.src.replace(/^\.\.\//, "")), (t) => { photoMat.uniforms.map.value = t; photoAspect = t.image.width / t.image.height; bump(); });
  }

  /* ── loading: fonts and photos, then the shapes that need them ── */

  function buildWord() {
    shapes.word = view.mobile ? sampleText(["ZYN", "TECH"], { gap: 0.08 }) : sampleText(["ZYNTECH"]);
    shapes.end = shapes.word;
    ready.word = ready.end = true;
    dirty = true;
  }
  const fontReady = document.fonts ? Promise.race([document.fonts.load("800 ultra-expanded 260px Archivo"), new Promise((r) => setTimeout(r, 2500))]) : Promise.resolve();
  fontReady.then(() => {
    buildWord();
    shapes.quote = sampleText(["“"], { weight: 900, stretch: "normal", depth: 0.18 });
    ready.quote = true;
    bump();
    startIntro();
  });
  SITE.team.slice(0, 2).forEach((m, i) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      shapes[`face-${i}`] = sampleFace(img, FACE_CROP[i] || FACE_CROP[0]);
      ready[`face-${i}`] = true;
      dirty = true;
      bump();
    };
    img.onerror = bump;
    img.src = up(m.photo);
  });
  ["wave", "services", "work", "helix", "lens", "orb", "scatter"].forEach((k) => (ready[k] = true));

  /* ── per-shape staging: where it sits, how it is lit, where the camera is ── */
  const ANIM = { wave: 1, services: 2, lens: 3, orb: 4, "face-0": 5, "face-1": 5 };
  const SIZE = { word: 1, end: 1, wave: 0.85, services: 1, work: 1.1, helix: 1, "face-0": small ? 1.25 : 1.15, "face-1": small ? 1.25 : 1.15, lens: 1, quote: 1, orb: 1, scatter: 1 };
  const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpE = new THREE.Euler(), tmpP = new THREE.Vector3(), tmpS = new THREE.Vector3();
  const mouse = { x: 0, y: 0, sx: 0, sy: 0, amt: 0, last: -10, tilt: { x: 0, y: 0 } };

  function stageFor(name, p, time, out) {
    const { visW, visH, mobile } = view;
    let x = 0, y = 0, z = 0, s = 1, rx = 0, ry = 0, rz = 0, alpha = 1;
    const mx = mouse.sx, my = mouse.sy;
    switch (name) {
      case "word": {
        s = (visW * (mobile ? 0.84 : 0.8)) / 2;
        y = visH * (mobile ? 0.1 : 0.15);
        ry = mx * 0.1; rx = -my * 0.08;
        break;
      }
      case "end": {
        const a = slotWorld("footSpace");
        s = a ? Math.min(a.w * 0.92, visW * 0.86) / 2 : visW * 0.42;
        x = a ? a.x : 0; y = a ? a.y : 0;
        ry = mx * 0.1; rx = -my * 0.08;
        break;
      }
      case "wave": {
        s = Math.max(visW * 0.62, 5);
        y = -visH * 0.26; z = -1;
        alpha = mobile ? 0.8 : 1;
        break;
      }
      case "services": {
        s = (mobile ? visW * 0.86 : Math.min(visW * 0.4, visH * 0.82)) / (CELL * 3);
        x = mobile ? 0 : visW * 0.24;
        y = mobile ? visH * 0.12 : -visH * 0.02;
        ry = mx * 0.35 + Math.sin(time * 0.2) * 0.1; rx = -my * 0.2;
        alpha = mobile ? 0.3 : 1;
        break;
      }
      case "work": {
        s = 9.5; ry = -ringTurn * 0.5 + time * 0.01;
        break;
      }
      case "helix": {
        s = mobile ? visH * 0.25 : visH * 0.3;
        x = mobile ? visW * 0.3 : visW * 0.25;
        y = lerp(-visH * 0.4, visH * 0.4, p);
        ry = time * 0.18 + p * 4; rz = 0.25; rx = -my * 0.15;
        alpha = mobile ? 0.26 : 1;
        break;
      }
      case "face-0":
      case "face-1": {
        s = mobile ? visH * 0.24 : visH * 0.42;
        x = mobile ? 0 : visW * 0.2;
        y = mobile ? visH * 0.2 : -visH * 0.02;
        ry = mx * 0.45 + Math.sin(time * 0.35) * 0.1; rx = -my * 0.15;
        break;
      }
      case "lens": {
        s = lensSize();
        x = lensAt.x; y = lensAt.y;
        rz = time * 0.05;
        break;
      }
      case "quote": {
        s = mobile ? visH * 0.12 : visH * 0.19;
        x = mobile ? visW * 0.22 : visW * 0.3;
        y = mobile ? visH * 0.3 : visH * 0.06;
        ry = Math.sin(time * 0.5) * 0.35 + mx * 0.3; rx = -my * 0.2;
        alpha = mobile ? 0.6 : 1;
        break;
      }
      case "orb": {
        const a = slotWorld("orbSlot");
        s = a ? a.h * 0.42 : visH * 0.12;
        x = a ? a.x : 0;
        y = a ? a.y : 0;
        ry = time * 0.25;
        alpha = mobile ? 0.7 : 0.95;
        break;
      }
      default: {                                // scatter
        s = 1;
      }
    }
    tmpE.set(rx, ry, rz);
    tmpQ.setFromEuler(tmpE);
    tmpP.set(x, y, z);
    tmpS.set(s, s, s);
    out.matrix.compose(tmpP, tmpQ, tmpS);
    out.alpha = alpha;
    out.size = SIZE[name] || 1;
    out.id = ANIM[name] || 0;
    out.light = 0;
  }

  const lensAt = { x: 0, y: 0 };
  // a box in the page, as a centre and size on the z = 0 plane of the resting camera
  function slotWorld(id) {
    const b = slots[id];
    if (!b || !b.w) return null;
    const sy = b.top - window.scrollY + b.h / 2, sx = b.left + b.w / 2;
    return { x: (sx / vw - 0.5) * view.visW, y: -(sy / vh - 0.5) * view.visH, w: (b.w / vw) * view.visW, h: (b.h / vh) * view.visH };
  }
  let ringTurn = 0;
  const lensSize = () => (view.mobile ? view.visW * 0.34 : view.visH * 0.22);

  function cameraFor(name, p, out) {
    const { visW, visH, mobile, aspect } = view;
    out.pos.set(0, 0, BASE);
    out.look.set(0, 0, 0);
    if (name === "wave") { out.pos.set(0, 2.2, BASE); out.look.set(0, -0.9, 0); }
    if (name === "work") {
      const need = PANEL_W / (0.9 * 2 * TAN * aspect);
      const d = Math.max(RING_R, need, (PANEL_H / ((mobile ? 0.5 : 0.56) * 2 * TAN)));
      const lift = d * 2 * TAN * (mobile ? 0.06 : 0.09);
      out.pos.set(0, -lift, d - RING_R);
      out.look.set(0, -lift, -RING_R);
    }
    if (name === "lens") {
      const s = lensSize();
      const dive = smooth(0.2, 0.86, p);
      out.pos.set(lerp(lensAt.x * 0.4, lensAt.x, dive), lerp(0, lensAt.y, dive), lerp(BASE, -1.2 * s - 2.2, dive));
      out.look.set(lensAt.x, lensAt.y, lerp(0, -1.2 * s - 10, dive));
    }
  }

  /* ── state ── */
  const A = { matrix: new THREE.Matrix4() }, Bs = { matrix: new THREE.Matrix4() };
  const camA = { pos: new THREE.Vector3(), look: new THREE.Vector3() }, camB = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
  const bgDark = new THREE.Color(0x0b0b0b), bgLight = new THREE.Color(0xf3f3f1), bg = new THREE.Color(), ink = new THREE.Color();
  let curA = null, curB = null, dirty = true;
  let intro = 0, introOn = false, introT0 = 0;
  function startIntro() {
    introOn = !reduced;
    introT0 = performance.now();
    intro = reduced ? 1 : 0;
    setTimeout(doneLoading, 250);
  }
  const focus = new Array(9).fill(0);
  let focusAny = 0, pulse = 0;

  function upload(attr, name) {
    const src = ready[name] ? shapes[name] : shapes.scatter;
    attr.array.set(src);
    attr.needsUpdate = true;
  }

  /* ── pointer, touch, tilt ── */
  const ndc = new THREE.Vector2();
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / vw) * 2 - 1;
    mouse.y = -(e.clientY / vh) * 2 + 1;
    mouse.last = performance.now();
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (!t) return;
    mouse.x = (t.clientX / vw) * 2 - 1;
    mouse.y = -(t.clientY / vh) * 2 + 1;
    mouse.last = performance.now();
  }, { passive: true });
  window.addEventListener("deviceorientation", (e) => {
    if (e.gamma == null || fine) return;
    mouse.tilt.x = clamp(e.gamma / 35, -1, 1);
    mouse.tilt.y = clamp(((e.beta || 45) - 45) / 35, -1, 1);
  }, { passive: true });

  /* ── panel hover + click (Work) ── */
  const ray = new THREE.Raycaster();
  let hoverPanel = -1;
  const stageEl = $("#workStage");
  function pickPanel(e) {
    if (!ring.visible) return -1;
    ndc.set((e.clientX / vw) * 2 - 1, -(e.clientY / vh) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(ring.children, false)[0];
    return hit ? hit.object.userData.index : -1;
  }
  stageEl.addEventListener("pointermove", (e) => {
    if (e.target.closest("button, a")) { hoverPanel = -1; setCanvasLabel(""); return; }
    hoverPanel = pickPanel(e);
    setCanvasLabel(hoverPanel === workAt ? "View" : hoverPanel >= 0 ? "Go" : "");
  });
  stageEl.addEventListener("pointerleave", () => { hoverPanel = -1; setCanvasLabel(""); });
  stageEl.addEventListener("click", (e) => {
    if (e.target.closest("button, a")) return;
    const i = pickPanel(e);
    if (i < 0) return;
    if (i === workAt) openProject(i);
    else scrollToWork(i);
  });

  /* ── size ── */
  let lastW = 0, lastH = 0;
  function resize(force) {
    const w = innerWidth, h = innerHeight;
    if (!force && w === lastW && Math.abs(h - lastH) < 140) return;   // ignore the mobile address bar
    lastW = w; lastH = h;
    const wasMobile = view.mobile;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const visH = 2 * BASE * TAN;
    view = { w, h, visH, visW: visH * (w / h), mobile: w < 760 || w / h < 0.8, aspect: w / h };
    lensAt.x = view.mobile ? 0 : view.visW * 0.2;
    lensAt.y = view.mobile ? view.visH * 0.12 : view.visH * 0.06;
    uniforms.uScale.value = renderer.domElement.height / (2 * TAN);
    uniforms.uDpr.value = renderer.getPixelRatio();
    uniforms.uMouseR.value = view.visH * (view.mobile ? 0.16 : 0.11);
    if (ready.word && wasMobile !== view.mobile) buildWord();
  }
  resize(true);
  window.addEventListener("resize", () => { resize(false); measure(); });

  /* ── the loop ── */
  let tPrev = performance.now(), time = 0, frames = 0, slow = 0, tuned = false;
  const planeN = new THREE.Vector3(), plane = new THREE.Plane(), hitP = new THREE.Vector3();

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - tPrev) / 1000);
    tPrev = now;
    if (lenis) lenis.raf(now);
    const y = window.scrollY;
    pageTick(y);
    if (document.hidden) return;
    time += dt;

    // a cheap quality check: if the first seconds are slow, render fewer pixels
    if (!tuned && introOn === false && intro >= 1) {
      frames++;
      if (dt > 0.026) slow++;
      if (frames === 90) {
        tuned = true;
        if (slow > 45 && renderer.getPixelRatio() > 1) { renderer.setPixelRatio(1); resize(true); }
      }
    }

    // intro: the scattered cloud gathers into the wordmark
    if (introOn) {
      intro = clamp((now - introT0) / 2600);
      if (intro >= 1) introOn = false;
    }

    // which two shapes, and how far between them
    let st = scrollState(y);
    let nameA = marks[st.a] ? marks[st.a].name : "word";
    let nameB = marks[st.b] ? marks[st.b].name : "word";
    let t = st.t;
    if (intro < 1 && st.a === 0 && st.b <= 1 && t < 0.05) {
      nameA = "scatter"; nameB = "word"; t = 1 - Math.pow(1 - intro, 3);
    }
    if (nameA !== curA || dirty) { upload(posA, nameA); curA = nameA; }
    if (nameB !== curB || dirty) { upload(posB, nameB); curB = nameB; }
    dirty = false;

    const pA = marks[st.a] ? sectionP(marks[st.a], y) : 0;
    const pB = marks[st.b] ? sectionP(marks[st.b], y) : 0;

    // pointer: eased, and asleep after a while
    const active = now - mouse.last < 1600 ? 1 : 0;
    const tx = fine ? mouse.x : mouse.tilt.x, ty = fine ? mouse.y : mouse.tilt.y;
    mouse.sx += (tx - mouse.sx) * 0.06;
    mouse.sy += (ty - mouse.sy) * 0.06;
    mouse.amt += (active - mouse.amt) * (active ? 0.08 : 0.02);

    // the ring turns to the project in front
    if (sec.work) {
      const idx = pinProgress(sec.work, y) * (P.length - 1);
      const f = idx - Math.floor(idx);
      const settled = Math.floor(idx) + smooth(0.2, 0.8, f);
      ringTurn += (settled - ringTurn) * 0.12;
    }

    stageFor(nameA, pA, time, A);
    stageFor(nameB, pB, time, Bs);
    cameraFor(nameA, pA, camA);
    cameraFor(nameB, pB, camB);
    const te = smooth(0, 1, t);
    camPos.lerpVectors(camA.pos, camB.pos, te);
    camLook.lerpVectors(camA.look, camB.look, te);
    const inside = (nameA === "work" ? 1 - te : 0) + (nameB === "work" ? te : 0);
    const lensW = (nameA === "lens" ? 1 - te : 0) + (nameB === "lens" ? te : 0);
    const par = 1 - Math.max(inside, lensW * 0.8);
    camPos.x += mouse.sx * 0.45 * par;
    camPos.y += mouse.sy * 0.28 * par;
    camera.position.copy(camPos);
    camera.lookAt(camLook);
    camera.updateMatrixWorld();

    // where the pointer touches the cloud: a plane through the look point, facing the camera
    let mxN = mouse.x, myN = mouse.y, mAmt = mouse.amt;
    const heroW = (nameA === "word" ? 1 - te : 0) + (nameB === "word" ? te : 0);
    if (heroW > 0 && mouse.amt < 0.5) {               // no pointer: a slow sweep keeps the hero alive
      mxN = Math.sin(time * 0.45) * 0.7;
      myN = (view.mobile ? 0.2 : 0.3) + Math.sin(time * 0.31) * 0.08;
      mAmt = Math.max(mAmt, 0.55 * heroW);
    }
    ndc.set(mxN, myN);
    ray.setFromCamera(ndc, camera);
    camera.getWorldDirection(planeN);
    plane.setFromNormalAndCoplanarPoint(planeN.negate(), camLook);
    if (ray.ray.intersectPlane(plane, hitP)) uniforms.uMouse.value.copy(hitP);
    uniforms.uMouseAmt.value = mAmt * (1 - inside) * (1 - lensW);

    // services: the object for the line you point at comes forward
    const focusIdx = svcHot >= 0 ? svcHot : svcOpen;
    for (let g = 0; g < 9; g++) focus[g] += ((g === focusIdx ? 1 : 0) - focus[g]) * 0.1;
    focusAny += ((focusIdx >= 0 ? 1 : 0) - focusAny) * 0.1;
    uniforms.uFocus.value = focus;
    uniforms.uFocusAny.value = focusAny;

    // lens: the iris opens as you scroll toward it
    const lensP = nameB === "lens" ? pB : nameA === "lens" ? pA : 0;
    uniforms.uAp.value = lerp(0.14, 0.97, smooth(0.04, 0.42, lensP));

    pulse = Math.max(pulse * 0.94, kick);
    kick = 0;
    uniforms.uPulse.value = pulse;

    // tone: black, or white for the light sections
    const lightA = marks[st.a] && marks[st.a].light ? 1 : 0;
    const lightB = marks[st.b] && marks[st.b].light ? 1 : 0;
    const tone = lerp(lightA, lightB, smooth(0.55, 0.9, t));
    bg.copy(bgDark).lerp(bgLight, tone);
    ink.setRGB(lerp(0.953, 0.04, tone), lerp(0.953, 0.04, tone), lerp(0.945, 0.04, tone));
    renderer.setClearColor(bg, 1);
    uniforms.uInk.value.copy(ink);

    uniforms.uTime.value = time;
    uniforms.uT.value = t;
    uniforms.uIdA.value = A.id; uniforms.uIdB.value = Bs.id;
    uniforms.uMatA.value.copy(A.matrix); uniforms.uMatB.value.copy(Bs.matrix);
    uniforms.uSizeA.value = A.size; uniforms.uSizeB.value = Bs.size;
    uniforms.uAlphaA.value = A.alpha * (tone > 0.5 ? 0.9 : 1); uniforms.uAlphaB.value = Bs.alpha * (tone > 0.5 ? 0.9 : 1);
    uniforms.uSwirl.value = nameA === "scatter" ? 0.6 : 0.9;
    uniforms.uFocusDist.value = camPos.distanceTo(camLook);
    uniforms.uDof.value = inside > 0.5 ? 0.02 : 0.045;

    // the ring of screens
    ring.visible = inside > 0.01;
    if (ring.visible) {
      ring.rotation.y = -ringTurn * step;
      panels.forEach((pn, i) => {
        const front = i === workAt && inside > 0.9;
        pn.reveal = front ? Math.min(1, pn.reveal + dt * 0.9) : Math.max(0, pn.reveal - dt * 1.6);
        pn.hover += ((hoverPanel === i && front ? 1 : 0) - pn.hover) * 0.08;
        pn.mat.uniforms.uReveal.value = pn.reveal;
        pn.mat.uniforms.uHover.value = pn.hover;
        pn.mat.uniforms.uTime.value = time;
        const away = Math.abs(i - ringTurn);
        pn.mat.uniforms.uOpacity.value = inside * (away < 0.6 ? 1 : 0.55);
      });
    }

    // the frame behind the lens
    const photoOn = lensW * smooth(0.32, 0.72, lensP);
    photo.visible = photoOn > 0.01 && !!photoMat.uniforms.map.value;
    if (photo.visible) {
      const s = lensSize();
      const zEnd = -1.2 * s - 2.2, zPhoto = zEnd - 6;
      const hgt = 2 * (zEnd - zPhoto) * TAN * 1.12, wid = hgt * view.aspect;
      photo.position.set(lensAt.x, lensAt.y, zPhoto);
      photo.scale.set(wid, hgt, 1);
      const pa = wid / hgt;
      photoMat.uniforms.uCover.value.set(pa > photoAspect ? 1 : pa / photoAspect, pa > photoAspect ? photoAspect / pa : 1);
      photoMat.uniforms.uOpacity.value = photoOn;
      photoMat.uniforms.uTime.value = time;
    }

    renderer.render(scene, camera);
  }

  function sectionP(m, y) {
    if (m.name === "work" || m.name === "lens") return pinProgress(m, y);
    return clamp((y - m.top + vh) / (m.h + vh));
  }

  requestAnimationFrame(frame);
}
