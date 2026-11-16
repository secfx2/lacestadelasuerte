/*
 * Base path for the multi-brand hub (hub/build.sh builds each brand as a static export
 * under /<slug>, e.g. NEXT_PUBLIC_BASE_PATH=/musketeer). Empty in a normal deploy.
 *
 * Next.js prefixes the base path itself on next/link, router.push/replace, next/font and
 * /_next assets — never wrap those. It does NOT prefix plain URLs to files in /public:
 * next/image string `src` (export uses unoptimized images), <img>, <a href> to files,
 * CSS url(), metadata icons. Wrap those with asset().
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, "");

/** "/products/x.jpg" → "/musketeer/products/x.jpg". No-op without base path, for external/data URLs and already-prefixed paths. */
export function asset(src) {
  if (!BASE_PATH || typeof src !== "string" || !src.startsWith("/") || src.startsWith("//")) return src;
  if (src === BASE_PATH || src.startsWith(`${BASE_PATH}/`)) return src;
  return `${BASE_PATH}${src}`;
}

/**
 * CSS-module masks use `var(--mk-emblem-url, url("/brand/emblem-black.svg"))`; under a
 * base path the root layout sets the variable to the prefixed URL (`style` on <html>).
 * undefined without base path, so the normal build renders exactly as before.
 */
export const assetCssVars = BASE_PATH ? { "--mk-emblem-url": `url("${asset("/brand/emblem-black.svg")}")` } : undefined;
