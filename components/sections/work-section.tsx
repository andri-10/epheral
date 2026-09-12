import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import type { Locale } from "@/content/site-config";
import type { Dictionary } from "@/i18n/types";
import { ProjectVisual } from "@/components/project-visual";

export function WorkSection({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  return (
    <section className="section work-section" id="work">
      <div className="section-heading" data-reveal><span className="eyebrow">01 · {dictionary.work.eyebrow}</span><h2>{dictionary.work.title}</h2><p>{dictionary.work.intro}</p></div>
      <div className="project-list">
        {projects.filter((project) => project.featured).map((project) => (
          <Link className="project-row" href={`/${locale}/work/${project.slug}`} key={project.slug} data-reveal>
            <div className="project-meta"><span>{project.index}</span><span>{project.category[locale]}</span></div>
            <ProjectVisual tone={project.tone} label={dictionary.common.replaceAsset} />
            <div className="project-copy"><h3>{project.title[locale]}</h3><p>{project.summary[locale]}</p><span className="project-link">{dictionary.work.viewProject}<ArrowUpRight size={16} aria-hidden="true" /></span></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
