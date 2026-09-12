import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteConfig } from "@/content/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const home = siteConfig.locales.map((locale) => ({
    url: `${siteConfig.url}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
    alternates: { languages: { sq: `${siteConfig.url}/sq`, en: `${siteConfig.url}/en` } },
  }));
  const work = siteConfig.locales.flatMap((locale) => projects.map((project) => ({
    url: `${siteConfig.url}/${locale}/work/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: { languages: { sq: `${siteConfig.url}/sq/work/${project.slug}`, en: `${siteConfig.url}/en/work/${project.slug}` } },
  })));
  return [...home, ...work];
}
