"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useState } from "react";
import { rememberPendingSection, scrollToSection, takePendingSection } from "@/lib/section-nav";

export function LaunchIntro() {
  const [phase, setPhase] = useState<"revealing" | "moving" | "done">("revealing");

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    if (window.location.hash) {
      rememberPendingSection(window.location.hash);
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const beginMove = () => {
    if (phase !== "revealing") return;
    setPhase("moving");
    window.setTimeout(() => {
      document.body.classList.add("launch-complete");
      document.body.classList.remove("has-launch-intro");
      window.dispatchEvent(new Event("launch-complete"));
      const pending = takePendingSection();
      if (pending) window.requestAnimationFrame(() => scrollToSection(pending, "instant"));
      setPhase("done");
    }, 1080);
  };

  useEffect(() => {
    if (phase === "done") return;
    document.body.classList.add("has-launch-intro");
    return () => document.body.classList.remove("has-launch-intro");
  }, [phase]);

  if (phase === "done") return null;
  return <div className={`launch-intro launch-intro--${phase}`}><div className="launch-logo" onAnimationEnd={beginMove}><Image src="/brand/epheral_dark_background.png" alt="" width={1274} height={637} priority /></div></div>;
}
