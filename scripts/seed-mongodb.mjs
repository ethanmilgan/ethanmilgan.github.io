import { MongoClient } from "mongodb";
import { seedCollections, seedPageSlides, seedProducts } from "../app/lib/seed-data.js";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required to seed MongoDB.");
}

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = process.env.MONGODB_DB || "style_edit_by_reena";

async function upsertMany(collectionName, records, key) {
  const collection = client.db(dbName).collection(collectionName);

  for (const record of records) {
    await collection.updateOne({ [key]: record[key] }, { $set: record }, { upsert: true });
  }
}

await client.connect();
await upsertMany("products", seedProducts, "slug");
await upsertMany("collections", seedCollections, "name");
await upsertMany("pageSlides", seedPageSlides, "page");
await client.close();

console.log(`Seeded MongoDB database "${dbName}".`);
