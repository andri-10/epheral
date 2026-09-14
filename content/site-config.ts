export const siteConfig = {
  id: "epheral",
  name: "EPHERAL",
  owner: "[Your Name]",
  location: "[Location]",
  email: "[Email Address]",
  social: {
    instagram: "[Instagram URL]",
    linkedin: "[LinkedIn URL]",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locales: ["sq", "en"] as const,
  defaultLocale: "sq" as const,
} as const;

export type Locale = (typeof siteConfig.locales)[number];

export function isLocale(value: string): value is Locale {
  return siteConfig.locales.includes(value as Locale);
}
