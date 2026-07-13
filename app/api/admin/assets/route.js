import { NextResponse } from "next/server";
import { createImageAsset, deleteImageAsset, getImageAssets } from "@/app/lib/assets";
import { getSessionFromRequest, isAdmin } from "@/app/lib/auth";
import { cleanText, readJsonObject } from "@/app/lib/input-validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function requireAdmin(request) {
  const session = getSessionFromRequest(request);

  if (!isAdmin(session)) {
    return null;
  }

  return session;
}

export async function GET(request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
  }

  return NextResponse.json({ assets: await getImageAssets() });
}

export async function POST(request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
  }

  let formData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Unable to read upload. Try a smaller JPEG or PNG file." }, { status: 400 });
  }

  const result = await createImageAsset({
    file: formData.get("file"),
    altText: formData.get("altText"),
    section: formData.get("section")
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ asset: result.asset }, { status: 201 });
}

export async function DELETE(request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
  }

  const body = await readJsonObject(request);
  const id = cleanText(body?.id, 24);

  if (!id) {
    return NextResponse.json({ error: "Image asset id is required." }, { status: 400 });
  }

  const deleted = await deleteImageAsset(id);

  if (!deleted) {
    return NextResponse.json({ error: "Image asset was not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
