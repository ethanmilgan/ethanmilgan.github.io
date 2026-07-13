"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const categories = ["All", "Wardrobe", "Travel", "Photoshoot", "Closet Edit"];

const stories = [
  {
    title: "Why a smaller wardrobe can make getting dressed easier",
    category: "Wardrobe",
    date: "Wardrobe Notes",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=82",
    summary:
      "Reena believes most women do not need more clothes. They need the right pieces that fit well and work for real life."
  },
  {
    title: "How to make travel outfits feel polished without overpacking",
    category: "Travel",
    date: "Travel",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=82",
    summary:
      "Build a mix-and-match travel wardrobe around pieces that move from daytime plans to dinner without stress."
  },
  {
    title: "What to wear for a branding photoshoot",
    category: "Photoshoot",
    date: "Studio",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=82",
    summary:
      "Photoshoot styling should reflect your brand, photograph beautifully, and give you enough variety for a full gallery."
  },
  {
    title: "Closet edits that start with what you already own",
    category: "Retail",
    date: "Closet Edit",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=82",
    summary:
      "Before shopping for anything new, Reena helps clients identify what works, what is missing, and what no longer serves them."
  }
];

const gettingStartedSteps = [
  ["Book a Consultation", "Talk through your goals, lifestyle, budget, and what is not working in your wardrobe right now."],
  ["Create Your Plan", "Get a personalized styling experience built around your body, schedule, events, and everyday needs."],
  ["Love Your Wardrobe", "Walk away with outfits that make getting dressed simple, polished, and enjoyable every day."]
];

const fallbackPageSlides = [
  {
    page: "About Me",
    title: "Personal styling rooted in confidence, ease, and real life.",
    text: "Meet Reena, a stylist helping women build wardrobes that fit their lifestyle, body, budget, and confidence.",
    href: "/about",
    buttonLabel: "About Me",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=82"
  },
  {
    page: "Shop",
    title: "Styling services for closets, photoshoots, travel, and everyday life.",
    text: "Explore style consultations, closet edits, personal shopping, lookbooks, photoshoot styling, and event outfit planning.",
    href: "/shop",
    buttonLabel: "Shop",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=82"
  },
  {
    page: "Contact",
    title: "Ready to make getting dressed feel simple again?",
    text: "Book a consultation for wardrobe support that is tailored to your lifestyle, goals, budget, and personal style.",
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
  const [activeSlide, setActiveSlide] = useState(0);

  const filteredStories = useMemo(() => {
    if (activeCategory === "All") {
      return stories;
    }

    return stories.filter((story) => story.category === activeCategory);
  }, [activeCategory]);

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
      let response;

      try {
        response = await fetch("/api/catalog");
      } catch {
        return;
      }

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

    loadCatalog();

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
            <h2 className="serif text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">Wardrobe notes for real life.</h2>
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
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#9f5f6f]">How to get started</p>
          <h2 className="serif text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">A simple path to a wardrobe that works.</h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#6f5d55] sm:text-lg sm:leading-8">
            Reena starts by learning how you live, what you need, and where getting dressed feels frustrating. From there, every recommendation is tailored to you.
          </p>
        </div>

        <div className="rounded-lg border border-[#d8c1b4] bg-white p-5 shadow-[0_20px_60px_rgba(43,35,32,0.1)] sm:p-6">
          <div className="grid gap-4">
            {gettingStartedSteps.map(([title, body], index) => (
              <article className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] p-5" key={title}>
                <p className="text-xs font-black uppercase tracking-normal text-[#9f5f6f]">Step {index + 1}</p>
                <h3 className="mt-2 text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-[#6f5d55]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
