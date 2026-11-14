import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This app lives inside a parent repo with its own lockfile/ESLint config: pin the root here.
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  eslint: { ignoreDuringBuilds: true },
  // Allows a second dev server (e.g. brand-book PDF export) without clashing on .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
