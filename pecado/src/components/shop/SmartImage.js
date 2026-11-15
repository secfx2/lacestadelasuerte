"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./SmartImage.module.css";

/** Placeholder with a small emblem. tone: "fog" | "bone" | "dark" | "tile" (light product tile) */
export function ImagePlaceholder({ tone = "fog", className = "" }) {
  return (
    <div className={`${styles.placeholder} ${className}`} data-tone={tone} aria-hidden="true">
      <span className={styles.emblem} />
    </div>
  );
}

/**
 * PECADO: shot 1 of every product is a flat lay on white, shot 2 is on model against a
 * grey concrete wall. Only shots on white may be multiplied onto the light tile.
 */
export const ON_WALL = /-2\.(jpe?g|png|webp|avif)$/i;
export const onWhite = (src) => !!src && !ON_WALL.test(src);
/** The flat lay of an on-model shot (".../black-2.jpg" → ".../black-1.jpg"), or null. */
export const flatOf = (src) => (src && ON_WALL.test(src) ? src.replace(ON_WALL, "-1.$1") : null);

/**
 * next/image wrapped in a positioned frame. Fades in on load; on error (file not
 * generated yet) tries `fallback` (e.g. the flat lay when the on-model shot is missing),
 * then degrades to the placeholder — or to nothing with `hideOnError`.
 * Size the frame with `className` / `ratio` (e.g. "4 / 5"); the image fills it.
 * `blend` multiplies product shots shot on white onto the light tile so every tile reads
 * identical; on-model shots (concrete wall, see ON_WALL) are never blended.
 */
export default function SmartImage({
  src: primary,
  fallback,
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
  blend = false,
  style,
}) {
  const [failed, setFailed] = useState(() => new Set());
  const [loaded, setLoaded] = useState(null);
  // An on-model shot that is not there yet falls back to its flat lay unless `fallback` says otherwise (null = none)
  const fb = fallback !== undefined ? fallback : flatOf(primary);
  const src = primary && !failed.has(primary) ? primary : fb && !failed.has(fb) ? fb : null;
  const isError = !src;
  const isLoaded = loaded === src;
  const doBlend = blend && onWhite(src);

  if (hideOnError && isError) return null;

  return (
    <div
      className={`${styles.frame} ${className}`}
      data-tone={tone}
      data-state={isError ? "error" : isLoaded ? "loaded" : "loading"}
      data-blend={doBlend || undefined}
      style={{ ...(ratio ? { aspectRatio: ratio } : null), ...style }}
    >
      {!isError && (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={`${styles.img} ${isLoaded ? styles.loaded : ""} ${doBlend ? styles.blend : ""} ${imgClassName}`}
          style={{ objectFit: fit, objectPosition: position }}
          onLoad={() => setLoaded(src)}
          onError={() => setFailed((f) => new Set(f).add(src))}
        />
      )}
      {/* product shots keep the light tile while their photo is missing, so the grid stays even */}
      {isError && <ImagePlaceholder tone={blend ? "tile" : tone} />}
    </div>
  );
}
