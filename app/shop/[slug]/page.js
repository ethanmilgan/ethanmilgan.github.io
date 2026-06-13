import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/app/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Service not found | styleeditbyreena"
    };
  }

  return {
    title: `${product.title} | styleeditbyreena`,
    description: product.description
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-[#fff7f1] text-[#2b2320]">
      <section className="grid gap-8 px-4 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-14 lg:py-28">
        <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-[#d8c1b4] bg-[#f7e8df]">
          <Image
            alt={product.title}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            src={product.image}
          />
        </div>

        <div className="flex flex-col justify-center">
          <Link className="mb-8 text-sm font-black text-[#9f5f6f]" href="/shop">
            Back to shop
          </Link>
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#9f5f6f]">{product.category}</p>
          <h1 className="serif text-4xl font-bold leading-none min-[420px]:text-5xl sm:text-6xl">
            {product.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#6f5d55] sm:text-lg">
            {product.description}
          </p>

          <div className="mt-8 rounded-lg border border-[#d8c1b4] bg-white p-5">
            <p className="text-xs font-black uppercase tracking-normal text-[#9f5f6f]">Pricing</p>
            <p className="mt-2 text-lg font-black">{product.pricingNote || "Please inquire directly for pricing."}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 min-[520px]:flex-row">
            <Link className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2b2320] px-5 py-3 text-sm font-black text-white" href="/contact">
              Inquire about this service
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#d8c1b4] bg-white px-5 py-3 text-sm font-black" href="/shop">
              View all services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
