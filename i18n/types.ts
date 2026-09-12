export type Dictionary = {
  localeName: string;
  nav: { work: string; services: string; process: string; about: string; contact: string; menu: string; close: string };
  common: { primaryCta: string; secondaryCta: string; learnMore: string; nextProject: string; backHome: string; replaceAsset: string };
  hero: {
    eyebrow: string;
    title: string;
    support: string;
    stages: { label: string; line: string }[];
    scroll: string;
  };
  work: { eyebrow: string; title: string; intro: string; viewProject: string };
  services: { eyebrow: string; title: string; items: { title: string; copy: string; includes: string[] }[] };
  principles: { eyebrow: string; title: string; intro: string; items: { title: string; copy: string }[]; signals: string[]; targets: string };
  process: { eyebrow: string; title: string; intro: string; items: { title: string; copy: string }[] };
  about: { eyebrow: string; title: string; copy: string; detail: string };
  contact: {
    eyebrow: string; title: string; intro: string; name: string; email: string; business: string; brief: string; budget: string; timeline: string;
    optional: string; consent: string; submit: string; sending: string; success: string; unavailable: string; error: string;
    budgetOptions: string[]; timelineOptions: string[];
    validation: { required: string; email: string; consent: string; tooLong: string };
  };
  footer: { line: string; navigation: string; social: string; availability: string };
  project: { context: string; objective: string; direction: string; deliverables: string; placeholder: string; contactLine: string };
  metadata: { title: string; description: string };
};
