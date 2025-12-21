/**
 * Rehype plugin to optimize images in markdown
 * Converts markdown image paths to use optimized asset URLs
 */

import type { Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { getImageAsset } from "./imageMap";

/**
 * Rehype plugin to process images in markdown
 * Resolves image paths through imageMap for optimization
 */
export function rehypeOptimizeImages(): Plugin<[], Root> {
  return (tree) => {
    visit(tree, "element", (node) => {
      // Process img elements
      if (node.tagName === "img" && node.properties && typeof node.properties.src === "string") {
        const src = node.properties.src;
        
        // Check if it's a path we should optimize
        if (src.startsWith("/img/") || src.startsWith("/blog/")) {
          try {
            // Resolve image path through imageMap
            const imageAsset = getImageAsset(src);
            
            if (typeof imageAsset === "object" && "src" in imageAsset) {
              // Update src to use optimized asset URL
              // The src property contains the optimized URL from Astro
              node.properties.src = imageAsset.src;
              
              // Add width and height if available
              if (imageAsset.width) {
                node.properties.width = imageAsset.width;
              }
              if (imageAsset.height) {
                node.properties.height = imageAsset.height;
              }
              
              // Add loading and decoding attributes for performance
              node.properties.loading = "lazy";
              node.properties.decoding = "async";
            }
          } catch (error) {
            // If image not found in map, keep original path
            console.warn(`Image not found in map: ${src}. Using original path.`);
          }
        }
      }
    });
  };
}
