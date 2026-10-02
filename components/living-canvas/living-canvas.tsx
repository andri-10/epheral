"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animationConfig, getFrameSrc } from "@/content/animation-config";
import type { Locale } from "@/content/site-config";
import type { Dictionary } from "@/i18n/types";

type Props = { locale: Locale; dictionary: Dictionary };

const marqueeItems = ["STRATEGY", "IDENTITY", "WEB DESIGN", "DEVELOPMENT", "MOTION", "CLARITY", "MOMENTUM", "IMPACT"];

function ServicesMarquee() {
  return (
    <div className="services-marquee" aria-hidden="true">
      <div className="services-marquee__track">
        {[0, 1].map((set) => (
          <div className="services-marquee__set" key={set}>
            {[0, 1].flatMap((repeat) => marqueeItems.map((item) => ({ item, repeat }))).map(({ item, repeat }) => (
              <span className="services-marquee__entry" key={`${set}-${repeat}-${item}`}>
                <span>{item}</span><span className="services-marquee__separator">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function FinalArrowField() {
  return <span className="final-arrow-field" aria-hidden="true">{Array.from({ length: 3 }, (_, index) => <i className="final-arrow-field__arrow" key={index} />)}</span>;
}

export function LivingCanvas({ locale, dictionary }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRefs = useRef<(HTMLElement | null)[]>([]);
  const [animated, setAnimated] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const narrow = window.matchMedia(`(max-width: ${animationConfig.desktopMinWidth - 1}px)`);
    const update = () => {
      setAnimated(motion.matches && typeof window.requestAnimationFrame === "function" && Boolean(document.createElement("canvas").getContext("2d")));
      setCompact(narrow.matches);
    };
    update();
    motion.addEventListener("change", update);
    narrow.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      narrow.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (animated) return;
    const finalStage = sectionRef.current?.querySelector<HTMLElement>(".mobile-stages article.is-final");
    if (!finalStage) return;
    const observer = new IntersectionObserver(([entry]) => {
      document.body.classList.toggle("hero-sequence-complete", entry.isIntersecting);
    }, { threshold: 0.6 });
    observer.observe(finalStage);
    return () => {
      observer.disconnect();
      document.body.classList.remove("hero-sequence-complete");
    };
  }, [animated]);

  useEffect(() => {
    if (!animated) return;
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

    // Phones use frames pre-cropped to the device and place it below the copy;
    // wider screens fit the whole frame, which keeps the device to the right of the copy.
    const drawArea = () => compact
      ? { x: canvas.width * 0.05, y: canvas.height * 0.5, width: canvas.width * 0.9, height: canvas.height * 0.46 }
      : { x: 0, y: 0, width: canvas.width, height: canvas.height };

    const draw = (image: HTMLImageElement, frame: number) => {
      const area = drawArea();
      const scale = Math.min(area.width / image.naturalWidth, area.height / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      const x = area.x + (area.width - width) / 2;
      const y = area.y + (area.height - height) / 2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, x, y, width, height);
      if (frame === 1 && !introPlayed && document.body.classList.contains("launch-complete")) {
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
    const onLaunchComplete = () => {
      const firstFrame = images.get(1);
      if (firstFrame?.complete && firstFrame.naturalWidth && drawnFrame === 1) {
        draw(firstFrame, 1);
        drawnFrame = 1;
      }
      requestRender();
    };
    const load = (frame: number) => {
      if (images.has(frame) || cancelled) return;
      const image = new window.Image();
      images.set(frame, image);
      image.decoding = "async";
      image.onload = requestRender;
      image.src = getFrameSrc(frame, compact);
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
      animationConfig.stageFrames.slice(0, -1).forEach((anchor, index) => { if (desiredFrame >= anchor) nextStage = index; });
      if (progress >= 0.82) nextStage = animationConfig.stageFrames.length - 1;
      canvas.classList.toggle("is-final-stage", nextStage === animationConfig.stageFrames.length - 1);
      section.classList.toggle("is-terminal", progress >= 0.82);
      section.classList.toggle("is-terminal-complete", progress >= 0.99);
      document.body.classList.toggle("hero-sequence-complete", progress >= 0.99);
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
    window.addEventListener("launch-complete", onLaunchComplete);
    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave);
    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
      idleIds.forEach((id) => window.cancelIdleCallback?.(id));
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("launch-complete", onLaunchComplete);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      document.body.classList.remove("hero-sequence-complete");
      images.forEach((image) => { image.onload = null; image.src = ""; });
      images.clear();
    };
  }, [animated, compact]);

  const stageContent = (index: number) => (
    <>
      {index === 0 ? (
        <><h1>{dictionary.hero.title.split("\n").map((line, lineIndex) => <span className="hero-line" key={line}>{line.split(" ").map((word, wordIndex) => <span className="hero-word" key={`${word}-${wordIndex}`} style={{ animationDelay: `${(lineIndex * 4 + wordIndex) * 150}ms` }}>{word}</span>)}</span>)}</h1></>
      ) : (
        <><h2 data-text={dictionary.hero.stages[index].line}>{dictionary.hero.stages[index].line}</h2>{index === dictionary.hero.stages.length - 1 && <><FinalArrowField /><Link className="button button--primary terminal-cta" href={`/${locale}#services`}>{dictionary.common.primaryCta}</Link></>}</>
      )}
    </>
  );

  return (
    <section className={`living-story ${animated ? "is-sequence" : "is-flow"} ${compact ? "is-compact" : ""}`} ref={sectionRef} aria-label={dictionary.hero.eyebrow}>
      {animated ? (
        <div className="story-sticky">
          <div className="hero-orange-scene" aria-hidden="true"><div className="orange-grain" /></div>
          <canvas ref={canvasRef} className="story-canvas" aria-hidden="true" />
          <div className="hero-lightning" aria-hidden="true"><i className="lightning-bolt lightning-bolt--one" /><i className="lightning-bolt lightning-bolt--two" /><i className="lightning-bolt lightning-bolt--three" /><i className="lightning-bolt lightning-bolt--four" /><i className="lightning-bolt lightning-bolt--left-one" /><i className="lightning-bolt lightning-bolt--left-two" /><i className="lightning-bolt lightning-bolt--left-three" /><i className="lightning-bolt lightning-bolt--left-four" /><i className="lightning-glow" /></div>
          <div className="story-copies">
            {dictionary.hero.stages.map((stage, index) => <article key={stage.label} ref={(node) => { copyRefs.current[index] = node; }} className={`story-copy ${index === 0 ? "is-active" : ""} ${index === dictionary.hero.stages.length - 1 ? "is-final" : ""}`}>{stageContent(index)}</article>)}
          </div>
        </div>
      ) : (
        <div className="story-flow">
          <div className="hero-orange-scene hero-orange-scene--flow" aria-hidden="true"><div className="orange-grain" /></div>
          <div className="hero-lightning hero-lightning--flow" aria-hidden="true"><i className="lightning-bolt lightning-bolt--one" /><i className="lightning-bolt lightning-bolt--three" /><i className="lightning-bolt lightning-bolt--four" /><i className="lightning-bolt lightning-bolt--left-one" /><i className="lightning-bolt lightning-bolt--left-three" /><i className="lightning-bolt lightning-bolt--left-four" /><i className="lightning-glow" /></div>
          <div className="mobile-hero-copy">{stageContent(0)}</div>
          <div className="story-poster" aria-hidden="true"><Image src={getFrameSrc(animationConfig.posterFrame)} alt="" fill priority sizes="(max-width: 1439px) 100vw, 1400px" /></div>
          <div className="mobile-stages">
            {dictionary.hero.stages.slice(1).map((stage, index) => <article data-reveal key={stage.label} className={index === dictionary.hero.stages.length - 2 ? "is-final" : ""}><h2>{stage.line}</h2>{index === dictionary.hero.stages.length - 2 && <><FinalArrowField /><Link className="button button--primary terminal-cta" href={`/${locale}#services`}>{dictionary.common.primaryCta}</Link></>}</article>)}
          </div>
        </div>
      )}
      <ServicesMarquee />
    </section>
  );
}
