import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CASE//ZERO — Interactive Crime Files",
  description: "Sign in, interrogate AI suspects, examine evidence and solve timed fictional Malaysian noir cases."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
