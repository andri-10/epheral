"use client";

import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitch } from "@/components/language-switch";
import { MenuLinks } from "@/components/menu-links";
import { currentSection, type MenuSection } from "@/lib/section-nav";
import type { Locale } from "@/content/site-config";
import type { Dictionary } from "@/i18n/types";

export function GlobalNavbar({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [revealMode, setRevealMode] = useState(false);
  const [current, setCurrent] = useState<MenuSection | null>(null);
  // Phones get a small popover under the button; wider screens the full-screen menu.
  const [popover, setPopover] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const query = window.matchMedia("(max-width: 899px)");
    const update = () => setPopover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // While open: move focus into the menu, close on Escape, and hand focus back on close. The full-screen
  // menu also locks the page behind it; the popover leaves the page usable and closes on an outside tap.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    if (!popover) root.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("nav a")?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !menuButtonRef.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    if (popover) document.addEventListener("pointerdown", onPointerDown);
    return () => {
      root.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      if (panelRef.current?.contains(document.activeElement)) menuButtonRef.current?.focus({ preventScroll: true });
    };
  }, [open, popover]);

  const toggleMenu = () => {
    if (!open) setCurrent(currentSection());
    setOpen(!open);
  };

  const returnHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setOpen(false);
    window.history.replaceState(null, "", homeHref);
    window.location.reload();
  };

  return <header className={`global-navbar ${revealMode ? "is-reveal-mode" : ""} ${open && !popover ? "is-menu-open" : ""} ${open && popover ? "is-popover-open" : ""}`}>
    <a className="global-navbar__home" href={homeHref} aria-label="Return to the Epheral homepage" onClick={returnHome}><BrandLogo priority /></a>
    <button ref={menuButtonRef} className={`hero-menu global-navbar__menu ${open ? "is-open" : ""}`} type="button" aria-label={open ? dictionary.nav.close : dictionary.nav.menu} aria-expanded={open} aria-controls="global-menu" onClick={toggleMenu}><span /><span /><span /></button>
    <div ref={panelRef} id="global-menu" className={`hero-menu-panel global-navbar__panel ${open ? "is-open" : ""}`} inert={!open}><MenuLinks locale={locale} dictionary={dictionary} current={current} onNavigate={() => setOpen(false)} /><LanguageSwitch locale={locale} label={dictionary.nav.language} /></div>
  </header>;
}
