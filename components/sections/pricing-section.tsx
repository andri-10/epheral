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
    if (!section || !viewport || !wrapper) return;
    const cards = Array.from(wrapper.querySelectorAll<HTMLElement>(".service-item"));
    const desktopMotion = window.matchMedia("(min-width: 1200px) and (prefers-reduced-motion: no-preference)");
    let dispose = () => {};

    const setup = () => {
      dispose();
      dispose = () => {};
      if (!desktopMotion.matches) return;

      const getDistance = () => viewport.clientHeight * (cards.length - 1);
      const updateDistance = () => section.style.setProperty("--pricing-scroll-distance", `${getDistance()}px`);
      updateDistance();

      const context = gsap.context(() => {
        const gap = 24;
        const trackWidth = () => wrapper.clientWidth;
        const finalWidth = () => (trackWidth() - gap * (cards.length - 1)) / cards.length;
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
        }
      }, section);

      let refreshFrame = 0;
      const refresh = () => {
        window.cancelAnimationFrame(refreshFrame);
        refreshFrame = window.requestAnimationFrame(() => {
          updateDistance();
          ScrollTrigger.refresh();
        });
      };
      const hero = document.querySelector<HTMLElement>(".living-story");
      const observer = new ResizeObserver(refresh);
      if (hero) observer.observe(hero);
      observer.observe(viewport);
      window.addEventListener("resize", refresh);
      dispose = () => {
        window.cancelAnimationFrame(refreshFrame);
        window.removeEventListener("resize", refresh);
        observer.disconnect();
        context.revert();
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
        <div className="services-reveal__scene" aria-hidden="true"><div className="orange-grain" /></div>
        <div className="pricing-section__intro">
          <h2 id="pricing-title">{dictionary.pricing.title}</h2>
        </div>
        <div className="services-wrapper" ref={wrapperRef}>
          {dictionary.pricing.items.map((card, index) => (
            <article className={`service-item ${index === 0 ? "service-item--featured" : ""}`} key={card.tier}>
              <div className="service-item__content">
                <div className="service-item__top">
                  <span className="service-item__tier">{card.tier}</span>
                  <h3>{card.headline}</h3>
                  <p className="service-item__price">{card.price}</p>
                  {card.priceNote && <p className="service-item__price-note">{card.priceNote}</p>}
                </div>
                <ul className="service-item__features">{card.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                <p className="service-item__tags">{card.tags}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
