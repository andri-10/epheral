import type { Dictionary } from "@/i18n/types";

export function AboutSection({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="section about-section" id="about">
      <div className="about-marker" aria-hidden="true"><span>LC</span><i /></div>
      <div className="about-copy" data-reveal><span className="eyebrow">05 · {dictionary.about.eyebrow}</span><h2>{dictionary.about.title}</h2><p>{dictionary.about.copy}</p><p className="secondary-copy">{dictionary.about.detail}</p></div>
    </section>
  );
}
