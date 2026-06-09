import { MongoClient } from "mongodb";

let cachedClient;
let cachedDb;

export async function getMongoDb() {
  if (!process.env.MONGODB_URI) {
    return null;
  }

  if (cachedDb) {
    return cachedDb;
  }

  cachedClient = cachedClient || new MongoClient(process.env.MONGODB_URI);
  await cachedClient.connect();

  cachedDb = cachedClient.db(process.env.MONGODB_DB || "style_edit_by_reena");
  return cachedDb;
}
