"use client";

import { useState } from "react";

const emptyProduct = {
  slug: "",
  title: "",
  description: "",
  category: "",
  image: "",
  price: "",
  sortOrder: 0,
  isFeatured: false
};

export default function AdminProductManager({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState(emptyProduct);
  const [message, setMessage] = useState("");

  function editProduct(product) {
    setForm(product);
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

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form className="rounded-lg border border-[#ded3ca] bg-white p-5" onSubmit={saveProduct}>
        <h2 className="text-xl font-black">Product details</h2>
        <div className="mt-5 grid gap-4">
          {[
            ["title", "Title"],
            ["slug", "Slug"],
            ["category", "Category"],
            ["price", "Price"],
            ["image", "Image URL"]
          ].map(([field, label]) => (
            <label className="grid gap-2 text-sm font-black" key={field}>
              {label}
              <input className="rounded-lg border border-[#ded3ca] bg-[#fffaf6] px-4 py-3 font-normal" onChange={(event) => updateField(field, event.target.value)} value={form[field]} />
            </label>
          ))}
          <label className="grid gap-2 text-sm font-black">
            Description
            <textarea className="min-h-32 rounded-lg border border-[#ded3ca] bg-[#fffaf6] px-4 py-3 font-normal" onChange={(event) => updateField("description", event.target.value)} value={form.description} />
          </label>
          <label className="grid gap-2 text-sm font-black">
            Sort order
            <input className="rounded-lg border border-[#ded3ca] bg-[#fffaf6] px-4 py-3 font-normal" onChange={(event) => updateField("sortOrder", Number(event.target.value))} type="number" value={form.sortOrder} />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-lg bg-[#f4eee7] p-4 text-sm font-black">
            Featured
            <input checked={form.isFeatured} className="h-5 w-5 accent-[#c83256]" onChange={(event) => updateField("isFeatured", event.target.checked)} type="checkbox" />
          </label>
          {message ? <p className="rounded-lg bg-[#f4eee7] px-4 py-3 text-sm font-bold">{message}</p> : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <button className="rounded-lg bg-[#171413] px-5 py-3 text-sm font-black text-white" type="submit">
              Save product
            </button>
            <button className="rounded-lg border border-[#ded3ca] bg-white px-5 py-3 text-sm font-black" onClick={() => setForm(emptyProduct)} type="button">
              Clear
            </button>
          </div>
        </div>
      </form>

      <div className="grid gap-4">
        {products.map((product) => (
          <article className="rounded-lg border border-[#ded3ca] bg-white p-5" key={product.slug}>
            <p className="text-xs font-black uppercase tracking-normal text-[#b92e4d]">{product.category}</p>
            <h2 className="mt-2 text-xl font-black">{product.title}</h2>
            <p className="mt-3 leading-7 text-[#655e58]">{product.description}</p>
            <p className="mt-3 font-black">{product.price}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="rounded-lg bg-[#171413] px-4 py-2 text-sm font-black text-white" onClick={() => editProduct(product)} type="button">
                Edit
              </button>
              <button className="rounded-lg border border-[#ded3ca] bg-white px-4 py-2 text-sm font-black" onClick={() => deleteProduct(product.slug)} type="button">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
