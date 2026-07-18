import { getPageSlides, getProducts } from "@/app/lib/catalog";
import { getPageContent } from "@/app/lib/page-content";

export const dynamic = "force-dynamic";

export async function GET() {
  const [pageSlides, products, pageContent] = await Promise.all([
    getPageSlides(),
    getProducts(),
    getPageContent("home")
  ]);

  const pageSlidesWithContentImages = pageSlides.map((slide) => {
    if (slide.href === "/about") {
      return { ...slide, image: pageContent.aboutSlideImage };
    }

    if (slide.href === "/shop" || slide.href === "/services") {
      return { ...slide, href: "/services", page: "Services", buttonLabel: "Services", image: pageContent.servicesSlideImage };
    }

    if (slide.href === "/contact") {
      return { ...slide, image: pageContent.contactSlideImage };
    }

    return slide;
  });

  return Response.json({ pageSlides: pageSlidesWithContentImages, products, pageContent });
}
