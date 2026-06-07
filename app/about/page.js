import Image from "next/image";

export const metadata = {
  title: "About Us | Maison Mode"
};

export default function AboutPage() {
  return (
    <main className="bg-[#fffaf6] text-[#171413]">
      <section className="grid gap-10 px-4 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-14 lg:py-28">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#b92e4d]">About Me</p>
          <h1 className="serif text-4xl font-bold leading-none min-[420px]:text-5xl sm:text-6xl lg:text-7xl">
            Fashion direction with a digital-first point of view.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#655e58] sm:text-lg sm:leading-8">
            Maison Mode is a fashion journal and creative studio for boutiques, stylists,
            emerging labels, and editorial teams that need polished storytelling online.
          </p>
        </div>
        <div className="relative min-h-[320px] overflow-hidden rounded-lg sm:min-h-[520px]">
          <Image
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=82"
            alt="Fashion editorial studio shoot"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        </div>
      </section>

      <section className="grid gap-5 bg-[#171413] px-4 py-16 text-white sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-14">
        {[
          ["Editorial taste", "We shape visual stories around silhouettes, texture, styling, and campaign mood."],
          ["Practical systems", "We build pages that are easy to scan, update, and extend as a label grows."],
          ["Boutique commerce", "We plan product discovery, lookbooks, social paths, and checkout-readiness together."]
        ].map(([title, body]) => (
          <article className="rounded-lg border border-white/15 p-6" key={title}>
            <h2 className="text-xl font-black">{title}</h2>
            <p className="mt-3 leading-7 text-white/72">{body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
