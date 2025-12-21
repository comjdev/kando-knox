// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://knoxmartialarts.com.au",
  compressHTML: true, // Minify HTML output
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true, // Split CSS per page for better caching
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Split React vendor code
            if (
              id.includes("node_modules/react") ||
              id.includes("node_modules/react-dom")
            ) {
              return "react-vendor";
            }
            // Split Flowbite
            if (id.includes("node_modules/flowbite")) {
              return "flowbite";
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
  integrations: [
    react(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      // Exclude any pages you don't want in the sitemap
      filter: (page) => {
        // Include all pages by default
        return true;
      },
    }),
  ],
});
