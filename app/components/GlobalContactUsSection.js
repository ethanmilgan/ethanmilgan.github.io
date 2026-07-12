"use client";

import { usePathname } from "next/navigation";
import ContactUsSection from "./ContactUsSection";

export default function GlobalContactUsSection() {
  const pathname = usePathname();

  if (pathname === "/contact") {
    return null;
  }

  return <ContactUsSection />;
}
