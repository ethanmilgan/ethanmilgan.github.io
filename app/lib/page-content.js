import { getMongoDb } from "./mongodb";
import { cleanEmail, cleanImageUrl, cleanText, isPlainObject } from "./input-validation";

const fieldTextMax = 1400;

export const pageContentSchema = [
  {
    page: "home",
    label: "Home",
    fields: [
      ["featuredEyebrow", "Featured products"],
      ["featuredTitle", "Curated pieces Reena is highlighting now"],
      ["journalEyebrow", "Journal"],
      ["journalTitle", "Wardrobe notes for real life"],
      ["gettingStartedEyebrow", "How to get started"],
      ["gettingStartedTitle", "A simple path to a wardrobe that works"],
      [
        "gettingStartedText",
        "Reena starts by learning how you live, what you need, and where getting dressed feels frustrating. From there, every recommendation is tailored to you."
      ],
      ["aboutSlideImage", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=82"],
      ["servicesSlideImage", "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=82"],
      ["contactSlideImage", "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=82"]
    ]
  },
  {
    page: "about",
    label: "About",
    fields: [
      ["heroEyebrow", "About Reena"],
      ["heroTitle", "Personal styling rooted in confidence, ease, and real life"],
      [
        "heroText",
        "Reena helps women build wardrobes that fit their lifestyle, their body, and the image they want to project so getting dressed feels simple again."
      ],
      ["heroImage", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=82"],
      ["storyEyebrow", "Her Story"],
      ["storyTitle", "A love for style that started at home"],
      [
        "storyParagraphOne",
        "Looking back, Reena's love for style started at home. Her dad always encouraged her family to take pride in the way they presented themselves. It was never about designer labels or having the biggest wardrobe. It was about looking put together, feeling confident, and respecting yourself and the people around you."
      ],
      [
        "storyParagraphTwo",
        "Before becoming a style consultant, Reena spent several years working in Corporate America. She genuinely looked forward to getting dressed for work and soon became the person coworkers came to for outfit advice before presentations, meetings, work trips, and events."
      ],
      [
        "storyParagraphThree",
        "Those conversations sparked her desire to become a style consultant. Today, she helps busy professionals, business owners, moms, and women tired of staring at full closets build wardrobes that make their mornings easier."
      ],
      ["faqEyebrow", "Frequently Asked Questions"],
      ["faqTitle", "What working with Reena looks like"]
    ]
  },
  {
    page: "shop",
    label: "Services",
    fields: [
      ["heroEyebrow", "Styling Services"],
      ["heroTitle", "Wardrobe support for closets, photoshoots, travel, events, and everyday life"],
      ["heroImage", "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=82"]
    ]
  },
  {
    page: "contact",
    label: "Contact",
    fields: [
      ["heroEyebrow", "Contact"],
      ["heroTitle", "Book a styling consultation"],
      [
        "heroText",
        "Reach out for closet edits, personal shopping, branding photoshoot styling, event looks, or help making your wardrobe feel easy again."
      ],
      ["email", "beingreena03@gmail.com"],
      ["nameLabel", "Name"],
      ["emailLabel", "Email"],
      ["goalsLabel", "Styling goals"],
      ["buttonLabel", "Send Inquiry"]
    ]
  },
  {
    page: "globalContact",
    label: "Bottom contact section",
    fields: [
      ["eyebrow", "Contact us"],
      ["title", "Ready to make getting dressed feel simple again?"],
      ["email", "beingreena03@gmail.com"],
      ["backgroundImage", "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1800&q=82"]
    ]
  }
];

export const defaultPageContent = Object.fromEntries(
  pageContentSchema.map((section) => [
    section.page,
    Object.fromEntries(section.fields.map(([key, value]) => [key, value]))
  ])
);

const pageContentSchemaByPage = new Map(pageContentSchema.map((section) => [section.page, section]));

function normalizePage(value) {
  const page = cleanText(value, 40);
  return pageContentSchemaByPage.has(page) ? page : "";
}

function sanitizeFields(page, fields) {
  const schema = pageContentSchemaByPage.get(page);

  if (!schema || !isPlainObject(fields)) {
    return null;
  }

  return Object.fromEntries(
    schema.fields.map(([key, fallback]) => {
      const isImageField = key.toLowerCase().includes("image");
      const value = key === "email"
        ? cleanEmail(fields[key]) || fallback
        : isImageField
          ? cleanImageUrl(fields[key]) || fallback
          : cleanText(fields[key] ?? fallback, fieldTextMax) || fallback;

      return [key, value];
    })
  );
}

async function getPageContentCollection() {
  try {
    const db = await getMongoDb();
    return db ? db.collection("pageContent") : null;
  } catch {
    return null;
  }
}

export async function getPageContent(page) {
  const normalizedPage = normalizePage(page);

  if (!normalizedPage) {
    return {};
  }

  const fallback = defaultPageContent[normalizedPage];
  const collection = await getPageContentCollection();

  if (!collection) {
    return fallback;
  }

  const record = await collection.findOne({ page: normalizedPage });
  return { ...fallback, ...(record?.fields || {}) };
}

export async function getAllPageContent() {
  const entries = await Promise.all(
    pageContentSchema.map(async (section) => ({
      page: section.page,
      label: section.label,
      fields: await getPageContent(section.page)
    }))
  );

  return entries;
}

export async function savePageContent(page, fields) {
  const normalizedPage = normalizePage(page);
  const sanitizedFields = sanitizeFields(normalizedPage, fields);

  if (!normalizedPage || !sanitizedFields) {
    return { error: "Invalid page content payload." };
  }

  const collection = await getPageContentCollection();

  if (!collection) {
    return { error: "MongoDB is not configured. Set MONGODB_URI before editing page content." };
  }

  await collection.updateOne(
    { page: normalizedPage },
    { $set: { page: normalizedPage, fields: sanitizedFields, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );

  return { content: { page: normalizedPage, fields: sanitizedFields } };
}
