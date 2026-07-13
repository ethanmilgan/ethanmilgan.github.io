import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import GlobalContactUsSection from "./components/GlobalContactUsSection";
import SiteHeader from "./components/SiteHeader";

export const metadata = {
  title: "styleeditbyreena | Personal Styling by Reena",
  description:
    "Personal styling, closet edits, shopping, photoshoot styling, and wardrobe support for women who want getting dressed to feel easy."
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
