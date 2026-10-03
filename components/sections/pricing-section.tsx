"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Dictionary } from "@/i18n/types";
import { WorksGallery } from "@/components/sections/works-gallery";
import { ClosingSection } from "@/components/sections/closing-section";
import type { Locale } from "@/content/site-config";

export function PricingSection({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const wrapper = wrapperRef.current;
    const worksHeading = section?.querySelector<HTMLElement>(".pricing-section__works-heading");
    const worksGallery = section?.querySelector<HTMLElement>(".works-gallery");
    const closing = section?.querySelector<HTMLElement>(".closing-section");
    if (!section || !viewport || !wrapper || !worksHeading || !worksGallery || !closing) return;
    const cards = Array.from(wrapper.querySelectorAll<HTMLElement>(".service-item"));
    const desktopMotion = window.matchMedia("(min-width: 1200px) and (prefers-reduced-motion: no-preference)");
    let dispose = () => {};

    const setup = () => {
      dispose();
      dispose = () => {};
      if (!desktopMotion.matches) return;

      const gap = 24;
      const cardSettleDuration = 0.45;
      const headingPauseDuration = 0.35;
      const headingRevealDuration = 0.8;
      const worksHoldDuration = 0.6;
      const collapseDuration = 1.1;
      const closingHoldDuration = 0.8;
      const worksEnd = cards.length + 1 + cardSettleDuration + headingPauseDuration + headingRevealDuration;
      const trackWidth = () => wrapper.clientWidth;
      const finalWidth = () => (trackWidth() - gap * (cards.length - 1)) / cards.length;
      const getDistance = () => viewport.clientHeight * (worksEnd + worksHoldDuration + collapseDuration + closingHoldDuration);
      const mergeInset = () => Math.min(180, Math.max(96, trackWidth() * 0.1));
      const topInset = () => (Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--navbar-height")) || 0) + 24;
      const bottomInset = 32;
      const headingSideInset = 32;
      const panelLeft = () => wrapper.offsetLeft + mergeInset();
      const panelHeight = () => viewport.clientHeight - topInset() - bottomInset;
      const collapsedHeight = () => {
        const style = getComputedStyle(worksGallery);
        const padding = Number.parseFloat(style.paddingTop);
        const rowGap = Number.parseFloat(style.rowGap);
        const firstRow = (panelHeight() - padding * 2 - rowGap) / 2;
        // Same space below the remaining row as above it.
        return padding + firstRow + padding;
      };
      const fitWorksHeading = () => {
        // Fit both languages inside the rail beside the panel, below the navbar.
        worksHeading.style.fontSize = "";
        // Undo any collapse scale still applied, or the heading measures smaller than it is.
        const rect = worksHeading.getBoundingClientRect();
        const applied = Number(gsap.getProperty(worksHeading, "scale")) || 1;
        const natural = { width: rect.width / applied, height: rect.height / applied };
        const scale = Math.min(1, panelHeight() / natural.height, (panelLeft() - headingSideInset * 2) / natural.width);
        if (scale < 1) {
          const size = Number.parseFloat(getComputedStyle(worksHeading).fontSize);
          worksHeading.style.fontSize = `${Math.floor(size * scale)}px`;
        }
      };
      const updateGeometry = () => {
        fitWorksHeading();
        section.style.setProperty("--pricing-scroll-distance", `${getDistance()}px`);
        wrapper.style.setProperty("--pricing-card-width", `${finalWidth()}px`);
        viewport.style.setProperty("--works-panel-left", `${panelLeft()}px`);
        viewport.style.setProperty("--closing-top", `${topInset() + collapsedHeight() + 24}px`);
      };
      updateGeometry();
      // Timeline phases (viewport heights past the reveal) where each part is fully on screen, for the menu.
      section.dataset.phasePricing = "0.05";
      section.dataset.phaseWork = String(worksEnd + worksHoldDuration / 2);
      section.dataset.phaseContact = String(worksEnd + worksHoldDuration + collapseDuration + closingHoldDuration / 2);

      const context = gsap.context(() => {
        const prices = cards.map((card) => card.querySelector<HTMLElement>(".service-item__price")!);
        const cardContent = cards.map((card) => card.querySelector<HTMLElement>(".service-item__content")!);
        const intro = section.querySelector<HTMLElement>(".pricing-section__intro")!;
        const palette = getComputedStyle(section);
        const warmSurface = palette.getPropertyValue("--light").trim();
        const darkInk = palette.getPropertyValue("--dark").trim();
        gsap.set(cards, { backgroundColor: warmSurface, color: darkInk, zIndex: (index) => cards.length - index });
        gsap.set(prices, { backgroundColor: darkInk, color: warmSurface, visibility: "hidden" });
        gsap.set(cards[0], { backgroundColor: darkInk, color: warmSurface });
        gsap.set(prices[0], { backgroundColor: warmSurface, color: darkInk, visibility: "visible" });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: () => `top+=${window.innerHeight} top`,
            end: () => `+=${getDistance()}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        for (let index = 1; index < cards.length; index += 1) {
          const phase = index - 1;
          const isLastCard = index === cards.length - 1;
          const handoffDuration = isLastCard ? 0.8 : 1;
          const pricePinProgress = Math.min(0.94, 1 / (cards.length - index));
          timeline.fromTo(cards[index - 1], {
            width: () => trackWidth() - (index - 1) * (finalWidth() + gap),
          }, {
            width: finalWidth,
            duration: 1,
            ease: "none",
            immediateRender: false,
          }, phase);
          timeline.fromTo(cards[index], {
            left: () => trackWidth() + gap,
            width: 0,
          }, {
            left: () => index * (finalWidth() + gap),
            width: () => trackWidth() - index * (finalWidth() + gap),
            duration: 1,
            ease: "none",
            immediateRender: false,
          }, phase);
          timeline.to(cards[index - 1], {
            backgroundColor: warmSurface,
            duration: handoffDuration,
            ease: "none",
          }, phase);
          timeline.to(cards[index], {
            backgroundColor: darkInk,
            duration: handoffDuration,
            ease: "none",
          }, phase);
          timeline.set(cards[index - 1], { color: darkInk }, phase + handoffDuration / 2);
          timeline.set(prices[index - 1], { backgroundColor: darkInk, color: warmSurface }, phase + handoffDuration / 2);
          timeline.set(cards[index], { color: warmSurface }, phase + handoffDuration / 2);
          timeline.set(prices[index], { backgroundColor: warmSurface, color: darkInk }, phase + handoffDuration / 2);
          timeline.set(prices[index], { visibility: "visible" }, phase + pricePinProgress);

          if (isLastCard) {
            timeline.to(cards[index], {
              backgroundColor: warmSurface,
              duration: 0.2,
              ease: "none",
            }, phase + handoffDuration);
            timeline.set(cards[index], { color: darkInk }, phase + handoffDuration + 0.1);
            timeline.set(prices[index], { backgroundColor: darkInk, color: warmSurface }, phase + handoffDuration + 0.1);
          }
        }

        const mergePhase = cards.length - 1 + cardSettleDuration;
        const expandPhase = cards.length + cardSettleDuration;
        // The heading is a viewport child; only the cards use wrapper coordinates.
        // Unscaled (but sub-pixel) size, so a refresh mid-collapse ignores the heading's scale.
        const headingSize = () => {
          const rect = worksHeading.getBoundingClientRect();
          const scale = Number(gsap.getProperty(worksHeading, "scale")) || 1;
          return { width: rect.width / scale, height: rect.height / scale };
        };
        const headingLeft = () => (panelLeft() - headingSize().width) / 2;
        const headingTop = () => topInset() + (panelHeight() - headingSize().height) / 2;

        timeline.set(wrapper, { pointerEvents: "none" }, mergePhase);
        timeline.to([intro, ...cardContent], {
          opacity: 0,
          duration: 1,
          ease: "none",
        }, mergePhase);
        timeline.to(cards, {
          left: mergeInset,
          width: () => trackWidth() - mergeInset(),
          borderRadius: 20,
          duration: 1,
          ease: "power1.inOut",
        }, mergePhase);
        timeline.to(cards, {
          top: () => topInset() - (wrapper.getBoundingClientRect().top - viewport.getBoundingClientRect().top),
          height: panelHeight,
          autoRound: false,
          backgroundColor: darkInk,
          duration: 1,
          ease: "power1.inOut",
        }, expandPhase);
        timeline.fromTo(worksHeading, {
          left: headingLeft,
          top: headingTop,
          x: () => panelLeft() + 24 - headingLeft(),
          opacity: 0,
        }, {
          left: headingLeft,
          top: headingTop,
          autoRound: false,
          x: 0,
          opacity: 1,
          duration: headingRevealDuration,
          ease: "power1.inOut",
        }, expandPhase + 1 + headingPauseDuration);
        const collapsePhase = worksEnd + worksHoldDuration;
        timeline.to(cards, {
          height: collapsedHeight,
          autoRound: false,
          duration: collapseDuration,
          ease: "power1.inOut",
        }, collapsePhase);
        // Clip the empty row while preserving the first row's geometry.
        timeline.fromTo(worksGallery, {
          clipPath: "inset(0px 0px 0px 0px round 20px)",
        }, {
          clipPath: () => `inset(0px 0px ${panelHeight() - collapsedHeight()}px 0px round 20px)`,
          duration: collapseDuration,
          ease: "power1.inOut",
        }, collapsePhase);
        // The heading stays, re-centred on the shorter panel and scaled to fit it.
        timeline.to(worksHeading, {
          top: () => topInset() + (collapsedHeight() - headingSize().height) / 2,
          scale: () => Math.min(1, (collapsedHeight() - headingSideInset * 2) / headingSize().height),
          autoRound: false,
          duration: collapseDuration,
          ease: "power1.inOut",
        }, collapsePhase);
        timeline.fromTo(closing, {
          autoAlpha: 0,
          y: 24,
          pointerEvents: "none",
        }, {
          autoAlpha: 1,
          y: 0,
          pointerEvents: "auto",
          duration: collapseDuration - 0.25,
          ease: "power1.inOut",
        }, collapsePhase + 0.25);
        timeline.to({}, { duration: closingHoldDuration }, collapsePhase + collapseDuration);
        timeline.fromTo(worksGallery, {
          autoAlpha: 0,
          y: 24,
          pointerEvents: "none",
        }, {
          autoAlpha: 1,
          y: 0,
          pointerEvents: "auto",
          duration: headingRevealDuration,
          ease: "power1.inOut",
        }, expandPhase + 1 + headingPauseDuration);
      }, section);

      let refreshFrame = 0;
      const refresh = () => {
        window.cancelAnimationFrame(refreshFrame);
        refreshFrame = window.requestAnimationFrame(() => {
          updateGeometry();
          ScrollTrigger.refresh();
        });
      };
      const hero = document.querySelector<HTMLElement>(".living-story");
      const observer = new ResizeObserver(refresh);
      if (hero) observer.observe(hero);
      observer.observe(viewport);
      window.addEventListener("resize", refresh);
      document.fonts.addEventListener("loadingdone", refresh);
      dispose = () => {
        window.cancelAnimationFrame(refreshFrame);
        window.removeEventListener("resize", refresh);
        document.fonts.removeEventListener("loadingdone", refresh);
        observer.disconnect();
        context.revert();
        worksHeading.style.fontSize = "";
        delete section.dataset.phasePricing;
        delete section.dataset.phaseWork;
        delete section.dataset.phaseContact;
      };
    };

    desktopMotion.addEventListener("change", setup);
    setup();
    return () => {
      desktopMotion.removeEventListener("change", setup);
      dispose();
    };
  }, []);

  return (
    <section className="pricing-section" ref={sectionRef} aria-labelledby="pricing-title">
      <div className="pricing-section__viewport" ref={viewportRef}>
        <div className="pricing-aurora" aria-hidden="true"><span className="pricing-aurora__ribbon" /><div className="orange-grain" /></div>
        {/* Title + price cards: one box so phones can pin it behind services for the reveal; layout-neutral on desktop. */}
        <div className="pricing-section__plans">
          <div className="pricing-section__intro">
            <h2 id="pricing-title">{dictionary.pricing.title}</h2>
          </div>
          <div className="services-wrapper" ref={wrapperRef}>
            {dictionary.pricing.items.map((card, index) => (
              <article className={`service-item ${index === 0 ? "service-item--featured" : ""}`} key={card.headline}>
                <div className="service-item__content">
                  <div className="service-item__top">
                    <h3>{card.headline}</h3>
                    <p className="service-item__price">{card.price}</p>
                  </div>
                  <ul className="service-item__features">{card.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </div>
        <h2 className="pricing-section__works-heading" id="works-title"><span>{dictionary.pricing.worksHeading}</span></h2>
        <WorksGallery />
        <ClosingSection dictionary={dictionary} locale={locale} />
      </div>
    </section>
  );
}
