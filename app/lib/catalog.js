import { getMongoDb } from "./mongodb";
import { seedPageSlides, seedProducts } from "./seed-data";

function bySortOrder(left, right) {
  return (left.sortOrder || 0) - (right.sortOrder || 0);
}

function byTitle(left, right) {
  return String(left.title || "").localeCompare(String(right.title || ""));
}

async function readMongoCollection(name, fallback, sort = {}) {
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
    records = await db.collection(name).find({}).sort(sort).toArray();
  } catch {
    return fallback;
  }

  return records.map(({ _id, ...record }) => record);
}

export async function getProducts() {
  const products = await readMongoCollection("products", seedProducts, { title: 1 });
  return products.sort(byTitle);
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
  const pageSlides = await readMongoCollection("pageSlides", seedPageSlides, { sortOrder: 1 });
  return pageSlides.sort(bySortOrder);
}
