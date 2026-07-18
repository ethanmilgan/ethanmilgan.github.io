"use client";

import { useState } from "react";

const textAreaFields = new Set([
  "gettingStartedText",
  "heroText",
  "storyParagraphOne",
  "storyParagraphTwo",
  "storyParagraphThree"
]);

function isImageField(key) {
  return key.toLowerCase().includes("image");
}

function formatFieldLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function ImagePreview({ src }) {
  if (!src) {
    return null;
  }

  return (
    <div className="mt-3 aspect-16/9 overflow-hidden rounded-lg border border-[#d8c1b4] bg-white">
      <img alt="" className="h-full w-full object-cover" src={src} />
    </div>
  );
}

function PreviewLine({ eyebrow, title, text }) {
  if (!eyebrow && !title && !text) {
    return null;
  }

  return (
    <div className="border-b border-[#d8c1b4] py-4 last:border-b-0">
      {eyebrow ? <p className="text-xs font-black uppercase tracking-normal text-[#9f5f6f]">{eyebrow}</p> : null}
      {title ? <h3 className="mt-2 text-xl font-black leading-tight">{title}</h3> : null}
      {text ? <p className="mt-2 text-sm leading-6 text-[#6f5d55]">{text}</p> : null}
    </div>
  );
}

function PagePreview({ page }) {
  const fields = page.fields;

  if (page.page === "home") {
    return (
      <div>
        <ImagePreview src={fields.aboutSlideImage} />
        <PreviewLine eyebrow={fields.featuredEyebrow} title={fields.featuredTitle} />
        <ImagePreview src={fields.servicesSlideImage} />
        <PreviewLine eyebrow={fields.journalEyebrow} title={fields.journalTitle} />
        <ImagePreview src={fields.contactSlideImage} />
        <PreviewLine
          eyebrow={fields.gettingStartedEyebrow}
          title={fields.gettingStartedTitle}
          text={fields.gettingStartedText}
        />
      </div>
    );
  }

  if (page.page === "about") {
    return (
      <div>
        <ImagePreview src={fields.heroImage} />
        <PreviewLine eyebrow={fields.heroEyebrow} title={fields.heroTitle} text={fields.heroText} />
        <PreviewLine
          eyebrow={fields.storyEyebrow}
          title={fields.storyTitle}
          text={[fields.storyParagraphOne, fields.storyParagraphTwo, fields.storyParagraphThree].filter(Boolean).join(" ")}
        />
        <PreviewLine eyebrow={fields.faqEyebrow} title={fields.faqTitle} />
      </div>
    );
  }

  if (page.page === "shop") {
    return (
      <div>
        <ImagePreview src={fields.heroImage} />
        <PreviewLine eyebrow={fields.heroEyebrow} title={fields.heroTitle} />
      </div>
    );
  }

  if (page.page === "contact") {
    return (
      <div>
        <PreviewLine eyebrow={fields.heroEyebrow} title={fields.heroTitle} text={fields.heroText} />
        <div className="mt-4 rounded-lg bg-[#b76a7a] px-4 py-3 text-center text-sm font-black text-white">
          {fields.email}
        </div>
        <div className="mt-4 grid gap-2 text-xs font-black text-[#6f5d55]">
          <span>{fields.nameLabel}</span>
          <span>{fields.emailLabel}</span>
          <span>{fields.goalsLabel}</span>
          <span>{fields.buttonLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ImagePreview src={fields.backgroundImage} />
      <PreviewLine eyebrow={fields.eyebrow} title={fields.title} />
      <div className="mt-4 rounded-lg bg-[#b76a7a] px-4 py-3 text-center text-sm font-black text-white">
        {fields.email}
      </div>
    </div>
  );
}

export default function PageContentManager({ initialAssets, initialPages }) {
  const [pages, setPages] = useState(initialPages);
  const [activePage, setActivePage] = useState(initialPages[0]?.page || "home");
  const [message, setMessage] = useState("");
  const page = pages.find((item) => item.page === activePage) || pages[0];

  function updateField(key, value) {
    setPages((current) =>
      current.map((item) =>
        item.page === activePage
          ? { ...item, fields: { ...item.fields, [key]: value } }
          : item
      )
    );
  }

  async function saveContent(event) {
    event.preventDefault();
    setMessage("Saving page text...");

    const response = await fetch("/api/admin/page-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: activePage, fields: page.fields })
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || "Unable to save page text.");
      return;
    }

    setPages((current) =>
      current.map((item) =>
        item.page === result.content.page ? { ...item, fields: result.content.fields } : item
      )
    );
    setMessage("Page text saved.");
  }

  if (!page) {
    return null;
  }

  return (
    <section className="rounded-lg border border-[#d8c1b4] bg-white p-5">
      <div className="mb-6">
        <p className="mb-2 text-xs font-black uppercase tracking-normal text-[#9f5f6f]">Page copy</p>
        <h2 className="text-xl font-black">Edit page text</h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] p-4 lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-sm font-black uppercase tracking-normal text-[#9f5f6f]">Pages</h3>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {pages.map((item) => (
              <button
                className={`min-h-11 rounded-lg border px-4 py-3 text-left text-sm font-black transition ${
                  activePage === item.page
                    ? "border-[#2b2320] bg-[#2b2320] text-white"
                    : "border-[#d8c1b4] bg-white hover:border-[#b76a7a] hover:text-[#b76a7a]"
                }`}
                key={item.page}
                onClick={() => {
                  setActivePage(item.page);
                  setMessage("");
                }}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="grid gap-5">
          <div className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2b2320] text-sm font-black text-white">1</span>
              <h3 className="text-sm font-black uppercase tracking-normal text-[#9f5f6f]">Selected page</h3>
            </div>
            <p className="mt-3 text-2xl font-black">{page.label}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f5d55]">
              Use the sidebar menu to choose the page or global section you want to edit.
            </p>
          </div>

          <form className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] p-4" onSubmit={saveContent}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2b2320] text-sm font-black text-white">2</span>
              <h3 className="text-sm font-black uppercase tracking-normal text-[#9f5f6f]">What can be edited on {page.label}</h3>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {Object.entries(page.fields).map(([key, value]) => (
                <label className="grid gap-2 text-sm font-black" key={key}>
                  {formatFieldLabel(key)}
                {isImageField(key) ? (
                  <div>
                    <input
                      className="w-full rounded-lg border border-[#d8c1b4] bg-white px-4 py-3 font-normal"
                      onChange={(event) => updateField(key, event.target.value)}
                      value={value}
                    />
                    {initialAssets?.length ? (
                      <select
                        className="mt-2 w-full rounded-lg border border-[#d8c1b4] bg-white px-4 py-3 font-normal"
                        onChange={(event) => event.target.value && updateField(key, event.target.value)}
                        value=""
                      >
                        <option value="">Use uploaded image...</option>
                        {initialAssets.map((asset) => (
                          <option key={asset.id} value={asset.url}>
                            {asset.section}: {asset.altText || asset.filename}
                          </option>
                        ))}
                      </select>
                    ) : null}
                    <ImagePreview src={value} />
                  </div>
                ) : textAreaFields.has(key) ? (
                  <textarea
                      className="min-h-28 rounded-lg border border-[#d8c1b4] bg-white px-4 py-3 font-normal"
                      onChange={(event) => updateField(key, event.target.value)}
                      value={value}
                    />
                  ) : (
                    <input
                      className="rounded-lg border border-[#d8c1b4] bg-white px-4 py-3 font-normal"
                      onChange={(event) => updateField(key, event.target.value)}
                      value={value}
                    />
                  )}
                </label>
              ))}
            </div>

            {message ? <p className="mt-4 rounded-lg bg-white px-4 py-3 text-sm font-bold">{message}</p> : null}

            <button className="mt-4 w-full rounded-lg bg-[#2b2320] px-5 py-3 text-sm font-black text-white" type="submit">
              Save page text
            </button>
          </form>

          <div className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2b2320] text-sm font-black text-white">3</span>
              <h3 className="text-sm font-black uppercase tracking-normal text-[#9f5f6f]">Updated page preview</h3>
            </div>
            <div className="mt-4 overflow-hidden rounded-lg border border-[#d8c1b4] bg-white">
              <div className="bg-[#2b2320] px-4 py-3 text-sm font-black text-white">{page.label}</div>
              <div className="p-4">
                <PagePreview page={page} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
