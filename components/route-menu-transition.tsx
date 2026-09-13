"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function RouteMenuTransition({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const start = (event: Event) => {
      const href = (event as CustomEvent<string>).detail;
      if (!href) return;
      setClosing(false);
      setOpen(true);
      router.push(href);
    };
    window.addEventListener("menu-route-transition", start);
    return () => window.removeEventListener("menu-route-transition", start);
  }, [router]);

  useEffect(() => {
    if (!open || !pathname.endsWith("/services")) return;
    const closeTimer = window.setTimeout(() => setClosing(true), 100);
    const removeTimer = window.setTimeout(() => setOpen(false), 1000);
    return () => { window.clearTimeout(closeTimer); window.clearTimeout(removeTimer); };
  }, [open, pathname]);

  if (!open) return null;
  return <div className={`route-menu-transition ${closing ? "is-closing" : ""}`}>
    <button className="hero-menu is-open route-menu-transition__button" type="button" aria-label="Close menu" onClick={() => setOpen(false)}><span /><span /><span /></button>
    <div className="hero-menu-panel is-open route-menu-transition__panel"><nav aria-label="Main menu">{["Services", "Works", "Contact", "Pricing"].map((item) => <a className={item === "Services" ? "is-current" : ""} key={item} href={item === "Services" ? `/${locale}/services` : "#"}>{item}</a>)}</nav></div>
  </div>;
}
