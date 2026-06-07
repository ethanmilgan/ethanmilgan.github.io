export const metadata = {
  title: "Contact | Maison Mode"
};

export default function ContactPage() {
  return (
    <main className="bg-[#fffaf6] px-4 py-16 text-[#171413] sm:px-8 sm:py-20 lg:px-14 lg:py-28">
      <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#b92e4d]">Contact</p>
          <h1 className="serif text-4xl font-bold leading-none min-[420px]:text-5xl sm:text-6xl lg:text-7xl">
            Tell us what you are building
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#655e58] sm:text-lg sm:leading-8">
            Reach out for fashion portfolio sites, blog strategy, collection pages, or boutique commerce planning.
          </p>
          <a className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#c83256] px-5 py-3 text-sm font-black text-white min-[420px]:w-fit" href="mailto:hello@example.com">
            hello@example.com
          </a>
        </div>

        <form className="rounded-lg border border-[#ded3ca] bg-white p-5 shadow-[0_20px_60px_rgba(23,20,19,0.1)] sm:p-6">
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-black">
              Name
              <input className="rounded-lg border border-[#ded3ca] bg-[#fffaf6] px-4 py-3 font-normal" placeholder="Your name" type="text" />
            </label>
            <label className="grid gap-2 text-sm font-black">
              Email
              <input className="rounded-lg border border-[#ded3ca] bg-[#fffaf6] px-4 py-3 font-normal" placeholder="you@example.com" type="email" />
            </label>
            <label className="grid gap-2 text-sm font-black">
              Project
              <textarea className="min-h-40 rounded-lg border border-[#ded3ca] bg-[#fffaf6] px-4 py-3 font-normal" placeholder="Portfolio, blog, shop, or commerce needs" />
            </label>
            <button className="rounded-lg bg-[#171413] px-5 py-3 text-sm font-black text-white" type="button">
              Send Inquiry
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
