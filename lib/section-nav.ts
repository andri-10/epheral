// Menu targets, in the order the sections appear on the home page.
export const menuSections = ["services", "pricing", "work", "contact"] as const;
export type MenuSection = (typeof menuSections)[number];

const pendingKey = "epheral:pending-section";
export const isMenuSection = (value: string | null | undefined): value is MenuSection => menuSections.includes(value as MenuSection);

const documentTop = (element: Element) => element.getBoundingClientRect().top + window.scrollY;
const navbarOffset = () => (document.querySelector<HTMLElement>(".global-navbar")?.offsetHeight ?? 0) + 24;

/** Scroll position that shows a section, or null when the home page isn't rendered. */
export function sectionScrollTop(section: MenuSection): number | null {
  const pricing = document.querySelector<HTMLElement>(".pricing-section");
  const services = document.querySelector<HTMLElement>(".services-page__heading");
  if (!pricing || !services) return null;
  if (section === "services") return documentTop(services) - navbarOffset();

  // Desktop: pricing, works and contact live in one pinned timeline. The section publishes the
  // timeline phase (in viewport heights) where each part is fully on screen.
  const phase = pricing.dataset[`phase${section[0].toUpperCase()}${section.slice(1)}`];
  if (phase !== undefined) return documentTop(pricing) + window.innerHeight * (1 + Number(phase));

  // Normal flow. The title + cards are pinned during the reveal, so their on-screen box can lie;
  // their resting place is just above the works heading.
  const worksHeading = pricing.querySelector<HTMLElement>(".pricing-section__works-heading")!;
  if (section === "pricing") {
    const plans = pricing.querySelector<HTMLElement>(".pricing-section__plans")!;
    const gap = Number.parseFloat(getComputedStyle(plans.parentElement!).rowGap) || 0;
    return documentTop(worksHeading) - gap - plans.offsetHeight - navbarOffset();
  }
  const target = section === "work" ? worksHeading : pricing.querySelector<HTMLElement>("#contact")!;
  return documentTop(target) - navbarOffset();
}

export function scrollToSection(section: MenuSection, behavior: ScrollBehavior = "smooth") {
  const top = sectionScrollTop(section);
  if (top === null) return false;
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

/** The section the visitor is currently looking at, for highlighting the menu. */
export function currentSection(): MenuSection | null {
  // The last section whose scroll position has been reached (capped at the page end, so the
  // final section counts once the visitor is at the bottom).
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  let current: MenuSection | null = null;
  for (const section of menuSections) {
    const top = sectionScrollTop(section);
    if (top !== null && window.scrollY >= Math.min(Math.max(0, top), maxScroll) - 8) current = section;
  }
  return current;
}

// Links from other pages arrive as /locale#section. The launch intro resets the scroll, so the
// target is parked here and applied once the intro has finished.
export function rememberPendingSection(hash: string) {
  const section = hash.replace(/^#/, "");
  try {
    if (isMenuSection(section)) window.sessionStorage.setItem(pendingKey, section);
  } catch {}
}

export function takePendingSection(): MenuSection | null {
  try {
    const section = window.sessionStorage.getItem(pendingKey);
    window.sessionStorage.removeItem(pendingKey);
    return isMenuSection(section) ? section : null;
  } catch {
    return null;
  }
}
