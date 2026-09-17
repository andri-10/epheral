"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

export function GlobalNavbar({ locale }: { locale: string }) {
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

  return <header className={`global-navbar ${revealMode ? "is-reveal-mode" : ""}`}>
    <a className="global-navbar__home" href={homeHref} aria-label="Return to the Epheral homepage" onClick={returnHome}><BrandLogo priority /></a>
    <button className={`hero-menu global-navbar__menu ${open ? "is-open" : ""}`} type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}><span /><span /><span /></button>
    <div className={`hero-menu-panel global-navbar__panel ${open ? "is-open" : ""}`} aria-hidden={!open}><nav aria-label="Main menu">{["Services", "Works", "Contact", "Pricing"].map((item) => <a className={item === "Services" ? "is-current" : ""} key={item} href={item === "Services" ? `/${locale}#services` : "#"} onClick={item === "Services" ? () => setOpen(false) : (event) => event.preventDefault()} tabIndex={open ? 0 : -1}>{item}</a>)}</nav></div>
  </header>;
}
