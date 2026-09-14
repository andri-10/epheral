import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/content/site-config";

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(`/${locale}#services`);
}
