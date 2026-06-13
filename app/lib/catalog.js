import { getMongoDb } from "./mongodb";
import { seedPageSlides, seedProducts } from "./seed-data";

function bySortOrder(left, right) {
  return (left.sortOrder || 0) - (right.sortOrder || 0);
}

async function readMongoCollection(name, fallback) {
  const db = await getMongoDb();

  if (!db) {
    return fallback;
  }

  const records = await db.collection(name).find({}).sort({ sortOrder: 1 }).toArray();

  return records.map(({ _id, ...record }) => record);
}

export async function getProducts() {
  const products = await readMongoCollection("products", seedProducts);
  return products.sort(bySortOrder);
}

export async function getProductBySlug(slug) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) || null;
}

export async function getProductWriteCollection() {
  const db = await getMongoDb();

  if (!db) {
    return null;
  }

  return db.collection("products");
}

export async function getPageSlides() {
  const pageSlides = await readMongoCollection("pageSlides", seedPageSlides);
  return pageSlides.sort(bySortOrder);
}
