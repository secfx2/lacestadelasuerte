"use client";
import { useId } from "react";
import LOGOS from "./logoData";

/**
 * MUSKETEER logo system. Inherits `color` (currentColor).
 * variant: "wordmark" | "emblem" | "monogram" | "gothic" | "seal"
 * Size it with className / style (set width OR height; aspect is kept).
 */
export default function Logo({ variant = "wordmark", title = "Musketeer", className, style, ...rest }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const logo = LOGOS[variant] || LOGOS.wordmark;
  const inner = logo.inner.replaceAll("__MID__", `mk-${variant}-${id}`);
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
