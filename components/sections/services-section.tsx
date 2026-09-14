"use client";

import type { Dictionary } from "@/i18n/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

export function ServicesSection({ dictionary, locale, embedded = false }: { dictionary: Dictionary; locale: string; embedded?: boolean }) {
  const categories = ["WEB EXPERIENCE", "DIGITAL MENUS", "REVIEWS & REPUTATION", "SEARCH & DISCOVERY"];
  const serviceTitles = ["Web Experience", "Digital Menus", "Reviews & Reputation", "Search & Discovery"];
  const serviceImages = ["web_experience.png", "digital_menu.png", "reviews_and_reputation.png", "search_and_discovery.png"];
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [previousVisualCategory, setPreviousVisualCategory] = useState<number | null>(null);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const visualRef = useRef<HTMLElement>(null);
  const activeVisualCategory = useRef(0);
  useEffect(() => {
    const previousCategory = activeVisualCategory.current;
    if (previousCategory === selectedCategory) return;
    setPreviousVisualCategory(previousCategory);
    activeVisualCategory.current = selectedCategory;
    const timeout = window.setTimeout(() => setPreviousVisualCategory(null), 1250);
    return () => window.clearTimeout(timeout);
  }, [selectedCategory]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Number((entry.target as HTMLElement).dataset.serviceIndex);
        if (Number.isInteger(index)) setSelectedCategory(index);
      });
    }, { rootMargin: "-42% 0px -42% 0px", threshold: 0.01 });
    articleRefs.current.forEach((article) => article && observer.observe(article));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const visual = visualRef.current;
    if (!visual) return;
    const updateParallax = () => {
      const distance = (window.innerHeight * 0.5 - visual.getBoundingClientRect().top) * 0.04;
      visual.style.setProperty("--services-parallax-y", `${Math.max(-24, Math.min(24, distance))}px`);
    };
    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    return () => window.removeEventListener("scroll", updateParallax);
  }, []);
  return <section className={`services-page grid-12-vars ${embedded ? "services-page--embedded" : ""}`} id="services">
    {!embedded && <><div className="services-page__chrome"><BrandLogo priority /><button className={`hero-menu services-page__menu-button ${menuOpen ? "is-open" : ""}`} type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button></div>
    <div className={`hero-menu-panel ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}><nav>{["Services", "Works", "Contact", "Pricing"].map((item) => <a className={item === "Services" ? "is-current" : ""} key={item} href={item === "Services" ? `/${locale}#services` : "#"} onClick={item === "Services" ? (event) => { event.preventDefault(); setMenuOpen(false); } : (event) => event.preventDefault()} tabIndex={menuOpen ? 0 : -1}>{item}</a>)}</nav></div></>}
    <div className="services-page__heading" data-reveal><h2 className="text-balance">{dictionary.services.title.split("\n").map((line, index) => <span key={line}>{line}{index < dictionary.services.title.split("\n").length - 1 && <br />}</span>)}</h2></div>
    <div className="services-page__grid">
      <aside className="services-page__sidebar" data-reveal><nav>{categories.map((category, index) => <a className={index === selectedCategory ? "is-current" : ""} key={category} href={`#service-${index + 1}`} onClick={() => setSelectedCategory(index)}><span>0{index + 1}</span><span className="services-page__category-name">{category}</span></a>)}</nav></aside>
      <div className="services-page__content">{dictionary.services.items.map((item, index) => <article id={`service-${index + 1}`} data-service-index={index} ref={(element) => { articleRefs.current[index] = element; }} key={item.title} data-reveal><h3>{serviceTitles[index]}</h3><p>{item.copy}</p><ul>{item.includes.map((entry) => <li key={entry}>{entry}</li>)}</ul></article>)}</div>
      <aside ref={visualRef} className="services-page__visual" data-reveal aria-label={`${serviceTitles[selectedCategory]} image`}><div className="services-page__visual-frame"><Image key={`background-${serviceImages[selectedCategory]}`} className="services-page__visual-background" src={`/services/${serviceImages[selectedCategory]}`} alt="" fill sizes="(min-width: 1200px) 50vw, 0px" aria-hidden="true" />{previousVisualCategory !== null && <Image key={`outgoing-${serviceImages[previousVisualCategory]}`} className="services-page__visual-image is-outgoing" src={`/services/${serviceImages[previousVisualCategory]}`} alt="" width={1200} height={1200} sizes="(min-width: 1200px) 50vw, 0px" aria-hidden="true" />}<Image key={`incoming-${serviceImages[selectedCategory]}`} className="services-page__visual-image is-incoming" src={`/services/${serviceImages[selectedCategory]}`} alt={serviceTitles[selectedCategory]} width={1200} height={1200} sizes="(min-width: 1200px) 50vw, 0px" /></div></aside>
    </div>
  </section>;
}
