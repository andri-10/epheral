"use client";

import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

export function GlobalNavbar({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const homeHref = `/${locale}`;

  const returnHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setOpen(false);
    window.history.replaceState(null, "", homeHref);
    window.location.reload();
  };

  return <header className="global-navbar">
    <a className="global-navbar__home" href={homeHref} aria-label="Return to the Epheral homepage" onClick={returnHome}><BrandLogo priority /></a>
    <button className={`hero-menu global-navbar__menu ${open ? "is-open" : ""}`} type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}><span /><span /><span /></button>
    <div className={`hero-menu-panel global-navbar__panel ${open ? "is-open" : ""}`} aria-hidden={!open}><nav aria-label="Main menu">{["Services", "Works", "Contact", "Pricing"].map((item) => <a className={item === "Services" ? "is-current" : ""} key={item} href={item === "Services" ? `/${locale}#services` : "#"} onClick={item === "Services" ? () => setOpen(false) : (event) => event.preventDefault()} tabIndex={open ? 0 : -1}>{item}</a>)}</nav></div>
  </header>;
}
