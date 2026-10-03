"use client";

import type { MouseEvent } from "react";
import type { Locale } from "@/content/site-config";
import type { Dictionary } from "@/i18n/types";
import { menuSections, scrollToSection, type MenuSection } from "@/lib/section-nav";

// Same order as the sections on the home page. On the home page a link scrolls to its section;
// elsewhere it navigates home and the launch intro picks up the #section.
export function MenuLinks({ locale, dictionary, current, onNavigate }: { locale: Locale; dictionary: Dictionary; current: MenuSection | null; onNavigate: () => void }) {
  const labels: Record<MenuSection, string> = { services: dictionary.nav.services, pricing: dictionary.nav.pricing, work: dictionary.nav.work, contact: dictionary.nav.contact };
  const go = (section: MenuSection) => (event: MouseEvent<HTMLAnchorElement>) => {
    onNavigate();
    if (!document.querySelector(".pricing-section")) return;
    event.preventDefault();
    // Let the menu release the page scroll lock before moving.
    window.requestAnimationFrame(() => {
      scrollToSection(section);
      window.history.replaceState(null, "", `/${locale}#${section}`);
    });
  };
  return <nav aria-label={dictionary.nav.mainMenu}>{menuSections.map((section) => (
    <a key={section} className={section === current ? "is-current" : ""} aria-current={section === current ? "location" : undefined} href={`/${locale}#${section}`} onClick={go(section)}>{labels[section]}</a>
  ))}</nav>;
}
