import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Define the programs collection schema
const programs = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/program" }),
  schema: z.object({
    id: z.number(),
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    ageGroup: z.string().optional(),
    schedule: z
      .array(
        z.object({
          day: z.string(),
          timeFrom: z.string(),
          timeTo: z.string(),
          className: z.string(),
          beltRank: z.string().nullable().optional(),
          instructor: z.string().optional(),
        })
      )
      .optional(),
    features: z.array(z.string()).optional(),
    image: z.string().optional(),
    // Add any other fields your programs need
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
  team,
  benefits,
  testimonials,
};
