import type { Metadata } from "next";
import "./globals.css";

const ADSENSE_CLIENT = "ca-pub-3818857321969667";

export const metadata: Metadata = {
  title: "CASE//ZERO — Interactive Crime Files",
  description: "Sign in, interrogate AI suspects, examine evidence and solve timed fictional Malaysian noir cases."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en">
    <head>
      <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
    </head>
    <body>{children}</body>
  </html>;
}
