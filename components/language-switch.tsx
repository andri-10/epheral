"use client";

import { usePathname } from "next/navigation";
import { siteConfig, type Locale } from "@/content/site-config";

export function LanguageSwitch({ locale, label, tabIndex }: { locale: Locale; label: string; tabIndex?: number }) {
  const pathname = usePathname();
  const target: Locale = locale === "sq" ? "en" : "sq";
  const switchLocale = () => {
    const rest = pathname.replace(new RegExp(`^/(${siteConfig.locales.join("|")})(?=/|$)`), "");
    window.location.assign(`/${target}${rest}${window.location.hash}`);
  };
  return <button className={`language-switch ${locale === "en" ? "is-en" : ""}`} type="button" role="switch" aria-checked={locale === "en"} aria-label={`${label}: ${target.toUpperCase()}`} tabIndex={tabIndex} onClick={switchLocale}>
    <span className="language-switch__thumb" aria-hidden="true" />
    <span className="language-switch__option" aria-hidden="true">SQ</span>
    <span className="language-switch__option" aria-hidden="true">EN</span>
  </button>;
}
