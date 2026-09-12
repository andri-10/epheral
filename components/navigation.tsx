"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale } from "@/content/site-config";
import { siteConfig } from "@/content/site-config";
import type { Dictionary } from "@/i18n/types";

export function Navigation({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const otherLocale: Locale = locale === "sq" ? "en" : "sq";
  const localizedPath = pathname.replace(/^\/(sq|en)(?=\/|$)/, `/${otherLocale}`);
  const links = [["work", dictionary.nav.work], ["services", dictionary.nav.services], ["process", dictionary.nav.process], ["about", dictionary.nav.about]] as const;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 18);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", closeOnEscape); };
  }, [open]);

  return (
    <header className={`site-header ${scrolled || open ? "is-scrolled" : ""}`}>
      <div className="nav-shell">
        <Link href={`/${locale}`} className="wordmark" aria-label={`${siteConfig.name} — ${dictionary.common.backHome}`}>{siteConfig.name}</Link>
        <nav className="desktop-nav" aria-label={dictionary.footer.navigation}>
          {links.map(([id, label]) => <Link key={id} href={`/${locale}#${id}`}>{label}</Link>)}
        </nav>
        <div className="nav-actions">
          <Link href={localizedPath} className="locale-switch" lang={otherLocale} hrefLang={otherLocale} aria-label={`${otherLocale.toUpperCase()} — ${locale === "sq" ? "English" : "Shqip"}`}>{otherLocale.toUpperCase()}</Link>
          <Link href={`/${locale}#contact`} className="nav-cta">{dictionary.common.primaryCta}</Link>
          <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? dictionary.nav.close : dictionary.nav.menu}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label={dictionary.footer.navigation}>
          {links.map(([id, label], index) => <Link key={id} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} href={`/${locale}#${id}`}><span>0{index + 1}</span>{label}</Link>)}
          <Link tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} href={`/${locale}#contact`}><span>05</span>{dictionary.nav.contact}</Link>
        </nav>
        <div className="mobile-menu-foot"><Link tabIndex={open ? 0 : -1} href={localizedPath}>{otherLocale.toUpperCase()} · {locale === "sq" ? "English" : "Shqip"}</Link><span>{dictionary.footer.availability}</span></div>
      </div>
    </header>
  );
}
