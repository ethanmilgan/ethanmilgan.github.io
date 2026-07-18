import { getAllPageContent } from "@/app/lib/page-content";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ pages: await getAllPageContent() });
}
