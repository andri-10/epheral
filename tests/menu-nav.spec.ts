import { expect, test, type Page } from "@playwright/test";

const order = { en: ["Services", "Pricing", "Work", "Contact"], sq: ["Shërbimet", "Çmimet", "Projektet", "Kontakt"] };

async function openMenu(page: Page) {
  await page.locator(".global-navbar__menu").click();
  await expect(page.locator(".global-navbar__menu")).toHaveAttribute("aria-expanded", "true");
}

// Waits for smooth scrolling (and GSAP's scrub) to come to rest.
async function settle(page: Page) {
  await expect.poll(async () => {
    const before = await page.evaluate(() => window.scrollY);
    await page.waitForTimeout(400);
    return before === await page.evaluate(() => window.scrollY);
  }, { timeout: 15000 }).toBe(true);
  await page.waitForTimeout(1200);
}

async function inView(page: Page, selector: string) {
  return page.locator(selector).evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const navbar = document.querySelector(".global-navbar")!.getBoundingClientRect().bottom;
    return rect.top >= navbar - 1 && rect.top < innerHeight * 0.75 && getComputedStyle(node).visibility !== "hidden" && Number(getComputedStyle(node).opacity) > 0.9;
  });
}

for (const viewport of [{ name: "desktop", width: 1440, height: 900, mobile: false }, { name: "phone", width: 390, height: 844, mobile: true }]) {
  test(`${viewport.name}: menu follows the page order and each link lands on its section`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.mobile, hasTouch: viewport.mobile });
    const page = await context.newPage();
    await page.goto("/en");
    await page.waitForFunction(() => document.body.classList.contains("launch-complete"));
    if (viewport.mobile) await expect(page.locator(".global-navbar__menu")).toBeVisible();
    else await page.evaluate(() => window.scrollTo(0, document.querySelector<HTMLElement>(".services-page--embedded")!.getBoundingClientRect().top + scrollY));

    await openMenu(page);
    await expect(page.locator(".global-navbar__panel nav a")).toHaveText(order.en);
    await expect(page.locator(".global-navbar__panel nav a").first()).toBeFocused();
    // The full-screen desktop menu locks the page; the phone popover leaves it scrollable.
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe(viewport.mobile ? "visible" : "hidden");
    await page.keyboard.press("Escape");
    await expect(page.locator(".global-navbar__menu")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(".global-navbar__menu")).toBeFocused();

    const targets: [string, string][] = [["Pricing", ".pricing-section__intro h2"], ["Work", viewport.mobile ? ".pricing-section__works-heading" : ".works-gallery"], ["Contact", ".closing-form"], ["Services", ".services-page__heading"]];
    for (const [label, selector] of targets) {
      await openMenu(page);
      await page.locator(".global-navbar__panel nav a", { hasText: label }).click();
      await expect(page.locator(".global-navbar__menu")).toHaveAttribute("aria-expanded", "false");
      await settle(page);
      expect(await inView(page, selector), `${label} -> ${selector}`).toBe(true);
      await openMenu(page);
      await expect(page.locator(".global-navbar__panel a.is-current")).toHaveText(label);
      await page.keyboard.press("Escape");
    }
    await context.close();
  });
}

test("phone: the menu is available on project pages and its links lead to the home sections", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/sq/work/pilates-studio");
  await expect(page.locator(".global-navbar__menu")).toBeVisible();
  await openMenu(page);
  await expect(page.locator(".global-navbar__panel nav a")).toHaveText(order.sq);
  await page.locator(".global-navbar__panel nav a", { hasText: "Kontakt" }).click();
  await page.waitForURL(/\/sq$/);
  await page.waitForFunction(() => document.body.classList.contains("launch-complete"));
  await settle(page);
  expect(await inView(page, ".closing-form")).toBe(true);
  await context.close();
});

test("desktop: the menu is available straight away on project pages", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en/work/pilates-studio");
  await expect(page.locator(".global-navbar__menu")).toBeVisible();
});

test("closed menu links are out of the tab order", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await expect(page.locator(".global-navbar__panel")).toHaveAttribute("inert", "");
  await expect(page.locator(".closing-form button")).toHaveText("Send");
});

test("phone: the menu is a small popover under the button that closes on an outside tap", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/en");
  await page.waitForFunction(() => document.body.classList.contains("launch-complete"));
  await openMenu(page);
  await expect(page.locator(".global-navbar")).not.toHaveClass(/is-menu-open/);
  await page.waitForTimeout(500);
  const panel = (await page.locator(".global-navbar__panel").boundingBox())!;
  const button = (await page.locator(".global-navbar__menu").boundingBox())!;
  expect(panel.width).toBeLessThanOrEqual(270);
  expect(panel.height).toBeLessThan(844 / 2);
  expect(panel.y).toBeGreaterThanOrEqual(button.y + button.height - 16);
  expect(Math.abs(panel.x + panel.width - (button.x + button.width))).toBeLessThan(16);
  await expect(page.locator(".global-navbar__panel .language-switch")).toBeVisible();
  await page.screenshot({ path: "test-results/menu-popover.png" });
  await page.mouse.click(60, 600);
  await expect(page.locator(".global-navbar__menu")).toHaveAttribute("aria-expanded", "false");
  await context.close();
});
