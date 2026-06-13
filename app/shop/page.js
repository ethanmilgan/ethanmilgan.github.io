import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/app/lib/catalog";

export const metadata = {
  title: "Shop | styleeditbyreena"
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const shopItems = await getProducts();

  return (
    <main className="bg-[#fff7f1] text-[#2b2320]">
      <section className="relative overflow-hidden px-4 py-20 text-white sm:px-8 sm:py-24 lg:px-14 lg:py-32">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=82"
          alt="Fashion boutique clothing racks"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#2b2320]/76" />
        <div className="relative z-10 max-w-4xl">
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#f2cbd1]">Shop</p>
          <h1 className="serif text-4xl font-bold leading-none min-[420px]:text-5xl sm:text-6xl lg:text-7xl">
            Fashion products and curated edits with a point of view.
          </h1>
        </div>
      </section>

      <section className="grid gap-4 px-4 py-16 sm:grid-cols-2 sm:px-8 sm:py-20 lg:grid-cols-3 xl:grid-cols-4 lg:px-14">
        {shopItems.map((item) => (
          <Link className="block overflow-hidden rounded-lg border border-[#d8c1b4] bg-white transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(43,35,32,0.12)]" href={`/shop/${item.slug}`} key={item.slug}>
            <div className="relative aspect-[5/6]">
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            </div>
            <div className="p-4">
              <p className="text-xs font-black uppercase tracking-normal text-[#9f5f6f]">{item.category}</p>
              <h2 className="mt-2 text-lg font-black leading-tight">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6f5d55]">{item.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
