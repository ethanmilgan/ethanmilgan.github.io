"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const categories = ["All", "Runway", "Streetwear", "Editorial", "Retail"];

const stories = [
  {
    title: "Sheer layers and steel-gray tailoring lead the season",
    category: "Runway",
    date: "June 2026",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=82",
    summary:
      "A trend report on transparent textures, sharp shoulders, and restrained metallic accents moving from showrooms into capsules."
  },
  {
    title: "How to style a five-piece travel wardrobe",
    category: "Streetwear",
    date: "Field Notes",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=82",
    summary:
      "A practical edit for city breaks: one statement coat, two bases, one texture piece, and footwear that works after dark."
  },
  {
    title: "Building campaign pages that make garments feel tactile",
    category: "Editorial",
    date: "Studio",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=82",
    summary:
      "Composition, crop ratios, image sequencing, and product copy patterns for fashion portfolios and digital lookbooks."
  },
  {
    title: "What a boutique needs before adding checkout",
    category: "Retail",
    date: "Guide",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=82",
    summary:
      "A phased plan for product discovery, wishlist behavior, sizing filters, payments, image optimization, and maintenance."
  }
];

const fallbackCollections = [
  {
    name: "Noir Capsule",
    label: "Evening editorial",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=82",
    description:
      "A monochrome capsule built around bias-cut satin, lacquered accessories, and cinematic close crops.",
    stats: ["18 looks", "6 hero images", "42% longer dwell time"]
  },
  {
    name: "Market Week",
    label: "Buyer preview",
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=82",
    description:
      "A buyer-facing portfolio with line-sheet summaries, fabric notes, and fast mobile browsing.",
    stats: ["4 drops", "Responsive grids", "Inquiry-ready"]
  },
  {
    name: "Resort Forms",
    label: "Lookbook",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=1200&q=82",
    description:
      "Warm-weather silhouettes photographed for social crops, campaign landing pages, and editorial mailers.",
    stats: ["12 stories", "Social assets", "SEO copy"]
  }
];

const tiers = {
  Portfolio: "$1,000-$5,000",
  Boutique: "$5,000-$20,000",
  Platform: "$20,000-$100,000+"
};

