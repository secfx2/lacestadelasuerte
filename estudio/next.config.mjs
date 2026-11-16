import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lives inside a parent repo with its own lockfile / ESLint / Tailwind config: pin the root here.
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
  // The MCP SDK and the Anthropic SDK are server-only; keep them out of the client bundle.
  serverExternalPackages: ["@modelcontextprotocol/sdk"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
