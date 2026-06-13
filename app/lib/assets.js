import { ObjectId } from "mongodb";
import { getMongoDb } from "./mongodb";

const maxAssetBytes = 5 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function getAssetUrl(id) {
  return `/api/assets/${id}`;
}

export function normalizeSection(value) {
  const section = String(value || "general").trim().toLowerCase();
  return section || "general";
}

export function normalizeAssetForList(asset) {
  const id = asset._id.toString();

  return {
    id,
    filename: asset.filename,
    altText: asset.altText || "",
    contentType: asset.contentType,
    size: asset.size,
    section: asset.section || "general",
    createdAt: asset.createdAt,
    url: getAssetUrl(id)
  };
}

export async function getImageAssetCollection() {
  const db = await getMongoDb();

  if (!db) {
    return null;
  }

  return db.collection("imageAssets");
}

export async function getImageAssets() {
  const collection = await getImageAssetCollection();

  if (!collection) {
    return [];
  }

  const assets = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return assets.map(normalizeAssetForList);
}

export async function getImageAssetById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = await getImageAssetCollection();

  if (!collection) {
    return null;
  }

  return collection.findOne({ _id: new ObjectId(id) });
}

export async function createImageAsset({ file, altText, section }) {
  if (!file || !file.size) {
    return { error: "Choose an image file to upload." };
  }

  if (!allowedImageTypes.has(file.type)) {
    return { error: "Only JPEG, PNG, WebP, and GIF images can be uploaded." };
  }

  if (file.size > maxAssetBytes) {
    return { error: "Images must be 5 MB or smaller." };
  }

  const collection = await getImageAssetCollection();

  if (!collection) {
    return { error: "MongoDB is not configured. Set MONGODB_URI before uploading images." };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const asset = {
    filename: file.name || "uploaded-image",
    altText: String(altText || "").trim(),
    contentType: file.type,
    size: file.size,
    section: normalizeSection(section),
    data: bytes.toString("base64"),
    createdAt: new Date().toISOString()
  };

  const result = await collection.insertOne(asset);
  return { asset: normalizeAssetForList({ ...asset, _id: result.insertedId }) };
}

export async function deleteImageAsset(id) {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const collection = await getImageAssetCollection();

  if (!collection) {
    return false;
  }

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
