// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://knoxmartialarts.com.au",
  compressHTML: true, // Minify HTML output
  image: {
    // Optimize all images to WebP by default (best compression)
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: false, // Allow large images
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true, // Split CSS per page for better caching
      minify: "esbuild", // Use esbuild for faster minification (faster than terser)
      sourcemap: false, // Disable source maps in production for smaller bundles
      target: "esnext", // Target modern browsers for smaller output
      rollupOptions: {
        output: {
          // Optimize chunk naming for better caching
          chunkFileNames: "chunks/[name]-[hash].js",
          entryFileNames: "entry/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
          manualChunks: (id) => {
            // Split React vendor code
            if (
              id.includes("node_modules/react") ||
              id.includes("node_modules/react-dom") ||
              id.includes("node_modules/react/jsx-runtime")
            ) {
              return "react-vendor";
            }
            // Split Flowbite and related packages
            if (
              id.includes("node_modules/flowbite") ||
              id.includes("node_modules/flowbite-react") ||
              id.includes("node_modules/flowbite-typography")
            ) {
              return "flowbite-vendor";
            }
            // Split other large vendor dependencies
            if (id.includes("node_modules")) {
              // Group other node_modules into a vendor chunk
              return "vendor";
            }
          },
        },
      },
      // Warn about large chunks
      chunkSizeWarningLimit: 500, // Warn if chunk exceeds 500KB
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react/jsx-runtime"],
      // Exclude Flowbite from pre-bundling (let it be bundled with the app)
      exclude: ["flowbite", "flowbite-react"],
    },
  },
  integrations: [
    react(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => true,
      // Per-page priority and changefreq for better Google crawl hints
      serialize(item) {
        const url = item.url;
        if (url === "https://knoxmartialarts.com.au/") {
          item.priority = 1;
          item.changefreq = "daily";
        } else if (
          url.includes("/privacy-policy/") ||
          url.includes("/terms-of-service/")
        ) {
          item.priority = 0.3;
          item.changefreq = "yearly";
        } else if (url.includes("/blog/")) {
          item.priority = 0.8;
          item.changefreq = "weekly";
        } else {
          item.priority = 0.9;
          item.changefreq = "weekly";
        }
        return item;
      },
    }),
  ],
});
