/**
 * Schema.org JSON-LD Helper Functions
 *
 * This file provides helper functions to generate common Schema.org structured data.
 * You can use these helpers or create custom schema objects directly.
 */

import { SITE_CONFIG } from "../config";

/**
 * Base Organization schema for the site
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.title,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/img/about.jpg`, // Update with your actual logo URL
    description: SITE_CONFIG.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.postcode,
      addressCountry: SITE_CONFIG.address.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_CONFIG.phone,
      contactType: "Customer Service",
      email: SITE_CONFIG.email,
    },
    sameAs: [SITE_CONFIG.facebook, SITE_CONFIG.instagram],
  };
}

/**
 * LocalBusiness schema (extends Organization)
 */
export function getLocalBusinessSchema() {
  const orgSchema = getOrganizationSchema();
  return {
    ...orgSchema,
    "@type": "LocalBusiness",
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.coordinates.latitude,
      longitude: SITE_CONFIG.coordinates.longitude,
    },
  };
}

/**
 * WebSite schema with search action
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.title,
    url: SITE_CONFIG.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * BreadcrumbList schema
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Article schema
 */
export function getArticleSchema(data: {
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  publisher?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.headline,
    description: data.description || SITE_CONFIG.description,
    image: data.image || `${SITE_CONFIG.url}/img/default.jpg`,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: {
      "@type": "Person",
      name: data.author || SITE_CONFIG.title,
    },
    publisher: {
      "@type": "Organization",
      name: data.publisher || SITE_CONFIG.title,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/img/about.jpg`,
      },
    },
  };
}

/**
 * BlogPosting schema for blog posts
 *
 * @param headline - The blog post title
 * @param description - The blog post description
 * @param slug - The blog post slug for URL
 * @param datePublished - Publication date (ISO format)
 * @param dateModified - Optional modification date (ISO format)
 * @param image - Optional featured image URL
 */
export function getBlogPostingSchema(
  headline: string,
  description: string,
  slug: string,
  datePublished?: string,
  dateModified?: string,
  image?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.title,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.title,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/blog/${slug}`,
    },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(image && {
      image: image.startsWith("http") ? image : `${SITE_CONFIG.url}${image}`,
    }),
  };
}

/**
 * Service schema for program pages
 * Represents a specific martial arts program/service
 *
 * @param serviceName - Name of the service (e.g., "Pre-School Martial Arts Classes in Knox")
 * @param serviceType - Type of service (e.g., "Pre-School Martial Arts and Karate")
 * @param slug - URL slug for the program page
 */
export function getProgramServiceSchema(
  serviceName: string,
  serviceType: string,
  slug: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    serviceType,
    provider: {
      "@type": "SportsActivityLocation",
      "@id": `${SITE_CONFIG.url}/#martial-arts-school`,
      name: SITE_CONFIG.title,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Knox, VIC",
    },
    url: `${SITE_CONFIG.url}/programs/${slug}`,
  };
}

/**
 * FAQPage schema for program pages
 * Provides structured FAQ data for program pages (same for all programs)
 */
export function getProgramFAQPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do you offer martial arts classes near Knox?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, ${SITE_CONFIG.title} offers martial arts classes in ${SITE_CONFIG.address.city}, serving the Knox area and surrounding suburbs.`,
        },
      },
      {
        "@type": "Question",
        name: "What age groups do you cater for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer classes for pre-school children, juniors, teens, and adults, including Brazilian Jiu-Jitsu and self-defence programs.",
        },
      },
    ],
  };
}

/**
 * Service schema
 */
export function getServiceSchema(data: {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.name,
    description: data.description,
    provider: {
      "@type": "Organization",
      name: data.provider || SITE_CONFIG.title,
      url: SITE_CONFIG.url,
    },
    areaServed: data.areaServed || SITE_CONFIG.address.city,
    serviceType: data.serviceType || "Martial Arts Training",
  };
}

/**
 * LocalBusiness schema for location pages
 * Provides comprehensive local business information with NAP and geographic data
 *
 * @param locationName - Name of the city/location being served
 * @param slug - URL slug for the location page
 */
export function getLocationLocalBusinessSchema(
  locationName: string,
  slug: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/locations/${slug}#business`,
    name: SITE_CONFIG.title,
    image: `${SITE_CONFIG.url}/img/about.jpg`,
    url: `${SITE_CONFIG.url}/locations/${slug}`,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.postcode,
      addressCountry: SITE_CONFIG.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.coordinates.latitude,
      longitude: SITE_CONFIG.coordinates.longitude,
    },
    areaServed: [
      {
        "@type": "City",
        name: locationName,
      },
      {
        "@type": "AdministrativeArea",
        name: "City of Knox",
      },
    ],
    ...(SITE_CONFIG.googleBusinessUrl && {
      sameAs: [SITE_CONFIG.googleBusinessUrl],
    }),
  };
}

