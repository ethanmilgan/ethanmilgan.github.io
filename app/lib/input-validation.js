const controlCharacters = /[\u0000-\u001f\u007f]/g;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const objectIdPathPattern = /^\/api\/assets\/[a-f\d]{24}$/i;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function readJsonObject(request) {
  try {
    const body = await request.json();
    return isPlainObject(body) ? body : null;
  } catch {
    return null;
  }
}

export function cleanText(value, maxLength = 500) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value).replace(controlCharacters, "").trim().slice(0, maxLength);
}

export function cleanEmail(value) {
  const email = cleanText(value, 254).toLowerCase();
  return emailPattern.test(email) ? email : "";
}

export function cleanPassword(value) {
  return typeof value === "string" ? value.slice(0, 256) : "";
}

export function cleanDate(value) {
  const date = cleanText(value, 20);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
}

export function cleanInteger(value, fallback = 0) {
  const number = Number(value);
  return Number.isSafeInteger(number) ? number : fallback;
}

export function cleanBoolean(value) {
  return value === true || value === "true";
}

export function cleanSlug(value) {
  const slug = cleanText(value, 80)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return slugPattern.test(slug) ? slug : "";
}

export function cleanImageUrl(value) {
  const image = cleanText(value, 2000);

  if (objectIdPathPattern.test(image)) {
    return image;
  }

  try {
    const url = new URL(image);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}
