import "./globals.css";
import SiteHeader from "./components/SiteHeader";

export const metadata = {
  title: "Style Edit by Reena | Fashion Journal & Portfolio",
  description:
    "A reactive fashion blog and portfolio built with Next.js, React, and Tailwind CSS."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
