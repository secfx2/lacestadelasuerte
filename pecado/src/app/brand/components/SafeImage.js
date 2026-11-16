"use client";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import s from "../brand.module.css";

/**
 * Plain <img> that degrades to a quiet placeholder when the file is missing
 * (product photos and mockups are generated asynchronously). Handles the case
 * where the error fired before hydration (img.complete && naturalWidth === 0).
 */
export default function SafeImage({ src, alt = "", label, className = "", fit = "cover" }) {
  const [failed, setFailed] = useState(!src);
  const ref = useRef(null);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src, failed]);

  if (failed) {
    return (
      <div className={`${s.imgFallback} ${className}`} role="img" aria-label={alt || label}>
        <span className={s.imgFallbackMark} aria-hidden="true">+</span>
        <span className={s.imgFallbackLabel}>{label || "Imagen en producción"}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={asset(src)}
      alt={alt}
      loading="eager"
      decoding="async"
      className={`${s.img} ${className}`}
      style={{ objectFit: fit }}
      onError={() => setFailed(true)}
    />
  );
}
