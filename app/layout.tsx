import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CASE//ZERO — Interactive Crime Files",
  description:
    "Sign in, interrogate AI suspects, examine evidence and solve timed fictional crime cases.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3818857321969666"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
