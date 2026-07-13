import Image from "next/image";
import { getLatestImageAssetBySection } from "@/app/lib/assets";
import { removeTrailingHeadingPeriod } from "@/app/lib/text-format";

export const metadata = {
  title: "About Reena | styleeditbyreena",
  description:
    "Meet Reena, a personal stylist helping women build practical wardrobes that fit their lifestyle, body, budget, and confidence."
};

const philosophyCards = [
  [
    "Style starts with confidence",
    "How you show up says a lot before you speak. Reena helps clients feel polished, confident, and comfortable in real life."
  ],
  [
    "The right pieces matter",
    "A great wardrobe does not need to be packed with clothes. It needs pieces that fit well, work hard, and mix together easily."
  ],
  [
    "Getting dressed should feel simple",
    "Whether it is work, motherhood, travel, an event, or a branding shoot, the goal is to remove the stress from choosing what to wear."
  ]
];

const faqs = [
  [
    "Do you offer virtual styling?",
    "Yes. Many clients are outside Northern Virginia, so virtual styling is available through FaceTime or Zoom for closet edits, try-ons, photoshoot planning, and special events."
  ],
  [
    "What can I expect when working with you?",
    "Every service starts with a consultation about your lifestyle, goals, budget, and wardrobe challenges. From there, Reena creates a plan tailored specifically to you."
  ],
  [
    "Do you work within my budget?",
    "Absolutely. Before shopping begins, you will talk through what you are comfortable spending so the recommendations make sense for your life."
  ],
  [
    "How long does the styling process take?",
    "It depends on the service. A closet edit is usually completed in two to three sessions, while personal shopping or branding photoshoot styling may take longer."
  ],
  [
    "Do I have to purchase everything you recommend?",
    "No. Recommendations are just recommendations. Reena explains why each piece was chosen, and you decide what feels right."
  ],
  [
    "What if I hate shopping?",
    "You are not alone. Reena can research and source pieces for you, and personal shopping with white-glove delivery is available for a more hands-off experience."
  ],
  [
    "Will you help me shop my own closet first?",
    "Yes. Reena loves showing clients how many great outfits they already own before recommending new pieces."
  ],
  [
    "Do you style for branding photoshoots?",
    "Yes. Branding photoshoot styling helps you create outfits that reflect your brand, photograph beautifully, and give your session variety."
  ]
];

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const aboutImage = await getLatestImageAssetBySection("about");
  const aboutImageSrc =
    aboutImage?.url || "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=82";
  const aboutImageAlt = aboutImage?.altText || "Reena personal stylist portrait";

  return (
    <main className="bg-[#fff7f1] text-[#5b1725]">
      <section className="grid gap-10 px-4 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-14 lg:py-28">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#9f5f6f]">About Reena</p>
          <h1 className="serif text-4xl font-bold leading-none min-[420px]:text-5xl sm:text-6xl lg:text-7xl">
            Personal styling rooted in confidence, ease, and real life
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#6f5d55] sm:text-lg sm:leading-8">
            Reena helps women build wardrobes that fit their lifestyle, their body, and the image they want to project so getting dressed feels simple again.
          </p>
        </div>
        <div className="relative min-h-80 overflow-hidden rounded-lg sm:min-h-130">
          <Image
            src={aboutImageSrc}
            alt={aboutImageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        </div>
      </section>

      <section className="grid gap-5 bg-[#2b2320] px-4 py-16 text-white sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-14">
        {philosophyCards.map(([title, body]) => (
          <article className="rounded-lg border border-white/15 p-6" key={title}>
            <h2 className="text-xl font-black">{removeTrailingHeadingPeriod(title)}</h2>
            <p className="mt-3 leading-7 text-white/72">{body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-10 px-4 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-14 lg:py-28">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#9f5f6f]">Her Story</p>
          <h2 className="serif text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
            A love for style that started at home
          </h2>
        </div>
        <div className="grid gap-5 text-base leading-8 text-[#6f5d55] sm:text-lg">
          <p>
            Looking back, Reena's love for style started at home. Her dad always encouraged her family to take pride in the way they presented themselves. It was never about designer labels or having the biggest wardrobe. It was about looking put together, feeling confident, and respecting yourself and the people around you.
          </p>
          <p>
            Before becoming a style consultant, Reena spent several years working in Corporate America. She genuinely looked forward to getting dressed for work and soon became the person coworkers came to for outfit advice before presentations, meetings, work trips, and events.
          </p>
          <p>
            Those conversations sparked her desire to become a style consultant. Today, she helps busy professionals, business owners, moms, and women tired of staring at full closets build wardrobes that make their mornings easier.
          </p>
        </div>
      </section>

      <section className="bg-[#f7e8df] px-4 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-28">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#9f5f6f]">Frequently Asked Questions</p>
          <h2 className="serif text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
            What working with Reena looks like
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <article className="rounded-lg border border-[#d8c1b4] bg-white p-5" key={question}>
              <h3 className="text-lg font-black leading-tight">{removeTrailingHeadingPeriod(question)}</h3>
              <p className="mt-3 leading-7 text-[#6f5d55]">{answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
