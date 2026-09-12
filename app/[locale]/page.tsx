import { notFound } from "next/navigation";
import { isLocale } from "@/content/site-config";
import { getDictionary } from "@/i18n";
import { LivingCanvas } from "@/components/living-canvas/living-canvas";
import { LaunchIntro } from "@/components/launch-intro";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  return (
    <><LaunchIntro /><main id="main-content"><LivingCanvas locale={locale} dictionary={dictionary} /></main></>
  );
}
