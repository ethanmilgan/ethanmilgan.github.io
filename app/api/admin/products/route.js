import { NextResponse } from "next/server";
import { getProductWriteCollection, getProducts } from "@/app/lib/catalog";
import { getSessionFromRequest, isAdmin } from "@/app/lib/auth";

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
  const title = String(input.title || "").trim();
  const slug = String(input.slug || slugify(title)).trim();
  const description = String(input.description || "").trim();
  const category = String(input.category || "").trim();
  const image = String(input.image || "").trim();
  const price = String(input.price || "").trim();
  const sortOrder = Number(input.sortOrder || 0);
  const isFeatured = Boolean(input.isFeatured);

  if (!title || !slug || !description || !category || !image || !price) {
    return null;
  }

  return { title, slug, description, category, image, price, sortOrder, isFeatured };
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

  const product = validateProduct(await request.json());

  if (!product) {
    return NextResponse.json({ error: "Missing required product fields." }, { status: 400 });
  }

  await collection.updateOne({ slug: product.slug }, { $set: product }, { upsert: true });
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

  const { slug } = await request.json();

  if (!slug) {
    return NextResponse.json({ error: "Product slug is required." }, { status: 400 });
  }

  await collection.deleteOne({ slug });
  return NextResponse.json({ ok: true });
}
