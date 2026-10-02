"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Dictionary } from "@/i18n/types";

export function PricingSection({ dictionary }: { dictionary: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const wrapper = wrapperRef.current;
    const worksHeading = section?.querySelector<HTMLElement>(".pricing-section__works-heading");
    if (!section || !viewport || !wrapper || !worksHeading) return;
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
      const trackWidth = () => wrapper.clientWidth;
      const finalWidth = () => (trackWidth() - gap * (cards.length - 1)) / cards.length;
      const getDistance = () => viewport.clientHeight * (cards.length + 1 + cardSettleDuration + headingPauseDuration + headingRevealDuration);
      const mergeInset = () => Math.min(180, Math.max(96, trackWidth() * 0.1));
      const topInset = () => (Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--navbar-height")) || 0) + 24;
      const bottomInset = 32;
      const headingSideInset = 32;
      const panelLeft = () => wrapper.offsetLeft + mergeInset();
      const panelHeight = () => viewport.clientHeight - topInset() - bottomInset;
      const fitWorksHeading = () => {
        // Fit both languages inside the rail beside the panel, below the navbar.
        worksHeading.style.fontSize = "";
        const natural = worksHeading.getBoundingClientRect();
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
      };
      updateGeometry();

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
        const headingLeft = () => (panelLeft() - worksHeading.getBoundingClientRect().width) / 2;
        const headingTop = () => topInset() + (panelHeight() - worksHeading.getBoundingClientRect().height) / 2;

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
        <h2 className="pricing-section__works-heading"><span>{dictionary.pricing.worksHeading}</span></h2>
      </div>
    </section>
  );
}
