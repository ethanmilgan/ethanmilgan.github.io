import Image from "next/image";
import { removeTrailingHeadingPeriod } from "@/app/lib/text-format";

const fallbackContent = {
  eyebrow: "Contact us",
  title: "Ready to make getting dressed feel simple again?",
  email: "beingreena03@gmail.com",
  backgroundImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1800&q=82"
};

export default function ContactUsSection({ content = fallbackContent }) {
  const sectionContent = { ...fallbackContent, ...content };

  return (
    <section id="contact-us" className="relative overflow-hidden px-4 py-16 text-white sm:px-8 sm:py-20 lg:px-14 lg:py-28">
      <Image
        src={sectionContent.backgroundImage}
        alt="Fashion garments hanging in a boutique studio"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#2b2320]/75" />
      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#f2cbd1]">{sectionContent.eyebrow}</p>
          <h2 className="serif max-w-4xl text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
            {removeTrailingHeadingPeriod(sectionContent.title)}
          </h2>
        </div>
        <a
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#b76a7a] px-5 py-3 text-sm font-black text-white min-[420px]:w-fit"
          href={`mailto:${sectionContent.email}`}
        >
          {sectionContent.email}
        </a>
      </div>
    </section>
  );
}
