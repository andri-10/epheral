"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function LaunchIntro() {
  const [phase, setPhase] = useState<"revealing" | "moving" | "done">("revealing");

  useEffect(() => {
    if (window.sessionStorage.getItem("epheral-reset-scroll") !== "true") return;
    window.sessionStorage.removeItem("epheral-reset-scroll");
    window.scrollTo(0, 0);
  }, []);

  const beginMove = () => {
    if (phase !== "revealing") return;
    setPhase("moving");
    window.setTimeout(() => {
      document.body.classList.add("launch-complete");
      document.body.classList.remove("has-launch-intro");
      window.dispatchEvent(new Event("launch-complete"));
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
