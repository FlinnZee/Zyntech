/* ============================================================
   ZynTECH: SITE CONTENT
   ------------------------------------------------------------
   EDIT THIS FILE TO UPDATE THE HOMEPAGE.
   Everything on the homepage (services, work, team, process,
   testimonials, contact info) lives here.
   No coding knowledge needed. Just edit the text between
   quotes, save, refresh the page.
   (The Creator Mode page has its own file: js/creator-data.js)
   ============================================================ */

const SITE = {

  /* ---------- BRAND ---------- */
  brand: {
    name: "ZynTECH",
    descriptor: "Software and video studio",
    location: "Sri Lanka",
    reach: "Working with clients worldwide",
    timezone: "GMT+5:30",
    email: "tnirmal122@gmail.com",
    phone: "+94 70 123 3971",
    whatsapp: "94701233971",          // digits only, used for wa.me links
  },

  /* ---------- HERO ----------
     title: the two lines of the main headline, exactly as they break. */
  hero: {
    title: ["We build it.", "We film it."],
    sub:
      "ZynTECH is a software and video studio from Sri Lanka. We engineer web platforms, mobile apps and secure systems, then produce the video and social content that brings people to them.",
    primary: { label: "Start a project", href: "#contact" },
    secondary: { label: "See the work", href: "#work" },
    notes: [
      "Engineering and creative, one team",
      "Sri Lanka, working worldwide",
    ],
  },

  /* ---------- MARQUEE (the scrolling band under the hero) ---------- */
  marquee: ["Web platforms", "Mobile apps", "Cyber security", "SaaS", "UI / UX", "Video production", "Social growth", "Cloud & DevOps"],

  /* ---------- MANIFESTO + NUMBERS ---------- */
  manifesto:
    "A business shouldn’t need five vendors to go digital. So we built one team: the people who write your code are the people who shoot your launch film.",
  stats: [
    { value: 500, suffix: "K+", label: "Concurrent users served by one API we engineered" },
    { value: 30, suffix: "+", label: "Projects delivered for clients and for ourselves" },
    { value: 5, suffix: "+", label: "Years of combined experience" },
    { value: 9, suffix: "", label: "Service lines under one roof" },
  ],

  /* ---------- SERVICES ----------
     group: "Engineering" | "Creative"
     lead:  who answers for it → "theekshana" | "hansana" | "both" */
  servicesTitle: "What we do",
  servicesIntro: "Nine service lines across engineering and creative. Open any line for what it covers and who leads it.",
  services: [
    {
      title: "Custom systems",
      group: "Engineering",
      lead: "theekshana",
      text: "Business systems, automation tools and internal software shaped around the way your team already works.",
      tags: ["Python", "Automation", "APIs"],
    },
    {
      title: "Web platforms",
      group: "Engineering",
      lead: "theekshana",
      text: "Fast marketing sites and web apps, from a single landing page to platforms serving hundreds of thousands of users.",
      tags: ["React", "Node.js", "WordPress"],
    },
    {
      title: "Mobile apps",
      group: "Engineering",
      lead: "theekshana",
      text: "Android and iOS apps from one Flutter codebase, with native Swift where the platform needs it.",
      tags: ["Flutter", "Dart", "Swift"],
    },
    {
      title: "Cyber security",
      group: "Engineering",
      lead: "theekshana",
      text: "Security assessments, server and application hardening, and compromise detection. Fixes, not only a report.",
      tags: ["Audits", "Hardening", "Monitoring"],
    },
    {
      title: "SaaS products",
      group: "Engineering",
      lead: "theekshana",
      text: "From idea to subscription-ready product: multi-tenant architecture, billing and analytics built in.",
      tags: ["Multi-tenant", "Billing", "Analytics"],
    },
    {
      title: "Cloud & DevOps",
      group: "Engineering",
      lead: "theekshana",
      text: "AWS deployments, CI/CD pipelines and Linux servers that scale with you, with bills you can predict.",
      tags: ["AWS", "CI/CD", "Linux"],
    },
    {
      title: "UI / UX design",
      group: "Creative",
      lead: "both",
      text: "User flows, interfaces and clickable prototypes in Figma, approved before a line of code is written.",
      tags: ["Figma", "Prototyping", "Design systems"],
    },
    {
      title: "Video production",
      group: "Creative",
      lead: "hansana",
      text: "Edits for YouTube, ads and brand films, with thumbnails and packaging that earn the click.",
      tags: ["Editing", "Thumbnails", "Storytelling"],
    },
    {
      title: "Social growth",
      group: "Creative",
      lead: "hansana",
      text: "Content calendars, channel strategy and day-to-day management that turn followers into customers.",
      tags: ["Strategy", "Content", "Management"],
    },
  ],

  /* ---------- WORK ----------
     image: a real screenshot or photo of the project (optional)
     ui:    otherwise, which drawn interface to show →
            carelink | api | assistant | wave | atmos | hanzy
     link:  optional. Adds an "Open" button to the project sheet. */
  workTitle: ["Selected", "work"],
  workIntro: "Products, platforms and channels we designed, built and grew.",
  projects: [
    {
      title: "Nyx",
      category: "Flagship product",
      text: "Our own invite-only messenger: real-time chats, voice and video calls, media that stays on your device, and three complete themes. Windows today, mobile next.",
      stack: ["Rust and Tauri", "React", "WebRTC", "Supabase"],
      lead: "theekshana",
      image: "assets/work/nyx.jpg",
      link: "https://flinnzee.github.io/Nyx/",
      linkLabel: "Visit Nyx",
    },
    {
      title: "High-load REST API",
      category: "Backend systems",
      text: "An API layer that serves live data to more than 500,000 concurrent users with sub-second responses.",
      stack: ["Node.js", "PostgreSQL", "AWS"],
      lead: "theekshana",
      ui: "api",
    },
    {
      title: "CareLink",
      category: "Web application",
      text: "A care coordination platform that connects caregivers and families, with visit scheduling and secure care records.",
      stack: ["React", "Node.js", "MySQL"],
      lead: "theekshana",
      ui: "carelink",
    },
    {
      title: "AI virtual assistant",
      category: "AI and automation",
      text: "A conversational assistant built on TensorFlow, with LUIS for language understanding and Microsoft Bot Framework.",
      stack: ["TensorFlow", "LUIS", "Bot Framework"],
      lead: "theekshana",
      ui: "assistant",
    },
    {
      title: "Wave",
      category: "Mobile app",
      text: "A streaming music app for Android and iOS, built in Flutter from a single codebase.",
      stack: ["Flutter", "Dart"],
      lead: "theekshana",
      ui: "wave",
    },
    {
      title: "Hanzy",
      category: "Video and social",
      text: "Editing, thumbnail design and retention-focused strategy for the Hanzy YouTube channel, running since 2023.",
      stack: ["Video editing", "Thumbnails", "Channel strategy"],
      lead: "hansana",
      ui: "hanzy",
    },
    {
      title: "Atmos",
      category: "Interface design",
      text: "A responsive weather interface, designed and user-tested in Figma.",
      stack: ["Figma", "Prototyping"],
      lead: "theekshana",
      ui: "atmos",
    },
  ],

  /* ---------- PROCESS ---------- */
  processTitle: "How we work",
  processIntro: "Every project moves through the same four stages, with a working demo every week.",
  process: [
    { title: "Discover", text: "We learn your goals, users and constraints, and agree on what success looks like.", items: ["Goals and users", "Scope and estimate", "Technical plan"] },
    { title: "Design", text: "Wireframes, then finished screens. You approve the experience before we write code.", items: ["Wireframes", "Interface design", "Clickable prototype"] },
    { title: "Build", text: "Weekly sprints, each ending in a demo. Tested, secure, production-grade.", items: ["Weekly demos", "Testing", "Security review"] },
    { title: "Launch & grow", text: "Deployment, monitoring and the content that brings people in. We stay on after launch.", items: ["Deployment", "Launch content", "Support"] },
  ],

  /* ---------- TEAM ----------
     id: used to match services and projects to a person.
     photo: a portrait. position moves the crop. */
  teamTitle: "The founders",
  teamIntro: "Two people, two crafts. Every project is planned, built and answered for by one of us.",
  team: [
    {
      id: "theekshana",
      initials: "TN",
      photo: "assets/team/theekshana.jpg",
      position: "50% 30%",
      name: "Theekshana Nirmal",
      role: "Co-founder, lead engineer",
      short: "Engineering",
      bio: "Full-stack developer and systems engineer, and an undergraduate at the University of Moratuwa. Builds secure, scalable products across web, mobile, cloud and AI.",
      skills: ["Python", "React / Node.js", "Flutter", "AWS", "Cyber security", "UI/UX"],
      links: {
        email: "tnirmal122@gmail.com",
        github: "https://github.com/FlinnZee",
        linkedin: "",                                     // ← add when ready
      },
    },
    {
      id: "hansana",
      initials: "HW",
      photo: "assets/team/hansana.jpg",
      position: "50% 40%",
      name: "Hansana Wick",
      role: "Co-founder, creative director",
      short: "Design and video",
      bio: "Video editor and content strategist behind the Hanzy channel. Runs the whole production pipeline: editing, thumbnails, branding and audience growth.",
      skills: ["Video editing", "Content creation", "Social media marketing", "Branding", "YouTube strategy"],
      links: {
        email: "hansanawickramasinghe662@gmail.com",
        github: "",
        linkedin: "https://www.linkedin.com/in/hansana-wick-9778ba344",
      },
    },
  ],

  /* ---------- TESTIMONIALS ----------
     These are starter samples. Replace them with real client
     feedback as it comes in. Just copy the block pattern. */
  testimonialsTitle: "Client words",
  testimonials: [
    {
      quote: "ZynTECH rebuilt our internal system from scratch and it simply works. Fast delivery, clear communication, zero drama.",
      name: "Startup founder",
      role: "SaaS client, via Fiverr",
    },
    {
      quote: "The UI they designed for our mobile app looked so premium our investors thought we’d hired a big-city agency.",
      name: "Product owner",
      role: "Mobile app client",
    },
    {
      quote: "Editing quality and thumbnails transformed our channel’s click-through rate. Retention went up within weeks.",
      name: "Content creator",
      role: "YouTube client",
    },
  ],

  /* ---------- CONTACT (the brief builder) ----------
     needs: the choices in "What do you need?" and who answers each. */
  contact: {
    title: "Start a project",
    sentence: "Tell us what you need. We’ll come back with a plan, a timeline and a price.",
    note: "Replies come from Theekshana or Hansana directly, not a sales team.",
    needs: [
      { label: "Web platform", lead: "theekshana" },
      { label: "Mobile app", lead: "theekshana" },
      { label: "Custom system", lead: "theekshana" },
      { label: "Cyber security", lead: "theekshana" },
      { label: "SaaS product", lead: "theekshana" },
      { label: "UI / UX design", lead: "both" },
      { label: "Video production", lead: "hansana" },
      { label: "Social growth", lead: "hansana" },
    ],
    timelines: ["As soon as possible", "In 1–3 months", "Later this year", "Not sure yet"],
  },

  /* ---------- FOOTER ---------- */
  footer: {
    line: ["Have something", "worth building?"],
    credit: "Designed and developed by Theekshana Nirmal",
    year: new Date().getFullYear(),
  },
};
