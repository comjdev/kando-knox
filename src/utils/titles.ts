/**
 * Title Tag Utility Functions
 *
 * Generates SEO-friendly page titles with consistent suffix
 * Ensures titles don't exceed 70 characters (Google best practice)
 */

import { SITE_CONFIG } from "../config";

const BASE_SUFFIX = "| Kando Martial Arts Knox";
const KEYWORDS = ["Karate", "BJJ"];

/**
 * Generate page title with smart suffix that adds keywords if space allows
 * @param pageTitle - The main page title
 * @param keywords - Optional keywords to add (e.g., ["Karate", "BJJ"])
 * @returns Full title with suffix (max 70 characters)
 */
export function generatePageTitle(
  pageTitle: string,
  keywords?: string[]
): string {
  const maxLength = 70;
  const baseTitle = pageTitle.trim();
  const baseSuffix = BASE_SUFFIX;

  // Start with base title + base suffix
  let fullTitle = `${baseTitle} ${baseSuffix}`;

  // If title is already at or near max, return it
  if (fullTitle.length >= maxLength - 5) {
    return fullTitle.substring(0, maxLength);
  }

  // Add keywords if provided and there's space
  const keywordsToAdd = keywords || KEYWORDS;
  const remainingSpace = maxLength - fullTitle.length;

  // Try to add keywords, prioritizing the most relevant ones
  for (const keyword of keywordsToAdd) {
    const keywordWithSeparator = ` | ${keyword}`;
    if (fullTitle.length + keywordWithSeparator.length <= maxLength) {
      fullTitle += keywordWithSeparator;
    } else {
      break; // No more space for keywords
    }
  }

  // Final check - ensure we don't exceed max length
  return fullTitle.length > maxLength
    ? fullTitle.substring(0, maxLength).trim()
    : fullTitle;
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
  // Add the program type as a keyword if it's not already in the title
  const keywords =
    programType === "Karate" ? ["Karate", "BJJ"] : ["BJJ", "Karate"];
  return generatePageTitle(
    `${programType} in ${locationName} & Knox`,
    keywords
  );
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

  // Determine keywords based on program type
  let keywords: string[] = [];
  const titleLower = title.toLowerCase();
  if (titleLower.includes("karate") || titleLower.includes("martial arts")) {
    keywords.push("Karate");
  }
  if (
    titleLower.includes("bjj") ||
    titleLower.includes("jiu-jitsu") ||
    titleLower.includes("jiu jitsu")
  ) {
    keywords.push("BJJ");
  }
  // If no specific keywords found, add both
  if (keywords.length === 0) {
    keywords = ["Karate", "BJJ"];
  }

  return generatePageTitle(title, keywords);
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
