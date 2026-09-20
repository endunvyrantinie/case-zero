"use client";

import { useState } from "react";

export default function VisualAsset({
  src,
  alt,
  fallback,
  className = "",
  imgClassName = ""
}: {
  src: string;
  alt: string;
  fallback: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`visual-fallback ${className}`} aria-label={alt}><span>{fallback}</span></div>;
  return <div className={`visual-asset ${className}`}><img className={imgClassName} src={src} alt={alt} onError={() => setFailed(true)} /></div>;
}
