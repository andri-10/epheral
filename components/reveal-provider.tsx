"use client";

import { useEffect } from "react";

export function RevealProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let observer: IntersectionObserver | null = null;
    const start = () => {
      window.requestAnimationFrame(() => {
        const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer?.unobserve(entry.target); } });
        }, { rootMargin: "0px 0px -8%", threshold: 0.12 });
        nodes.forEach((node) => observer?.observe(node));
      });
    };
    if (document.body.classList.contains("launch-complete")) start();
    else window.addEventListener("launch-complete", start, { once: true });
    return () => {
      window.removeEventListener("launch-complete", start);
      observer?.disconnect();
    };
  }, []);
  return null;
}
