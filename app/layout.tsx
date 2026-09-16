import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CASE//ZERO — 11:47",
  description: "A Malaysian noir AI detective game."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
