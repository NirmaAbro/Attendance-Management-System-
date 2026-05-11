import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      fs: { browser: "./lib/empty.ts" },
      module: { browser: "./lib/empty.ts" },
      perf_hooks: { browser: "./lib/empty.ts" },
      v8: { browser: "./lib/empty.ts" },
      os: { browser: "./lib/empty.ts" },
    },
  },
};

export default nextConfig;