/**
 * Service schema for location pages
 * Represents karate training service for a specific location/city
 *
 * @param locationName - Name of the city/location being served
 * @param slug - URL slug for the location page
 * @param serviceName - Name of the service (e.g., "Karate Classes in Ferntree Gully")
 */
export function getLocationServiceSchema(
  locationName: string,
  slug: string,
  serviceName?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName || `Karate Classes in ${locationName}`,
    serviceType: "Karate Training",
    provider: {
      "@type": "SportsActivityLocation",
      "@id": `${SITE_CONFIG.url}/#martial-arts-school`,
      name: SITE_CONFIG.title,
    },
    areaServed: {
      "@type": "City",
      name: locationName,
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceLocation: {
        "@type": "Place",
        name: SITE_CONFIG.title,
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE_CONFIG.address.city,
          addressRegion: SITE_CONFIG.address.state,
        },
      },
    },
    url: `${SITE_CONFIG.url}/locations/${slug}`,
  };
}

/**
 * FAQPage schema for location pages
 * Provides structured FAQ data for a specific location/suburb
 *
 * @param locationName - Name of the city/location being served
 */
export function getLocationFAQPageSchema(locationName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Do you offer karate classes near ${locationName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ${SITE_CONFIG.title} is located in ${SITE_CONFIG.address.city} and offers karate classes to students from ${locationName} and surrounding Knox suburbs.`,
        },
      },
      {
        "@type": "Question",
        name: `How far is your martial arts school from ${locationName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Our ${SITE_CONFIG.address.city} academy is a short drive from ${locationName} and easily accessible for families across the City of Knox.`,
        },
      },
    ],
  };
}

/**
 * AggregateRating and Review schema
 * Uses Google reviews data to create aggregate rating and individual reviews
 *
 * @param reviews - Array of review objects with stars, name, text, reviewUrl
 * @param googleBusinessUrl - Optional Google Business Profile URL
 */
export function getReviewSchema(
  reviews: Array<{
    stars: number;
    name: string;
    text: string;
    reviewUrl?: string;
  }>,
  googleBusinessUrl?: string
) {
  // Calculate aggregate rating
  const totalReviews = reviews.length;
  const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
  const averageRating = totalStars / totalReviews;

  // Get up to 10 most recent reviews (or all if less than 10)
  const reviewItems = reviews.slice(0, 10).map((review) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.stars,
      bestRating: 5,
    },
    reviewBody: review.text,
    ...(review.reviewUrl && { url: review.reviewUrl }),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/#business`,
    name: SITE_CONFIG.title,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageRating.toFixed(1),
      reviewCount: totalReviews,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviewItems,
    ...(googleBusinessUrl && { url: googleBusinessUrl }),
  };
}

/**
 * SportsActivityLocation schema for martial arts school
 * This schema is used for the homepage and represents the business location
 *
 * @param cities - Optional array of city names. If not provided, uses default cities.
 */
export function getSportsActivityLocationSchema(cities?: string[]) {
  // Default cities if not provided
  const defaultCities = [
    "Boronia",
    "Bayswater",
    "Croydon",
    "Ferntree Gully",
    "Knoxfield",
    "Rowville",
    "Scoresby",
    "Wantirna",
  ];

  const cityList = cities || defaultCities;

  // Build areaServed array with AdministrativeArea (City of Knox) and Cities
  const areaServed = [
    {
      "@type": "AdministrativeArea",
      name: "City of Knox",
    },
    ...cityList.map((city: string) => ({
      "@type": "City",
      name: city,
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "@id": `${SITE_CONFIG.url}/#martial-arts-school`,
    name: SITE_CONFIG.title,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    image: `${SITE_CONFIG.url}/images/academy.jpg`,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.postcode,
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.coordinates.latitude,
      longitude: SITE_CONFIG.coordinates.longitude,
    },
    areaServed,
    sameAs: [SITE_CONFIG.facebook, SITE_CONFIG.instagram],
  };
}
