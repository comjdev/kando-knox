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
    react({
      // Configure React to work better with ViewTransitions
      experimentalReactChildren: true,
    }),
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
