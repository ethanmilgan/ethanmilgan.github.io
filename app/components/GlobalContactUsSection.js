"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ContactUsSection from "./ContactUsSection";

export default function GlobalContactUsSection() {
  const pathname = usePathname();
  const [content, setContent] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      try {
        const response = await fetch("/api/page-content");

        if (!response.ok) {
          return;
        }

        const result = await response.json();
        const globalContact = result.pages?.find((page) => page.page === "globalContact");

        if (isMounted && globalContact?.fields) {
          setContent(globalContact.fields);
        }
      } catch {
        // Keep fallback content when the CMS content API is unavailable.
      }
    }

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  if (pathname === "/contact" || pathname === "/admin") {
    return null;
  }

  return <ContactUsSection content={content} />;
}
