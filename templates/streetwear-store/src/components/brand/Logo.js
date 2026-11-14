"use client";
import { useId } from "react";
import brand from "@/config/brand";
import LOGOS from "./logoData";

/**
 * Brand logo system. Inherits `color` (currentColor).
 * variant: "wordmark" | "monogram" | "graphic" | "emblem" | "seal"
 *   (+ any extra public/brand/<name>.svg picked up by scripts/build-logo-data.mjs)
 * Size it with className / style (set width OR height; aspect is kept).
 * Paths come from src/components/brand/logoData.js — regenerate it with
 * `npm run logos` after replacing the SVGs in public/brand/.
 */
export default function Logo({ variant = "wordmark", title = brand.name, className, style, ...rest }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const logo = LOGOS[variant] || LOGOS.wordmark;
  const inner = logo.inner.replaceAll("__MID__", `lg-${variant}-${id}`);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={logo.viewBox}
      role="img"
      aria-label={title}
      className={className}
      style={{ display: "block", ...style }}
      dangerouslySetInnerHTML={{ __html: `<title>${title}</title>${inner}` }}
      {...rest}
    />
  );
}
