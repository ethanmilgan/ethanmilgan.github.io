import { NextResponse } from "next/server";
import { getAllPageContent, savePageContent } from "@/app/lib/page-content";
import { getSessionFromRequest, isAdmin } from "@/app/lib/auth";
import { readJsonObject } from "@/app/lib/input-validation";

export const dynamic = "force-dynamic";

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

  return NextResponse.json({ pages: await getAllPageContent() });
}

export async function POST(request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
  }

  const body = await readJsonObject(request);

  if (!body) {
    return NextResponse.json({ error: "Invalid page content payload." }, { status: 400 });
  }

  const result = await savePageContent(body.page, body.fields);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
