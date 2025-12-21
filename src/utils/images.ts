/**
 * Image Utility Functions
 *
 * Helper functions for handling images with Astro's Image component
 * Supports both asset imports and public folder paths
 */

import type { ImageMetadata } from "astro";

/**
 * Map of public image paths to asset imports
 * This allows gradual migration from public to assets
 */
const imageMap: Record<string, () => Promise<ImageMetadata>> = {
  "/img/kando-knox-karate-man.jpg": () =>
    import("../assets/img/kando-knox-karate-man.jpg"),
  "/img/kando-knox-karate-girl.jpg": () =>
    import("../assets/img/kando-knox-karate-girl.jpg"),
  "/img/bear-cave-logo.avif": () => import("../assets/img/bear-cave-logo.avif"),
  "/img/kando-knox-junior-martial-arts-3.jpg": () =>
    import("../assets/img/kando-knox-junior-martial-arts-3.jpg"),
  "/img/default.jpg": () => import("../assets/img/default.jpg"),
  "/img/placeholder.jpg": () => import("../assets/img/default.jpg"),
  "/img/about.jpg": () => import("../assets/img/about.jpg"),
  "/img/adult-bjj.jpg": () => import("../assets/img/adult-bjj.jpg"),
  "/img/adult-martial-arts.JPG": () =>
    import("../assets/img/adult-martial-arts.JPG"),
  "/img/junior-bjj.jpg": () => import("../assets/img/junior-bjj.jpg"),
  "/img/junior-martial-arts.JPG": () =>
    import("../assets/img/junior-martial-arts.JPG"),
  "/img/pre-school-martial-arts.jpg": () =>
    import("../assets/img/pre-school-martial-arts.jpg"),
  "/img/women-self-defence.JPG": () =>
    import("../assets/img/women-self-defence.JPG"),
  "/img/sensei-andy.jpg": () => import("../assets/img/sensei-andy.jpg"),
  "/img/kando-contact.jpg": () => import("../assets/img/kando-contact.jpg"),
  "/img/admin-girls.jpg": () => import("../assets/img/admin-girls.jpg"),
  // Hero images
  "/img/hero/karate-kando-knox.jpg": () =>
    import("../assets/img/hero/karate-kando-knox.jpg"),
  "/img/hero/karate-kando-knox-1.jpg": () =>
    import("../assets/img/hero/karate-kando-knox-1.jpg"),
  "/img/hero/karate-kando-knox-2.jpg": () =>
    import("../assets/img/hero/karate-kando-knox-2.jpg"),
  "/img/hero/martial-arts-kando-knox.jpg": () =>
    import("../assets/img/hero/martial-arts-kando-knox.jpg"),
  "/img/hero/brazilian-jiu-jitsu-kando-knox.jpg": () =>
    import("../assets/img/hero/brazilian-jiu-jitsu-kando-knox.jpg"),
  "/img/hero/brazilian-jiu-jitsu-kando-knox-1.jpg": () =>
    import("../assets/img/hero/brazilian-jiu-jitsu-kando-knox-1.jpg"),
  "/img/hero/kids-karate-kando-knox.jpg": () =>
    import("../assets/img/hero/kids-karate-kando-knox.jpg"),
  "/img/hero/kids-brazilian-jiu-jitsu-kando-knox.jpg": () =>
    import("../assets/img/hero/kids-brazilian-jiu-jitsu-kando-knox.jpg"),
  "/img/hero/pre-school-martial-arts-kando-knox.jpg": () =>
    import("../assets/img/hero/pre-school-martial-arts-kando-knox.jpg"),
  "/img/hero/womens-self-defense-kando-knox.jpg": () =>
    import("../assets/img/hero/womens-self-defense-kando-knox.jpg"),
  // Program content images
  "/img/kando-knox-adult-bjj-1.jpg": () =>
    import("../assets/img/kando-knox-adult-bjj-1.jpg"),
  "/img/kando-knox-adult-bjj-2.jpg": () =>
    import("../assets/img/kando-knox-adult-bjj-2.jpg"),
  "/img/kando-knox-adult-bjj-3.jpg": () =>
    import("../assets/img/kando-knox-adult-bjj-3.jpg"),
  "/img/kando-knox-adult-martial-arts-1.jpg": () =>
    import("../assets/img/kando-knox-adult-martial-arts-1.jpg"),
  "/img/kando-knox-adult-martial-arts-2.jpg": () =>
    import("../assets/img/kando-knox-adult-martial-arts-2.jpg"),
  "/img/kando-knox-adult-martial-arts-3.jpg": () =>
    import("../assets/img/kando-knox-adult-martial-arts-3.jpg"),
  "/img/kando-knox-junior-bjj-1.jpg": () =>
    import("../assets/img/kando-knox-junior-bjj-1.jpg"),
  "/img/kando-knox-junior-bjj-2.jpg": () =>
    import("../assets/img/kando-knox-junior-bjj-2.jpg"),
  "/img/kando-knox-junior-martial-arts-1.jpg": () =>
    import("../assets/img/kando-knox-junior-martial-arts-1.jpg"),
  "/img/kando-knox-junior-martial-arts-2.jpg": () =>
    import("../assets/img/kando-knox-junior-martial-arts-2.jpg"),
  "/img/kando-knox-junior-martial-arts-3.jpg": () =>
    import("../assets/img/kando-knox-junior-martial-arts-3.jpg"),
  "/img/kando-knox-pre-school-martail-arts-1.jpg": () =>
    import("../assets/img/kando-knox-pre-school-martail-arts-1.jpg"),
  "/img/kando-knox-pre-school-martail-arts-2.jpg": () =>
    import("../assets/img/kando-knox-pre-school-martail-arts-2.jpg"),
  "/img/kando-knox-pre-school-martail-arts-3.jpg": () =>
    import("../assets/img/kando-knox-pre-school-martail-arts-3.jpg"),
  "/img/kando-knox-pre-school-martail-arts-4.jpg": () =>
    import("../assets/img/kando-knox-pre-school-martail-arts-4.jpg"),
  "/img/kando-knox-women-self-defence-1.jpg": () =>
    import("../assets/img/kando-knox-women-self-defence-1.jpg"),
  "/img/kando-knox-women-self-defence-2.jpg": () =>
    import("../assets/img/kando-knox-women-self-defence-2.jpg"),
  "/img/kando-knox-women-self-defence-3.jpg": () =>
    import("../assets/img/kando-knox-women-self-defence-3.jpg"),
};

/**
 * Get image asset from path string
 * Returns the imported asset if available, otherwise returns the original path
 */
export async function getImageAsset(
  imagePath: string | undefined
): Promise<ImageMetadata | string> {
  if (!imagePath) {
    return "/img/default.jpg";
  }

  // If it's already an asset import, return as is
  if (typeof imagePath === "object") {
    return imagePath;
  }

  // Check if we have a mapped asset
  const imageLoader = imageMap[imagePath];
  if (imageLoader) {
    try {
      const module = await imageLoader();
      return module.default;
    } catch (error) {
      console.warn(`Failed to load image asset for ${imagePath}:`, error);
      return imagePath; // Fallback to original path
    }
  }

  // Fallback to original path (for images not yet migrated)
  return imagePath;
}

/**
 * Get responsive image sizes for different use cases
 */
export function getImageSizes(
  context: "hero" | "content" | "thumbnail" | "card"
): string {
  switch (context) {
    case "hero":
      return "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px";
    case "content":
      return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
    case "thumbnail":
      return "(max-width: 640px) 100px, 200px";
    case "card":
      return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
    default:
      return "100vw";
  }
}
