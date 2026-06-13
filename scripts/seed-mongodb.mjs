import { MongoClient } from "mongodb";
import { seedPageSlides, seedProducts } from "../app/lib/seed-data.js";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required to seed MongoDB.");
}

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = process.env.MONGODB_DB || "style_edit_by_reena";

async function upsertMany(collectionName, records, key) {
  const collection = client.db(dbName).collection(collectionName);

  for (const record of records) {
    const unset = collectionName === "products" ? { price: "" } : {};
    await collection.updateOne({ [key]: record[key] }, { $set: record, $unset: unset }, { upsert: true });
  }
}

await client.connect();
await upsertMany("products", seedProducts, "slug");
await client
  .db(dbName)
  .collection("products")
  .deleteMany({ slug: { $nin: seedProducts.map((product) => product.slug) } });
await upsertMany("pageSlides", seedPageSlides, "page");
await client.db(dbName).collection("collections").drop().catch(() => {});
await client.close();

console.log(`Seeded MongoDB database "${dbName}".`);
