"use client";

import { useState } from "react";

export default function SafeImage({ src, alt, fallback, className = "" }: { src: string; alt: string; fallback: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`${className} visual-fallback-inline`} role="img" aria-label={alt}><span>{fallback}</span></div>;
  return <img className={className} src={src} alt={alt} onError={() => setFailed(true)} />;
}
