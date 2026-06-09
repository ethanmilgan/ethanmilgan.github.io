import Image from "next/image";
import { getProducts } from "@/app/lib/catalog";

export const metadata = {
  title: "Shop | Style Edit by Reena"
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const shopItems = await getProducts();

  return (
    <main className="bg-[#fffaf6] text-[#171413]">
      <section className="relative overflow-hidden px-4 py-20 text-white sm:px-8 sm:py-24 lg:px-14 lg:py-32">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=82"
          alt="Fashion boutique clothing racks"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#171413]/76" />
        <div className="relative z-10 max-w-4xl">
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#f1bcc4]">Shop</p>
          <h1 className="serif text-4xl font-bold leading-none min-[420px]:text-5xl sm:text-6xl lg:text-7xl">
            Fashion products and curated edits with a point of view.
          </h1>
        </div>
      </section>

      <section className="grid gap-5 px-4 py-16 sm:grid-cols-2 sm:px-8 sm:py-20 xl:grid-cols-4 lg:px-14">
        {shopItems.map((item) => (
          <article className="overflow-hidden rounded-lg border border-[#ded3ca] bg-white" key={item.slug}>
            <div className="relative aspect-[4/5]">
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 25vw" />
            </div>
            <div className="p-6">
              <p className="text-xs font-black uppercase tracking-normal text-[#b92e4d]">{item.category}</p>
              <h2 className="mt-3 text-xl font-black leading-tight">{item.title}</h2>
              <p className="mt-4 leading-7 text-[#655e58]">{item.description}</p>
              <p className="mt-5 text-lg font-black">{item.price}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
