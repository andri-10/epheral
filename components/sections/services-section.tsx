"use client";

import type { Dictionary } from "@/i18n/types";
import Image from "next/image";
import { useState } from "react";

export function ServicesSection({ dictionary, locale }: { dictionary: Dictionary; locale: string }) {
  const categories = ["WEB EXPERIENCES", "DIGITAL MENUS", "REVIEWS & REPUTATION", "SEARCH & DISCOVERY"];
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  return <section className="services-page grid-12-vars" id="services">
    <div className="services-page__chrome"><Image src="/brand/epheral_dark_background.png" alt="Epheral" width={1274} height={637} priority /><button className={`hero-menu services-page__menu-button ${menuOpen ? "is-open" : ""}`} type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button></div>
    <div className={`hero-menu-panel ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}><nav>{["Services", "Works", "Contact", "Pricing"].map((item) => <a className={item === "Services" ? "is-current" : ""} key={item} href={item === "Services" ? `/${locale}/services` : "#"} onClick={item === "Services" ? (event) => { event.preventDefault(); setMenuOpen(false); } : (event) => event.preventDefault()} tabIndex={menuOpen ? 0 : -1}>{item}</a>)}</nav></div>
    <div className="services-page__heading" data-reveal><h2>{dictionary.services.title.split("\n").map((line, index) => <span key={line}>{line}{index < dictionary.services.title.split("\n").length - 1 && <br />}</span>)}</h2></div>
    <div className="services-page__grid">
      <aside className="services-page__sidebar" data-reveal><nav>{categories.map((category, index) => <a className={index === selectedCategory ? "is-current" : ""} key={category} href={`#service-${index + 1}`} onClick={() => setSelectedCategory(index)}><span>0{index + 1}</span><span className="services-page__category-name">{category}</span></a>)}</nav></aside>
      <div className="services-page__content">{dictionary.services.items.map((item, index) => <article id={`service-${index + 1}`} key={item.title} data-reveal><h3>{categories[index]}</h3><p>{item.copy}</p><ul>{item.includes.map((entry) => <li key={entry}>{entry}</li>)}</ul></article>)}</div>
      <aside className="services-page__visual" data-reveal aria-label="Service image placeholder" />
    </div>
  </section>;
}
