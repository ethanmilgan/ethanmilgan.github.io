import { NextResponse } from "next/server";
import { getImageAssetById } from "@/app/lib/assets";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;
  const asset = await getImageAssetById(id);

  if (!asset) {
    return NextResponse.json({ error: "Image asset was not found." }, { status: 404 });
  }

  return new NextResponse(Buffer.from(asset.data, "base64"), {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": asset.contentType
    }
  });
}
