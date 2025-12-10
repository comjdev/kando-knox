export const SITE_CONFIG = {
  title: "Kando Martial Arts Knox",
  description: "Martial arts training in Knox",
  facebook: "https://www.facebook.com/kandoknox",
  instagram: "https://www.instagram.com/kandoknox",
  // Add other site-wide constants here as needed
  url: "https://knoxmartialarts.com",
  shopUrl: "https://shop.knoxmartialarts.com",
  academyUrl:
    "https://cf.knoxmartialarts.com.au/membership-access-page1584527208387?page_id=37236729&page_key=xmowug900rg1qm7g&login_redirect=1",
  // author: "Your Name",
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
    label: "Women's Self-Defence",
    href: "/programs/womens-self-defence-knox",
    description: "Women's Self-Defence",
  },
];
