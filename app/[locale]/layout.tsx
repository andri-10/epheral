import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, siteConfig } from "@/content/site-config";
import { getDictionary } from "@/i18n";
import { GlobalNavbar } from "@/components/global-navbar";

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dictionary = getDictionary(locale);
  const canonical = `${siteConfig.url}/${locale}`;
  return {
    metadataBase: new URL(siteConfig.url),
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    alternates: {
      canonical,
      languages: { sq: `${siteConfig.url}/sq`, en: `${siteConfig.url}/en`, "x-default": `${siteConfig.url}/sq` },
    },
    openGraph: {
      type: "website",
      locale: locale === "sq" ? "sq_AL" : "en_US",
      url: canonical,
      siteName: siteConfig.name,
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        <link rel="preload" href="/animations/canvas/living-canvas-0001.webp" as="image" type="image/webp" />
      </head>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">{locale === "sq" ? "Kalo te përmbajtja" : "Skip to content"}</a>
        <GlobalNavbar locale={locale} />
        {children}
      </body>
    </html>
  );
}
