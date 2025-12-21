/**
 * Build-time Image Mapping
 *
 * Maps public image paths to asset imports for Astro optimization.
 * All images in this map will be optimized to WebP/AVIF during build.
 */

// Hero images
import heroMartialArts from "../assets/img/hero/martial-arts-kando-knox.jpg";
import heroKarate from "../assets/img/hero/karate-kando-knox.jpg";
import heroKarate1 from "../assets/img/hero/karate-kando-knox-1.jpg";
import heroKarate2 from "../assets/img/hero/karate-kando-knox-2.jpg";
import heroKidsKarate from "../assets/img/hero/kids-karate-kando-knox.jpg";
import heroBJJ from "../assets/img/hero/brazilian-jiu-jitsu-kando-knox.jpg";
import heroBJJ1 from "../assets/img/hero/brazilian-jiu-jitsu-kando-knox-1.jpg";
import heroKidsBJJ from "../assets/img/hero/kids-brazilian-jiu-jitsu-kando-knox.jpg";
import heroPreSchool from "../assets/img/hero/pre-school-martial-arts-kando-knox.jpg";
import heroWomensSelfDefense from "../assets/img/hero/womens-self-defense-kando-knox.jpg";

// Program images
import adultBJJ from "../assets/img/adult-bjj.jpg";
import adultMartialArts from "../assets/img/adult-martial-arts.JPG";
import juniorBJJ from "../assets/img/junior-bjj.jpg";
import juniorMartialArts from "../assets/img/junior-martial-arts.JPG";
import preSchoolMartialArts from "../assets/img/pre-school-martial-arts.jpg";
import womenSelfDefence from "../assets/img/women-self-defence.JPG";
import about from "../assets/img/about.jpg";
import senseiAndy from "../assets/img/sensei-andy.jpg";
import kandoContact from "../assets/img/kando-contact.jpg";
import adminGirls from "../assets/img/admin-girls.jpg";
import defaultImage from "../assets/img/default.jpg";
import bearCaveLogo from "../assets/img/bear-cave-logo.avif";

// Program content images - Adult BJJ
import adultBJJ1 from "../assets/img/kando-knox-adult-bjj-1.jpg";
import adultBJJ2 from "../assets/img/kando-knox-adult-bjj-2.jpg";
import adultBJJ3 from "../assets/img/kando-knox-adult-bjj-3.jpg";

// Program content images - Adult Martial Arts
import adultMA1 from "../assets/img/kando-knox-adult-martial-arts-1.jpg";
import adultMA2 from "../assets/img/kando-knox-adult-martial-arts-2.jpg";
import adultMA3 from "../assets/img/kando-knox-adult-martial-arts-3.jpg";

// Program content images - Junior BJJ
import juniorBJJ1 from "../assets/img/kando-knox-junior-bjj-1.jpg";
import juniorBJJ2 from "../assets/img/kando-knox-junior-bjj-2.jpg";

// Program content images - Junior Martial Arts
import juniorMA1 from "../assets/img/kando-knox-junior-martial-arts-1.jpg";
import juniorMA2 from "../assets/img/kando-knox-junior-martial-arts-2.jpg";
import juniorMA3 from "../assets/img/kando-knox-junior-martial-arts-3.jpg";

// Program content images - Pre-School
import preSchool1 from "../assets/img/kando-knox-pre-school-martail-arts-1.jpg";
import preSchool2 from "../assets/img/kando-knox-pre-school-martail-arts-2.jpg";
import preSchool3 from "../assets/img/kando-knox-pre-school-martail-arts-3.jpg";
import preSchool4 from "../assets/img/kando-knox-pre-school-martail-arts-4.jpg";

// Program content images - Women's Self Defense
import womensSD1 from "../assets/img/kando-knox-women-self-defence-1.jpg";
import womensSD2 from "../assets/img/kando-knox-women-self-defence-2.jpg";
import womensSD3 from "../assets/img/kando-knox-women-self-defence-3.jpg";

// Blog images
import blogBJJFriends from "../assets/img/blog/bjj-friends.jpg";
import blogBJJSelfDefence from "../assets/img/blog/bjj-self-defence.jpg";
import blogKidsConfidence from "../assets/img/blog/kids-confidence.jpg";
import blogTeenagerConfidence from "../assets/img/blog/teenager-confidence.jpg";
import blogWomensSelfDefence from "../assets/img/blog/women-self-defence.jpg";

import type { ImageMetadata } from "astro";

/**
 * Image map: Maps public paths to asset imports
 */
