/**
 * Meta Description Utility Functions
 *
 * Formats and validates meta descriptions for SEO
 * Target length: 155-160 characters (optimal for Google search result display)
 */

import { SITE_CONFIG } from "../config";

const OPTIMAL_LENGTH = 160; // Google typically shows 155-160 chars
const MAX_LENGTH = 165; // Allow slight overflow for natural sentence endings
const MIN_LENGTH = 120; // Minimum acceptable length

/**
 * Format and validate meta description
 * Optimizes description to 155-160 characters for optimal Google display
 *
 * @param description - Raw description from content (metaDescription field takes priority)
 * @param fallback - Fallback description if provided one is too short
 * @param keywords - Additional keywords/phrases to enhance description
 * @returns Formatted description optimized for 155-160 character display
 */
export function formatMetaDescription(
  description: string | undefined,
  fallback?: string,
  keywords?: string[]
): string {
  if (!description && !fallback) {
    return "Martial arts training in Knox. Karate and Brazilian Jiu-Jitsu classes for all ages in Boronia, serving the Knox area.";
  }

  // Ensure we have a string
  let desc = (description || fallback || "").toString();
  desc = desc.trim();

  // If description is too short, enhance with keywords and location info
  if (desc.length < MIN_LENGTH) {
    const enhancements: string[] = [];

    // Add keywords if provided (limit to avoid making too long)
    if (keywords && keywords.length > 0) {
      const keywordStr = keywords.slice(0, 3).join(", "); // Limit to first 3 keywords
      if (keywordStr.length + desc.length < OPTIMAL_LENGTH) {
        enhancements.push(keywordStr);
      }
    }

    // Add location info for context (only if not already present)
    if (
      !desc.toLowerCase().includes("knox") &&
      !desc.toLowerCase().includes("boronia")
    ) {
      const locationText = `Located in ${SITE_CONFIG.address.city}, serving the Knox area.`;
      if (locationText.length + desc.length < OPTIMAL_LENGTH) {
        enhancements.push(locationText);
      }
    }

    if (enhancements.length > 0) {
      const enhancedText = enhancements.join(" ");
      desc = `${desc} ${enhancedText}`.trim();
    }
  }

  // Optimize length: target 155-160 characters for Google display
  if (desc.length > MAX_LENGTH) {
    // Try to truncate at a sentence boundary (preferred)
    let truncated = desc.substring(0, OPTIMAL_LENGTH);
    const lastPeriod = truncated.lastIndexOf(".");
    const lastExclamation = truncated.lastIndexOf("!");
    const lastQuestion = truncated.lastIndexOf("?");
    const lastSentence = Math.max(lastPeriod, lastExclamation, lastQuestion);

    // If we find a sentence end within reasonable range, use it
    if (lastSentence > OPTIMAL_LENGTH - 30) {
      truncated = truncated.substring(0, lastSentence + 1);
    } else {
      // Fallback to word boundary near optimal length
      const lastSpace = truncated.lastIndexOf(" ");
      if (lastSpace > OPTIMAL_LENGTH - 20) {
        truncated = truncated.substring(0, lastSpace).trim() + "...";
      } else {
        // Hard truncate at optimal length
        truncated = truncated.substring(0, OPTIMAL_LENGTH).trim() + "...";
      }
    }

    desc = truncated;
  }

  // If still too short after enhancements, add concise context
  if (desc.length < MIN_LENGTH) {
    const context = "Professional martial arts training for all ages.";
    desc = `${desc} ${context}`.trim();
  }

  // Final optimization: ensure we're within optimal range
  if (desc.length > MAX_LENGTH) {
    // One more pass to get it right
    const truncated = desc.substring(0, OPTIMAL_LENGTH);
    const lastSpace = truncated.lastIndexOf(" ");
    desc = truncated.substring(0, lastSpace).trim() + "...";
  }

  // Ensure minimum length
  if (desc.length < MIN_LENGTH && desc.length > 0) {
    const locationText = `Serving ${SITE_CONFIG.address.city} and the Knox area.`;
    desc = `${desc} ${locationText}`.trim();
    // If this makes it too long, truncate again
    if (desc.length > MAX_LENGTH) {
      desc = desc.substring(0, OPTIMAL_LENGTH).trim() + "...";
    }
  }

  return desc;
}
