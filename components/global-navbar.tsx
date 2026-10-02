"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitch } from "@/components/language-switch";
import type { Locale } from "@/content/site-config";
import type { Dictionary } from "@/i18n/types";

export function GlobalNavbar({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [revealMode, setRevealMode] = useState(false);
  const homeHref = `/${locale}`;

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const servicesPage = document.querySelector<HTMLElement>(".services-page--embedded");
      if (!servicesPage) return;
      const navbar = document.querySelector<HTMLElement>(".global-navbar");
      const navbarHeight = navbar?.getBoundingClientRect().height ?? 0;
      const nextRevealMode = servicesPage.getBoundingClientRect().bottom <= navbarHeight;
      setRevealMode((current) => current === nextRevealMode ? current : nextRevealMode);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const returnHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setOpen(false);
    window.history.replaceState(null, "", homeHref);
    window.location.reload();
  };

  return <header className={`global-navbar ${revealMode ? "is-reveal-mode" : ""} ${open ? "is-menu-open" : ""}`}>
    <a className="global-navbar__home" href={homeHref} aria-label="Return to the Epheral homepage" onClick={returnHome}><BrandLogo priority /></a>
    <button className={`hero-menu global-navbar__menu ${open ? "is-open" : ""}`} type="button" aria-label={open ? dictionary.nav.close : dictionary.nav.menu} aria-expanded={open} onClick={() => setOpen((value) => !value)}><span /><span /><span /></button>
    <div className={`hero-menu-panel global-navbar__panel ${open ? "is-open" : ""}`} aria-hidden={!open}><nav aria-label="Main menu">{[dictionary.nav.services, dictionary.nav.work, dictionary.nav.contact, dictionary.nav.pricing].map((item, index) => <a className={index === 0 ? "is-current" : ""} key={index} href={index === 0 ? `/${locale}#services` : "#"} onClick={index === 0 ? () => setOpen(false) : (event) => event.preventDefault()} tabIndex={open ? 0 : -1}>{item}</a>)}</nav><LanguageSwitch locale={locale} label={dictionary.nav.language} tabIndex={open ? 0 : -1} /></div>
  </header>;
}
