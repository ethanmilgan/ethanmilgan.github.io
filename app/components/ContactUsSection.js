import Image from "next/image";

export default function ContactUsSection() {
  return (
    <section id="contact-us" className="relative overflow-hidden px-4 py-16 text-white sm:px-8 sm:py-20 lg:px-14 lg:py-28">
      <Image
        src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1800&q=82"
        alt="Fashion garments hanging in a boutique studio"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#2b2320]/75" />
      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#f2cbd1]">Contact us</p>
          <h2 className="serif max-w-4xl text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
            Ready to make getting dressed feel simple again?
          </h2>
        </div>
        <a
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#b76a7a] px-5 py-3 text-sm font-black text-white min-[420px]:w-fit"
          href="mailto:beingreena03@gmail.com"
        >
          beingreena03@gmail.com
        </a>
      </div>
    </section>
  );
}
