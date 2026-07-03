/* ============================================================
   ZynTECH — SITE CONTENT
   ------------------------------------------------------------
   ✏️  EDIT THIS FILE TO UPDATE THE WEBSITE.
   Everything on the site (services, team, projects,
   testimonials, contact info, stats) lives here.
   No coding knowledge needed — just edit the text between
   quotes, save, refresh the page.
   ============================================================ */

const SITE = {

  /* ---------- BRAND ---------- */
  brand: {
    name: "ZynTECH",
    tagline: "Engineering the Future of Digital",
    description:
      "ZynTECH is a full-spectrum IT solutions agency. From custom systems and secure applications to cinematic content and social growth — we design, build and scale digital experiences that move businesses forward.",
    location: "Sri Lanka · Serving Worldwide",
    email: "tnirmal122@gmail.com",
    phone: "+94 70 123 3971",
  },

  /* ---------- HERO ---------- */
  hero: {
    badge: "Full-Spectrum IT Solutions Agency",
    headlineTop: "We Engineer the",
    headlineHighlight: "Future of Digital.",
    // Words that rotate in the typing animation:
    rotatingWords: [
      "Custom Systems",
      "Web Platforms",
      "Mobile Apps",
      "Cyber Security",
      "SaaS Products",
      "Cinematic Content",
      "Social Growth",
    ],
    sub:
      "One agency. Every digital capability. We turn ambitious ideas into secure, scalable and stunning products.",
    ctaPrimary: { label: "Start a Project", href: "#contact" },
    ctaSecondary: { label: "Explore Services", href: "#services" },
  },

  /* ---------- STATS (animated counters) ---------- */
  stats: [
    { value: 30, suffix: "+", label: "Projects Delivered" },
    { value: 5,  suffix: "+", label: "Years Combined Experience" },
    { value: 9,  suffix: "",  label: "Core Service Lines" },
    { value: 100, suffix: "%", label: "Client Commitment" },
  ],

  /* ---------- ABOUT ---------- */
  about: {
    title: "A Digital Agency Built Different",
    lead:
      "ZynTECH was founded on a simple idea — businesses shouldn't need five vendors to go digital. We merged deep engineering with creative production under one roof.",
    points: [
      {
        title: "Engineering-Grade Builds",
        text: "Production-ready systems built with modern stacks — React, Node.js, Python, Flutter and cloud-native architecture on AWS.",
      },
      {
        title: "Security in Our DNA",
        text: "Every product we ship is hardened by design. We also audit and secure what you already run.",
      },
      {
        title: "Creative Firepower",
        text: "In-house video editing, branding and content strategy — so your product doesn't just work, it wins attention.",
      },
      {
        title: "End-to-End Ownership",
        text: "Strategy, design, development, launch and growth. One team, fully accountable.",
      },
    ],
  },

  /* ---------- SERVICES ----------
     icon: pick from → system | web | mobile | security | saas |
                       uiux | video | social | cloud            */
  services: [
    {
      icon: "system",
      title: "Custom Systems & Software",
      text: "Tailor-made business systems, automation tools and enterprise software engineered around your exact workflow.",
      tags: ["Python", "Automation", "APIs"],
    },
    {
      icon: "web",
      title: "Web Development",
      text: "High-performance websites and web apps — from landing pages to platforms serving hundreds of thousands of users.",
      tags: ["React", "Node.js", "WordPress"],
    },
    {
      icon: "mobile",
      title: "Mobile App Development",
      text: "Beautiful cross-platform apps for Android & iOS from a single codebase, built to feel truly native.",
      tags: ["Flutter", "Swift", "Dart"],
    },
    {
      icon: "security",
      title: "Cyber Security",
      text: "Security assessments, hardening and compromise detection that keep your infrastructure and data protected.",
      tags: ["Auditing", "Hardening", "Monitoring"],
    },
    {
      icon: "saas",
      title: "SaaS Solutions",
      text: "From idea to subscription-ready product — multi-tenant architecture, billing, analytics and scale built in.",
      tags: ["Cloud-Native", "Scalable", "B2B/B2C"],
    },
    {
      icon: "uiux",
      title: "UI / UX Design",
      text: "Interfaces users love — glassmorphism, motion design and conversion-focused flows crafted in Figma.",
      tags: ["Figma", "Prototyping", "Design Systems"],
    },
    {
      icon: "video",
      title: "Video Editing & Production",
      text: "Cinematic edits, YouTube content, ads and brand films — with thumbnails and packaging that earn the click.",
      tags: ["Editing", "Thumbnails", "Storytelling"],
    },
    {
      icon: "social",
      title: "Social Media Management",
      text: "Content calendars, branding and audience growth strategies that turn followers into customers.",
      tags: ["Strategy", "Content", "Growth"],
    },
    {
      icon: "cloud",
      title: "Cloud & DevOps",
      text: "AWS deployments, CI/CD pipelines and infrastructure that scales with you — without the surprise bills.",
      tags: ["AWS", "CI/CD", "Linux"],
    },
  ],

  /* ---------- PROCESS ---------- */
  process: [
    { num: "01", title: "Discover", text: "We dig into your goals, users and constraints to define exactly what success looks like." },
    { num: "02", title: "Design",   text: "Wireframes to polished UI — you see and approve the experience before a line of code." },
    { num: "03", title: "Build",    text: "Agile sprints with weekly demos. Secure, tested, production-grade engineering." },
    { num: "04", title: "Launch & Grow", text: "Deployment, monitoring and content that drives adoption. We stay for the long run." },
  ],

  /* ---------- PROJECTS / WORK ----------
     accent: a | b | c | d  (changes the card artwork colours) */
  projects: [
    {
      title: "CareLink — Caregiver Platform",
      category: "Web Application",
      text: "Full-stack care coordination platform connecting caregivers and families, with scheduling and secure records.",
      stack: ["ReactJS", "Node.js", "MySQL"],
      accent: "a",
    },
    {
      title: "High-Load REST API Platform",
      category: "Backend Systems",
      text: "API layer engineered to serve dynamic data to 500,000+ concurrent users with sub-second response times.",
      stack: ["Node.js", "PostgreSQL", "AWS"],
      accent: "b",
    },
    {
      title: "AI Virtual Assistant",
      category: "AI & Automation",
      text: "Conversational assistant built on TensorFlow with LUIS language understanding and MS Bot Framework.",
      stack: ["TensorFlow", "LUIS", "Bot Framework"],
      accent: "c",
    },
    {
      title: "Wave — Cross-Platform Music App",
      category: "Mobile App",
      text: "Spotify-class streaming experience for Android & iOS built with Flutter from a single codebase.",
      stack: ["Flutter", "Dart"],
      accent: "d",
    },
    {
      title: "Atmos — Weather Experience UI",
      category: "UI / UX Design",
      text: "Responsive weather application interface designed and user-tested in Figma with glassmorphism styling.",
      stack: ["Figma", "UI/UX"],
      accent: "b",
    },
    {
      title: "Hanzy — Brand & Channel Growth",
      category: "Content & Social",
      text: "End-to-end YouTube brand: editing, thumbnail design and retention-focused strategy growing a loyal audience since 2023.",
      stack: ["Video Editing", "Branding", "Strategy"],
      accent: "c",
    },
  ],

  /* ---------- TEAM ---------- */
  team: [
    {
      initials: "TN",
      name: "Theekshana Nirmal",
      role: "Co-Founder · Lead Engineer",
      bio: "Full-stack developer and systems engineer. Builds secure, scalable products across web, mobile, cloud and AI — undergraduate at University of Moratuwa.",
      skills: ["Python", "React / Node.js", "Flutter", "AWS", "Cyber Security", "UI/UX"],
      links: {
        email: "tnirmal122@gmail.com",
        github: "https://github.com/FlinnZee",
        linkedin: "",                                     // ← add when ready
      },
    },
    {
      initials: "HW",
      name: "Hansana Wick",
      role: "Co-Founder · Creative Director",
      bio: "Video editor and content strategist. Runs full production pipelines — editing, thumbnails, branding and audience growth — creator of the Hanzy channel.",
      skills: ["Video Editing", "Content Creation", "Social Media Marketing", "Branding", "YouTube Strategy"],
      links: {
        email: "hansanawickramasinghe662@gmail.com",
        github: "",
        linkedin: "https://www.linkedin.com/in/hansana-wick-9778ba344",
      },
    },
  ],

  /* ---------- TESTIMONIALS ----------
     ✏️ These are starter samples — replace them with real client
     feedback as it comes in. Just copy the block pattern. */
  testimonials: [
    {
      quote: "ZynTECH rebuilt our internal system from scratch and it simply works. Fast delivery, clear communication, zero drama.",
      name: "Startup Founder",
      role: "SaaS Client · Fiverr",
      stars: 5,
    },
    {
      quote: "The UI they designed for our mobile app looked so premium our investors thought we'd hired a big-city agency.",
      name: "Product Owner",
      role: "Mobile App Client",
      stars: 5,
    },
    {
      quote: "Editing quality and thumbnails transformed our channel's click-through rate. Retention went up within weeks.",
      name: "Content Creator",
      role: "YouTube Client",
      stars: 5,
    },
  ],

  /* ---------- FOOTER ---------- */
  footer: {
    note: "Full-spectrum IT solutions — engineered in Sri Lanka, delivered worldwide.",
    credit: "Designed & Developed by Theekshana Nirmal",
    year: new Date().getFullYear(),
  },
};
