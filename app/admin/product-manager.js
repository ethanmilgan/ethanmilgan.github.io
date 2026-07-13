"use client";

import { useState } from "react";

const emptyProduct = {
  slug: "",
  title: "",
  description: "",
  category: "",
  image: "",
  pricingNote: "Please inquire directly for pricing.",
  sortOrder: 0,
  isFeatured: false
};

const assetSections = ["general", "slider", "featured", "shop", "about", "contact", "product"];
const uploadMaxBytes = 4 * 1024 * 1024;
const uploadMaxDimension = 1800;
const compressibleImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const passthroughImageTypes = new Set(["image/gif", "image/svg+xml", "image/x-icon", "image/vnd.microsoft.icon"]);
const imageFilenamePattern = /\.(avif|bmp|gif|heic|heif|ico|jfif|jpe?g|png|svg|tiff?|webp)$/i;

function formatBytes(bytes) {
  if (!bytes) {
    return "0 B";
  }

  const units = ["B", "KB", "MB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(imageUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("This image format could not be read. If it is HEIC, export it as JPEG first."));
    };

    image.src = imageUrl;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

async function prepareImageForUpload(file) {
  if (!file) {
    throw new Error("Choose an image file to upload.");
  }

  const isImage = file.type.startsWith("image/") || imageFilenamePattern.test(file.name);

  if (!isImage) {
    throw new Error("Choose an image file.");
  }

  if (passthroughImageTypes.has(file.type)) {
    if (file.size > uploadMaxBytes) {
      throw new Error(`This image format must be ${formatBytes(uploadMaxBytes)} or smaller.`);
    }

    return file;
  }

  let image;

  try {
    image = await loadImage(file);
  } catch (error) {
    if (file.size <= uploadMaxBytes) {
      return file;
    }

    throw new Error(`${error.message} Choose a file under ${formatBytes(uploadMaxBytes)} or convert it to JPEG, PNG, or WebP.`);
  }

  const scale = Math.min(1, uploadMaxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  for (const quality of compressibleImageTypes.has(file.type) ? [0.86, 0.76, 0.66] : [0.9, 0.78, 0.66]) {
    const blob = await canvasToBlob(canvas, "image/jpeg", quality);

    if (blob && blob.size <= uploadMaxBytes) {
      const filename = file.name.replace(/\.[^.]+$/, "") || "uploaded-image";
      return new File([blob], `${filename}.jpg`, { type: "image/jpeg" });
    }
  }

  if (file.size <= uploadMaxBytes) {
    return file;
  }

  throw new Error(`Image is still too large after resizing. Choose an image under ${formatBytes(uploadMaxBytes)}.`);
}

export default function AdminProductManager({ initialAssets, initialProducts }) {
  const [assets, setAssets] = useState(initialAssets);
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState(emptyProduct);
  const [message, setMessage] = useState("");
  const [assetMessage, setAssetMessage] = useState("");
  const [assetForm, setAssetForm] = useState({
    altText: "",
    section: "product",
    file: null
  });

  function editProduct(product) {
    setForm({ ...emptyProduct, ...product, pricingNote: product.pricingNote || emptyProduct.pricingNote });
    setMessage("");
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function refreshProducts() {
    const response = await fetch("/api/admin/products");

    if (response.ok) {
      const result = await response.json();
      setProducts(result.products);
    }
  }

  async function refreshAssets() {
    const response = await fetch("/api/admin/assets");

    if (response.ok) {
      const result = await response.json();
      setAssets(result.assets);
    }
  }

  async function saveProduct(event) {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || "Unable to save product.");
      return;
    }

    setForm(emptyProduct);
    setMessage("Product saved.");
    await refreshProducts();
  }

  async function deleteProduct(slug) {
    const response = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug })
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || "Unable to delete product.");
      return;
    }

    setMessage("Product deleted.");
    await refreshProducts();
  }

  async function uploadAsset(event) {
    event.preventDefault();
    setAssetMessage("Preparing image...");

    let uploadFile;

    try {
      uploadFile = await prepareImageForUpload(assetForm.file);
    } catch (error) {
      setAssetMessage(error.message);
      return;
    }

    const body = new FormData();
    body.append("altText", assetForm.altText);
    body.append("section", assetForm.section);
    body.append("file", uploadFile);

    try {
      setAssetMessage("Uploading image...");

      const response = await fetch("/api/admin/assets", {
        method: "POST",
        body
      });

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        setAssetMessage(result.error || "Unable to upload image. Try a smaller JPEG or PNG file.");
        return;
      }

      setAssetForm({ altText: "", section: "product", file: null });
      setAssetMessage("Image uploaded.");
      updateField("image", result.asset.url);
      await refreshAssets();
    } catch {
      setAssetMessage("Upload failed. Check that you are signed in as admin and try again.");
    }
  }

  async function deleteAsset(id) {
    const response = await fetch("/api/admin/assets", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    const result = await response.json();

    if (!response.ok) {
      setAssetMessage(result.error || "Unable to delete image.");
      return;
    }

    setAssetMessage("Image deleted.");
    await refreshAssets();
  }

  return (
    <div className="grid gap-8">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-6">
          <form className="rounded-lg border border-[#d8c1b4] bg-white p-5" onSubmit={saveProduct}>
            <h2 className="text-xl font-black">Product details</h2>
            <div className="mt-5 grid gap-4">
              {[
                ["title", "Title"],
                ["slug", "Slug"],
                ["category", "Category"],
                ["pricingNote", "Pricing note"],
                ["image", "Image URL or database image path"]
              ].map(([field, label]) => (
                <label className="grid gap-2 text-sm font-black" key={field}>
                  {label}
                  <input className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal" onChange={(event) => updateField(field, event.target.value)} value={form[field] ?? ""} />
                </label>
              ))}
              <label className="grid gap-2 text-sm font-black">
                Description
                <textarea className="min-h-32 rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal" onChange={(event) => updateField("description", event.target.value)} value={form.description} />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Sort order
                <input className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal" onChange={(event) => updateField("sortOrder", Number(event.target.value))} type="number" value={form.sortOrder} />
              </label>
              <label className="flex items-center justify-between gap-4 rounded-lg bg-[#f7e8df] p-4 text-sm font-black">
                Featured
                <input checked={form.isFeatured} className="h-5 w-5 accent-[#b76a7a]" onChange={(event) => updateField("isFeatured", event.target.checked)} type="checkbox" />
              </label>
              {message ? <p className="rounded-lg bg-[#f7e8df] px-4 py-3 text-sm font-bold">{message}</p> : null}
              <div className="grid gap-3 sm:grid-cols-2">
                <button className="rounded-lg bg-[#2b2320] px-5 py-3 text-sm font-black text-white" type="submit">
                  Save product
                </button>
                <button className="rounded-lg border border-[#d8c1b4] bg-white px-5 py-3 text-sm font-black" onClick={() => setForm(emptyProduct)} type="button">
                  Clear
                </button>
              </div>
            </div>
          </form>

          <form className="rounded-lg border border-[#d8c1b4] bg-white p-5" onSubmit={uploadAsset}>
            <h2 className="text-xl font-black">Upload image</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-black">
                Image file
                <input
                  accept="image/*"
                  className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setAssetForm((current) => ({ ...current, file }));
                    setAssetMessage(file ? `Selected ${file.name} (${formatBytes(file.size)}).` : "");
                  }}
                  type="file"
                />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Alt text
                <input
                  className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal"
                  onChange={(event) => setAssetForm((current) => ({ ...current, altText: event.target.value }))}
                  value={assetForm.altText}
                />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Website section
                <select
                  className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal"
                  onChange={(event) => setAssetForm((current) => ({ ...current, section: event.target.value }))}
                  value={assetForm.section}
                >
                  {assetSections.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </label>
              {assetMessage ? <p className="rounded-lg bg-[#f7e8df] px-4 py-3 text-sm font-bold">{assetMessage}</p> : null}
              <button className="rounded-lg bg-[#2b2320] px-5 py-3 text-sm font-black text-white" type="submit">
                Upload and use for product
              </button>
            </div>
          </form>
        </div>

        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {products.map((product) => (
            <article className="rounded-lg border border-[#d8c1b4] bg-white p-4" key={product.slug}>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-black uppercase tracking-normal text-[#9f5f6f]">{product.category}</p>
                {product.isFeatured ? (
                  <span className="rounded-full bg-[#f7e8df] px-3 py-1 text-xs font-black text-[#9f5f6f]">
                    Featured
                  </span>
                ) : null}
              </div>
              <h2 className="mt-2 text-lg font-black leading-tight">{product.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6f5d55]">{product.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-lg bg-[#2b2320] px-4 py-2 text-sm font-black text-white" onClick={() => editProduct(product)} type="button">
                  Edit
                </button>
                <button className="rounded-lg border border-[#d8c1b4] bg-white px-4 py-2 text-sm font-black" onClick={() => deleteProduct(product.slug)} type="button">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[#d8c1b4] bg-white p-5">
        <div className="mb-5">
          <h2 className="text-xl font-black">Image library</h2>
          <p className="mt-2 text-sm leading-6 text-[#6f5d55]">
            Uploaded images are stored in MongoDB and can be assigned to products or labeled for other website sections.
          </p>
        </div>

        {assets.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {assets.map((asset) => (
              <article className="overflow-hidden rounded-lg border border-[#d8c1b4] bg-[#fff7f1]" key={asset.id}>
                <div className="aspect-4/3 bg-[#f7e8df]">
                  <img alt={asset.altText || asset.filename} className="h-full w-full object-cover" src={asset.url} />
                </div>
                <div className="grid gap-3 p-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-normal text-[#9f5f6f]">{asset.section}</p>
                    <h3 className="mt-1 wrap-break-word text-sm font-black">{asset.filename}</h3>
                  </div>
                  <p className="text-xs font-bold text-[#6f5d55]">{Math.round(asset.size / 1024)} KB</p>
                  <div className="grid gap-2 min-[420px]:grid-cols-2">
                    <button className="rounded-lg bg-[#2b2320] px-4 py-2 text-sm font-black text-white" onClick={() => updateField("image", asset.url)} type="button">
                      Use for product
                    </button>
                    <button className="rounded-lg border border-[#d8c1b4] bg-white px-4 py-2 text-sm font-black" onClick={() => deleteAsset(asset.id)} type="button">
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] p-5">
            <h3 className="font-black">No uploaded images yet</h3>
            <p className="mt-2 text-sm leading-6 text-[#6f5d55]">
              Upload an image above to store it in MongoDB and add it to the library.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
