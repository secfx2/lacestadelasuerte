/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allows a second dev server (e.g. brand-book PDF export) without clashing on .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
