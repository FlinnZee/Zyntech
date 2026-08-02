/* ============================================================
   ZynTECH — CREATOR MODE CONTENT
   ------------------------------------------------------------
   ✏️  EDIT THIS FILE TO UPDATE THE CREATOR MODE PAGE (/creator).
   Packages, prices, one-off shoots, à la carte rates, FAQ —
   everything on that page lives here.

   PRICES ARE PLAIN NUMBERS. Write 72000, not "LKR 72,000".
   The page formats them for you, so the currency style stays
   identical everywhere. Optional flags on a price:
     from:    true          → "From LKR 65,000"
     unit:    "hr"          → "LKR 4,500 / hr"
     suffix:  "+ 15% …"     → appended after the price
     display: "+40%"        → shown instead of a price (set price: null)
   ============================================================ */

const CREATOR = {

  /* ---------- PAGE META (browser tab + link previews) ---------- */
  meta: {
    title: "Creator Mode — Social Content Production | ZynTECH",
    description:
      "Social content production for businesses in Kandy and across Sri Lanka. Shot, graded, captioned and published — with open pricing from LKR 15,000 a month.",
    ogTitle: "Creator Mode — We shoot it. We cut it. We post it.",
    ogDescription:
      "Reels, statics and full social management for Sri Lankan businesses. Real prices, no lock-in.",
  },

  /* ---------- CONTACT (used by every Enquire / CTA button) ---------- */
  contact: {
    // Digits only, country code first — no +, spaces or dashes.
    whatsapp: "94701233971",
    whatsappLabel: "WhatsApp us",
    // Pre-filled WhatsApp message. {tier} is replaced with the package name.
    whatsappText: "Hi ZynTECH — I'd like to talk about Creator Mode.",
    whatsappTierText: "Hi ZynTECH — I'd like to know more about the {tier} package.",
    // Enquiries go to both founders.
    emails: ["tnirmal122@gmail.com", "hansanawickramasinghe662@gmail.com"],
    emailSubject: "[ZynTECH] Creator Mode enquiry",
    emailLabel: "Email us",
  },

  /* ---------- HERO ---------- */
  hero: {
    eyebrow: "Creator Mode",
    headline: "We shoot it. We cut it. We post it.",
    sub:
      "Social content production for businesses in Kandy and across Sri Lanka. Shot, graded, captioned and published — you just run your business.",
    ctaPrimary: "Start a project",
    ctaSecondary: "See packages",
  },

  /* ---------- HOMEPAGE ENTRY BAND ---------- */
  homeBand: {
    eyebrow: "New",
    title: "Creator Mode",
    text:
      "Our productised social content service — shoot, edit, design and management, with prices published openly.",
    link: "See packages and pricing",
  },

  /* ---------- TICKER (the scrolling strip under the hero) ---------- */
  ticker: [
    "Reels", "TikTok", "Shorts", "Shot in 4K", "Colour graded",
    "Captions SI / EN", "Sound design", "Thumbnails", "Carousels",
    "Posting & scheduling", "Analytics",
  ],

  /* ---------- PHOTOS ----------
     Drop replacements in assets/creator/ and update the paths here.
     Keep them compressed — target under ~150 KB each. */
  photos: {
    // Hero viewfinder card (portrait works best)
    hero: {
      src: "../assets/creator/edit-suite.jpg",
      alt: "A reel being colour graded next to the camera that shot it",
      clip: "A001_C004",
    },
    // Film strip — three frames, shown in order
    strip: [
      { src: "../assets/creator/frame-shoot.jpg", alt: "Camera operator lining up a shot on set", clip: "A003_C011.MOV", label: "SHOOT" },
      { src: "../assets/creator/on-set.jpg",      alt: "Phone rig recording in a studio",         clip: "A007_C002.MOV", label: "SET" },
      { src: "../assets/creator/frame-edit.jpg",  alt: "Editor cutting a talking-head video",     clip: "TL_04_FINE.PRJ", label: "EDIT" },
    ],
    // FAQ side visual, framed as a browser window
    faq: {
      src: "../assets/creator/feed-laptop.jpg",
      alt: "A managed Instagram profile open on a laptop",
      url: "instagram.com/yourbrand",
    },
    // Closing section — taped photo print
    cta: {
      src: "../assets/creator/feed-phone.jpg",
      alt: "A client scrolling their own feed",
      caption: "your feed — managed daily",
    },
  },

  /* ---------- 1. WHAT WE DO ----------
     icon: video | cut | uiux | social  */
  whatWeDo: [
    { icon: "video",  title: "Shoot",  text: "On location, 4K, colour-accurate. Product, food, interiors, people." },
    { icon: "cut",    title: "Edit",   text: "Cut, graded, captioned, sound designed. Built for vertical." },
    { icon: "uiux",   title: "Design", text: "Statics, carousels, thumbnails, brand kits." },
    { icon: "social", title: "Manage", text: "Calendar, captions, scheduling, community, reporting." },
  ],

  /* ---------- 2. WHAT'S IN EVERY REEL ---------- */
  reelSpec: [
    "45 seconds to 2 minutes long",
    "Vertical 9:16, shot in 4K",
    "Colour graded",
    "Burned-in captions, Sinhala or English",
    "Sound design and licensed music",
    "2 rounds of revisions",
  ],

  /* ---------- 3. PACKAGES ----------
     Two tracks, each rendered as its own section in array order.
     popular: true adds the "Most popular" flag (use it on one tier only). */
  packages: {
    note: "Custom scopes available. Ad spend is billed separately and paid directly by you.",
    tracks: [
      {
        id: "edit",
        label: "We edit",
        blurb: "You already have the footage. We turn it into content.",
        tiers: [
          {
            id: "cut",
            name: "CUT",
            tagline: "You send footage. We cut.",
            price: 24000,
            period: "month",
            popular: false,
            includes: [
              "4 reels per month, up to 2 min each",
              "Colour grade, captions and sound",
              "2 revision rounds on each reel",
              "5–7 working day turnaround",
            ],
          },
          {
            id: "cut-pro",
            name: "CUT PRO",
            tagline: "Higher volume, faster turnaround.",
            price: 42000,
            period: "month",
            popular: false,
            includes: [
              "8 reels per month, up to 2 min each",
              "1 premium reel with motion graphics",
              "Priority 48-hour turnaround on 2 reels",
              "Thumbnails and cover frames included",
            ],
          },
        ],
      },
      {
        id: "production",
        label: "We shoot + edit",
        blurb: "We come to you, shoot it, cut it and put it out.",
        tiers: [
          {
            id: "boot",
            name: "BOOT",
            tagline: "Presence, without a shoot day.",
            price: 15000,
            period: "month",
            popular: false,
            includes: [
              "12 designed posts or carousels",
              "Captions and hashtag research",
              "Scheduling and posting, 2 platforms",
              "Monthly performance report",
            ],
          },
          {
            id: "signal",
            name: "SIGNAL",
            tagline: "Your first month of real content.",
            price: 35000,
            period: "month",
            popular: false,
            includes: [
              "1 half-day shoot per month",
              "3 reels, graded and captioned",
              "3 static posts",
              "Posting and captions, up to 3 platforms",
              "Monthly performance report",
            ],
          },
          {
            id: "surge",
            name: "SURGE",
            tagline: "Consistent output, managed end to end.",
            price: 72000,
            period: "month",
            popular: true,
            includes: [
              "2 half-day shoots per month",
              "7 reels",
              "6 statics or carousels",
              "12 edited stills",
              "Posting plus comment and DM management",
              "Monthly strategy call and analytics",
            ],
          },
          {
            id: "override",
            name: "OVERRIDE",
            tagline: "A full content engine.",
            price: 130000,
            period: "month",
            popular: false,
            includes: [
              "4 shoot days per month",
              "14 reels",
              "10 statics plus 2 carousels",
              "1 long-form video",
              "25 edited stills",
              "Full management, community and ads",
              "Weekly calls, priority turnaround",
            ],
          },
        ],
      },
    ],
  },

  /* ---------- 4. ONE-OFF SHOOTS ---------- */
  bundles: [
    { name: "SOLO",   price: 16000, note: "2-hour shoot → 1 reel (45 sec – 2 min)" },
    { name: "TRIPLE", price: 30000, note: "Half-day shoot → 3 reels + posting" },
    { name: "FIVE",   price: 40000, note: "Half-day shoot → 5 reels + posting" },
    { name: "DAY",    price: 68000, note: "Full-day shoot → 8 reels + 15 edited stills" },
  ],

  /* ---------- 5. PROJECT PACKAGES ---------- */
  projects: [
    { name: "Launch Kit",       price: 45000, note: "Full day, 5 reels, 15 stills, 4 statics, profile setup" },
    { name: "Menu / Catalogue", price: 28000, note: "Half day, 25 product stills, 2 reels" },
    { name: "Brand Film",       price: 65000, from: true, note: "Full day, scripted 60–90 sec film, 3 social cutdowns" },
    { name: "Event Coverage",   price: 38000, note: "4 hours, same-day story clips, 2 recap reels, 30 stills" },
  ],

  /* ---------- 6. À LA CARTE ---------- */
  aLaCarteNote: "Bundles above save 25–40% on the same work.",
  aLaCarte: [
    {
      category: "Production",
      items: [
        { name: "Mini shoot — up to 2 hrs, 1 location", price: 12000 },
        { name: "Half-day shoot — up to 4 hrs, 1 location", price: 18000 },
        { name: "Full-day shoot — up to 8 hrs, 2 locations", price: 32000 },
        { name: "Event coverage — up to 4 hrs", price: 25000 },
        { name: "Overtime beyond booked hours", price: 4500, unit: "hr" },
        { name: "Second camera operator", price: 8000, unit: "day" },
        { name: "Travel outside Kandy", price: 60, unit: "km" },
        { name: "Overnight stay, per person", price: 6000, unit: "night" },
        { name: "Location recce visit", price: 4000 },
      ],
    },
    {
      category: "Edit only — your footage",
      items: [
        { name: "Quick cut — up to 30 sec", price: 3500 },
        { name: "Standard reel — 30–60 sec", price: 6000 },
        { name: "Extended reel — 60 sec – 2 min", price: 9000 },
        { name: "Premium reel — motion graphics, sound design", price: 15000 },
        { name: "Colour grade only, per reel", price: 3000 },
        { name: "Long-form edit — 5–12 min", price: 20000 },
        { name: "Repurpose long-form into a short", price: 3000 },
        { name: "Subtitles and translation", price: 2000 },
      ],
    },
    {
      category: "Photography and design",
      items: [
        { name: "Product or lifestyle stills — 12 edited", price: 10000 },
        { name: "Additional edited image", price: 600 },
        { name: "Static post design", price: 1500 },
        { name: "Carousel slide", price: 1200 },
        { name: "Story or poster graphic", price: 1000 },
        { name: "YouTube thumbnail", price: 1800 },
        { name: "Logo and mini brand kit", price: 32000 },
        { name: "Full brand identity system", price: 70000 },
      ],
    },
    {
      category: "Social management",
      items: [
        { name: "Calendar, scheduling and posting — 12 posts", price: 14000, unit: "mo" },
        { name: "Caption and hashtag writing, per post", price: 700 },
        { name: "Comment and DM management", price: 12000, unit: "mo" },
        { name: "Analytics and insights report", price: 4000 },
        { name: "Profile setup and optimisation", price: 8000 },
        { name: "Meta / TikTok ads management", price: 18000, unit: "mo", suffix: "+ 15% of ad spend" },
      ],
    },
    {
      category: "Add-ons",
      items: [
        { name: "Rush delivery — under 48 hours", price: null, display: "+40%" },
        { name: "Extra revision round", price: 2500 },
        { name: "Raw footage handover", price: 8000 },
        { name: "Voiceover — Sinhala or English", price: 3000, unit: "script" },
        { name: "Paid-ad usage licence", price: null, display: "+25% of content fee" },
      ],
    },
  ],

  /* ---------- 7. PROCESS ---------- */
  process: [
    { num: "01", title: "Brief",   text: "We talk through your business, your audience and what you actually need." },
    { num: "02", title: "Shoot",   text: "We come to you. Half day or full day, depending on scope." },
    { num: "03", title: "Edit",    text: "Cut, graded, captioned. Two rounds of revisions included." },
    { num: "04", title: "Publish", text: "We post it, write the captions, and send you the numbers." },
  ],

  /* ---------- 8. FAQ ---------- */
  faq: [
    {
      q: "How long are the videos?",
      a: "Between 45 seconds and 2 minutes. That's the range that performs on Reels, TikTok and Shorts without losing people halfway.",
    },
    {
      q: "How fast is turnaround?",
      a: "Standard delivery is 5–7 working days from shoot day. Rush delivery under 48 hours is available at a 40% surcharge.",
    },
    {
      q: "How many revisions do I get?",
      a: "Two rounds are included in every package and project. Additional rounds are LKR 2,500 each.",
    },
    {
      q: "Can you just edit footage I already have?",
      a: "Yes. That's the edit track — CUT and CUT PRO, or per-reel pricing in the à la carte list.",
    },
    {
      q: "Is ad spend included in the price?",
      a: "No. Package prices cover content and management. Ad budget is your money, paid directly by you through your own Business Manager, so you keep full control and visibility.",
    },
    {
      q: "Do you need my account passwords?",
      a: "No. We get added as a partner through Meta Business Suite and TikTok Business Center. You keep your login, and you can remove our access at any time.",
    },
    {
      q: "Do I get the raw footage?",
      a: "Raw footage isn't included by default. It's available as an add-on for LKR 8,000 per shoot.",
    },
    {
      q: "Do you work outside Kandy?",
      a: "Yes. Travel outside Kandy is charged at LKR 60 per kilometre, plus accommodation for overnight shoots.",
    },
    {
      q: "Is there a minimum contract?",
      a: "No lock-in. Monthly packages are reviewed month to month. We'd recommend three months to see real traction, but you're never tied in.",
    },
  ],

  /* ---------- 9. CLOSING CTA ---------- */
  cta: {
    title: "Let's get your content moving.",
    text: "Tell us what you sell and where you are. We'll come back with a scope and a number.",
  },
};
