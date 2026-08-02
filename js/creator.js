/* ============================================================
   ZynTECH — CREATOR MODE ENGINE
   Renders the /creator page from js/creator-data.js and powers
   the track toggle and the accordions.
   Runs before main.js so that main.js picks up the rendered
   .reveal / .card / .magnetic elements for its motion pass.
   You normally don't need to edit this file — edit creator-data.js.
   ============================================================ */

(function () {
  "use strict";

  if (typeof CREATOR === "undefined") return;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ─────────────────────────────────────────────
     1. CURRENCY — the single formatting helper.
        Never format a price anywhere else.
  ───────────────────────────────────────────── */
  const nf = new Intl.NumberFormat("en-US");
  const lkr = (n) => `LKR ${nf.format(n)}`;

  // Full price label for list rows: handles from / unit / suffix / display.
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
  const waTier = (tierName) => waLink(c.whatsappTierText.replace("{tier}", tierName));
  const mailLink = () =>
    `mailto:${c.emails.join(",")}?subject=${encodeURIComponent(c.emailSubject)}`;

  /* ─────────────────────────────────────────────
     3. HERO
  ───────────────────────────────────────────── */
  $("#cmHeroEyebrow").textContent = CREATOR.hero.eyebrow;
  $("#cmHeroTitle").textContent = CREATOR.hero.headline;
  $("#cmHeroSub").textContent = CREATOR.hero.sub;
  $("#cmHeroCta").innerHTML = `
    <a class="btn btn-primary magnetic" href="${waLink()}" target="_blank" rel="noopener">
      <svg class="btn-ic" aria-hidden="true"><use href="#ic-whatsapp"/></svg>${CREATOR.hero.ctaPrimary}
    </a>
    <a class="btn btn-ghost magnetic" href="#cm-packages">${CREATOR.hero.ctaSecondary}</a>`;

  /* ─────────────────────────────────────────────
     4. WHAT WE DO
  ───────────────────────────────────────────── */
  $("#cmWhatGrid").innerHTML = CREATOR.whatWeDo
    .map(
      (d, i) => `
      <div class="card service-card tilt reveal" style="transition-delay:${i * 80}ms">
        <div class="service-icon"><svg><use href="#ic-${d.icon}"/></svg></div>
        <h3>${d.title}</h3>
        <p>${d.text}</p>
      </div>`
    )
    .join("");

  /* ─────────────────────────────────────────────
     5. WHAT'S IN EVERY REEL
  ───────────────────────────────────────────── */
  $("#cmSpecList").innerHTML = CREATOR.reelSpec
    .map((s) => `<li class="cm-spec-item">${s}</li>`)
    .join("");

  /* ─────────────────────────────────────────────
     6. PACKAGES — track toggle + tier rows
  ───────────────────────────────────────────── */
  const pk = CREATOR.packages;
  const tabsEl = $("#cmTabs");
  const panelsEl = $("#cmPanels");
  const blurbEl = $("#cmTrackBlurb");
  const defaultIndex = Math.max(
    0,
    pk.tracks.findIndex((t) => t.id === pk.defaultTrack)
  );

  tabsEl.innerHTML = pk.tracks
    .map((t, i) => {
      const on = i === defaultIndex;
      return `<button class="cm-tab${on ? " is-active" : ""}" role="tab"
        id="cm-tab-${t.id}" aria-controls="cm-panel-${t.id}"
        aria-selected="${on}" tabindex="${on ? 0 : -1}">${t.label}</button>`;
    })
    .join("");

  const tierCard = (t) => `
    <article class="card cm-tier${t.popular ? " is-popular" : ""}">
      ${t.popular ? '<span class="cm-flag">Most popular</span>' : ""}
      <h3 class="cm-tier-name">${t.name}</h3>
      <p class="cm-tier-tagline">${t.tagline}</p>
      <p class="cm-tier-price">${lkr(t.price)}<span class="cm-per">/${t.period}</span></p>
      <ul class="cm-tier-list">
        ${t.includes.map((li) => `<li>${li}</li>`).join("")}
      </ul>
      <a class="btn ${t.popular ? "btn-primary" : "btn-ghost"} cm-tier-btn"
         href="${waTier(t.name)}" target="_blank" rel="noopener">Enquire</a>
    </article>`;

  panelsEl.innerHTML = pk.tracks
    .map(
      (t, i) => `
      <div class="cm-tiers" role="tabpanel" tabindex="0"
           id="cm-panel-${t.id}" aria-labelledby="cm-tab-${t.id}"
           data-count="${t.tiers.length}" ${i === defaultIndex ? "" : "hidden"}>
        ${t.tiers.map(tierCard).join("")}
      </div>`
    )
    .join("");

  $("#cmPackageNote").textContent = pk.note;

  const tabs = $$(".cm-tab", tabsEl);
  const panels = $$(".cm-tiers", panelsEl);

  function selectTrack(i, focusTab) {
    tabs.forEach((tab, ti) => {
      const on = ti === i;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      panels[ti].hidden = !on;
    });
    blurbEl.textContent = pk.tracks[i].blurb;
    if (focusTab) tabs[i].focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTrack(i, false));
    tab.addEventListener("keydown", (e) => {
      const last = tabs.length - 1;
      let next = null;
      if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
      else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = last;
      if (next === null) return;
      e.preventDefault();
      selectTrack(next, true);
    });
  });

  blurbEl.textContent = pk.tracks[defaultIndex].blurb;

  // Reserve the height of the tallest track so switching never shifts the page.
  function syncPanelHeight() {
    panelsEl.style.minHeight = "";
    const tallest = panels.reduce((max, p) => {
      const wasHidden = p.hidden;
      p.hidden = false;
      const h = p.offsetHeight;
      p.hidden = wasHidden;
      return Math.max(max, h);
    }, 0);
    panelsEl.style.minHeight = `${tallest}px`;
  }
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncPanelHeight, 180);
  });
  window.addEventListener("load", syncPanelHeight);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncPanelHeight);
  syncPanelHeight();

  /* ─────────────────────────────────────────────
     7. ONE-OFF SHOOTS + PROJECT PACKAGES
  ───────────────────────────────────────────── */
  const miniCard = (m, i) => `
    <div class="cm-mini" style="transition-delay:${i * 70}ms">
      <div class="cm-mini-head">
        <span class="cm-mini-name">${m.name}</span>
        <span class="cm-mini-price">${priceLabel(m)}</span>
      </div>
      <p class="cm-mini-note">${m.note}</p>
    </div>`;

  $("#cmBundleGrid").innerHTML = CREATOR.bundles.map(miniCard).join("");
  $("#cmProjectGrid").innerHTML = CREATOR.projects.map(miniCard).join("");

  /* ─────────────────────────────────────────────
     8. ACCORDIONS (à la carte + FAQ)
        Real <button> triggers, aria-expanded/-controls,
        keyboard operable, all closed on load.
  ───────────────────────────────────────────── */
  function accordionItem(id, heading, bodyHTML) {
    return `
      <div class="cm-acc-item">
        <h3 class="cm-acc-heading">
          <button type="button" class="cm-acc-btn" id="${id}-btn"
                  aria-expanded="false" aria-controls="${id}-panel">
            <span>${heading}</span>
            <span class="cm-acc-icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="cm-acc-panel" id="${id}-panel" role="region"
             aria-labelledby="${id}-btn" hidden>${bodyHTML}</div>
      </div>`;
  }

  $("#cmAlcNote").textContent = CREATOR.aLaCarteNote;
  $("#cmAlcAccordion").innerHTML = CREATOR.aLaCarte
    .map((group, i) =>
      accordionItem(
        `alc-${i}`,
        group.category,
        `<dl class="cm-price-list">
          ${group.items
            .map(
              (item) => `
            <div class="cm-price-row">
              <dt>${item.name}</dt>
              <dd>${priceLabel(item)}</dd>
            </div>`
            )
            .join("")}
        </dl>`
      )
    )
    .join("");

  $("#cmFaqAccordion").innerHTML = CREATOR.faq
    .map((f, i) => accordionItem(`faq-${i}`, f.q, `<p class="cm-acc-text">${f.a}</p>`))
    .join("");

  $$(".cm-acc").forEach((acc) => {
    acc.addEventListener("click", (e) => {
      const btn = e.target.closest(".cm-acc-btn");
      if (!btn || !acc.contains(btn)) return;
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      document.getElementById(btn.getAttribute("aria-controls")).hidden = open;
    });
  });

  /* ─────────────────────────────────────────────
     9. PROCESS — reuses the homepage process styling
  ───────────────────────────────────────────── */
  $("#cmProcessGrid").innerHTML = CREATOR.process
    .map(
      (p, i) => `
      <div class="card process-step reveal" style="transition-delay:${i * 100}ms">
        <div class="process-num">${p.num}</div>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
      </div>`
    )
    .join("");

  /* ─────────────────────────────────────────────
     10. CLOSING CTA
  ───────────────────────────────────────────── */
  $("#cmCtaTitle").textContent = CREATOR.cta.title;
  $("#cmCtaText").textContent = CREATOR.cta.text;
  $("#cmCtaActions").innerHTML = `
    <a class="btn btn-primary magnetic" href="${waLink()}" target="_blank" rel="noopener">
      <svg class="btn-ic" aria-hidden="true"><use href="#ic-whatsapp"/></svg>${c.whatsappLabel}
    </a>
    <a class="btn btn-ghost magnetic" href="${mailLink()}">
      <svg class="btn-ic" aria-hidden="true"><use href="#ic-mail"/></svg>${c.emailLabel}
    </a>`;
})();
