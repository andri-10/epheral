import { Gauge, ScanLine, Sparkles } from "lucide-react";
import type { Dictionary } from "@/i18n/types";

const icons = [Sparkles, ScanLine, Gauge];

export function PrinciplesSection({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="principles-band">
      <div className="section principles-inner">
        <div className="section-heading" data-reveal><span className="eyebrow">03 · {dictionary.principles.eyebrow}</span><h2>{dictionary.principles.title}</h2><p>{dictionary.principles.intro}</p></div>
        <div className="principles-grid">
          {dictionary.principles.items.map((item, index) => { const Icon = icons[index]; return <article key={item.title} data-reveal><Icon aria-hidden="true" size={22} strokeWidth={1.5} /><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.copy}</p></article>; })}
        </div>
        <div className="signal-row" data-reveal>{dictionary.principles.signals.map((signal) => <span key={signal}>{signal}</span>)}</div>
        <p className="performance-target" data-reveal>{dictionary.principles.targets}</p>
      </div>
    </section>
  );
}