const fallbackPageSlides = [
  {
    page: "About Me",
    title: "Fashion direction with a digital-first point of view.",
    text: "Meet Maison Mode, a fashion journal and creative studio for boutiques, stylists, emerging labels, and editorial teams.",
    href: "/about",
    buttonLabel: "About Me",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=82"
  },
  {
    page: "Shop",
    title: "Curated fashion edits built around strong seasonal stories.",
    text: "Explore capsule lookbooks, resort edits, buyer previews, and studio essentials shaped for modern fashion presentation.",
    href: "/shop",
    buttonLabel: "Shop",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=82"
  },
  {
    page: "Contact",
    title: "Start a portfolio, product, or editorial website conversation.",
    text: "Reach out for fashion site planning, collection pages, journal strategy, boutique commerce paths, or campaign storytelling.",
    href: "/contact",
    buttonLabel: "Contact",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=82"
  }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [collections, setCollections] = useState(fallbackCollections);
  const [pageSlides, setPageSlides] = useState(fallbackPageSlides);
  const [activeCollection, setActiveCollection] = useState(fallbackCollections[0]);
  const [siteType, setSiteType] = useState("Portfolio");
  const [commerce, setCommerce] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const filteredStories = useMemo(() => {
    if (activeCategory === "All") {
      return stories;
    }

    return stories.filter((story) => story.category === activeCategory);
  }, [activeCategory]);

  const estimate = commerce && siteType === "Portfolio" ? "$5,000-$20,000" : tiers[siteType];
  const currentSlide = pageSlides[activeSlide];

  const showPreviousSlide = () => {
    setActiveSlide((current) => (current === 0 ? pageSlides.length - 1 : current - 1));
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current === pageSlides.length - 1 ? 0 : current + 1));
    }, 15000);

    return () => window.clearInterval(timer);
  }, [pageSlides.length]);

  useEffect(() => {
    let isMounted = true;

    async function loadCatalog() {
      const response = await fetch("/api/catalog");

      if (!response.ok) {
        return;
      }

      const catalog = await response.json();

      if (!isMounted) {
        return;
      }

      if (catalog.collections?.length) {
        setCollections(catalog.collections);
        setActiveCollection(catalog.collections[0]);
      }

      if (catalog.pageSlides?.length) {
        setPageSlides(catalog.pageSlides);
        setActiveSlide(0);
      }
    }

    loadCatalog().catch((error) => {
      console.error("Unable to load catalog data", error);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const showNextSlide = () => {
    setActiveSlide((current) => (current === pageSlides.length - 1 ? 0 : current + 1));
  };

  return (
    <main className="min-h-screen bg-[#fffaf6] text-[#171413]">
      <section className="relative min-h-[calc(100vh-77px)] overflow-hidden bg-[#171413] text-white" aria-label="Page highlights slider">
        {pageSlides.map((slide, index) => (
          <Image
            alt={`${slide.page} fashion preview`}
            className={`object-cover transition-opacity duration-700 ${
              activeSlide === index ? "opacity-100" : "opacity-0"
            }`}
            fill
            key={slide.page}
            priority={index === 0}
            sizes="100vw"
            src={slide.image}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,20,19,0.88),rgba(23,20,19,0.5)_55%,rgba(23,20,19,0.16))]" />

        <div className="relative z-10 flex min-h-[calc(100vh-77px)] items-end px-4 pb-10 pt-20 sm:px-8 lg:px-14">
          <div className="w-full max-w-4xl pb-4 sm:pb-[8vh]">
            <p className="mb-4 text-xs font-black uppercase tracking-normal text-[#f1bcc4]">
              {currentSlide.page}
            </p>
            <h1 className="serif text-4xl font-bold leading-none min-[420px]:text-5xl sm:text-6xl lg:text-7xl">
              {currentSlide.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">
              {currentSlide.text}
            </p>

            <div className="mt-8 flex flex-col gap-5 min-[520px]:flex-row min-[520px]:items-center">
              <Link
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#c83256] px-5 py-3 text-sm font-black text-white min-[520px]:w-auto"
                href={currentSlide.href}
              >
                {currentSlide.buttonLabel}
              </Link>

              <div className="flex items-center gap-3">
                <button
                  aria-label="Previous slide"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/30 text-2xl leading-none hover:border-[#f1bcc4] hover:text-[#f1bcc4]"
                  onClick={showPreviousSlide}
                  type="button"
                >
                  {"<"}
                </button>
                <button
                  aria-label="Next slide"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/30 text-2xl leading-none hover:border-[#f1bcc4] hover:text-[#f1bcc4]"
                  onClick={showNextSlide}
                  type="button"
                >
                  {">"}
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-5 left-4 z-20 flex gap-2 sm:left-8 lg:left-14" aria-label="Select slide">
            {pageSlides.map((slide, index) => (
              <button
                aria-label={`Show ${slide.page} slide`}
                className={`h-3 w-8 rounded-full transition ${
                  activeSlide === index ? "bg-[#f1bcc4]" : "bg-white/35 hover:bg-white/60"
                }`}
                key={slide.page}
                onClick={() => setActiveSlide(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 bg-[#171413] px-4 py-6 text-white sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-14">
        {[
          ["Frontend", "Next.js + React"],
          ["Styling", "Tailwind CSS"],
          ["Commerce Path", "Shopify / WooCommerce"],
          ["Media", "Cloudinary-ready imagery"]
        ].map(([label, value]) => (
          <div className="border-l border-white/20 pl-4" key={label}>
            <p className="text-xs font-black uppercase tracking-normal text-[#f1bcc4]">{label}</p>
            <p className="mt-1 text-lg font-black">{value}</p>
          </div>
        ))}
      </section>

      <section id="collections" className="px-4 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-28">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#b92e4d]">Portfolio</p>
            <h2 className="serif max-w-3xl text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
              Collections with enough detail to sell the vision.
            </h2>
          </div>
          <div className="grid w-full grid-cols-1 gap-2 min-[420px]:grid-cols-3 lg:w-auto">
            {collections.map((collection) => (
              <button
                className={`min-h-11 rounded-lg border px-4 py-3 text-sm font-black transition ${
                  activeCollection.name === collection.name
                    ? "border-[#171413] bg-[#171413] text-white"
                    : "border-[#ded3ca] bg-white text-[#5f5852] hover:border-[#171413]"
                }`}
                key={collection.name}
                onClick={() => setActiveCollection(collection)}
                type="button"
              >
                {collection.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid overflow-hidden rounded-lg border border-[#ded3ca] bg-white shadow-[0_24px_70px_rgba(23,20,19,0.13)] lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[320px] sm:min-h-[440px]">
            <Image
              src={activeCollection.image}
              alt={`${activeCollection.name} fashion collection`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
          <div className="flex flex-col justify-between p-5 sm:p-8 lg:p-10">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#b92e4d]">
                {activeCollection.label}
              </p>
              <h3 className="serif text-3xl font-bold leading-none sm:text-4xl">{activeCollection.name}</h3>
              <p className="mt-5 text-base leading-7 text-[#655e58] sm:text-lg sm:leading-8">{activeCollection.description}</p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {activeCollection.stats.map((stat) => (
                <div className="rounded-lg bg-[#f4eee7] px-4 py-3 text-sm font-black" key={stat}>
                  {stat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="journal" className="bg-[#f4eee7] px-4 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-28">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#b92e4d]">Journal</p>
            <h2 className="serif text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">Fashion-first publishing.</h2>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 min-[520px]:flex min-[520px]:w-auto min-[520px]:flex-wrap">
            {categories.map((category) => (
              <button
                className={`min-h-11 rounded-lg border px-4 py-3 text-sm font-black transition ${
                  activeCategory === category
                    ? "border-[#171413] bg-[#171413] text-white"
                    : "border-[#d4c8bd] bg-[#fffaf6] text-[#5f5852] hover:border-[#171413]"
                }`}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredStories.map((story) => (
            <article className="overflow-hidden rounded-lg border border-[#ded3ca] bg-[#fffaf6]" key={story.title}>
              <div className="relative aspect-[4/5]">
                <Image src={story.image} alt={story.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 25vw" />
              </div>
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-normal text-[#b92e4d]">
                  {story.category} / {story.date}
                </p>
                <h3 className="mt-3 text-xl font-black leading-tight">{story.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#655e58]">{story.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="studio" className="grid gap-8 px-4 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-14 lg:py-28">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#b92e4d]">Interactive planner</p>
          <h2 className="serif text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">Plan the right fashion website phase.</h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#655e58] sm:text-lg sm:leading-8">
            The guide recommends matching cost and technology to complexity. Use this lightweight planner to
            pick the right starting point before adding payments, advanced search, or account features.
          </p>
        </div>

        <div className="rounded-lg border border-[#ded3ca] bg-white p-5 shadow-[0_20px_60px_rgba(23,20,19,0.1)] sm:p-6">
          <div className="grid gap-3 min-[520px]:grid-cols-3">
            {Object.keys(tiers).map((type) => (
              <button
                className={`rounded-lg border px-4 py-4 text-left font-black ${
                  siteType === type
                    ? "border-[#c83256] bg-[#c83256] text-white"
                    : "border-[#ded3ca] bg-[#fffaf6] text-[#171413]"
                }`}
                key={type}
                onClick={() => setSiteType(type)}
                type="button"
              >
                {type}
              </button>
            ))}
          </div>

          <label className="mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-lg bg-[#f4eee7] p-4 text-sm font-black">
            Add e-commerce checkout path
            <input
              checked={commerce}
              className="h-5 w-5 accent-[#c83256]"
              onChange={(event) => setCommerce(event.target.checked)}
              type="checkbox"
            />
          </label>

          <div className="mt-6 rounded-lg bg-[#171413] p-6 text-white">
            <p className="text-xs font-black uppercase tracking-normal text-[#f1bcc4]">Estimated build range</p>
            <p className="serif mt-2 text-4xl font-bold sm:text-5xl">{estimate}</p>
            <p className="mt-4 leading-7 text-white/75">
              Suggested stack: Next.js and React for the interface, Tailwind CSS for styling,
              Cloudinary-style image optimization, and Shopify or WooCommerce when selling starts.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden px-4 py-16 text-white sm:px-8 sm:py-20 lg:px-14 lg:py-28">
        <Image
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1800&q=82"
          alt="Fashion garments hanging in a boutique studio"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#171413]/75" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#f1bcc4]">Contact</p>
            <h2 className="serif max-w-4xl text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
              Ready for a fashion site that feels as considered as the collection?
            </h2>
          </div>
          <a className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#c83256] px-5 py-3 text-sm font-black text-white min-[420px]:w-fit" href="mailto:hello@example.com">
            hello@example.com
          </a>
        </div>
      </section>
    </main>
  );
}
