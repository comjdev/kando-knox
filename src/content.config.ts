import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Define the programs collection schema (using glob loader for JSON files)
const programs = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/program" }),
  schema: z.object({
    id: z.number(),
    title: z.string(),
    slug: z.string(),
    description: z.string().or(z.array(z.string())),
    shortDescription: z.string().optional(),
    metaDescription: z.string().optional(),
    titleTag: z.string().optional(),
    ageGroup: z.string().optional(),
    bearCave: z.boolean().optional(),
    schedule: z
      .array(
        z.object({
          day: z.string(),
          timeFrom: z.string(),
          timeTo: z.string(),
          className: z.string(),
          beltRank: z.string().nullable().optional(),
          instructor: z.string().nullable().optional(),
        })
      )
      .optional(),
    features: z.array(z.string()).optional(),
    image: z.string().optional(),
    content: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          image: z.string().optional(),
        })
      )
      .optional(),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),
    trial: z
      .object({
        weeks: z.number(),
        cost: z.union([z.number(), z.boolean()]),
        value: z.number(),
        unlimitedClasses: z.boolean().optional(),
        freeGi: z.boolean().optional(),
      })
      .optional(),
  }),
});

// Define the locations collection schema
const locations = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/locations" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    metaDescription: z.string().optional(),
    titleTag: z.string().optional(),
    image: z.string().optional(),
    featuredImage: z.string().optional(),
    transitionName: z.string().optional(),
    locationName: z.string(),
    suburb: z.string().optional(),
    programType: z.string().optional(),
    servingArea: z
      .object({
        heading: z.string().optional(),
        suburbs: z.array(z.string()).optional(),
        description: z.string(),
      })
      .optional(),
    getToKando: z
      .union([
        z.string(),
        z.object({
          heading: z.string(),
          description: z.union([z.string(), z.array(z.string())]),
        }),
      ])
      .optional(),
    programs: z.array(z.string()).optional(),
    faqs: z
      .union([
        z.string(),
        z.array(
          z.object({
            question: z.string(),
            answer: z.string(),
          })
        ),
      ])
      .optional(),
    intro: z
      .object({
        heading: z.string(),
        description: z.string(),
      })
      .optional(),
    kandoInfo: z
      .object({
        heading: z.string(),
        description: z.union([z.string(), z.array(z.string())]),
      })
      .optional(),
    classes: z
      .array(
        z.object({
          id: z.string(),
          heading: z.string(),
          description: z.string(),
        })
      )
      .optional(),
    whyChooseUs: z
      .object({
        heading: z.string(),
        description: z.string(),
        benefits: z.array(
          z.object({
            icon: z.string(),
            heading: z.string(),
            description: z.string(),
          })
        ),
      })
      .optional(),
    benefits: z
      .array(
        z.object({
          heading: z.string(),
          description: z.array(z.string()),
        })
      )
      .optional(),
  }),
});

// Define the blog collection schema
const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    metaDescription: z.string().optional(),
    titleTag: z.string().optional(),
    date: z.coerce.date(), // Use coerce to handle string dates
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    featuredImage: z.string().optional(),
    category: z.union([z.string(), z.array(z.string())]).optional(),
    author: z.string().optional(),
  }),
});

// Define the pages collection schema
const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    metaDescription: z.string().optional(),
    titleTag: z.string().optional(),
    image: z.string().optional(),
    transitionName: z.string().optional(),
  }),
});

// Define the team collection schema
const team = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    role: z.string(),
    image: z.string(),
    bio: z.string().optional(),
    beltRank: z.string().optional(),
    yearsExperience: z.number().optional(),
    order: z.number().optional(), // For controlling display order
  }),
});

// Define the benefits collection schema
const benefits = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(), // SVG path or icon identifier
    order: z.number().optional(), // For controlling display order
  }),
});

// Define the testimonials collection schema
const testimonials = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
    content: z.string(), // Testimonial content
    order: z.number().optional(), // For controlling display order
  }),
});

export const collections = {
  programs,
  locations,
  // blog, // Temporarily disabled - using import.meta.glob until schema validation is fixed
  // pages, // Temporarily disabled - using import.meta.glob until schema validation is fixed
  team,
  benefits,
  testimonials,
};
