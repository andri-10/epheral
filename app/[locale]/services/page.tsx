import { notFound } from "next/navigation";
import { isLocale } from "@/content/site-config";
import { getDictionary } from "@/i18n";
import { ServicesSection } from "@/components/sections/services-section";
import { RevealProvider } from "@/components/reveal-provider";

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <><main className="services-route"><ServicesSection locale={locale} dictionary={getDictionary(locale)} /></main><RevealProvider /></>;
}
