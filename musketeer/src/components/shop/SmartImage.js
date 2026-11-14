"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./SmartImage.module.css";

/** Fog placeholder with a small grey emblem. tone: "fog" | "bone" | "dark" */
export function ImagePlaceholder({ tone = "fog", className = "" }) {
  return (
    <div className={`${styles.placeholder} ${className}`} data-tone={tone} aria-hidden="true">
      <span className={styles.emblem} />
    </div>
  );
}

/**
 * next/image wrapped in a positioned frame. Fades in on load; on error (file not
 * generated yet) degrades to the fog placeholder — or to nothing with `hideOnError`.
 * Size the frame with `className` / `ratio` (e.g. "4 / 5"); the image fills it.
 */
export default function SmartImage({
  src,
  alt = "",
  sizes = "100vw",
  priority = false,
  quality,
  className = "",
  imgClassName = "",
  ratio,
  tone = "fog",
  hideOnError = false,
  fit = "cover",
  position,
  style,
}) {
  const [failed, setFailed] = useState(null);
  const [loaded, setLoaded] = useState(null);
  const isError = !src || failed === src;
  const isLoaded = loaded === src;

  return (
    <div
      className={`${styles.frame} ${className}`}
      data-tone={tone}
      data-state={isError ? "error" : isLoaded ? "loaded" : "loading"}
      data-hide={hideOnError && isError ? "true" : undefined}
      style={{ ...(ratio ? { aspectRatio: ratio } : null), ...style }}
    >
      {!isError && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={`${styles.img} ${isLoaded ? styles.loaded : ""} ${imgClassName}`}
          style={{ objectFit: fit, objectPosition: position }}
          onLoad={() => setLoaded(src)}
          onError={() => setFailed(src)}
        />
      )}
      {isError && !hideOnError && <ImagePlaceholder tone={tone} />}
    </div>
  );
}
