import type { Dictionary } from "./types";

export const en: Dictionary = {
  localeName: "English",
  nav: { work: "Work", services: "Services", process: "Process", about: "About", contact: "Contact", menu: "Open menu", close: "Close menu" },
  common: { primaryCta: "Start a conversation", secondaryCta: "View selected work", learnMore: "View project", nextProject: "Next project", backHome: "Back to home", replaceAsset: "Project visual — replace with final asset" },
  hero: {
    eyebrow: "Independent design and development studio",
    title: "Make your business feel as good online as it does in real life.",
    support: "Distinctive websites for businesses with something real to offer.",
    stages: [
      { label: "Potential", line: "An idea with potential." }, { label: "Define", line: "Every strong presence starts with clarity." },
      { label: "Design", line: "Structure becomes a point of view." }, { label: "Build", line: "Designed to be felt, not just viewed." },
      { label: "Refine", line: "Built for every screen." }, { label: "Resolution", line: "Have something worth making tangible?" },
    ],
    scroll: "Scroll to follow the process",
  },
  work: { eyebrow: "Selected work", title: "A direction shaped around the business.", intro: "Three directional studies show how the approach adapts to different sectors and needs. Final imagery and real project content can replace them later.", viewProject: "View case study" },
  services: {
    eyebrow: "Services", title: "Clarity at the start. Quality through the finish.",
    items: [
      { title: "Strategy and structure", copy: "We clarify what the website needs to say, who it serves and how it should guide people towards the right action.", includes: ["Content hierarchy", "UX and page architecture"] },
      { title: "Visual design and interaction", copy: "We develop a distinctive visual direction and a responsive interface that feels natural to use.", includes: ["Visual direction", "Motion and 3D integration"] },
      { title: "Development and performance", copy: "We turn the system into resilient, fast and accessible code, ready to launch and straightforward to maintain.", includes: ["Frontend development", "Optimization and launch support"] },
    ],
  },
  principles: {
    eyebrow: "Principles", title: "Looking good is not enough.", intro: "The website must be clear, useful and fast without losing its character.",
    items: [
      { title: "Distinctive", copy: "A visual identity that belongs to your business, not merely its category." },
      { title: "Purposeful", copy: "Every visual decision supports hierarchy, understanding or action." },
      { title: "Performant", copy: "Measured implementation that responds quickly and works across screens." },
    ],
    signals: ["Accessibility", "Responsive behavior", "Efficient assets", "Core Web Vitals", "Reduced motion"],
    targets: "Technical targets: LCP < 2.5s · INP < 200ms · CLS < 0.1",
  },
  process: {
    eyebrow: "Process", title: "No excess steps. No vague decisions.", intro: "The process adapts to the project while the direction and decisions stay clear.",
    items: [
      { title: "Understand", copy: "We talk about the business, the people it serves and the problem the website needs to solve." },
      { title: "Direct", copy: "We set priorities, structure and tone before moving into detailed design." },
      { title: "Design and build", copy: "Form and code develop together, with continuous checks on real screens." },
      { title: "Refine and launch", copy: "We tune content, accessibility and performance, then prepare the release." },
    ],
  },
  about: { eyebrow: "About the studio", title: "Close collaboration. A high standard.", copy: "I’m [Your Name]. From [Location], I run an independent studio where strategy, design, development and motion are treated as one connected piece of work.", detail: "You work directly with the person thinking, designing and building the site, with fewer layers and more attention on the details that matter." },
  contact: {
    eyebrow: "Contact", title: "Let’s build an online presence that fits the quality of your business.", intro: "Tell me briefly about your business and what you would like to create. I’ll reply with questions and a practical next step.",
    name: "Name", email: "Email", business: "Business or company", brief: "What would you like to create?", budget: "Budget", timeline: "Preferred timeline", optional: "Optional", consent: "I agree that my information may be used to respond to this enquiry.", submit: "Send enquiry", sending: "Sending…", success: "Thank you. Your enquiry was delivered and I’ll respond shortly.", unavailable: "The form is not configured for delivery yet. Please use the email address once it has been replaced.", error: "The enquiry could not be sent. Please try again shortly.",
    budgetOptions: ["Select a range", "Under €3,000", "€3,000–€6,000", "€6,000–€12,000", "Above €12,000"], timelineOptions: ["Select a timeline", "Within 1 month", "1–3 months", "3–6 months", "I’m flexible"],
    validation: { required: "This field is required.", email: "Enter a valid email address.", consent: "You must agree before submitting.", tooLong: "This content is too long." },
  },
  footer: { line: "Distinctive websites, built with care.", navigation: "Navigation", social: "Social", availability: "Available for selected projects" },
  project: { context: "Context", objective: "Objective", direction: "Direction", deliverables: "Deliverables", placeholder: "This is a structured case-study placeholder. Replace it with imagery and content from the real project.", contactLine: "Have a project with the same need for clarity?" },
  metadata: { title: "Living Canvas — Distinctive websites for real businesses", description: "Strategy, design and development for businesses with something real to offer." },
};
