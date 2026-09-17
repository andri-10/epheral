import { expect, test } from "@playwright/test";

test("pricing stays after services when the desktop hero changes layout", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/sq");
  await expect(page.locator(".living-story.is-desktop")).toBeVisible();
  await page.waitForFunction(() => document.body.classList.contains("launch-complete"));
  await page.waitForFunction(() => document.querySelector<HTMLElement>(".pricing-section")!.offsetHeight > innerHeight);

  const positions = await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>(".living-story")!;
    const services = document.querySelector<HTMLElement>(".services-page--embedded")!;
    const pricing = document.querySelector<HTMLElement>(".pricing-section")!;
    const top = (element: HTMLElement) => element.getBoundingClientRect().top + window.scrollY;
    return { heroEnd: top(hero) + hero.offsetHeight, servicesTop: top(services), servicesEnd: top(services) + services.offsetHeight, pricingTop: top(pricing) };
  });

  expect(positions.servicesTop).toBeGreaterThanOrEqual(positions.heroEnd - 100);
  expect(positions.pricingTop).toBeGreaterThan(positions.servicesTop);
  expect(positions.pricingTop).toBeCloseTo(positions.servicesEnd - 900, 0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".pricing-section__eyebrow, .service-item__number")).toHaveCount(0);

  await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });

  for (const scrollY of [positions.heroEnd - 600, positions.heroEnd + 100, positions.servicesEnd - 900, positions.servicesEnd - 200]) {
    const state = await page.evaluate((target) => {
      window.scrollTo(0, target);
      const pricing = document.querySelector<HTMLElement>(".pricing-section")!;
      const services = document.querySelector<HTMLElement>(".services-page--embedded")!;
      const viewport = pricing.querySelector<HTMLElement>(".pricing-section__viewport")!;
      return { pricingTop: pricing.getBoundingClientRect().top, viewportTop: viewport.getBoundingClientRect().top, servicesBottom: services.getBoundingClientRect().bottom };
    }, scrollY);
    if (scrollY < positions.servicesEnd - 900) expect(state.pricingTop).toBeGreaterThan(800);
    if (scrollY === positions.servicesEnd - 200) {
      expect(state.viewportTop).toBeCloseTo(0, 0);
      expect(state.servicesBottom).toBeCloseTo(200, 0);
      const widths = await page.locator(".service-item").evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));
      expect(widths[0]).toBeGreaterThan(1200);
      expect(widths.slice(1).every((width) => width < 1)).toBe(true);
      await page.screenshot({ path: "test-results/pricing-transition.png" });
    }
  }

  for (const visibleCount of [2, 3, 4]) {
    await page.evaluate((target) => window.scrollTo(0, target), positions.servicesEnd + (visibleCount - 1.5) * 900);
    await page.waitForTimeout(1000);
    const midpoint = await page.locator(".service-item").evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { width: rect.width, left: rect.left, right: rect.right };
    }));
    expect(midpoint[visibleCount - 1].width).toBeGreaterThan(100);
    expect(midpoint.slice(visibleCount).every((card) => card.width < 1)).toBe(true);
    expect(midpoint[visibleCount - 1].left - midpoint[visibleCount - 2].right).toBeCloseTo(24, 0);

    await page.evaluate((target) => window.scrollTo(0, target), positions.servicesEnd + (visibleCount - 1) * 900);
    await page.waitForTimeout(1000);
    const cards = await page.locator(".service-item").evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { width: rect.width, left: rect.left, right: rect.right };
    }));
    const visible = cards.slice(0, visibleCount);
    expect(cards.slice(visibleCount).every((card) => card.width < 1)).toBe(true);
    const finalWidth = (await page.locator(".services-wrapper").evaluate((node) => node.clientWidth) - 72) / 4;
    for (const card of visible.slice(0, -1)) expect(card.width).toBeCloseTo(finalWidth, 0);
    for (let index = 1; index < visible.length; index += 1) {
      expect(visible[index].left - visible[index - 1].right).toBeCloseTo(24, 0);
    }
    expect(visible[visible.length - 1].right).toBeCloseTo((await page.locator(".services-wrapper").boundingBox())!.x + (await page.locator(".services-wrapper").boundingBox())!.width, 0);
    if (visibleCount === 4) await page.screenshot({ path: "test-results/pricing-four-cards.png" });
  }
});

test("pricing cards remain readable and swipeable on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/sq");
  const wrapper = page.locator(".services-wrapper");
  await expect(wrapper).toHaveCSS("overflow-x", "auto");
  const dimensions = await wrapper.evaluate((node) => ({ visible: node.clientWidth, total: node.scrollWidth }));
  expect(dimensions.total).toBeGreaterThan(dimensions.visible * 3);
  const widths = await page.locator(".service-item").evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));
  expect(Math.min(...widths)).toBeGreaterThan(250);
});
