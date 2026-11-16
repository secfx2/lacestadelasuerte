import path from "node:path";
import { fileURLToPath } from "node:url";

// Multi-brand hub (hub/build.sh): NEXT_OUTPUT=export NEXT_PUBLIC_BASE_PATH=/<slug> builds a static
// export served under /<slug>. Without these env vars this is the normal Next.js build.
const isExport = process.env.NEXT_OUTPUT === "export";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This app lives inside a parent repo with its own lockfile/ESLint config: pin the root here.
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  eslint: { ignoreDuringBuilds: true },
  // Allows a second dev server (e.g. brand-book PDF export) without clashing on .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    // No image optimisation server in a static export: files are served as they are in /public.
    ...(isExport ? { unoptimized: true } : null),
  },
  ...(isExport ? { output: "export" } : null),
  ...(basePath ? { basePath } : null),
};

export default nextConfig;
