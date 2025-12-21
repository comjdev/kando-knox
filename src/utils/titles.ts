/**
 * Title Tag Utility Functions
 *
 * Generates SEO-friendly page titles with consistent suffix
 */

import { SITE_CONFIG } from "../config";

const TITLE_SUFFIX = "| Kando Martial Arts Knox | Karate | BJJ";

/**
 * Generate page title with suffix
 * @param pageTitle - The main page title
 * @returns Full title with suffix
 */
export function generatePageTitle(pageTitle: string): string {
  return `${pageTitle} ${TITLE_SUFFIX}`;
}

/**
 * Generate title for location pages
 * @param locationName - Name of the location/suburb
 * @param programType - "Karate" or "BJJ" (defaults to "Karate")
 * @returns Formatted title
 */
export function getLocationPageTitle(
  locationName: string,
  programType: "Karate" | "BJJ" = "Karate"
): string {
  return generatePageTitle(`${programType} in ${locationName} & Knox`);
}

/**
 * Generate title for program pages
 * @param programTitle - The program title (e.g., "Junior Martial Arts")
 * @returns Formatted title
 */
export function getProgramPageTitle(programTitle: string): string {
  // Add "Classes in Knox" if not already present
  const title = programTitle.includes("Classes in Knox")
    ? programTitle
    : `${programTitle} Classes in Knox`;
  return generatePageTitle(title);
}

/**
 * Generate title for blog posts
 * @param postTitle - The blog post title
 * @returns Formatted title
 */
export function getBlogPostTitle(postTitle: string): string {
  return generatePageTitle(postTitle);
}

/**
 * Generate title for about page
 * @returns Formatted title
 */
export function getAboutPageTitle(): string {
  return generatePageTitle("About Kando Martial Arts Knox");
}

/**
 * Generate title from custom title tag or fallback
 * @param customTitle - Custom title from content file (optional)
 * @param fallbackTitle - Fallback title if custom title not provided
 * @returns Formatted title
 */
export function getCustomPageTitle(
  customTitle?: string,
  fallbackTitle?: string
): string {
  const title = customTitle || fallbackTitle || SITE_CONFIG.title;
  return generatePageTitle(title);
}
