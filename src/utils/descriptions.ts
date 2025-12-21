/**
 * Meta Description Utility Functions
 *
 * Formats and validates meta descriptions for SEO
 * Target length: 160-300 characters (optimal: 155-160 for Google snippets)
 */

import { SITE_CONFIG } from "../config";

/**
 * Format and validate meta description
 * Ensures description is between 160-300 characters for optimal SEO
 *
 * @param description - Raw description from content (metaDescription field takes priority)
 * @param fallback - Fallback description if provided one is too short
 * @param keywords - Additional keywords/phrases to enhance description
 * @returns Formatted description within 160-300 character range
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
  if (desc.length < 160) {
    const enhancements: string[] = [];

    // Add keywords if provided
    if (keywords && keywords.length > 0) {
      enhancements.push(keywords.join(", "));
    }

    // Add location info for context
    if (
      !desc.toLowerCase().includes("knox") &&
      !desc.toLowerCase().includes("boronia")
    ) {
      enhancements.push(
        `Located in ${SITE_CONFIG.address.city}, serving the Knox area.`
      );
    }

    if (enhancements.length > 0) {
      const enhancedText = enhancements.join(" ");
      desc = `${desc} ${enhancedText}`.trim();
    }
  }

  // Truncate if too long (max 300 chars, try to keep at sentence boundary)
  if (desc.length > 300) {
    // Try to truncate at a sentence boundary (preferred)
    let truncated = desc.substring(0, 297);
    const lastPeriod = truncated.lastIndexOf(".");
    const lastExclamation = truncated.lastIndexOf("!");
    const lastQuestion = truncated.lastIndexOf("?");
    const lastSentence = Math.max(lastPeriod, lastExclamation, lastQuestion);

    if (lastSentence > 250) {
      // Truncate at sentence end
      truncated = truncated.substring(0, lastSentence + 1);
    } else {
      // Fallback to word boundary
      const lastSpace = truncated.lastIndexOf(" ");
      if (lastSpace > 250) {
        truncated = truncated.substring(0, lastSpace).trim() + "...";
      } else {
        truncated = truncated.trim() + "...";
      }
    }

    desc = truncated;
  }

  // If still too short after enhancements, add more context
  if (desc.length < 160) {
    const context =
      "Professional martial arts training for kids, teens, and adults.";
    desc = `${desc} ${context}`.trim();
  }

  // Final validation - ensure we're within bounds
  if (desc.length > 300) {
    desc = desc.substring(0, 297).trim() + "...";
  }
  if (desc.length < 160 && desc.length > 0) {
    // Add location as final resort
    desc = `${desc} Serving Boronia and the Knox area.`.trim();
    if (desc.length > 300) {
      desc = desc.substring(0, 297).trim() + "...";
    }
  }

  return desc;
}
