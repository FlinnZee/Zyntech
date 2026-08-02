/* ============================================================
   ZynTECH — CREATOR MODE ENGINE
   Renders the /creator page from js/creator-data.js.

   This page is deliberately independent of the main site: it
   loads no GSAP, no Lenis and no style.css. Everything here is
   plain DOM, one canvas and one scroll handler.

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
     3. PHOTOS — sources live in creator-data.js.
        A missing file degrades to a styled
        placeholder instead of a broken image.
  ───────────────────────────────────────────── */
  const photos = CREATOR.photos || {};

  function mountPhoto(imgEl, frameEl, meta) {
    if (!imgEl || !frameEl || !meta || !meta.src) {
      if (frameEl) frameEl.classList.add("noimg");
      if (imgEl) imgEl.remove();
      return;
    }
    imgEl.alt = meta.alt || "";
    imgEl.onerror = () => {
      frameEl.classList.add("noimg");
      imgEl.remove();
    };
    imgEl.src = meta.src;
  }

  mountPhoto($("#vfImg"), $("#vf"), photos.hero);
  if (photos.hero) $("#vfClip").textContent = photos.hero.clip || "";
  mountPhoto($("#winImg"), $("#faqWin"), photos.faq);
  if (photos.faq) $("#winUrl").textContent = photos.faq.url || "";
  mountPhoto($("#printImg"), $("#ctaPrint"), photos.cta);
  if (photos.cta) $("#printCap").textContent = photos.cta.caption || "";

  $("#stripRow").innerHTML = (photos.strip || [])
    .map(
      (p, i) => `
      <figure class="cell" style="--i:${i}">
        <img src="${p.src}" alt="${p.alt || ""}" loading="lazy" decoding="async"
             onerror="this.closest('.cell').classList.add('noimg');this.remove()" />
        <span class="cell-tint" aria-hidden="true"></span>
        <figcaption class="cell-cap"><b>${p.label || ""}</b><span>${p.clip || ""}</span></figcaption>
      </figure>`
    )
    .join("");

  /* ─────────────────────────────────────────────
     4. HERO
  ───────────────────────────────────────────── */
  $("#heroSub").textContent = CREATOR.hero.sub;

  $("#heroActions").innerHTML = `
    <a class="btn btn-solid" href="${waLink()}" target="_blank" rel="noopener">
      ${waIcon}${CREATOR.hero.ctaPrimary}
    </a>
    <a class="btn btn-line" href="#packages">${CREATOR.hero.ctaSecondary}</a>`;

  const cheapest = Math.min(
    ...CREATOR.packages.tracks.flatMap((t) => t.tiers.map((x) => x.price))
  );
  $("#heroMeta").innerHTML = `
    <div><dt>Based in</dt><dd>Kandy, Sri Lanka</dd></div>
    <div><dt>Turnaround</dt><dd>5–7 days</dd></div>
    <div><dt>From</dt><dd>${lkr(cheapest)}/mo</dd></div>
    <div><dt>Lock-in</dt><dd>None</dd></div>`;

  /* ─────────────────────────────────────────────
     5. TICKER
  ───────────────────────────────────────────── */
  const chunk = `<div class="ticker-chunk">${(CREATOR.ticker || [])
    .map((t) => `${t}<i>◆</i>`)
    .join("")}</div>`;
  $("#tickerTrack").innerHTML = chunk + chunk;

  /* ─────────────────────────────────────────────
     6. WHAT WE DO + REEL SPEC
  ───────────────────────────────────────────── */
  $("#caps").innerHTML = CREATOR.whatWeDo
    .map(
      (d, i) => `
      <article class="cap" style="--i:${i}">
        <span class="cap-n">${String(i + 1).padStart(2, "0")}</span>
        <h3>${d.title}</h3>
        <p>${d.text}</p>
      </article>`
    )
    .join("");

  $("#specList").innerHTML = CREATOR.reelSpec
    .map((s, i) => `<li style="--i:${i}">${s}</li>`)
    .join("");

  /* ─────────────────────────────────────────────
     7. PACKAGES — both tracks as open sections
  ───────────────────────────────────────────── */
  const tierCard = (t, i) => `
    <article class="tier${t.popular ? " pop" : ""}" style="--i:${i}">
      <div class="tier-top">
        <span class="tier-name">${t.name}</span>
        ${t.popular ? '<span class="tier-flag">Most popular</span>' : ""}
      </div>
      <div class="tier-body">
        <p class="tier-tag">${t.tagline}</p>
        <p class="tier-price"><span class="tp" data-n="${t.price}">${lkr(t.price)}</span><span class="per">/${t.period}</span></p>
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
     8. INDEX ROWS — one-off shoots + projects.
        Every row is itself an enquiry link.
  ───────────────────────────────────────────── */
  const rowx = (m, i) => `
    <a class="rowx" style="--i:${i}" target="_blank" rel="noopener"
       href="${waTier(m.name)}">
      <span class="rowx-n">${String(i + 1).padStart(2, "0")}</span>
      <span class="rowx-name">${m.name}</span>
      <span class="rowx-note">${m.note}</span>
      <span class="rowx-price">${priceLabel(m)}</span>
      <span class="rowx-arr" aria-hidden="true">↗</span>
    </a>`;

  $("#bundles").innerHTML = CREATOR.bundles.map(rowx).join("");
  $("#projectRows").innerHTML = CREATOR.projects.map(rowx).join("");

  /* ─────────────────────────────────────────────
     9. ACCORDIONS
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
     10. PROCESS
  ───────────────────────────────────────────── */
  $("#steps").innerHTML = CREATOR.process
    .map(
      (p, i) => `
      <article class="step" style="--i:${i}">
        <span class="step-n">${p.num}</span>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
      </article>`
    )
    .join("");

  /* ─────────────────────────────────────────────
     11. CLOSING CTA + FOOTER + MOBILE DOCK
  ───────────────────────────────────────────── */
  $("#ctaTitle").textContent = CREATOR.cta.title;
  $("#ctaText").textContent = CREATOR.cta.text;
  $("#ctaActions").innerHTML = `
    <a class="btn btn-solid" href="${waLink()}" target="_blank" rel="noopener">
      ${waIcon}${c.whatsappLabel}
    </a>
    <a class="btn btn-ghost-light" href="${mailLink()}">${mailIcon}${c.emailLabel}</a>`;

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
     12. LIVE TIMECODE — ticks at 25 fps in the
         viewfinder HUD. Pauses when the tab hides.
  ───────────────────────────────────────────── */
  const tcEls = $$("[data-timecode]");
  if (tcEls.length && !reduced) {
    let frames = 0;
    let tcTimer = null;
    const pad = (n) => String(n).padStart(2, "0");
    const draw = () => {
      frames++;
      const ff = frames % 25;
      const s = Math.floor(frames / 25);
      const label = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(ff)}`;
      tcEls.forEach((el) => (el.textContent = label));
    };
    const start = () => { if (!tcTimer) tcTimer = setInterval(draw, 40); };
    const stop = () => { clearInterval(tcTimer); tcTimer = null; };
    document.addEventListener("visibilitychange", () =>
      document.hidden ? stop() : start()
    );
    if (!document.hidden) start();
  }

  /* ─────────────────────────────────────────────
     13. DUST — a light canvas of drifting motes.
         Skipped for reduced motion; paused when
         the tab is hidden.
  ───────────────────────────────────────────── */
  const canvas = $("#dust");
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, motes = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const count = Math.min(54, Math.round((W * H) / 30000));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.6,
        vy: -(Math.random() * 0.16 + 0.05),
        drift: Math.random() * Math.PI * 2,
        ds: Math.random() * 0.008 + 0.003,
        teal: Math.random() < 0.24,
        a: Math.random() * 0.05 + 0.04,
      }));
    }
    resize();
    window.addEventListener("resize", resize);

    (function tick() {
      requestAnimationFrame(tick);
      if (document.hidden) return;
      ctx.clearRect(0, 0, W, H);
      for (const m of motes) {
        m.drift += m.ds;
        m.x += Math.sin(m.drift) * 0.22;
        m.y += m.vy;
        if (m.y < -4) { m.y = H + 4; m.x = Math.random() * W; }
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = m.teal
          ? `rgba(14, 140, 127, ${m.a + 0.03})`
          : `rgba(20, 24, 29, ${m.a})`;
        ctx.fill();
      }
    })();
  }

  /* ─────────────────────────────────────────────
     14. SIDE TIMELINE — built from the sections
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
     15. PRICE COUNT-UP — runs once per price when
         its card is revealed. A safety timeout
         guarantees the final value regardless.
  ───────────────────────────────────────────── */
  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const target = +el.dataset.n;
    if (reduced || !target) { el.textContent = lkr(target); return; }
    const t0 = performance.now();
    const dur = 640;
    const from = Math.round(target * 0.4);
    (function stepFrame(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = lkr(Math.round(from + (target - from) * eased));
      if (p < 1) requestAnimationFrame(stepFrame);
    })(t0);
    // If rAF never runs (hidden tab), the final value still lands.
    setTimeout(() => (el.textContent = lkr(target)), dur + 150);
  }

  /* ─────────────────────────────────────────────
     16. REVEAL ON SCROLL
         Measured straight from the scroll handler —
         no observer callback that can fail to fire.
  ───────────────────────────────────────────── */
  let pending = $$(".rv, .st");

  // Once a reveal animation finishes, drop it: a filled animation would keep
  // overriding `transform` and block hover lifts on cards and the photo print.
  document.addEventListener("animationend", (e) => {
    if (e.animationName === "riseIn") e.target.style.animation = "none";
  });

  function revealInView() {
    if (!pending.length) return;
    const limit = window.innerHeight * 0.94;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top > limit) return true;
      el.classList.add("rv-on");
      $$(".tp", el).forEach((tp, i) => setTimeout(() => countUp(tp), 120 + i * 70));
      return false;
    });
  }

  if (reduced) {
    pending.forEach((el) => {
      el.classList.add("rv-on");
      $$(".tp", el).forEach(countUp);
    });
    pending = [];
  } else {
    window.addEventListener("load", revealInView);
  }

  /* ─────────────────────────────────────────────
     17. SCROLL STATE — progress, header, timeline,
         dock, film-strip drift, reveals.
  ───────────────────────────────────────────── */
  const head = $("#head");
  const prog = $("#prog");
  const dock = $("#dock");
  const stripRow = $("#stripRow");
  const stripSec = stripRow ? stripRow.closest(".strip") : null;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    prog.style.width = max > 0 ? `${(y / max) * 100}%` : "0%";
    head.classList.toggle("stuck", y > 8);
    dock.classList.toggle("up", y > vh * 0.7);

    // film strip drifts sideways a touch as it passes through the viewport
    if (stripSec && !reduced && window.innerWidth > 720) {
      const r = stripSec.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -0.5 … 0.5
        stripRow.style.transform = `translateX(${(-p * 56).toFixed(1)}px)`;
      }
    }

    let active = -1;
    const line = y + vh * 0.35;
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

  // Runs last: paints the initial state and reveals whatever is on screen.
  onScroll();
})();
