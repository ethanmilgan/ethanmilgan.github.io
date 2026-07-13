import { getMongoDb } from "./mongodb";
import { seedPageSlides, seedProducts } from "./seed-data";

function bySortOrder(left, right) {
  return (left.sortOrder || 0) - (right.sortOrder || 0);
}

async function readMongoCollection(name, fallback) {
  let db;

  try {
    db = await getMongoDb();
  } catch {
    return fallback;
  }

  if (!db) {
    return fallback;
  }

  let records;

  try {
    records = await db.collection(name).find({}).sort({ sortOrder: 1 }).toArray();
  } catch {
    return fallback;
  }

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
  let db;

  try {
    db = await getMongoDb();
  } catch {
    return null;
  }

  if (!db) {
    return null;
  }

  return db.collection("products");
}

export async function getPageSlides() {
  const pageSlides = await readMongoCollection("pageSlides", seedPageSlides);
  return pageSlides.sort(bySortOrder);
}
