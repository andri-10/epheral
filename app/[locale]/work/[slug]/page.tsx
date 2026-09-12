import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { isLocale, siteConfig } from "@/content/site-config";
import { getDictionary } from "@/i18n";
import { Footer } from "@/components/footer";
import { ProjectVisual } from "@/components/project-visual";
import { ArrowLink } from "@/components/ui/arrow-link";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return siteConfig.locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = getProject(slug);
  if (!project) return {};
  const url = `${siteConfig.url}/${locale}/work/${slug}`;
  return { title: `${project.title[locale]} — ${siteConfig.name}`, description: project.summary[locale], alternates: { canonical: url, languages: { sq: `${siteConfig.url}/sq/work/${slug}`, en: `${siteConfig.url}/en/work/${slug}` } } };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = getProject(slug);
  if (!project) notFound();
  const dictionary = getDictionary(locale);
  const currentIndex = projects.findIndex((entry) => entry.slug === slug);
  const next = projects[(currentIndex + 1) % projects.length];
  return (
    <><main id="main-content" className="project-page">
      <header className="project-hero"><div className="project-kicker"><Link href={`/${locale}#work`}><ArrowLeft size={16} aria-hidden="true" />{dictionary.common.backHome}</Link><span>{project.index} / 04</span></div><div className="project-title"><span className="eyebrow">{project.category[locale]}</span><h1>{project.title[locale]}</h1><p>{project.summary[locale]}</p></div></header>
      <div className="project-page-visual"><ProjectVisual tone={project.tone} label={dictionary.common.replaceAsset} /></div>
      <p className="placeholder-note">{dictionary.project.placeholder}</p>
      <section className="case-grid"><article><span className="eyebrow">01 · {dictionary.project.context}</span><p>{project.context[locale]}</p></article><article><span className="eyebrow">02 · {dictionary.project.objective}</span><p>{project.objective[locale]}</p></article><article><span className="eyebrow">03 · {dictionary.project.direction}</span><p>{project.direction[locale]}</p></article><article><span className="eyebrow">04 · {dictionary.project.deliverables}</span><ul>{project.deliverables[locale].map((item) => <li key={item}>{item}</li>)}</ul></article></section>
      <section className="next-project"><div><span className="eyebrow">{dictionary.project.contactLine}</span><ArrowLink href={`/${locale}#contact`}>{dictionary.common.primaryCta}</ArrowLink></div><Link href={`/${locale}/work/${next.slug}`}><span>{dictionary.common.nextProject}</span><strong>{next.title[locale]}</strong><ArrowRight aria-hidden="true" /></Link></section>
    </main><Footer locale={locale} dictionary={dictionary} /></>
  );
}
