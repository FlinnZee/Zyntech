/* ============================================================
   ZynTECH: SITE CONTENT
   ------------------------------------------------------------
   EDIT THIS FILE TO UPDATE THE WEBSITE.
   Everything on the site (services, work, team, testimonials,
   contact info, picture credits) lives here.
   No coding knowledge needed. Just edit the text between
   quotes, save, refresh the page.
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
    title: ["A software and", "video studio"],
    standfirst:
      "ZynTECH builds web platforms, mobile apps and secure systems, then makes the video and social content that brings people to them. One team in Sri Lanka, from the first sketch to launch day.",
    primary: { label: "Start a project", href: "#contact" },
    secondary: { label: "See the work", href: "#work" },
    // Small facts beside the headline
    facts: [
      { label: "Founders", value: "Theekshana Nirmal and Hansana Wick" },
      { label: "Based in", value: "Sri Lanka, working worldwide" },
      { label: "Delivered", value: "30+ projects, 5+ years combined" },
    ],
    // The amber tile in the picture band
    figure: { value: "500K+", text: "concurrent users served by one API we engineered" },
    // Photographs that slowly crossfade in the wide picture cell
    rotating: [
      { src: "assets/img/colombo-skyline.jpg", alt: "Colombo skyline at night, seen from above" },
      { src: "assets/img/colombo-beira-lake.jpg", alt: "Colombo towers reflected in Beira Lake at night" },
      { src: "assets/img/colombo-galle-road.jpg", alt: "Colombo rooftops at night, framed by leaves" },
    ],
  },

  /* ---------- INTRO / ABOUT ---------- */
  about: {
    title: ["One team,", "not five vendors"],
    lead:
      "We started ZynTECH because a business shouldn’t need five vendors to go digital. Engineering and creative production share one roof, one plan and one inbox.",
    points: [
      {
        title: "Built to production standard",
        text: "React, Node.js, Python and Flutter on cloud infrastructure that we document, hand over and keep supporting.",
      },
      {
        title: "Security from the first commit",
        text: "Every product is hardened before launch, and we audit and secure the systems you already run.",
      },
      {
        title: "Creative in the same room",
        text: "Video, branding and content are made in-house, so the launch looks as good as the product works.",
      },
      {
        title: "One team, start to finish",
        text: "Strategy, design, build, launch and growth, with one accountable team and one point of contact.",
      },
    ],
    photo: { src: "assets/img/colombo-beira-lake.jpg", alt: "Office towers lit up at night, reflected in Beira Lake", caption: "Beira Lake, Colombo, at night" },
    photoSmall: { src: "assets/img/colombo-galle-road.jpg", alt: "Colombo apartment blocks and towers at night, seen from a rooftop garden", caption: "Colombo from a rooftop, 2019" },
  },

  /* ---------- SERVICES ----------
     lead: who answers for this practice → "theekshana" | "hansana" | "both"
     plate: a picture from the history of the trade (optional). */
  servicesTitle: "What we build",
  servicesIntro: "Nine service lines in six practices, each one led by a founder.",
  services: [
    {
      title: "Systems and cloud",
      lead: "theekshana",
      items: [
        "Business systems shaped around your workflow",
        "Automation that removes manual steps",
        "APIs and third-party integrations",
        "AWS deployments and CI/CD pipelines",
        "Linux servers with predictable bills",
      ],
      plate: { src: "assets/img/plate-punch.jpg", alt: "Hollerith punched-card reader, close up", caption: "Hollerith card reader" },
    },
    {
      title: "Web platforms and SaaS",
      lead: "theekshana",
      items: [
        "Marketing sites and web apps in React",
        "Multi-tenant SaaS with billing and analytics",
        "WordPress when it is the right tool",
        "Back ends built for hundreds of thousands of users",
      ],
      plate: { src: "assets/img/plate-switchboard.jpg", alt: "Telephone operators working a large switchboard in 1945", caption: "Switchboard operators, 1945" },
    },
    {
      title: "Mobile apps",
      lead: "theekshana",
      items: [
        "Android and iOS from one Flutter codebase",
        "Native Swift where the platform needs it",
        "App Store and Play Store releases",
        "Updates and support after launch",
      ],
      plate: { src: "assets/img/plate-mobile.jpg", alt: "A Motorola DynaTAC held next to a modern smartphone", caption: "Motorola DynaTAC, 1983, and a modern phone", position: "62% 50%" },
    },
    {
      title: "Cyber security",
      lead: "theekshana",
      items: [
        "Security assessments and audits",
        "Server and application hardening",
        "Compromise detection and monitoring",
        "Fixes, not only a report",
      ],
      plate: { src: "assets/img/plate-padlock.jpg", alt: "An iron padlock and its key", caption: "Padlock with key, 18th century" },
    },
    {
      title: "Interface and brand design",
      lead: "both",
      items: [
        "User flows and interfaces in Figma",
        "Clickable prototypes before any code",
        "Design systems your team can extend",
        "Logos, brand kits and launch visuals",
      ],
      plate: { src: "assets/img/plate-type.jpg", alt: "A wooden type case full of metal letterpress type", caption: "Type case, Gutenberg Museum, Mainz", position: "70% 50%" },
    },
    {
      title: "Video and social",
      lead: "hansana",
      items: [
        "Editing for YouTube, ads and brand films",
        "Thumbnails and packaging that earn the click",
        "Content calendars and channel strategy",
        "Social media management and growth",
      ],
      plate: { src: "assets/img/plate-moviola.jpg", alt: "A Moviola 35mm film editing machine", caption: "Moviola 35mm editor, Kolkata" },
    },
  ],

  /* ---------- WORK ----------
     ui: which drawn interface shows on the tile →
         carelink | api | assistant | wave | atmos | hanzy
     Leave ui out for a new project and the tile shows its title instead. */
  workTitle: ["Selected", "work"],
  projects: [
    {
      title: "CareLink",
      category: "Web application",
      text: "A care coordination platform that connects caregivers and families, with visit scheduling and secure care records.",
      stack: ["React", "Node.js", "MySQL"],
      lead: "theekshana",
      ui: "carelink",
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
      title: "Atmos",
      category: "Interface design",
      text: "A responsive weather interface, designed and user-tested in Figma.",
      stack: ["Figma", "Prototyping"],
      lead: "theekshana",
      ui: "atmos",
    },
    {
      title: "Hanzy",
      category: "Video and social",
      text: "Editing, thumbnail design and retention-focused strategy for the Hanzy YouTube channel, running since 2023.",
      stack: ["Video editing", "Thumbnails", "Channel strategy"],
      lead: "hansana",
      ui: "hanzy",
    },
  ],

  /* ---------- PROCESS ---------- */
  processTitle: ["How a project", "runs"],
  processIntro: "Every project moves through the same four stages, with a working demo every week.",
  process: [
    { title: "Discover", text: "We learn your goals, users and constraints, and agree on what success looks like." },
    { title: "Design", text: "Wireframes, then finished screens. You approve the experience before we write code." },
    { title: "Build", text: "Weekly sprints, each ending in a demo. Tested, secure, production-grade." },
    { title: "Launch and grow", text: "Deployment, monitoring and the content that brings people in. We stay on after launch." },
  ],

  /* ---------- TEAM ----------
     id: used to match services and projects to a person.
     photo: a portrait (4:5 crops best). position moves the crop. */
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
      bio: "Full-stack developer and systems engineer at the University of Moratuwa. Builds secure, scalable products across web, mobile, cloud and AI.",
      skills: ["Python", "React and Node.js", "Flutter", "AWS", "Cyber security", "UI/UX"],
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
      position: "50% 45%",
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
  testimonialsTitle: "What clients said",
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

  /* ---------- CONTACT (the brief builder) ---------- */
  contact: {
    title: "Start a project",
    sentence: "Tell us what you need. We’ll come back with a plan, a timeline and a price.",
    note: "Replies come from Theekshana or Hansana directly, not a sales team.",
    timelines: ["As soon as possible", "In 1–3 months", "Later this year", "Not sure yet"],
  },

  /* ---------- FOOTER ---------- */
  footer: {
    note: "ZynTECH is a software and video studio founded by Theekshana Nirmal and Hansana Wick.",
    credit: "Designed and developed by Theekshana Nirmal",
    year: new Date().getFullYear(),
  },

  /* ---------- PICTURE CREDITS ----------
     Photographs that are not ZynTECH's own. Keep these when the
     pictures stay on the site; the licences ask for a credit. */
  credits: [
    { title: "Stunning Night View of Colombo City Skyline", creator: "Thilina Alagiyawanna", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/", page: "https://commons.wikimedia.org/wiki/File:Stunning_Night_View_of_Colombo_City_Skyline.jpg" },
    { title: "Night Skyline Reflection in Colombo, Sri Lanka", creator: "Thilina Alagiyawanna", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/", page: "https://commons.wikimedia.org/wiki/File:Night_Skyline_Reflection_in_Colombo,_Sri_Lanka.jpg" },
    { title: "Colombo - 49531939661", creator: "Sergei Gussev", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", page: "https://commons.wikimedia.org/wiki/File:Colombo_-_49531939661.jpg" },
    { title: "Hollerith card reader closeup", creator: "Marcin Wichary", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", page: "https://commons.wikimedia.org/wiki/File:Hollerith_card_reader_closeup.jpg" },
    { title: "WAC telephone operators at the Victory switchboard, 1945", creator: "U.S. National Archives", license: "Public domain", licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/", page: "https://commons.wikimedia.org/wiki/File:WAC_telephone_operators_operate_the_Victory_switchboard_during_the_Potsdam_Conference_in_their_headquarters_in..._-_NARA_-_199007.jpg" },
    { title: "Motorola DynaTAC and Samsung Galaxy Note Edge", creator: "Umut Çolak", license: "Public domain", licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/", page: "https://commons.wikimedia.org/wiki/File:Motorola_DynaTAC_and_Samsung_Galaxy_Note_Edge.jpg" },
    { title: "Padlock with key", creator: "The Metropolitan Museum of Art", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/", page: "https://www.metmuseum.org/art/collection/search/191473" },
    { title: "Type case with movable types, Gutenberg Museum, Mainz", creator: "dronepicr", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", page: "https://commons.wikimedia.org/wiki/File:Type_case_with_movable_types_for_letterpress_printing_in_the_Gutenberg_Museum,_Mainz,_Germany_(48988492232).jpg" },
    { title: "Moviola - 35mm Film Editing Machine - Kolkata", creator: "Biswarup Ganguly", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/", page: "https://commons.wikimedia.org/wiki/File:Moviola_-_35mm_Film_Editing_Machine_-_Kolkata_2012-10-09_1577.JPG" },
  ],
};
