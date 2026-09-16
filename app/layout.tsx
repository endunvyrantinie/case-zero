import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "CASE//ZERO — Interactive Crime Files",
  description: "Sign in, interrogate AI suspects, examine evidence and solve timed fictional Malaysian noir cases."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return <html lang="en"><body>
    {adsenseClient && <Script id="casezero-adsense" async strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`} />}
    {children}
  </body></html>;
}
