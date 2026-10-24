/* ============================================================
   ZynTECH: CREATOR MODE ENGINE
   Renders the /creator page from js/creator-data.js and runs
   its motion: the viewfinder hero (live timecode, autofocus box
   that follows the pointer), the export panel that renders, the
   film strip, the packages switch, the searchable rate card,
   the timeline and the FAQ.
   Shares the homepage's look (css/style.css) and its habits:
   GSAP + ScrollTrigger + Lenis when they load, a complete page
   without them.
   You normally don't need to edit this file. Edit creator-data.js.
   ============================================================ */

(function () {
  "use strict";

  if (typeof CREATOR === "undefined") return;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduced;
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    root.classList.add("has-gsap");
  } else {
    root.classList.add("no-scenes");
  }
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const pad = (n) => String(n).padStart(2, "0");
  const local = (src = "") => src;            // photo paths in creator-data.js are already relative to /creator

  /* ─────────────────────────────────────────────
     1. CURRENCY: the single formatting helper.
        Never format a price anywhere else.
  ───────────────────────────────────────────── */
  const nf = new Intl.NumberFormat("en-US");
  const lkr = (n) => `LKR ${nf.format(n)}`;
  function priceLabel(item) {
    if (item.display) return esc(item.display);
    let out = lkr(item.price);
    if (item.from) out = `From ${out}`;
    if (item.unit) out += ` <i>/ ${esc(item.unit)}</i>`;
    if (item.suffix) out += ` <i>${esc(item.suffix)}</i>`;
    return out;
  }

  /* ─────────────────────────────────────────────
     2. CONTACT LINKS
  ───────────────────────────────────────────── */
  const c = CREATOR.contact;
  const waLink = (text) => `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(text || c.whatsappText)}`;
  const waTier = (name) => waLink(c.whatsappTierText.replace("{tier}", name));
  const mailLink = () => `mailto:${c.emails.join(",")}?subject=${encodeURIComponent(c.emailSubject)}`;

  const ICON = {
    plus: '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M7 0v14M0 7h14" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
    wa: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.02h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.35c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.2-8.24 8.2zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.65 4.2 3.71.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29z"/></svg>',
  };

  /* ─────────────────────────────────────────────
     3. SHARED PIECES: the mark, split headings, the giant wordmark
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

  function splitWords(el) {
    const text = el.textContent.trim();
    if (!text) return;
    el.setAttribute("aria-label", text);
    el.innerHTML = text
      .split(" ")
      .map((w, i) => `<span class="wm" aria-hidden="true"><span style="--i:${i}">${esc(w)}</span></span>`)
      .join(" ");
  }

  function giant(el, word) {
    el.innerHTML = `<span class="giant__in">${[...word].map((ch, i) => `<span class="ch" style="--i:${i}">${ch === " " ? "&nbsp;" : esc(ch)}</span>`).join("")}</span>`;
    el.style.setProperty("--stretch", "125%");
  }
  function fitGiant(el) {
    const inner = $(".giant__in", el);
    if (!inner) return;
    const cs = getComputedStyle(el);
    const avail = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const prev = el.style.getPropertyValue("--stretch");
    el.style.fontSize = "100px";
    el.style.setProperty("--stretch", "125%");
    const w = inner.getBoundingClientRect().width;
    el.style.setProperty("--stretch", prev || "125%");
    if (w > 0) el.style.fontSize = `${(avail / w) * 100 * 0.995}px`;
  }

  const photos = CREATOR.photos || {};
  const setPhoto = (img, meta) => {
    if (!img) return;
    if (!meta || !meta.src) return img.closest("figure, div").classList.add("noimg");
    img.src = local(meta.src);
    img.alt = meta.alt || "";
    img.onerror = () => img.remove();
  };

  /* ─────────────────────────────────────────────
     4. HERO: the viewfinder
  ───────────────────────────────────────────── */
  const H = CREATOR.hero;
  setPhoto($("#vfImg"), photos.hero);
  $("#vfClip").textContent = (photos.hero && photos.hero.clip) || "";
  const lines = (H.headline || "").split(/(?<=\.)\s+/).filter(Boolean);
  $("#cmTitle").innerHTML = lines.map((l, i) => `<span class="line"><span style="--i:${i}">${esc(l)}</span></span>`).join("");
  $("#heroSub").textContent = H.sub;
  $("#heroActions").innerHTML = `
    <a class="pill pill--light" href="${waLink()}" target="_blank" rel="noopener" data-magnetic>${ICON.wa}${esc(H.ctaPrimary)}</a>
    <a class="arrow-link" href="#packages">${esc(H.ctaSecondary)}</a>`;
  const cheapest = Math.min(...CREATOR.packages.tracks.flatMap((t) => t.tiers.map((x) => x.price)));
  const facts = [...(H.facts || [])];
  facts.splice(Math.min(2, facts.length), 0, { label: "From", value: `${lkr(cheapest)} / month` });
  $("#heroFacts").innerHTML = facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("");

  // live timecode at 25 fps, paused while the tab is hidden
  const tcEls = $$("[data-timecode]");
  if (tcEls.length && !reduced) {
    let frames = 0, timer = null;
    const draw = () => {
      frames++;
      const s = Math.floor(frames / 25);
      const label = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(frames % 25)}`;
      tcEls.forEach((el) => (el.textContent = label));
    };
    const start = () => { if (!timer) timer = setInterval(draw, 40); };
    const stop = () => { clearInterval(timer); timer = null; };
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    if (!document.hidden) start();
  }

  // autofocus: the focus box follows the pointer, then "locks" when it rests
  const vf = $("#top");
  const focus = $("#vfFocus");
  const vfImg = $("#vfImg");
  if (fine && !reduced) {
    let fx = innerWidth / 2, fy = innerHeight / 2, tx = fx, ty = fy, lockT = 0, raf = 0;
    const loop = () => {
      fx += (tx - fx) * 0.14; fy += (ty - fy) * 0.14;
      focus.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
      const r = vf.getBoundingClientRect();
      const px = (fx / r.width - 0.5) * -18, py = ((fy) / r.height - 0.5) * -12;
      vfImg.style.translate = `${px.toFixed(1)}px ${py.toFixed(1)}px`;
      if (Math.abs(tx - fx) + Math.abs(ty - fy) > 0.5) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    vf.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const hud = $(".vf__hud").getBoundingClientRect();
      tx = e.clientX - hud.left; ty = e.clientY - hud.top;
      focus.classList.add("is-on");
      focus.classList.remove("is-locked");
      clearTimeout(lockT);
      lockT = setTimeout(() => focus.classList.add("is-locked"), 380);
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    vf.addEventListener("pointerleave", () => focus.classList.remove("is-on"));
  }

  /* ─────────────────────────────────────────────
     5. TICKER (shares the homepage marquee)
  ───────────────────────────────────────────── */
  const marquee = $("#marquee");
  const chunk = (CREATOR.ticker || []).map((t) => `<span class="marquee__item">${esc(t)}<span class="mark" aria-hidden="true">${logoMark}</span></span>`).join("");
  marquee.innerHTML = chunk + chunk + chunk;
  if (!reduced) {
    let mx = 0, dir = -1, vel = 0, prevY = window.scrollY, third = 0;
    const measure = () => (third = marquee.scrollWidth / 3);
    measure();
    window.addEventListener("resize", measure);
    (function tick() {
      requestAnimationFrame(tick);
      const y = window.scrollY, dy = y - prevY;
      prevY = y;
      if (dy) dir = dy > 0 ? -1 : 1;
      vel += (Math.min(40, Math.abs(dy)) - vel) * 0.1;
      mx += dir * (0.6 + vel * 0.35);
      if (mx <= -third) mx += third;
      if (mx > 0) mx -= third;
      marquee.style.transform = `translate3d(${mx}px, 0, 0) skewX(${(-dir * Math.min(vel, 30) * 0.18).toFixed(2)}deg)`;
    })();
  }

  /* ─────────────────────────────────────────────
     6. WHAT WE DO: a storyboard of four frames
  ───────────────────────────────────────────── */
  $("#board").innerHTML = CREATOR.whatWeDo
    .map(
      (d, i) => `
      <li class="frame" data-reveal style="--i:${i}">
        <span class="frame__sc"><span>Scene ${pad(i + 1)}</span><span>Take 1</span></span>
        <div><h3 class="frame__title">${esc(d.title)}</h3></div>
        <p class="frame__text">${esc(d.text)}</p>
      </li>`
    )
    .join("");

  /* ─────────────────────────────────────────────
     7. EVERY REEL: export settings that render to 100%
  ───────────────────────────────────────────── */
  $("#specRows").innerHTML = CREATOR.reelSpec
    .map((s, i) => (typeof s === "string" ? { label: `Spec ${pad(i + 1)}`, value: s } : s))
    .map((s, i) => `<div style="--i:${i}"><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`)
    .join("");
  const render = $("#render");
  function runRender() {
    const bar = $("#renderBar"), pct = $("#renderPct"), state = $("#renderState");
    const finish = () => { bar.style.transform = "scaleX(1)"; pct.textContent = "100%"; state.textContent = "Ready to post"; render.classList.add("is-done"); };
    if (reduced) return finish();
    const t0 = performance.now() + 500, dur = 2600;
    (function step(now) {
      const p = Math.max(0, Math.min((now - t0) / dur, 1));
      const e = p < 0.85 ? p / 0.85 * 0.92 : 0.92 + (p - 0.85) / 0.15 * 0.08;   // slows near the end, as renders do
      bar.style.transform = `scaleX(${e})`;
      pct.textContent = `${Math.round(e * 100)}%`;
      if (p < 1) requestAnimationFrame(step);
      else finish();
    })(performance.now());
    setTimeout(finish, 3600);
  }

  /* ─────────────────────────────────────────────
     8. FILM STRIP
  ───────────────────────────────────────────── */
  const strip = photos.strip || [];
  const film = $("#film");
  film.innerHTML = [...strip, ...strip, ...strip]
    .map(
      (p) => `
      <figure class="film__frame">
        <img src="${esc(local(p.src))}" alt="${esc(p.alt || "")}" width="640" height="480" loading="lazy" decoding="async" onerror="this.remove()">
        <figcaption><b>${esc(p.label || "")}</b><span>${esc(p.clip || "")}</span></figcaption>
      </figure>`
    )
    .join("");

  /* ─────────────────────────────────────────────
     9. PACKAGES: one switch, two tracks
  ───────────────────────────────────────────── */
  const tracks = CREATOR.packages.tracks;
  const switchEl = $("#trackSwitch");
  const tiersEl = $("#tiers");
  switchEl.innerHTML =
    `<span class="switch__thumb" aria-hidden="true"></span>` +
    tracks
      .map((t, i) => `<button type="button" role="tab" id="track-${esc(t.id)}" aria-controls="tiers" aria-selected="false" tabindex="-1" data-i="${i}">${esc(t.label)}<span>${t.tiers.length}</span></button>`)
      .join("");
  const thumb = $(".switch__thumb", switchEl);
  const tabBtns = $$("button", switchEl);

  const tierCard = (t, i) => `
    <article class="tier${t.popular ? " tier--pop" : ""}" style="--i:${i}">
      <div class="tier__head">
        <h3 class="tier__name">${esc(t.name)}</h3>
        ${t.popular ? '<span class="tier__flag">Most popular</span>' : ""}
      </div>
      <p class="tier__tag">${esc(t.tagline)}</p>
      <p class="tier__price"><b data-n="${t.price}">${lkr(t.price)}</b><span>/ ${esc(t.period)}</span></p>
      <ul class="tier__list">${t.includes.map((li) => `<li>${esc(li)}</li>`).join("")}</ul>
      <a class="pill ${t.popular ? "pill--light" : "pill--dark"}" href="${waTier(t.name)}" target="_blank" rel="noopener">${ICON.wa}Enquire about ${esc(t.name)}</a>
    </article>`;

  function countUp(el) {
    const target = +el.dataset.n;
    if (reduced || !target) return void (el.textContent = lkr(target));
    const t0 = performance.now(), dur = 900, from = Math.round(target * 0.35);
    (function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = lkr(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
    setTimeout(() => (el.textContent = lkr(target)), dur + 200);
  }
  let tiersSeen = false;
  let trackAt = -1;
  function moveThumb() {
    const b = tabBtns[trackAt];
    if (!b) return;
    thumb.style.width = `${b.offsetWidth}px`;
    thumb.style.transform = `translateX(${b.offsetLeft - 6}px)`;
  }
  function showTrack(i, focusTab) {
    if (i === trackAt) return;
    const first = trackAt === -1;
    trackAt = i;
    const t = tracks[i];
    tabBtns.forEach((b, k) => {
      b.setAttribute("aria-selected", String(k === i));
      b.tabIndex = k === i ? 0 : -1;
    });
    if (focusTab) tabBtns[i].focus();
    moveThumb();
    $("#pkgBlurb").textContent = t.blurb;
    const paint = () => {
      tiersEl.dataset.count = t.tiers.length;
      tiersEl.innerHTML = t.tiers.map(tierCard).join("");
      tiersEl.classList.remove("is-out");
      if (tiersSeen) $$("[data-n]", tiersEl).forEach((el, k) => setTimeout(() => countUp(el), 120 + k * 80));
    };
    if (first || reduced) return paint();
    tiersEl.classList.add("is-out");
    setTimeout(paint, 260);
  }
  switchEl.addEventListener("click", (e) => {
    const b = e.target.closest("button[role='tab']");
    if (b) showTrack(+b.dataset.i);
  });
  switchEl.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    showTrack((trackAt + (e.key === "ArrowRight" ? 1 : -1) + tracks.length) % tracks.length, true);
  });
  const popularTrack = Math.max(0, tracks.findIndex((t) => t.tiers.some((x) => x.popular)));
  showTrack(popularTrack);
  $("#pkgNote").textContent = CREATOR.packages.note;
  window.addEventListener("resize", moveThumb);

  /* ─────────────────────────────────────────────
     10. ONE-OFF WORK: every row is an enquiry
  ───────────────────────────────────────────── */
  const row = (m) => `
    <li data-reveal>
      <a href="${waTier(m.name)}" target="_blank" rel="noopener" data-cursor="Enquire">
        <span class="rows__name">${esc(m.name)}</span>
        <span class="rows__price">${priceLabel(m)}</span>
        <span class="rows__note">${esc(m.note)}</span>
        <span class="rows__go">Enquire on WhatsApp</span>
      </a>
    </li>`;
  $("#bundles").innerHTML = CREATOR.bundles.map(row).join("");
  $("#projectRows").innerHTML = CREATOR.projects.map(row).join("");
  $$(".rows").forEach((list) => $$("li", list).forEach((li, i) => li.style.setProperty("--i", i % 4)));

  /* ─────────────────────────────────────────────
     11. RATE CARD: search and filter every rate
  ───────────────────────────────────────────── */
  $("#ratesNote").textContent = CREATOR.aLaCarteNote;
  const allRates = CREATOR.aLaCarte.flatMap((g) => g.items.map((it) => ({ ...it, category: g.category })));
  const cats = ["All", ...CREATOR.aLaCarte.map((g) => g.category)];
  let cat = "All", query = "";
  $("#rateFilters").innerHTML = cats
    .map((name) => `<button type="button" class="filter" aria-pressed="${name === "All"}" data-cat="${esc(name)}">${esc(name)}</button>`)
    .join("");
  const highlight = (text, q) => {
    const safe = esc(text);
    if (!q) return safe;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
    return safe.replace(re, "<mark>$1</mark>");
  };
  function paintRates() {
    const q = query.trim().toLowerCase();
    const hits = allRates.filter((r) => (cat === "All" || r.category === cat) && (!q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)));
    let n = 0;
    const groups = CREATOR.aLaCarte
      .map((g) => {
        const items = hits.filter((h) => h.category === g.category);
        if (!items.length) return "";
        return `
        <div class="rate-group">
          <h3>${esc(g.category)}<span>${items.length} ${items.length === 1 ? "rate" : "rates"}</span></h3>
          ${items.map((it) => `<div class="rate" style="--i:${n++ % 14}"><span class="rate__name">${highlight(it.name, query.trim())}</span><span class="rate__dots" aria-hidden="true"></span><span class="rate__price">${priceLabel(it)}</span></div>`).join("")}
        </div>`;
      })
      .join("");
    $("#rateList").innerHTML =
      groups ||
      `<p class="rate-empty">Nothing on the card matches “${esc(query.trim())}”. <a href="${waLink(`Hi ZynTECH, do you do ${query.trim()}?`)}" target="_blank" rel="noopener">Ask us on WhatsApp</a> and we’ll quote it.</p>`;
    $("#rateCount").textContent = `Showing ${hits.length} of ${allRates.length} rates`;
  }
  $("#rateFilters").addEventListener("click", (e) => {
    const b = e.target.closest(".filter");
    if (!b) return;
    cat = b.dataset.cat;
    $$(".filter", $("#rateFilters")).forEach((f) => f.setAttribute("aria-pressed", String(f === b)));
    paintRates();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
  let rateT = 0;
  $("#rateSearch").addEventListener("input", (e) => {
    query = e.target.value;
    clearTimeout(rateT);
    rateT = setTimeout(() => { paintRates(); if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 90);
  });
  paintRates();

  /* ─────────────────────────────────────────────
     12. PROCESS: a timeline that draws as you scroll
  ───────────────────────────────────────────── */
  $("#steps").innerHTML = CREATOR.process
    .map(
      (p, i) => `
      <li data-reveal style="--i:${i}">
        <span class="timeline__tc">00:00:${pad(i + 1)}:00</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.text)}</p>
      </li>`
    )
    .join("");

  /* ─────────────────────────────────────────────
     13. FAQ: one answer open at a time
  ───────────────────────────────────────────── */
  setPhoto($("#winImg"), photos.faq);
  $("#winUrl").textContent = (photos.faq && photos.faq.url) || "";
  const faq = $("#faqAcc");
  faq.innerHTML = CREATOR.faq
    .map(
      (f, i) => `
      <div class="qa" data-reveal style="--i:${i % 5}">
        <h3><button type="button" class="qa__q" id="qa-${i}" aria-expanded="false" aria-controls="qa-${i}-a"><span>${esc(f.q)}</span><span class="qa__icon">${ICON.plus}</span></button></h3>
        <div class="qa__a" id="qa-${i}-a" role="region" aria-labelledby="qa-${i}"><div><p>${esc(f.a)}</p></div></div>
      </div>`
    )
    .join("");
  faq.addEventListener("click", (e) => {
    const btn = e.target.closest(".qa__q");
    if (!btn) return;
    const item = btn.closest(".qa");
    const open = !item.classList.contains("is-open");
    $$(".qa.is-open", faq).forEach((q) => { q.classList.remove("is-open"); $(".qa__q", q).setAttribute("aria-expanded", "false"); });
    item.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 620);
  });

  /* ─────────────────────────────────────────────
     14. CLOSING CTA, FOOTER, MENU, DOCK
  ───────────────────────────────────────────── */
  $("#ctaTitle").textContent = CREATOR.cta.title;
  $("#ctaText").textContent = CREATOR.cta.text;
  $("#ctaActions").innerHTML = `
    <a class="pill pill--light" href="${waLink()}" target="_blank" rel="noopener" data-magnetic>${ICON.wa}${esc(c.whatsappLabel)}</a>
    <a class="pill pill--outline" href="${mailLink()}">${esc(c.emailLabel)}</a>`;
  setPhoto($("#printImg"), photos.cta);
  $("#printCap").textContent = (photos.cta && photos.cta.caption) || "";

  $("#footWa").href = waLink();
  $("#menuWa").href = waLink();
  $("#footContact").insertAdjacentHTML(
    "beforeend",
    `<a href="${waLink()}" target="_blank" rel="noopener">WhatsApp</a>` + c.emails.map((m) => `<a href="mailto:${esc(m)}">${esc(m)}</a>`).join("")
  );
  const based = (H.facts || []).find((f) => /based/i.test(f.label));
  $("#footStudio").insertAdjacentHTML(
    "beforeend",
    `<p>Creator Mode by ZynTECH</p><p>${esc(based ? based.value : "Sri Lanka")}</p><p>Social content production</p>`
  );
  const brand = typeof SITE !== "undefined" ? SITE.brand : null;
  $("#footCopy").textContent = `© ${new Date().getFullYear()} ${brand ? brand.name : "ZynTECH"}. All rights reserved.`;
  const footWord = $("#footWord");
  giant(footWord, "CREATOR MODE");

  const dock = $("#dock");
  dock.innerHTML = `<a class="pill pill--light" href="${waLink()}" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a><a class="dock__link" href="#packages">Packages</a>`;

  $$("[data-split]").forEach(splitWords);

  /* ─────────────────────────────────────────────
     15. SMOOTH SCROLL + anchors
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
     16. HEADER, MENU, SECTION TIMECODE, DOCK
  ───────────────────────────────────────────── */
  const nav = $("#nav");
  const menu = $("#menu");
  const menuButton = $("#menuButton");
  const navLinks = $$(".nav__links a[href^='#']");
  const tcSections = $$("[data-tc]");
  const hudCode = $("#tcHudCode"), hudLabel = $("#tcHudLabel");
  const footer = $("#footer");
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("is-hidden", y > lastY && y > 240 && menu.hidden);
    lastY = y;
    let current = tcSections[0];
    for (const s of tcSections) if (s.getBoundingClientRect().top <= innerHeight * 0.4) current = s;
    if (current && hudCode.textContent !== current.dataset.tc) {
      hudCode.textContent = current.dataset.tc;
      hudLabel.textContent = current.dataset.label;
    }
    navLinks.forEach((l) => {
      const sec = document.querySelector(l.getAttribute("href"));
      l.classList.toggle("is-current", !!sec && current === sec);
    });
    const footTop = footer.getBoundingClientRect().top;
    dock.classList.toggle("is-up", y > innerHeight * 0.7 && footTop > innerHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

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
  onScroll();

  /* ─────────────────────────────────────────────
     17. CURSOR, MAGNETIC BUTTONS, LINK SCRAMBLE (mouse only)
  ───────────────────────────────────────────── */
  if (fine && !reduced) {
    root.classList.add("has-cursor");
    const cur = $("#cursor");
    const label = $("#cursorLabel");
    cur.classList.add("is-hidden");
    window.addEventListener("pointermove", (e) => {
      cur.classList.remove("is-hidden");
      cur.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }, { passive: true });
    document.addEventListener("pointerover", (e) => {
      const lab = e.target.closest("[data-cursor]");
      const link = e.target.closest("a, button, label, input");
      cur.classList.toggle("is-label", !!lab);
      cur.classList.toggle("is-link", !lab && !!link);
      label.textContent = lab ? lab.dataset.cursor : "";
    });
    document.addEventListener("pointerleave", () => cur.classList.add("is-hidden"));

    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.28, dy = (e.clientY - r.top - r.height / 2) * 0.35;
        if (hasGsap) gsap.to(el, { x: dx, y: dy, duration: 0.5, ease: "power3.out" });
        else el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener("pointerleave", () => {
        if (hasGsap) gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
        else el.style.transform = "";
      });
    });

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
          el.textContent = [...text].map((ch, i) => (i < solved || ch === " " ? ch : glyphs[(Math.random() * glyphs.length) | 0])).join("");
          if (p < 1) raf = requestAnimationFrame(step);
          else { el.textContent = text; el.style.width = ""; }
        })(t0);
      });
    });
  }

  /* ─────────────────────────────────────────────
     18. SCROLL SCENES (GSAP)
  ───────────────────────────────────────────── */
  if (hasGsap) {
    // the viewfinder pushes in as you leave it
    gsap.to(".vf__picture", { scale: 1.12, ease: "none", scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".vf__content", { yPercent: -14, opacity: 0.3, ease: "none", scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true } });

    // the film strip runs past
    gsap.fromTo(film, { x: () => -innerWidth * 0.1 }, {
      x: () => -(film.scrollWidth - innerWidth * 0.9), ease: "none",
      scrollTrigger: { trigger: ".film", start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
    });

    // the timeline draws, and each step lights as the line reaches it
    const steps = $$("#steps li");
    gsap.fromTo("#timelineFill", { scaleX: 0 }, {
      scaleX: 1, ease: "none",
      scrollTrigger: {
        trigger: "#timeline", start: "top 78%", end: "bottom 55%", scrub: true,
        onUpdate: (s) => steps.forEach((li, i) => li.classList.toggle("is-lit", s.progress >= (i / steps.length) + 0.02)),
      },
    });

    // the footer wordmark opens as the curtain lifts
    gsap.fromTo(footWord, { "--stretch": "70%" }, {
      "--stretch": "125%", ease: "none",
      scrollTrigger: { trigger: "#cm-contact", start: "bottom bottom", end: "bottom top", scrub: true },
    });
  }

  /* ─────────────────────────────────────────────
     19. ENTRANCES, the render, the first prices
  ───────────────────────────────────────────── */
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
        if (e.target === render) runRender();
        if (e.target === tiersEl && !tiersSeen) {
          tiersSeen = true;
          $$("[data-n]", tiersEl).forEach((el, k) => setTimeout(() => countUp(el), 160 + k * 90));
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0 }
  );
  $$("[data-reveal], [data-split]").forEach((el) => io.observe(el));
  io.observe(render);
  io.observe(tiersEl);

  /* ─────────────────────────────────────────────
     20. FIT THE WORDMARK and settle the scenes
  ───────────────────────────────────────────── */
  const refit = () => {
    fitGiant(footWord);
    moveThumb();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  };
  refit();
  if (document.fonts) document.fonts.ready.then(refit);
  let rt = 0;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(refit, 150); });
  window.addEventListener("load", () => window.ScrollTrigger && ScrollTrigger.refresh());
})();
