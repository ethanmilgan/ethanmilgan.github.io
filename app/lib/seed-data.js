export const seedProducts = [
  {
    slug: "noir-capsule-lookbook",
    title: "Noir Capsule Lookbook",
    description: "Eveningwear edits with satin slips, structured blazers, lacquered accessories, and campaign-ready styling.",
    category: "Lookbook",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=82",
    price: "$148",
    sortOrder: 1,
    isFeatured: true
  },
  {
    slug: "resort-forms-collection",
    title: "Resort Forms Collection",
    description: "Lightweight separates, warm-weather silhouettes, and social-first outfit stories for boutique drops.",
    category: "Collection",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=1200&q=82",
    price: "$126",
    sortOrder: 2,
    isFeatured: true
  },
  {
    slug: "market-week-buyer-edit",
    title: "Market Week Buyer Edit",
    description: "Curated line-sheet selections with fabric notes, size runs, collection highlights, and inquiry-ready product copy.",
    category: "Buyer Edit",
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=82",
    price: "$96",
    sortOrder: 3,
    isFeatured: true
  },
  {
    slug: "studio-essentials",
    title: "Studio Essentials",
    description: "Foundational styling pieces for editorial shoots, capsule wardrobes, product pages, and seasonal refreshes.",
    category: "Essentials",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=82",
    price: "$84",
    sortOrder: 4,
    isFeatured: false
  }
];

export const seedCollections = [
  {
    name: "Noir Capsule",
    label: "Evening editorial",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=82",
    description: "A monochrome capsule built around bias-cut satin, lacquered accessories, and cinematic close crops.",
    stats: ["18 looks", "6 hero images", "42% longer dwell time"],
    sortOrder: 1
  },
  {
    name: "Market Week",
    label: "Buyer preview",
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=82",
    description: "A buyer-facing portfolio with line-sheet summaries, fabric notes, and fast mobile browsing.",
    stats: ["4 drops", "Responsive grids", "Inquiry-ready"],
    sortOrder: 2
  },
  {
    name: "Resort Forms",
    label: "Lookbook",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=1200&q=82",
    description: "Warm-weather silhouettes photographed for social crops, campaign landing pages, and editorial mailers.",
    stats: ["12 stories", "Social assets", "SEO copy"],
    sortOrder: 3
  }
];

export const seedPageSlides = [
  {
    page: "About Me",
    title: "Fashion direction with a digital-first point of view.",
    text: "Meet Maison Mode, a fashion journal and creative studio for boutiques, stylists, emerging labels, and editorial teams.",
    href: "/about",
    buttonLabel: "About Me",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=82",
    sortOrder: 1
  },
  {
    page: "Shop",
    title: "Curated fashion edits built around strong seasonal stories.",
    text: "Explore capsule lookbooks, resort edits, buyer previews, and studio essentials shaped for modern fashion presentation.",
    href: "/shop",
    buttonLabel: "Shop",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=82",
    sortOrder: 2
  },
  {
    page: "Contact",
    title: "Start a portfolio, product, or editorial website conversation.",
    text: "Reach out for fashion site planning, collection pages, journal strategy, boutique commerce paths, or campaign storytelling.",
    href: "/contact",
    buttonLabel: "Contact",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=82",
    sortOrder: 3
  }
];
