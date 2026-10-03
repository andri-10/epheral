"use client";

import type { Dictionary } from "@/i18n/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitch } from "@/components/language-switch";
import { MenuLinks } from "@/components/menu-links";
import type { Locale } from "@/content/site-config";
import webExperience from "@/public/services/web_experience.png";
import digitalMenu from "@/public/services/digital_menu.png";
import reviewsAndReputation from "@/public/services/reviews_and_reputation.png";
import searchAndDiscovery from "@/public/services/search_and_discovery.png";

const visualTransitionDuration = 2200;

// Each word sits in a clipping span so it can rise into place when its block is revealed.
function RevealWords({ text, offset = 0 }: { text: string; offset?: number }) {
  return <>{text.split(" ").map((word, index) => <span key={`${word}-${index}`}><span className="reveal-word" style={{ "--word-index": index + offset } as React.CSSProperties}><span>{word}</span></span>{" "}</span>)}</>;
}

export function ServicesSection({ dictionary, locale, embedded = false }: { dictionary: Dictionary; locale: Locale; embedded?: boolean }) {
  const serviceTitles = dictionary.services.items.map((item) => item.title);
  const categories = serviceTitles.map((title) => title.toLocaleUpperCase(locale));
  const serviceImages = [webExperience.src, digitalMenu.src, reviewsAndReputation.src, searchAndDiscovery.src];
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [previousVisualCategory, setPreviousVisualCategory] = useState<number | null>(null);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const visualRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const activeVisualCategory = useRef(0);
  useEffect(() => {
    const previousCategory = activeVisualCategory.current;
    if (previousCategory === selectedCategory) return;
    setPreviousVisualCategory(previousCategory);
    activeVisualCategory.current = selectedCategory;
    const timeout = window.setTimeout(() => setPreviousVisualCategory(null), visualTransitionDuration);
    return () => window.clearTimeout(timeout);
  }, [selectedCategory]);
  useEffect(() => {
    // On phones the categories become a horizontal strip; keep the current one in view.
    const sidebar = sidebarRef.current;
    const link = sidebar?.querySelectorAll("a")[selectedCategory];
    if (!sidebar || !link || sidebar.scrollWidth <= sidebar.clientWidth) return;
    sidebar.scrollTo({ left: link.offsetLeft - Number.parseFloat(getComputedStyle(sidebar).paddingLeft), behavior: "smooth" });
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
    {!embedded && <><div className="services-page__chrome"><BrandLogo priority /><button className={`hero-menu services-page__menu-button ${menuOpen ? "is-open" : ""}`} type="button" aria-label={menuOpen ? dictionary.nav.close : dictionary.nav.menu} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button></div>
    <div className={`hero-menu-panel ${menuOpen ? "is-open" : ""}`} inert={!menuOpen}><MenuLinks locale={locale} dictionary={dictionary} current="services" onNavigate={() => setMenuOpen(false)} /><LanguageSwitch locale={locale} label={dictionary.nav.language} /></div></>}
    <div className="services-page__heading" data-reveal><h2 className="text-balance">{dictionary.services.title.split("\n").map((line, index, lines) => <span key={line}><RevealWords text={line} offset={lines.slice(0, index).join(" ").split(" ").filter(Boolean).length} />{index < lines.length - 1 && <br />}</span>)}</h2></div>
    <div className="services-page__grid">
      <aside ref={sidebarRef} className="services-page__sidebar" data-reveal><nav>{categories.map((category, index) => <a className={index === selectedCategory ? "is-current" : ""} key={category} href={`#service-${index + 1}`} onClick={() => setSelectedCategory(index)}><span>0{index + 1}</span><span className="services-page__category-name">{category}</span></a>)}</nav></aside>
      <div className="services-page__content">{dictionary.services.items.map((item, index) => <article id={`service-${index + 1}`} data-service-index={index} ref={(element) => { articleRefs.current[index] = element; }} key={item.title} data-reveal><div className="services-page__article-visual" aria-hidden="true"><Image src={serviceImages[index]} alt="" width={1254} height={1254} sizes="(max-width: 1199px) 360px, 1px" /></div><h3><RevealWords text={serviceTitles[index]} /></h3><p>{item.copy}</p><ul>{item.includes.map((entry, entryIndex) => <li key={entry} style={{ "--item-index": entryIndex } as React.CSSProperties}>{entry}</li>)}</ul></article>)}</div>
      <aside ref={visualRef} className="services-page__visual" data-reveal aria-label={serviceTitles[selectedCategory]}><div className="services-page__visual-frame">{previousVisualCategory !== null && <Image key={`outgoing-${serviceImages[previousVisualCategory]}`} className="services-page__visual-image is-outgoing" src={serviceImages[previousVisualCategory]} alt="" width={1200} height={1200} sizes="(min-width: 1200px) 60vw, 0px" aria-hidden="true" />}<Image key={`incoming-${serviceImages[selectedCategory]}`} className="services-page__visual-image is-incoming" src={serviceImages[selectedCategory]} alt={serviceTitles[selectedCategory]} width={1200} height={1200} sizes="(min-width: 1200px) 60vw, 0px" /></div></aside>
    </div>
  </section>;
}
