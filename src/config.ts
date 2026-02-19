/**
 * Form API endpoints - set via environment variables at build time.
 * e.g. PUBLIC_TRIAL_API_URL=https://xxx.lambda-url.ap-southeast-2.on.aws/
 *      PUBLIC_CONTACT_API_URL=https://xxx.lambda-url.ap-southeast-2.on.aws/
 */
export const SITE_CONFIG = {
  title: "Kando Martial Arts Knox",
  description: "Martial arts training in Knox",
  facebook: "https://www.facebook.com/kandoknox",
  instagram: "https://www.instagram.com/kandoknox",
  url: "https://knoxmartialarts.com.au",
  shopUrl: "https://shop.knoxmartialarts.com.au",
  academyUrl: "https://cf.knoxmartialarts.com.au/membership-area",
  // academyUrl: "https://kandoknox.myclickfunnels.com/courses/online-academy",
  googleAnalyticsId: "G-XXXXXXXXXX", // Replace with your actual GA4 Measurement ID
  // author: "Your Name",
  address: {
    street: "Unit 2/5 Wadhurst Dr",
    city: "Boronia",
    state: "VIC",
    postcode: "3155",
    country: "Australia",
  },
  phone: "(03) 9800 5454",
  email: "knox@kandomartialarts.com.au",
  coordinates: {
    latitude: -37.8656501,
    longitude: 145.2531667,
  },
  googleBusinessUrl: "https://maps.app.goo.gl/iNSWgGtT8VPqmy516", // Google Business Profile/Maps URL
  /** Lambda/API URL for trial form submissions. Set PUBLIC_TRIAL_API_URL at build. */
  trialApiUrl: import.meta.env.PUBLIC_TRIAL_API_URL || "",
  /** Lambda/API URL for contact form submissions. Set PUBLIC_CONTACT_API_URL at build. */
  contactApiUrl: import.meta.env.PUBLIC_CONTACT_API_URL || "",
} as const;

export interface Program {
  group: string;
  label: string;
  href: string;
  description: string;
}

export const PROGRAMS: Program[] = [
  {
    group: "Martial Arts",
    label: "Pre-School Martial Arts",
    href: "/programs/pre-school-martial-arts-karate-knox",
    description:
      "Martial Arts and Karate classes for pre-schoolers (3-6 years old)",
  },
  {
    group: "Martial Arts",
    label: "Junior Martial Arts",
    href: "/programs/junior-martial-arts-karate-knox",
    description: "Martial Arts and Karate classes for children (7 - 12 years)",
  },
  {
    group: "Martial Arts",
    label: "Teen & Adults Martial Arts",
    href: "/programs/adult-martial-arts-karate-knox",
    description: "Martial Arts and Karate classes for teenagers and adults",
  },
  {
    group: "Brazilian Jiu-Jitsu",
    label: "Junior Brazilian Jiu-Jitsu",
    href: "/programs/junior-bjj-bear-cave-knox",
    description: "Junior Brazilian Jiu-Jitsu for children (7 - 12 years)",
  },
  {
    group: "Brazilian Jiu-Jitsu",
    label: "Teen & Adult Brazilian Jiu-Jitsu",
    href: "/programs/teen-adult-bjj-brazilian-jiu-jitsu-knox",
    description: "Brazilian Jiu-Jitsu classes for teenagers and adults",
  },
  {
    group: "Self-Defence",
    label: "Women's Self-Protection",
    href: "/programs/womens-self-defence-knox",
    description: "Women's Self-Defence",
  },
];