export const imageMap: Record<string, ImageMetadata> = {
  // Hero images
  "/img/hero/martial-arts-kando-knox.jpg": heroMartialArts,
  "/img/hero/karate-kando-knox.jpg": heroKarate,
  "/img/hero/karate-kando-knox-1.jpg": heroKarate1,
  "/img/hero/karate-kando-knox-2.jpg": heroKarate2,
  "/img/hero/kids-karate-kando-knox.jpg": heroKidsKarate,
  "/img/hero/brazilian-jiu-jitsu-kando-knox.jpg": heroBJJ,
  "/img/hero/brazilian-jiu-jitsu-kando-knox-1.jpg": heroBJJ1,
  "/img/hero/kids-brazilian-jiu-jitsu-kando-knox.jpg": heroKidsBJJ,
  "/img/hero/pre-school-martial-arts-kando-knox.jpg": heroPreSchool,
  "/img/hero/womens-self-defense-kando-knox.jpg": heroWomensSelfDefense,

  // Program main images
  "/img/adult-bjj.jpg": adultBJJ,
  "/img/adult-martial-arts.JPG": adultMartialArts,
  "/img/junior-bjj.jpg": juniorBJJ,
  "/img/junior-martial-arts.JPG": juniorMartialArts,
  "/img/pre-school-martial-arts.jpg": preSchoolMartialArts,
  "/img/women-self-defence.JPG": womenSelfDefence,
  "/img/about.jpg": about,
  "/img/sensei-andy.jpg": senseiAndy,
  "/img/kando-contact.jpg": kandoContact,
  "/img/admin-girls.jpg": adminGirls,
  "/img/default.jpg": defaultImage,
  "/img/placeholder.jpg": defaultImage,
  "/img/bear-cave-logo.avif": bearCaveLogo,

  // Program content images - Adult BJJ
  "/img/kando-knox-adult-bjj-1.jpg": adultBJJ1,
  "/img/kando-knox-adult-bjj-2.jpg": adultBJJ2,
  "/img/kando-knox-adult-bjj-3.jpg": adultBJJ3,

  // Program content images - Adult Martial Arts
  "/img/kando-knox-adult-martial-arts-1.jpg": adultMA1,
  "/img/kando-knox-adult-martial-arts-2.jpg": adultMA2,
  "/img/kando-knox-adult-martial-arts-3.jpg": adultMA3,

  // Program content images - Junior BJJ
  "/img/kando-knox-junior-bjj-1.jpg": juniorBJJ1,
  "/img/kando-knox-junior-bjj-2.jpg": juniorBJJ2,

  // Program content images - Junior Martial Arts
  "/img/kando-knox-junior-martial-arts-1.jpg": juniorMA1,
  "/img/kando-knox-junior-martial-arts-2.jpg": juniorMA2,
  "/img/kando-knox-junior-martial-arts-3.jpg": juniorMA3,

  // Program content images - Pre-School
  "/img/kando-knox-pre-school-martail-arts-1.jpg": preSchool1,
  "/img/kando-knox-pre-school-martail-arts-2.jpg": preSchool2,
  "/img/kando-knox-pre-school-martail-arts-3.jpg": preSchool3,
  "/img/kando-knox-pre-school-martail-arts-4.jpg": preSchool4,

  // Program content images - Women's Self Defense
  "/img/kando-knox-women-self-defence-1.jpg": womensSD1,
  "/img/kando-knox-women-self-defence-2.jpg": womensSD2,
  "/img/kando-knox-women-self-defence-3.jpg": womensSD3,

  // Blog images
  "/blog/bjj-friends.jpg": blogBJJFriends,
  "/blog/bjj-self-defence.jpg": blogBJJSelfDefence,
  "/blog/kids-confidence.jpg": blogKidsConfidence,
  "/blog/teenager-confidence.jpg": blogTeenagerConfidence,
  "/blog/women-self-defence.jpg": blogWomensSelfDefence,
};

/**
 * Get image asset from path string
 * Returns the asset import if available, otherwise returns the original path
 */
export function getImageAsset(
  imagePath: string | undefined
): ImageMetadata | string {
  if (!imagePath) {
    return imageMap["/img/default.jpg"] || "/img/default.jpg";
  }

  // If it's already an asset import, return as is
  if (typeof imagePath === "object") {
    return imagePath;
  }

  // Check if we have a mapped asset
  const asset = imageMap[imagePath];
  if (asset) {
    return asset;
  }

  // Fallback to original path (for images not yet migrated)
  console.warn(`Image not found in map: ${imagePath}. Using original path.`);
  return imagePath;
}
