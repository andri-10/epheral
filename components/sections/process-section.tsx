import type { Dictionary } from "@/i18n/types";

export function ProcessSection({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="section process-section" id="process">
      <div className="section-heading" data-reveal><span className="eyebrow">04 · {dictionary.process.eyebrow}</span><h2>{dictionary.process.title}</h2><p>{dictionary.process.intro}</p></div>
      <ol className="process-list">
        {dictionary.process.items.map((item, index) => <li key={item.title} data-reveal><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.copy}</p></li>)}
      </ol>
    </section>
  );
}
