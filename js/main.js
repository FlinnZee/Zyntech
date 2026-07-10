/* ============================================================
   ZynTECH — Site Engine
   Renders content from js/data.js and powers all motion.
   Uses GSAP + ScrollTrigger + Lenis when available (CDN),
   falls back to IntersectionObserver reveals otherwise.
   You normally don't need to edit this file — edit data.js.
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const gsapReady = !!(window.gsap && window.ScrollTrigger) && !reducedMotion;

  if (gsapReady) {
    document.documentElement.classList.add("has-gsap");
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ─────────────────────────────────────────────
     1. LOGO MARK (inline SVG so the bars animate)
  ───────────────────────────────────────────── */
  const logoMark = (uid) => `
    <svg viewBox="0 0 200 340" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="zc-${uid}" x1="0" y1="120" x2="200" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#f5f7fa"/><stop offset="0.5" stop-color="#c7cdd8"/><stop offset="1" stop-color="#eef1f6"/>
        </linearGradient>
        <linearGradient id="bg-${uid}" x1="0" y1="0" x2="0" y2="340" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#b8bec9"/><stop offset="1" stop-color="#8a919e"/>
        </linearGradient>
      </defs>
      <rect class="eq eq-t eq-d1" x="52"  y="58"  width="26" height="56" fill="url(#bg-${uid})"/>
      <rect class="eq eq-t eq-d2" x="87"  y="18"  width="26" height="96" fill="url(#bg-${uid})"/>
      <rect class="eq eq-t eq-d3" x="122" y="40"  width="26" height="74" fill="url(#bg-${uid})"/>
      <path d="M46 126 H158 V150 L92 190 H158 V214 H42 V190 L108 150 H46 Z" fill="url(#zc-${uid})"/>
      <rect class="eq eq-b eq-d3" x="52"  y="226" width="26" height="74" fill="url(#bg-${uid})"/>
      <rect class="eq eq-b eq-d2" x="87"  y="226" width="26" height="96" fill="url(#bg-${uid})"/>
      <rect class="eq eq-b eq-d1" x="122" y="226" width="26" height="56" fill="url(#bg-${uid})"/>
    </svg>`;
  $$("[data-logo-mark]").forEach((el, i) => (el.innerHTML = logoMark(i)));

  /* ─────────────────────────────────────────────
     2. RENDER CONTENT FROM data.js
  ───────────────────────────────────────────── */

  // Simple data-bind: <el data-bind="hero.badge">
  $$("[data-bind]").forEach((el) => {
    const path = el.dataset.bind.split(".");
    let val = SITE;
    for (const key of path) val = val?.[key];
    if (val != null) el.textContent = val;
  });

  // Hero CTAs
  $("#ctaPrimary").textContent = SITE.hero.ctaPrimary.label;
  $("#ctaPrimary").href = SITE.hero.ctaPrimary.href;
  $("#ctaSecondary").textContent = SITE.hero.ctaSecondary.label;
  $("#ctaSecondary").href = SITE.hero.ctaSecondary.href;

  // Stats
  $("#statsRow").innerHTML = SITE.stats
    .map(
      (s) => `
      <div class="stat">
        <div class="stat-num" data-count="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</div>
        <div class="stat-label">${s.label}</div>
      </div>`
    )
    .join("");

  // Services marquee strip (built from service titles, twice for a seamless loop)
  const chunk = `<div class="marquee-chunk">${SITE.services
    .map((s) => `${s.title}<i>◆</i>`)
    .join("")}</div>`;
  $("#marqueeTrack").innerHTML = chunk + chunk;

  // About points
  $("#aboutPoints").innerHTML = SITE.about.points
    .map(
      (p, i) => `
      <div class="about-point card reveal" style="transition-delay:${i * 90}ms">
        <div class="about-point-icon">0${i + 1}</div>
        <div><h3>${p.title}</h3><p>${p.text}</p></div>
      </div>`
    )
    .join("");

  // Services
  $("#servicesGrid").innerHTML = SITE.services
    .map(
      (s, i) => `
      <div class="card service-card tilt reveal" style="transition-delay:${(i % 3) * 90}ms">
        <div class="service-icon"><svg><use href="#ic-${s.icon}"/></svg></div>
        <h3>${s.title}</h3>
        <p>${s.text}</p>
        <div class="tag-row">${s.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      </div>`
    )
    .join("");

  // Process
  $("#processGrid").innerHTML = SITE.process
    .map(
      (p, i) => `
      <div class="card process-step reveal" style="transition-delay:${i * 100}ms">
        <div class="process-num">${p.num}</div>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
      </div>`
    )
    .join("");

  // Work / projects — cards with a `link` open the live project.
  $("#workGrid").innerHTML = SITE.projects
    .map((w, i) => {
      const inner = `
        <div class="work-art work-art-${w.accent}">
          <div class="work-orb"></div>
          <div class="work-glyph">${w.title.charAt(0)}</div>
          <span class="work-arrow">↗</span>
        </div>
        <div class="work-body">
          <span class="work-cat">${w.category}</span>
          <h3>${w.title}</h3>
          <p class="work-text">${w.text}</p>
          <div class="tag-row">${w.stack.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        </div>`;
      const attrs = `class="card work-card tilt reveal" style="transition-delay:${(i % 3) * 90}ms"`;
      return w.link
        ? `<a ${attrs} href="${w.link}" target="_blank" rel="noopener">${inner}</a>`
        : `<div ${attrs}>${inner}</div>`;
    })
    .join("");

  // Team
  $("#teamGrid").innerHTML = SITE.team
    .map((m, i) => {
      const links = [];
      if (m.links.email)
        links.push(`<a class="team-link" href="mailto:${m.links.email}" aria-label="Email ${m.name}"><svg><use href="#ic-mail"/></svg></a>`);
      if (m.links.github)
        links.push(`<a class="team-link" href="${m.links.github}" target="_blank" rel="noopener" aria-label="${m.name} on GitHub"><svg><use href="#ic-github"/></svg></a>`);
      if (m.links.linkedin)
        links.push(`<a class="team-link" href="${m.links.linkedin}" target="_blank" rel="noopener" aria-label="${m.name} on LinkedIn"><svg><use href="#ic-linkedin"/></svg></a>`);
      const photo = m.photo
        ? `<img class="avatar-img" src="${m.photo}" alt="${m.name}" loading="lazy" onerror="this.remove()">`
        : "";
      return `
      <div class="card team-card tilt reveal" style="transition-delay:${i * 110}ms">
        <div class="avatar">${m.initials}${photo}</div>
        <h3>${m.name}</h3>
        <span class="team-role">${m.role}</span>
        <p class="team-bio">${m.bio}</p>
        <div class="team-skills">${m.skills.map((s) => `<span class="tag">${s}</span>`).join("")}</div>
        <div class="team-links">${links.join("")}</div>
      </div>`;
    })
    .join("");

  // Testimonials
  const star = '<svg><use href="#ic-star"/></svg>';
  $("#tTrack").innerHTML = SITE.testimonials
    .map(
      (t) => `
      <div class="tcard">
        <div class="tstars">${star.repeat(t.stars)}</div>
        <p class="tquote">${t.quote}</p>
        <div class="tname">${t.name}</div>
        <div class="trole">${t.role}</div>
      </div>`
    )
    .join("");

  // Contact + footer
  const b = SITE.brand;
  $("#contactEmail").textContent = b.email;
  $("#contactEmail").href = `mailto:${b.email}`;
  $("#contactPhone").textContent = b.phone;
  $("#contactPhone").href = `tel:${b.phone.replace(/\s/g, "")}`;
  $("#contactLocation").textContent = b.location;
  $("#footerNote").textContent = SITE.footer.note;
  $("#footerEmail").textContent = b.email;
  $("#footerEmail").href = `mailto:${b.email}`;
  $("#footerPhone").textContent = b.phone;
  $("#footerPhone").href = `tel:${b.phone.replace(/\s/g, "")}`;
  $("#footerLocation").textContent = b.location;
  $("#footerCopy").textContent = `© ${SITE.footer.year} ${b.name}. All rights reserved.`;
  $("#footerCredit").innerHTML = SITE.footer.credit.replace(
    "Theekshana Nirmal",
    "<b>Theekshana Nirmal</b>"
  );

  /* ─────────────────────────────────────────────
     3. SMOOTH SCROLL (Lenis) + anchor handling
  ───────────────────────────────────────────── */
  let lenis = null;
  if (gsapReady && window.Lenis) {
    document.documentElement.style.scrollBehavior = "auto";
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: -(document.querySelector(".nav").offsetHeight + 8) });
    else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    else target.scrollIntoView({ behavior: "smooth" });
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    scrollToTarget(target);
    history.replaceState(null, "", id);
  });

  /* ─────────────────────────────────────────────
     4. WORD-SPLIT TITLES (for staggered reveals)
  ───────────────────────────────────────────── */
  function splitWords(el) {
    [...el.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(document.createTextNode(part));
          const clip = document.createElement("span");
          clip.className = "wclip";
          const w = document.createElement("span");
          w.className = "w";
          w.textContent = part;
          clip.append(w);
          frag.append(clip);
        });
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "BR") {
        splitWords(node);
      }
    });
  }

  /* ─────────────────────────────────────────────
     5. SCROLL ANIMATIONS
        GSAP path: word reveals, staggers, parallax.
        Fallback: IntersectionObserver + CSS classes.
  ───────────────────────────────────────────── */
  if (gsapReady) {
    // Titles rise word by word
    $$(".hero-title, .section-title").forEach(splitWords);

    $$(".section-title").forEach((title) => {
      gsap.to($$(".w", title), {
        y: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.055,
        scrollTrigger: { trigger: title, start: "top 87%", once: true },
      });
    });

    // Generic reveals outside the hero
    $$(".reveal").forEach((el) => {
      if (el.closest("#home")) return;
      const td = el.style.transitionDelay || "0s";
      const delay = td.endsWith("ms") ? parseFloat(td) / 1000 : parseFloat(td) || 0;
      gsap.fromTo(
        el,
        { y: 42, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    });

    // Hero intro timeline (kicked off when the preloader lifts)
    const heroTl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    heroTl
      .to(".hero-badge", { opacity: 1, y: 0, duration: 0.7 }, 0)
      .set(".hero-title", { opacity: 1, y: 0 }, 0.1)
      .to($$(".hero-title .w"), { y: 0, duration: 1, ease: "power4.out", stagger: 0.06 }, 0.1)
      .to(".hero-typing", { opacity: 1, y: 0, duration: 0.7 }, 0.55)
      .to(".hero-sub", { opacity: 1, y: 0, duration: 0.7 }, 0.7)
      .to(".hero-cta", { opacity: 1, y: 0, duration: 0.7 }, 0.85)
      .to(".hero-stats", { opacity: 1, y: 0, duration: 0.8 }, 1.0);
    gsap.set(".hero .reveal", { y: 26, opacity: 0 });
    window.__heroIntro = () => heroTl.play();

    // Scrub parallax details
    gsap.to(".hero-watermark", {
      yPercent: 24,
      rotation: 5,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.fromTo(
      ".about-visual",
      { y: 50 },
      {
        y: -50,
        ease: "none",
        scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true },
      }
    );
    $$(".work-orb").forEach((orb) => {
      gsap.fromTo(
        orb,
        { y: 26 },
        {
          y: -26,
          ease: "none",
          scrollTrigger: { trigger: orb.closest(".work-card"), start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            revealObserver.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    $$(".reveal").forEach((el) => revealObserver.observe(el));
  }

  /* ─────────────────────────────────────────────
     6. PRELOADER
  ───────────────────────────────────────────── */
  function dismissPreloader() {
    const pl = $("#preloader");
    if (pl.classList.contains("done")) return;
    pl.classList.add("done");
    if (window.__heroIntro) window.__heroIntro();
  }
  window.addEventListener("load", () => setTimeout(dismissPreloader, reducedMotion ? 0 : 450));
  setTimeout(dismissPreloader, 3500); // never trap the user behind the loader

  /* ─────────────────────────────────────────────
     7. CUSTOM CURSOR (desktop only)
  ───────────────────────────────────────────── */
  if (finePointer && !reducedMotion) {
    const dot = $("#cursorDot");
    const ring = $("#cursorRing");
    let mx = -100, my = -100, rx = -100, ry = -100;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    }, { passive: true });

    (function followRing() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(followRing);
    })();

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, .card, input, textarea")) ring.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("a, button, .card, input, textarea")) ring.classList.remove("is-hover");
    });
  } else {
    $("#cursorDot").style.display = "none";
    $("#cursorRing").style.display = "none";
  }

  /* ─────────────────────────────────────────────
     8. HERO PARTICLE CONSTELLATION
  ───────────────────────────────────────────── */
  const canvas = $("#particleCanvas");
  if (canvas && !reducedMotion) {
    const ctx = canvas.getContext("2d");
    let W, H, particles = [];
    const mouse = { x: -9999, y: -9999 };
    const COUNT = () => Math.min(90, Math.floor((W * H) / 16000));
    const LINK_DIST = 130;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = rect.width;
      H = canvas.height = rect.height;
      particles = Array.from({ length: COUNT() }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
        tw: Math.random() * Math.PI * 2,          // twinkle phase
      }));
    }
    resize();
    window.addEventListener("resize", resize);

    canvas.parentElement.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });
    canvas.parentElement.addEventListener("mouseleave", () => {
      mouse.x = -9999; mouse.y = -9999;
    });

    let heroVisible = true;
    new IntersectionObserver(([entry]) => (heroVisible = entry.isIntersecting))
      .observe(canvas);

    (function tick() {
      requestAnimationFrame(tick);
      if (!heroVisible) return;
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120) {
          const d = Math.sqrt(d2) || 1;
          p.x += (dx / d) * 1.4;
          p.y += (dy / d) * 1.4;
        }
        p.x += p.vx; p.y += p.vy;
        p.tw += 0.02;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 185, 210, ${0.35 + 0.3 * Math.sin(p.tw)})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], c = particles[j];
          const dx = a.x - c.x, dy = a.y - c.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(c.x, c.y);
            ctx.strokeStyle = `rgba(56, 225, 255, ${0.14 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    })();
  }

  /* ─────────────────────────────────────────────
     9. TYPING ROTATOR
  ───────────────────────────────────────────── */
  const typingEl = $("#typingWord");
  if (typingEl) {
    const words = SITE.hero.rotatingWords;
    let wi = 0, ci = 0, deleting = false;

    (function type() {
      const word = words[wi];
      if (reducedMotion) {
        typingEl.textContent = word;
        setTimeout(() => { wi = (wi + 1) % words.length; type(); }, 2600);
        return;
      }
      typingEl.textContent = word.slice(0, ci);
      if (!deleting) {
        if (ci++ < word.length) return void setTimeout(type, 65);
        deleting = true;
        return void setTimeout(type, 1700);
      }
      if (ci-- > 0) return void setTimeout(type, 32);
      deleting = false;
      wi = (wi + 1) % words.length;
      setTimeout(type, 300);
    })();
  }

  /* ─────────────────────────────────────────────
     10. SCROLL STATE: progress bar, nav, back-top,
         active section link
  ───────────────────────────────────────────── */
  const nav = $("#nav");
  const progress = $("#scrollProgress");
  const backTop = $("#backTop");
  const sections = $$("section[id], .hero[id]");
  const navLinks = $$(".nav-link");

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${(y / max) * 100}%`;
    nav.classList.toggle("scrolled", y > 30);
    backTop.classList.toggle("show", y > 700);

    let current = "home";
    for (const s of sections) {
      if (y >= s.offsetTop - innerHeight * 0.4) current = s.id;
    }
    navLinks.forEach((l) =>
      l.classList.toggle("is-active", l.getAttribute("href") === `#${current}`)
    );
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backTop.addEventListener("click", () => scrollToTarget(0));

  /* ─────────────────────────────────────────────
     11. MOBILE MENU
  ───────────────────────────────────────────── */
  const burger = $("#navBurger");
  const links = $("#navLinks");
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", (e) => {
    if (e.target.matches(".nav-link")) {
      links.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ─────────────────────────────────────────────
     12. ANIMATED COUNTERS
  ───────────────────────────────────────────── */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        counterObserver.unobserve(e.target);
        const el = e.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || "";
        if (reducedMotion) { el.textContent = target + suffix; continue; }
        const t0 = performance.now();
        const dur = 1600;
        (function step(now) {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      }
    },
    { threshold: 0.5 }
  );
  $$("[data-count]").forEach((el) => counterObserver.observe(el));

  /* ─────────────────────────────────────────────
     13. CARD SPOTLIGHT + 3D TILT
  ───────────────────────────────────────────── */
  if (finePointer && !reducedMotion) {
    document.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);

      if (card.classList.contains("tilt")) {
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateY(${px * 7}deg) rotateX(${py * -7}deg) translateY(-4px)`;
      }
    }, { passive: true });

    document.addEventListener("mouseout", (e) => {
      const card = e.target.closest(".card.tilt");
      if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
    });
  }

  /* ─────────────────────────────────────────────
     14. MAGNETIC BUTTONS
  ───────────────────────────────────────────── */
  if (finePointer && !reducedMotion) {
    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ─────────────────────────────────────────────
     15. TESTIMONIAL SLIDER
  ───────────────────────────────────────────── */
  const track = $("#tTrack");
  const dotsWrap = $("#tDots");
  const total = SITE.testimonials.length;
  let index = 0, timer;

  dotsWrap.innerHTML = SITE.testimonials
    .map((_, i) => `<button class="tdot${i === 0 ? " active" : ""}" data-i="${i}" aria-label="Testimonial ${i + 1}"></button>`)
    .join("");

  function goTo(i) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    $$(".tdot", dotsWrap).forEach((d, di) => d.classList.toggle("active", di === index));
  }
  function autoplay() {
    clearInterval(timer);
    if (!reducedMotion) timer = setInterval(() => goTo(index + 1), 5500);
  }
  $("#tPrev").addEventListener("click", () => { goTo(index - 1); autoplay(); });
  $("#tNext").addEventListener("click", () => { goTo(index + 1); autoplay(); });
  dotsWrap.addEventListener("click", (e) => {
    const d = e.target.closest(".tdot");
    if (d) { goTo(+d.dataset.i); autoplay(); }
  });
  let touchX = null;
  track.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  track.addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) goTo(index + (dx < 0 ? 1 : -1));
    touchX = null;
    autoplay();
  }, { passive: true });
  autoplay();

  /* ─────────────────────────────────────────────
     16. CONTACT FORM (mailto — no backend needed)
  ───────────────────────────────────────────── */
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#fName").value.trim();
    const email = $("#fEmail").value.trim();
    const subject = $("#fSubject").value.trim();
    const message = $("#fMessage").value.trim();
    const body = encodeURIComponent(
      `Hi ZynTECH team,\n\n${message}\n\n— ${name}\n${email}`
    );
    window.location.href = `mailto:${SITE.brand.email}?subject=${encodeURIComponent(
      `[ZynTECH] ${subject}`
    )}&body=${body}`;
  });

  /* ─────────────────────────────────────────────
     17. HERO CONTENT PARALLAX
  ───────────────────────────────────────────── */
  if (!reducedMotion) {
    const heroContent = $(".hero-content");
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < innerHeight) {
        heroContent.style.transform = `translateY(${y * 0.18}px)`;
        heroContent.style.opacity = 1 - (y / innerHeight) * 0.9;
      }
    }, { passive: true });
  }
})();
