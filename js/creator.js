/* ============================================================
   ZynTECH — CREATOR MODE ENGINE
   Renders the /creator page from js/creator-data.js.

   This page is deliberately independent of the main site: it
   loads no GSAP, no Lenis and no style.css. Everything here is
   plain DOM + IntersectionObserver.

   You normally don't need to edit this file — edit creator-data.js.
   ============================================================ */

(function () {
  "use strict";

  if (typeof CREATOR === "undefined") return;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ─────────────────────────────────────────────
     1. CURRENCY — the single formatting helper.
        Never format a price anywhere else.
  ───────────────────────────────────────────── */
  const nf = new Intl.NumberFormat("en-US");
  const lkr = (n) => `LKR ${nf.format(n)}`;

  function priceLabel(item) {
    if (item.display) return item.display;
    let out = lkr(item.price);
    if (item.from) out = `From ${out}`;
    if (item.unit) out += ` <i>/ ${item.unit}</i>`;
    if (item.suffix) out += ` <i>${item.suffix}</i>`;
    return out;
  }

  /* ─────────────────────────────────────────────
     2. CONTACT LINKS
  ───────────────────────────────────────────── */
  const c = CREATOR.contact;
  const waLink = (text) =>
    `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(text || c.whatsappText)}`;
  const waTier = (name) => waLink(c.whatsappTierText.replace("{tier}", name));
  const mailLink = () =>
    `mailto:${c.emails.join(",")}?subject=${encodeURIComponent(c.emailSubject)}`;

  const waIcon = '<svg aria-hidden="true"><use href="#i-wa"/></svg>';
  const mailIcon = '<svg aria-hidden="true"><use href="#i-mail"/></svg>';

  /* ─────────────────────────────────────────────
     3. HERO
  ───────────────────────────────────────────── */
  $("#heroSub").textContent = CREATOR.hero.sub;

  $("#heroActions").innerHTML = `
    <a class="btn btn-solid" href="${waLink()}" target="_blank" rel="noopener">
      ${waIcon}${CREATOR.hero.ctaPrimary}
    </a>
    <a class="btn btn-line" href="#packages">${CREATOR.hero.ctaSecondary}</a>`;

  // Three facts that answer "is this for me?" before any price is read.
  const cheapest = Math.min(
    ...CREATOR.packages.tracks.flatMap((t) => t.tiers.map((x) => x.price))
  );
  $("#heroMeta").innerHTML = `
    <div><dt>Based in</dt><dd>Kandy, Sri Lanka</dd></div>
    <div><dt>Turnaround</dt><dd>5–7 days</dd></div>
    <div><dt>From</dt><dd>${lkr(cheapest)}/mo</dd></div>
    <div><dt>Lock-in</dt><dd>None</dd></div>`;

  /* ─────────────────────────────────────────────
     4. WHAT WE DO
  ───────────────────────────────────────────── */
  $("#caps").innerHTML = CREATOR.whatWeDo
    .map(
      (d, i) => `
      <article class="cap">
        <span class="cap-n">${String(i + 1).padStart(2, "0")}</span>
        <h3>${d.title}</h3>
        <p>${d.text}</p>
      </article>`
    )
    .join("");

  /* ─────────────────────────────────────────────
     5. REEL SPEC
  ───────────────────────────────────────────── */
  $("#specList").innerHTML = CREATOR.reelSpec.map((s) => `<li>${s}</li>`).join("");

  /* ─────────────────────────────────────────────
     6. PACKAGES — both tracks shown as their own
        sections, so nothing is hidden behind a control.
  ───────────────────────────────────────────── */
  const tierCard = (t) => `
    <article class="tier${t.popular ? " pop" : ""}">
      <div class="tier-top">
        <span class="tier-name">${t.name}</span>
        ${t.popular ? '<span class="tier-flag">Most popular</span>' : ""}
      </div>
      <div class="tier-body">
        <p class="tier-tag">${t.tagline}</p>
        <p class="tier-price">${lkr(t.price)}<span class="per">/${t.period}</span></p>
        <ul class="tier-list">${t.includes.map((li) => `<li>${li}</li>`).join("")}</ul>
        <a class="btn ${t.popular ? "btn-solid" : "btn-line"} btn-block"
           href="${waTier(t.name)}" target="_blank" rel="noopener">Enquire</a>
      </div>
    </article>`;

  const trackById = (id) => CREATOR.packages.tracks.find((t) => t.id === id);
  const edit = trackById("edit");
  const prod = trackById("production");

  $("#editBlurb").textContent = edit.blurb;
  $("#editTiers").innerHTML = edit.tiers.map(tierCard).join("");
  $("#editTiers").dataset.tiers = edit.tiers.length;

  $("#prodBlurb").textContent = prod.blurb;
  $("#prodTiers").innerHTML = prod.tiers.map(tierCard).join("");
  $("#prodTiers").dataset.tiers = prod.tiers.length;

  $("#packageNote").textContent = CREATOR.packages.note;

  /* ─────────────────────────────────────────────
     7. ONE-OFF SHOOTS + PROJECTS
  ───────────────────────────────────────────── */
  const mini = (m) => `
    <article class="mini">
      <span class="mini-name">${m.name}</span>
      <p class="mini-price">${priceLabel(m)}</p>
      <p class="mini-note">${m.note}</p>
    </article>`;

  $("#bundles").innerHTML = CREATOR.bundles.map(mini).join("");
  $("#projects").innerHTML = CREATOR.projects.map(mini).join("");

  /* ─────────────────────────────────────────────
     8. ACCORDIONS
        Real <button> triggers with aria-expanded /
        aria-controls. Closed panels are visibility:hidden
        in CSS, so their links stay out of the tab order.
  ───────────────────────────────────────────── */
  const accItem = (id, heading, body) => `
    <div class="acc-item">
      <h3 class="acc-h">
        <button type="button" class="acc-btn" id="${id}-b"
                aria-expanded="false" aria-controls="${id}-p">
          <span>${heading}</span><span class="acc-sign" aria-hidden="true"></span>
        </button>
      </h3>
      <div class="acc-panel" id="${id}-p" role="region" aria-labelledby="${id}-b">
        <div class="acc-inner"><div class="acc-pad">${body}</div></div>
      </div>
    </div>`;

  $("#alcNote").textContent = CREATOR.aLaCarteNote;
  $("#alcAcc").innerHTML = CREATOR.aLaCarte
    .map((g, i) =>
      accItem(
        `alc-${i}`,
        g.category,
        `<dl class="rows">${g.items
          .map((it) => `<div class="row"><dt>${it.name}</dt><dd>${priceLabel(it)}</dd></div>`)
          .join("")}</dl>`
      )
    )
    .join("");

  $("#faqAcc").innerHTML = CREATOR.faq
    .map((f, i) => accItem(`faq-${i}`, f.q, `<p class="acc-text">${f.a}</p>`))
    .join("");

  $$(".acc").forEach((acc) => {
    acc.addEventListener("click", (e) => {
      const btn = e.target.closest(".acc-btn");
      if (!btn || !acc.contains(btn)) return;
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      $(`#${btn.getAttribute("aria-controls")}`).classList.toggle("open", !open);
    });
  });

  /* ─────────────────────────────────────────────
     9. PROCESS
  ───────────────────────────────────────────── */
  $("#steps").innerHTML = CREATOR.process
    .map(
      (p) => `
      <article class="step">
        <span class="step-n">${p.num}</span>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
      </article>`
    )
    .join("");

  /* ─────────────────────────────────────────────
     10. CLOSING CTA + FOOTER + MOBILE DOCK
  ───────────────────────────────────────────── */
  $("#ctaTitle").textContent = CREATOR.cta.title;
  $("#ctaText").textContent = CREATOR.cta.text;

  const ctaButtons = `
    <a class="btn btn-solid" href="${waLink()}" target="_blank" rel="noopener">
      ${waIcon}${c.whatsappLabel}
    </a>
    <a class="btn btn-ghost-light" href="${mailLink()}">${mailIcon}${c.emailLabel}</a>`;
  $("#ctaActions").innerHTML = ctaButtons;

  $("#dock").innerHTML = `
    <a class="btn btn-solid" href="${waLink()}" target="_blank" rel="noopener">
      ${waIcon}WhatsApp
    </a>
    <a class="btn btn-line" href="#packages">Packages</a>`;

  const brand = typeof SITE !== "undefined" ? SITE.brand : null;
  const year = new Date().getFullYear();
  $("#footLeft").textContent = brand
    ? `© ${year} ${brand.name} · ${brand.location}`
    : `© ${year} ZynTECH`;

  /* ─────────────────────────────────────────────
     11. SIDE TIMELINE — built from the sections
         themselves, so it can never drift.
  ───────────────────────────────────────────── */
  const sections = $$("section[data-tc]");
  const rail = $("#rail");
  rail.innerHTML = sections
    .map(
      (s) => `
      <button class="rail-item" data-to="${s.id}" type="button">
        <span class="rail-tick"></span>
        <span class="rail-label">${s.dataset.label}</span>
      </button>`
    )
    .join("");
  const railItems = $$(".rail-item", rail);

  rail.addEventListener("click", (e) => {
    const b = e.target.closest(".rail-item");
    if (b) $(`#${b.dataset.to}`).scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  });

  /* ─────────────────────────────────────────────
     12. SCROLL STATE — progress, header, timeline,
         mobile dock.
  ───────────────────────────────────────────── */
  const head = $("#head");
  const prog = $("#prog");
  const dock = $("#dock");
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = max > 0 ? `${(y / max) * 100}%` : "0%";
    head.classList.toggle("stuck", y > 8);
    dock.classList.toggle("up", y > window.innerHeight * 0.7);

    let active = -1;
    const line = y + window.innerHeight * 0.35;
    sections.forEach((s, i) => {
      if (line >= s.offsetTop) active = i;
    });
    railItems.forEach((b, i) => b.classList.toggle("on", i === active));
    revealInView();
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    },
    { passive: true }
  );

  /* ─────────────────────────────────────────────
     13. REVEAL ON SCROLL
         Deliberately plain: measured straight from the
         scroll handler rather than an observer, so there
         is no code path where content stays invisible
         because a callback never fired.
  ───────────────────────────────────────────── */
  let pending = $$(".rv");

  function revealInView() {
    if (!pending.length) return;
    const limit = window.innerHeight * 0.94;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top > limit) return true;
      el.classList.add("rv-on");
      return false;
    });
  }

  if (reduced) {
    pending.forEach((el) => el.classList.add("rv-on"));
    pending = [];
  } else {
    window.addEventListener("load", revealInView);
  }

  // Runs last: paints the initial scroll state and reveals whatever is
  // already on screen. Must come after `pending` exists.
  onScroll();
})();
