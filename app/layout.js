import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import GlobalContactUsSection from "./components/GlobalContactUsSection";
import SiteHeader from "./components/SiteHeader";

export const metadata = {
  title: "styleeditbyreena | Fashion Journal & Portfolio",
  description:
    "A reactive fashion blog and portfolio built with Next.js, React, and Tailwind CSS."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SiteHeader />
        {children}
        <GlobalContactUsSection />
        <Analytics />
      </body>
    </html>
  );
}
