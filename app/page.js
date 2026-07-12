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

const tiers = {
  Portfolio: "$1,000-$5,000",
  Boutique: "$5,000-$20,000",
  Platform: "$20,000-$100,000+"
};

const fallbackPageSlides = [
  {
    page: "About Me",
    title: "Fashion direction with a digital-first point of view.",
    text: "Meet styleeditbyreena, a fashion journal and creative studio for boutiques, stylists, emerging labels, and editorial teams.",
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

const fallbackProducts = [
  {
    slug: "style-consultation",
    title: "Style Consultation",
    description: "A personalized virtual or in-person session to understand your lifestyle, goals, wardrobe needs, and style direction.",
    category: "Services",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=82",
    pricingNote: "Please inquire directly for pricing.",
    sortOrder: 1,
    isFeatured: true
  },
  {
    slug: "personal-styling-lookbook",
    title: "Personal Styling & Lookbook",
    description: "A fully curated style guide with complete outfits tailored to work, lifestyle, photoshoot, travel, and everyday needs.",
    category: "Services",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=1200&q=82",
    pricingNote: "Please inquire directly for pricing.",
    sortOrder: 2,
    isFeatured: true
  }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [pageSlides, setPageSlides] = useState(fallbackPageSlides);
  const [products, setProducts] = useState(fallbackProducts);
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
  const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 4);

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

      if (catalog.pageSlides?.length) {
        setPageSlides(catalog.pageSlides);
        setActiveSlide(0);
      }

      if (catalog.products?.length) {
        setProducts(catalog.products);
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
    <main className="min-h-screen bg-[#fff7f1] text-[#5b1725]">
      <section className="relative min-h-[calc(100vh-77px)] overflow-hidden bg-[#2b2320] text-white" aria-label="Page highlights slider">
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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(43,35,32,0.88),rgba(43,35,32,0.5)_55%,rgba(43,35,32,0.16))]" />

        <div className="relative z-10 flex min-h-[calc(100vh-77px)] items-end px-4 pb-10 pt-20 sm:px-8 lg:px-14">
          <div className="w-full max-w-4xl pb-4 sm:pb-[8vh]">
            <p className="mb-4 text-xs font-black uppercase tracking-normal text-[#f2cbd1]">
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
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#b76a7a] px-5 py-3 text-sm font-black text-white min-[520px]:w-auto"
                href={currentSlide.href}
              >
                {currentSlide.buttonLabel}
              </Link>

              <div className="flex items-center gap-3">
                <button
                  aria-label="Previous slide"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/30 text-2xl leading-none hover:border-[#f2cbd1] hover:text-[#f2cbd1]"
                  onClick={showPreviousSlide}
                  type="button"
                >
                  {"<"}
                </button>
                <button
                  aria-label="Next slide"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/30 text-2xl leading-none hover:border-[#f2cbd1] hover:text-[#f2cbd1]"
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
                  activeSlide === index ? "bg-[#f2cbd1]" : "bg-white/35 hover:bg-white/60"
                }`}
                key={slide.page}
                onClick={() => setActiveSlide(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24" aria-labelledby="featured-products-title">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#9f5f6f]">Featured products</p>
            <h2 id="featured-products-title" className="serif max-w-3xl text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
              Curated pieces Reena is highlighting now.
            </h2>
          </div>
          <Link className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[#d8c1b4] bg-white px-5 py-3 text-sm font-black min-[420px]:w-fit" href="/shop">
            Shop all
          </Link>
        </div>

        {featuredProducts.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <Link className="block overflow-hidden rounded-lg border border-[#d8c1b4] bg-white transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(43,35,32,0.12)]" href={`/shop/${product.slug}`} key={product.slug}>
                <div className="relative aspect-5/6">
                  <Image src={product.image} alt={product.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-black uppercase tracking-normal text-[#9f5f6f]">{product.category}</p>
                  <h3 className="mt-2 text-lg font-black leading-tight">{product.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6f5d55]">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-[#d8c1b4] bg-white p-6">
            <h3 className="text-xl font-black">No featured products selected</h3>
            <p className="mt-3 leading-7 text-[#6f5d55]">
              Administrators can choose featured products in the CMS by checking the Featured field.
            </p>
          </div>
        )}
      </section>

      <section id="journal" className="bg-[#f7e8df] px-4 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-28">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#9f5f6f]">Journal</p>
            <h2 className="serif text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">Fashion-first publishing.</h2>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 min-[520px]:flex min-[520px]:w-auto min-[520px]:flex-wrap">
            {categories.map((category) => (
              <button
                className={`min-h-11 rounded-lg border px-4 py-3 text-sm font-black transition ${
                  activeCategory === category
                    ? "border-[#2b2320] bg-[#2b2320] text-white"
                    : "border-[#d8c1b4] bg-[#fff7f1] text-[#5f5852] hover:border-[#2b2320]"
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
            <article className="overflow-hidden rounded-lg border border-[#d8c1b4] bg-[#fff7f1]" key={story.title}>
              <div className="relative aspect-4/5">
                <Image src={story.image} alt={story.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 25vw" />
              </div>
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-normal text-[#9f5f6f]">
                  {story.category} / {story.date}
                </p>
                <h3 className="mt-3 text-xl font-black leading-tight">{story.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#6f5d55]">{story.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="studio" className="grid gap-8 px-4 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-14 lg:py-28">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#9f5f6f]">Interactive planner</p>
          <h2 className="serif text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">Plan the right fashion website phase.</h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#6f5d55] sm:text-lg sm:leading-8">
            The guide recommends matching cost and technology to complexity. Use this lightweight planner to
            pick the right starting point before adding payments, advanced search, or account features.
          </p>
        </div>

        <div className="rounded-lg border border-[#d8c1b4] bg-white p-5 shadow-[0_20px_60px_rgba(43,35,32,0.1)] sm:p-6">
          <div className="grid gap-3 min-[520px]:grid-cols-3">
            {Object.keys(tiers).map((type) => (
              <button
                className={`rounded-lg border px-4 py-4 text-left font-black ${
                  siteType === type
                    ? "border-[#b76a7a] bg-[#b76a7a] text-white"
                    : "border-[#d8c1b4] bg-[#fff7f1] text-[#5b1725]"
                }`}
                key={type}
                onClick={() => setSiteType(type)}
                type="button"
              >
                {type}
              </button>
            ))}
          </div>

          <label className="mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-lg bg-[#f7e8df] p-4 text-sm font-black">
            Add e-commerce checkout path
            <input
              checked={commerce}
              className="h-5 w-5 accent-[#b76a7a]"
              onChange={(event) => setCommerce(event.target.checked)}
              type="checkbox"
            />
          </label>

          <div className="mt-6 rounded-lg bg-[#2b2320] p-6 text-white">
            <p className="text-xs font-black uppercase tracking-normal text-[#f2cbd1]">Estimated build range</p>
            <p className="serif mt-2 text-4xl font-bold sm:text-5xl">{estimate}</p>
            <p className="mt-4 leading-7 text-white/75">
              Suggested stack: Next.js and React for the interface, Tailwind CSS for styling,
              Cloudinary-style image optimization, and Shopify or WooCommerce when selling starts.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
