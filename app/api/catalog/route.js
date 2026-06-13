import { getPageSlides, getProducts } from "@/app/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const [pageSlides, products] = await Promise.all([
    getPageSlides(),
    getProducts()
  ]);

  return Response.json({ pageSlides, products });
}
