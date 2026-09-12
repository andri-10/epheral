import type { Dictionary } from "@/i18n/types";

export function ServicesSection({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="section services-section" id="services">
      <div className="section-heading section-heading--split" data-reveal><span className="eyebrow">02 · {dictionary.services.eyebrow}</span><h2>{dictionary.services.title}</h2></div>
      <div className="service-list">
        {dictionary.services.items.map((item, index) => <article key={item.title} data-reveal><span className="item-number">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.copy}</p><ul>{item.includes.map((entry) => <li key={entry}>{entry}</li>)}</ul></div></article>)}
      </div>
    </section>
  );
}
