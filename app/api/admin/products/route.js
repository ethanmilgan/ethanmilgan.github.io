import { NextResponse } from "next/server";
import { getProductWriteCollection, getProducts } from "@/app/lib/catalog";
import { getSessionFromRequest, isAdmin } from "@/app/lib/auth";
import {
  cleanBoolean,
  cleanImageUrl,
  cleanInteger,
  cleanSlug,
  cleanText,
  readJsonObject
} from "@/app/lib/input-validation";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function requireAdmin(request) {
  const session = getSessionFromRequest(request);

  if (!isAdmin(session)) {
    return null;
  }

  return session;
}

function validateProduct(input) {
  const title = cleanText(input.title, 120);
  const slug = cleanSlug(input.slug || slugify(title));
  const description = cleanText(input.description, 1200);
  const category = cleanText(input.category, 80);
  const image = cleanImageUrl(input.image);
  const pricingNote = cleanText(input.pricingNote || "Please inquire directly for pricing.", 180);
  const sortOrder = cleanInteger(input.sortOrder, 0);
  const isFeatured = cleanBoolean(input.isFeatured);

  if (!title || !slug || !description || !category || !image || !pricingNote) {
    return null;
  }

  return { title, slug, description, category, image, pricingNote, sortOrder, isFeatured };
}

export async function GET(request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
  }

  return NextResponse.json({ products: await getProducts() });
}

export async function POST(request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
  }

  const collection = await getProductWriteCollection();

  if (!collection) {
    return NextResponse.json({ error: "MongoDB is not configured. Set MONGODB_URI before editing products." }, { status: 503 });
  }

  const body = await readJsonObject(request);

  if (!body) {
    return NextResponse.json({ error: "Invalid product payload." }, { status: 400 });
  }

  const product = validateProduct(body);

  if (!product) {
    return NextResponse.json({ error: "Missing required product fields." }, { status: 400 });
  }

  await collection.updateOne({ slug: product.slug }, { $set: product, $unset: { price: "" } }, { upsert: true });
  return NextResponse.json({ product });
}

export async function DELETE(request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
  }

  const collection = await getProductWriteCollection();

  if (!collection) {
    return NextResponse.json({ error: "MongoDB is not configured. Set MONGODB_URI before editing products." }, { status: 503 });
  }

  const body = await readJsonObject(request);
  const slug = cleanSlug(body?.slug);

  if (!slug) {
    return NextResponse.json({ error: "Product slug is required." }, { status: 400 });
  }

  await collection.deleteOne({ slug });
  return NextResponse.json({ ok: true });
}
