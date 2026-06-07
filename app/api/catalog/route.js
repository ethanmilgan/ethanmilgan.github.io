import { getCollections, getPageSlides, getProducts } from "@/app/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const [collections, pageSlides, products] = await Promise.all([
    getCollections(),
    getPageSlides(),
    getProducts()
  ]);

  return Response.json({ collections, pageSlides, products });
}
