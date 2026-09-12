import type { Locale } from "./site-config";

export type Project = {
  slug: string;
  featured: boolean;
  index: string;
  title: Record<Locale, string>;
  category: Record<Locale, string>;
  summary: Record<Locale, string>;
  context: Record<Locale, string>;
  objective: Record<Locale, string>;
  direction: Record<Locale, string>;
  deliverables: Record<Locale, string[]>;
  tone: "sage" | "coral" | "blue" | "gold";
};

export const projects: Project[] = [
  {
    slug: "pilates-studio",
    featured: true,
    index: "01",
    title: { sq: "Studio Pilates", en: "Pilates Studio" },
    category: { sq: "Mirëqenie dhe lëvizje", en: "Wellness and movement" },
    summary: {
      sq: "Një drejtim i qetë vizual dhe rrjedhë rezervimi për një studio që e vendos kujdesin në qendër.",
      en: "A calm visual direction and booking flow for a studio built around considered care.",
    },
    context: {
      sq: "Një koncept i redaktueshëm për një studio Pilates që ka nevojë për të njëjtën qartësi online që ofron në hapësirën fizike.",
      en: "An editable concept for a Pilates studio that needs the same clarity online as it offers in its physical space.",
    },
    objective: {
      sq: "Të organizojë ofertën, oraret dhe rezervimin në një rrugë të thjeshtë për klientin.",
      en: "Organize the offer, schedule and booking into one simple path for the client.",
    },
    direction: {
      sq: "Tipografi e përmbajtur, ritëm i butë dhe ndërveprime që e mbajnë përmbajtjen në plan të parë.",
      en: "Restrained typography, gentle rhythm and interactions that keep the content in focus.",
    },
    deliverables: {
      sq: ["Drejtim marke", "Strategji faqeje", "Dizajn ndërfaqeje", "Rrjedhë rezervimi"],
      en: ["Brand direction", "Website strategy", "Interface design", "Booking flow"],
    },
    tone: "sage",
  },
  {
    slug: "brunch-cafe",
    featured: true,
    index: "02",
    title: { sq: "Kafe Brunch", en: "Brunch Café" },
    category: { sq: "Mikpritje dhe ushqim", en: "Hospitality and food" },
    summary: {
      sq: "Një faqe e ngrohtë dhe e drejtpërdrejtë që e bën menunë, atmosferën dhe vizitën të lehta për t’u kuptuar.",
      en: "A warm, direct website that makes the menu, atmosphere and visit easy to understand.",
    },
    context: {
      sq: "Një koncept i redaktueshëm për një kafene që mbështetet te produkti, vendi dhe klientët e rregullt.",
      en: "An editable concept for a café built around its product, place and returning customers.",
    },
    objective: {
      sq: "Të sjellë karakterin e ambientit online dhe t’i çojë vizitorët shpejt te menuja dhe vendndodhja.",
      en: "Bring the character of the space online and move visitors quickly to the menu and location.",
    },
    direction: {
      sq: "Kompozim editorial, ritëm energjik dhe detaje të frymëzuara nga menuja e printuar.",
      en: "Editorial composition, energetic pacing and details informed by the printed menu.",
    },
    deliverables: {
      sq: ["Hierarki përmbajtjeje", "Drejtim vizual", "Dizajn responsiv", "Zhvillim frontend"],
      en: ["Content hierarchy", "Visual direction", "Responsive design", "Frontend development"],
    },
    tone: "coral",
  },
  {
    slug: "law-service",
    featured: true,
    index: "03",
    title: { sq: "Shërbim Ligjor", en: "Law Service" },
    category: { sq: "Shërbime profesionale", en: "Professional services" },
    summary: {
      sq: "Një prani e besueshme që shpjegon ekspertizën pa zhurmë dhe e bën kontaktin të qartë.",
      en: "A credible presence that explains expertise without noise and makes enquiry straightforward.",
    },
    context: {
      sq: "Një koncept i redaktueshëm për një praktikë ligjore që duhet të komunikojë seriozitet dhe afërsi njëkohësisht.",
      en: "An editable concept for a legal practice that needs to communicate rigour and approachability at once.",
    },
    objective: {
      sq: "Të qartësojë fushat e shërbimit dhe ta bëjë hapin e parë më të lehtë për klientin e mundshëm.",
      en: "Clarify service areas and make the first step easier for a prospective client.",
    },
    direction: {
      sq: "Strukturë e matur, gjuhë e saktë dhe tipografi me autoritet pa u bërë e ftohtë.",
      en: "Measured structure, precise language and typography with authority that does not feel cold.",
    },
    deliverables: {
      sq: ["Strategji faqeje", "Arkitekturë UX", "Dizajn ndërfaqeje", "Rrjedhë kontakti"],
      en: ["Website strategy", "UX architecture", "Interface design", "Enquiry flow"],
    },
    tone: "blue",
  },
  {
    slug: "academy",
    featured: false,
    index: "04",
    title: { sq: "Akademi", en: "Academy" },
    category: { sq: "Arsim dhe zhvillim", en: "Education and growth" },
    summary: {
      sq: "Një sistem i qartë për të prezantuar programet, pedagogët dhe rrugën drejt regjistrimit.",
      en: "A clear system for presenting programmes, educators and the path to enrolment.",
    },
    context: {
      sq: "Një koncept i redaktueshëm për një biznes edukimi me disa programe dhe audienca.",
      en: "An editable concept for an education business with several programmes and audiences.",
    },
    objective: {
      sq: "Të ndajë programet qartë dhe t’u japë studentëve informacionin e duhur para aplikimit.",
      en: "Separate programmes clearly and give students the right information before applying.",
    },
    direction: {
      sq: "Sistem modular, navigim i qartë dhe vend për përmbajtje që mund të zgjerohet.",
      en: "A modular system, clear navigation and room for content that can grow.",
    },
    deliverables: {
      sq: ["Strategji përmbajtjeje", "Arkitekturë faqesh", "Sistem vizual", "Mbështetje publikimi"],
      en: ["Content strategy", "Page architecture", "Visual system", "Launch support"],
    },
    tone: "gold",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
