"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animationConfig, getFrameSrc } from "@/content/animation-config";
import type { Locale } from "@/content/site-config";
import type { Dictionary } from "@/i18n/types";

type Props = { locale: Locale; dictionary: Dictionary };

export function LivingCanvas({ locale, dictionary }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRefs = useRef<(HTMLElement | null)[]>([]);
  const [desktop, setDesktop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuPanel = (
    <div className={`hero-menu-panel ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
      <nav aria-label="Main menu">
        {["Services", "Works", "Contact", "Pricing"].map((item) => <a key={item} href="#" tabIndex={menuOpen ? 0 : -1} onClick={(event) => event.preventDefault()}>{item}</a>)}
      </nav>
    </div>
  );

  const menuButton = (
    <button className={`hero-menu ${menuOpen ? "is-open" : ""}`} type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
      <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
    </button>
  );

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${animationConfig.desktopMinWidth}px) and (prefers-reduced-motion: no-preference)`);
    const update = () => setDesktop(query.matches && typeof window.requestAnimationFrame === "function" && Boolean(document.createElement("canvas").getContext("2d")));
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!desktop) return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const images = new Map<number, HTMLImageElement>();
    let desiredFrame = 1;
    let drawnFrame = 0;
    let animationFrame = 0;
    let activeStage = -1;
    let introPlayed = false;
    let cancelled = false;
    const idleIds: number[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, animationConfig.maxDevicePixelRatio);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      drawnFrame = 0;
      render();
    };

    const draw = (image: HTMLImageElement, frame: number) => {
      const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      const x = (canvas.width - width) / 2;
      const y = (canvas.height - height) / 2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, x, y, width, height);
      if (frame === 1 && !introPlayed) {
        introPlayed = true;
        canvas.classList.add("is-intro");
        canvas.addEventListener("animationend", () => canvas.classList.remove("is-intro"), { once: true });
      }
      canvas.dataset.drawBounds = [x, y, width, height].map((value) => value.toFixed(2)).join(",");
      canvas.dataset.sourceSize = `${image.naturalWidth},${image.naturalHeight}`;
    };

    const bestAvailable = () => {
      if (images.get(desiredFrame)?.complete) return desiredFrame;
      for (let distance = 1; distance < animationConfig.frameCount; distance += 1) {
        const before = desiredFrame - distance;
        const after = desiredFrame + distance;
        if (before >= 1 && images.get(before)?.complete) return before;
        if (after <= animationConfig.frameCount && images.get(after)?.complete) return after;
      }
      return 1;
    };

    function render() {
      animationFrame = 0;
      const frame = bestAvailable();
      const image = images.get(frame);
      if (image?.complete && image.naturalWidth && (frame !== drawnFrame || drawnFrame === 0)) { draw(image, frame); drawnFrame = frame; }
    }

    const requestRender = () => { if (!animationFrame) animationFrame = requestAnimationFrame(render); };
    const load = (frame: number) => {
      if (images.has(frame) || cancelled) return;
      const image = new window.Image();
      images.set(frame, image);
      image.decoding = "async";
      image.onload = requestRender;
      image.src = getFrameSrc(frame);
    };

    for (let frame = 1; frame <= animationConfig.initialBatchSize; frame += 1) load(frame);
    const scheduleBatch = (start: number) => {
      if (cancelled || start > animationConfig.frameCount) return;
      const run = () => {
        for (let frame = start; frame < start + animationConfig.batchSize && frame <= animationConfig.frameCount; frame += 1) load(frame);
        scheduleBatch(start + animationConfig.batchSize);
      };
      if ("requestIdleCallback" in window) idleIds.push(window.requestIdleCallback(run, { timeout: 900 }));
      else globalThis.setTimeout(run, 120);
    };
    scheduleBatch(animationConfig.initialBatchSize + 1);

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(distance, 1)));
      const frameProgress = Math.min(progress / 0.78, 1);
      const terminalProgress = Math.max(0, Math.min(1, (progress - 0.82) / 0.17));
      section.style.setProperty("--terminal-progress", terminalProgress.toFixed(4));
      section.style.setProperty("--terminal-scale", (1 - terminalProgress * 0.58).toFixed(4));
      desiredFrame = Math.min(animationConfig.frameCount, Math.max(1, Math.round(1 + frameProgress * (animationConfig.frameCount - 1))));
      let nextStage = 0;
      animationConfig.stageFrames.forEach((anchor, index) => { if (desiredFrame >= anchor) nextStage = index; });
      canvas.classList.toggle("is-final-stage", nextStage === animationConfig.stageFrames.length - 1);
      section.classList.toggle("is-terminal", progress >= 0.82);
      section.classList.toggle("is-terminal-complete", progress >= 0.99);
      if (nextStage !== activeStage) {
        activeStage = nextStage;
        copyRefs.current.forEach((node, index) => node?.classList.toggle("is-active", index === activeStage));
      }
      requestRender();
    };

    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      const y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
      section.style.setProperty("--cursor-rotate-y", `${(x * 14).toFixed(2)}deg`);
      section.style.setProperty("--cursor-rotate-x", `${(-y * 10).toFixed(2)}deg`);
      section.style.setProperty("--cursor-layer-x", `${(x * 8).toFixed(2)}px`);
      section.style.setProperty("--cursor-layer-y", `${(y * 5).toFixed(2)}px`);
      section.style.setProperty("--cursor-layer-neg-x", `${(-x * 8).toFixed(2)}px`);
      section.style.setProperty("--cursor-layer-neg-y", `${(-y * 5).toFixed(2)}px`);
    };
    const onPointerLeave = () => {
      section.style.setProperty("--cursor-rotate-y", "0deg");
      section.style.setProperty("--cursor-rotate-x", "0deg");
      section.style.setProperty("--cursor-layer-x", "0px");
      section.style.setProperty("--cursor-layer-y", "0px");
      section.style.setProperty("--cursor-layer-neg-x", "0px");
      section.style.setProperty("--cursor-layer-neg-y", "0px");
    };

    resize(); onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave);
    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
      idleIds.forEach((id) => window.cancelIdleCallback?.(id));
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      images.forEach((image) => { image.onload = null; image.src = ""; });
      images.clear();
    };
  }, [desktop]);

  const stageContent = (index: number) => (
    <>
      {index === 0 ? (
        <><h1>{dictionary.hero.title.split(" ").map((word, wordIndex) => <span className="hero-word" key={`${word}-${wordIndex}`} style={{ animationDelay: `${wordIndex * 150}ms` }}>{word}</span>)}</h1></>
      ) : (
        <><h2 data-text={dictionary.hero.stages[index].line}>{dictionary.hero.stages[index].line}</h2>{index === 5 && <><ArrowDown className="final-stage-arrow" size={42} strokeWidth={1.6} aria-hidden="true" /><Link className="button button--primary terminal-cta" href={`/${locale}#contact`}>{dictionary.common.primaryCta}</Link></>}</>
      )}
    </>
  );

  return (
    <section className={`living-story ${desktop ? "is-desktop" : "is-flow"}`} ref={sectionRef} aria-label={dictionary.hero.eyebrow}>
      {desktop ? (
        <div className="story-sticky">
          {menuButton}
          {menuPanel}
          <div className="hero-orange-scene" aria-hidden="true"><div className="orange-grain" /></div>
          <canvas ref={canvasRef} className="story-canvas" aria-hidden="true" />
          <div className="hero-lightning" aria-hidden="true"><i className="lightning-bolt lightning-bolt--one" /><i className="lightning-bolt lightning-bolt--two" /><i className="lightning-bolt lightning-bolt--three" /><i className="lightning-bolt lightning-bolt--four" /><i className="lightning-bolt lightning-bolt--left-one" /><i className="lightning-bolt lightning-bolt--left-two" /><i className="lightning-bolt lightning-bolt--left-three" /><i className="lightning-bolt lightning-bolt--left-four" /><i className="lightning-glow" /></div>
          <div className="story-copies">
            {dictionary.hero.stages.map((stage, index) => <article key={stage.label} ref={(node) => { copyRefs.current[index] = node; }} className={`story-copy ${index === 0 ? "is-active" : ""} ${index === 5 ? "is-final" : ""}`}>{stageContent(index)}</article>)}
          </div>
        </div>
      ) : (
        <div className="story-flow">
          {menuButton}
          {menuPanel}
          <div className="hero-orange-scene hero-orange-scene--flow" aria-hidden="true"><div className="orange-grain" /></div>
          <div className="hero-lightning hero-lightning--flow" aria-hidden="true"><i className="lightning-bolt lightning-bolt--one" /><i className="lightning-bolt lightning-bolt--three" /><i className="lightning-bolt lightning-bolt--four" /><i className="lightning-bolt lightning-bolt--left-one" /><i className="lightning-bolt lightning-bolt--left-three" /><i className="lightning-bolt lightning-bolt--left-four" /><i className="lightning-glow" /></div>
          <div className="mobile-hero-copy">{stageContent(0)}</div>
          <div className="story-poster" aria-hidden="true"><Image src={getFrameSrc(animationConfig.posterFrame)} alt="" fill priority sizes="(max-width: 1439px) 100vw, 1400px" /></div>
          <div className="mobile-stages">
            {dictionary.hero.stages.slice(1).map((stage, index) => <article data-reveal key={stage.label} className={index === 4 ? "is-final" : ""}><h2>{stage.line}</h2>{index === 4 && <><ArrowDown className="final-stage-arrow" size={42} strokeWidth={1.6} aria-hidden="true" /><Link className="button button--primary terminal-cta" href={`/${locale}#contact`}>{dictionary.common.primaryCta}</Link></>}</article>)}
          </div>
        </div>
      )}
    </section>
  );
}
