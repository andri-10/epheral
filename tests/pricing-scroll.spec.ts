import { expect, test } from "@playwright/test";

test("pricing stays after services when the desktop hero changes layout", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/sq");
  await expect(page.locator(".living-story.is-sequence")).toBeVisible();
  await page.waitForFunction(() => document.body.classList.contains("launch-complete"));
  await page.waitForFunction(() => document.querySelector<HTMLElement>(".pricing-section")!.offsetHeight > innerHeight);
  await expect(page.locator(".pricing-section__intro h2")).toHaveText("Një ekip që i çon idetë përpara.");
  await expect(page.locator(".service-item__price")).toHaveText(["Nga €290", "Nga €690", "Nga €1290", "Flasim →"]);
  await expect(page.locator(".service-item__features li")).toHaveCount(20);
  await expect(page.locator(".service-item__tier, .service-item__tags, .service-item__price-note")).toHaveCount(0);

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
      const contentWidth = await page.locator(".service-item__content").first().evaluate((node) => node.getBoundingClientRect().width);
      const finalWidth = (await page.locator(".services-wrapper").evaluate((node) => node.clientWidth) - 72) / 4;
      expect(contentWidth).toBeCloseTo(finalWidth, 0);
      const initialCard = await page.locator(".service-item").first().evaluate((node) => {
        const card = node.getBoundingClientRect();
        const price = node.querySelector<HTMLElement>(".service-item__price")!.getBoundingClientRect();
        return { background: getComputedStyle(node).backgroundColor, color: getComputedStyle(node).color, priceBackground: getComputedStyle(node.querySelector(".service-item__price")!).backgroundColor, priceRight: card.right - price.right, priceTop: price.top - card.top };
      });
      expect(initialCard).toEqual({ background: "rgb(11, 22, 40)", color: "rgb(245, 243, 237)", priceBackground: "rgb(245, 243, 237)", priceRight: 26, priceTop: 26 });
      await expect(page.locator(".pricing-section__intro")).toHaveCSS("color", "rgb(11, 22, 40)");
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
    if (visibleCount === 2) await page.screenshot({ path: "test-results/pricing-color-handoff.png" });

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
    const cardColors = await page.locator(".service-item").evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).backgroundColor));
    if (visibleCount < 4) {
      expect(cardColors[visibleCount - 2]).toBe("rgb(245, 243, 237)");
      expect(cardColors[visibleCount - 1]).toBe("rgb(11, 22, 40)");
    }
    if (visibleCount === 4) {
      await expect(page.locator(".global-navbar")).toHaveClass(/is-reveal-mode/);
      await page.mouse.move(720, 450);
      await expect(page.locator(".global-navbar__menu")).toHaveCSS("color", "rgb(11, 22, 40)");
      const restingLogo = await page.locator(".global-navbar .brand-logo").evaluate((node) => getComputedStyle(node, "::before").backgroundColor);
      expect(restingLogo).toBe("rgb(11, 22, 40)");
      await page.screenshot({ path: "test-results/pricing-navbar-rest.png" });
      await page.locator(".global-navbar__home").hover();
      await expect(page.locator(".global-navbar .brand-logo__reveal--blue")).toHaveCSS("visibility", "hidden");
      await expect(page.locator(".global-navbar .brand-logo__reveal--black")).toHaveCSS("visibility", "visible");
      await expect(page.locator(".global-navbar .brand-logo__reveal--black")).toHaveCSS("background-color", "rgb(245, 243, 237)");
      await page.waitForTimeout(700);
      await page.screenshot({ path: "test-results/pricing-navbar-hover.png" });
      await page.locator(".global-navbar__menu").hover();
      await expect(page.locator(".global-navbar__menu")).toHaveCSS("color", "rgb(245, 243, 237)");
      await page.locator(".global-navbar__menu").click();
      await expect(page.locator(".global-navbar")).toHaveClass(/is-menu-open/);
      await page.mouse.move(720, 450);
      await expect(page.locator(".global-navbar__menu")).toHaveCSS("color", "rgb(245, 243, 237)");
      await page.locator(".global-navbar__menu").hover();
      await expect(page.locator(".global-navbar__menu")).toHaveCSS("color", "rgb(184, 147, 74)");
      await page.locator(".global-navbar__home").hover();
      await expect(page.locator(".global-navbar .brand-logo__reveal--blue")).toHaveCSS("visibility", "visible");
      await expect(page.locator(".global-navbar .brand-logo__reveal--black")).toHaveCSS("visibility", "hidden");
      await expect(page.locator(".global-navbar .brand-logo__reveal--blue")).toHaveCSS("background-color", "rgb(184, 147, 74)");
      await page.waitForTimeout(700);
      await page.screenshot({ path: "test-results/pricing-menu-accent-logo.png" });
      await expect(page.locator(".global-navbar__panel a.is-current")).toHaveCSS("background-position", "100% 0px");
      await page.locator(".global-navbar__panel a.is-current").hover();
      await expect(page.locator(".global-navbar__panel a.is-current")).toHaveCSS("background-position", "0px 0px");
      await page.locator(".global-navbar__menu").click();
      await expect(page.locator(".global-navbar__panel")).toHaveAttribute("aria-hidden", "true");
      await expect(page.locator(".global-navbar__panel")).toHaveCSS("transition-duration", "1.1s, 0.38s, 0s");
      await page.waitForTimeout(1180);
      const headingTop = await page.locator(".pricing-section__intro h2").evaluate((node) => node.getBoundingClientRect().top);
      expect(headingTop).toBeGreaterThan(90);
      const hiddenFeatures = await page.locator(".service-item__features").evaluateAll((nodes) => nodes.filter((node) => node.scrollHeight > node.clientHeight + 2).length);
      expect(hiddenFeatures).toBe(0);
      const typography = await page.locator(".service-item").evaluateAll((nodes) => nodes.map((node) => {
        const heading = node.querySelector<HTMLElement>("h3")!;
        const content = node.querySelector<HTMLElement>(".service-item__content")!;
        const cardRect = node.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        const features = Array.from(node.querySelectorAll<HTMLElement>(".service-item__features li"));
        const style = getComputedStyle(heading);
        return { fontSize: style.fontSize, headingLines: heading.getBoundingClientRect().height / Number.parseFloat(style.lineHeight), wrappedFeatures: features.filter((feature) => feature.scrollWidth > feature.clientWidth + 1).length, contentOffset: contentRect.left - cardRect.left, contentWidth: contentRect.width };
      }));
      expect(new Set(typography.map((item) => item.fontSize)).size).toBe(1);
      expect(typography.every((item) => item.headingLines <= 4.1 && item.wrappedFeatures === 0 && Math.abs(item.contentOffset) < 1 && item.contentWidth > 300)).toBe(true);
      expect(cardColors.every((color) => color === "rgb(245, 243, 237)")).toBe(true);
      await expect(page.locator(".service-item__price").first()).toHaveCSS("background-color", "rgb(11, 22, 40)");
      await expect(page.locator(".service-item__price").first()).toHaveCSS("color", "rgb(245, 243, 237)");
      await expect(page.locator(".service-item__price").first()).toHaveCSS("font-size", "20px");
      await expect(page.locator(".service-item__price").first()).toHaveCSS("border-radius", "999px");
      await page.screenshot({ path: "test-results/pricing-four-cards.png" });
    }
  }

  await page.evaluate((target) => window.scrollTo(0, target), positions.servicesEnd + 3.25 * 900);
  await page.waitForTimeout(1000);
  const settled = await page.locator(".service-item").evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return { left: rect.left, width: rect.width };
  }));
  expect(settled.every((card) => Math.abs(card.width - settled[0].width) < 1)).toBe(true);
  await expect(page.locator(".pricing-section__intro")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "test-results/pricing-four-cards-hold.png" });

  await page.evaluate((target) => window.scrollTo(0, target), positions.servicesEnd + 3.95 * 900);
  await page.waitForTimeout(1000);
  const merging = await page.locator(".service-item").evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return { left: rect.left, width: rect.width };
  }));
  const mergingOpacity = Number(await page.locator(".pricing-section__intro").evaluate((node) => getComputedStyle(node).opacity));
  expect(merging[0].left).toBeGreaterThan(32);
  expect(merging[0].width).toBeGreaterThan(326);
  expect(mergingOpacity).toBeGreaterThan(0);
  expect(mergingOpacity).toBeLessThan(1);
  await page.screenshot({ path: "test-results/pricing-cards-merging.png" });

  await page.evaluate((target) => window.scrollTo(0, target), positions.servicesEnd + 4.45 * 900);
  await page.waitForTimeout(1000);
  const merged = await page.locator(".service-item").evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  }));
  expect(merged.every((card) => Math.abs(card.left - merged[0].left) < 1 && Math.abs(card.width - merged[0].width) < 1)).toBe(true);
  expect(merged[0].left).toBeGreaterThan(120);
  await expect(page.locator(".pricing-section__intro")).toHaveCSS("opacity", "0");
  await expect(page.locator(".service-item__content").first()).toHaveCSS("opacity", "0");

  const wrapperBeforeExpansion = await page.locator(".services-wrapper").boundingBox();
  await page.evaluate((target) => window.scrollTo(0, target), positions.servicesEnd + 4.95 * 900);
  await page.waitForTimeout(1000);
  const midwayColor = await page.locator(".service-item").first().evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(midwayColor).not.toBe("rgb(245, 243, 237)");
  expect(midwayColor).not.toBe("rgb(11, 22, 40)");
  await page.evaluate((target) => window.scrollTo(0, target), positions.servicesEnd + 5.45 * 900);
  await page.waitForTimeout(1000);
  const expanded = await page.locator(".service-item").first().boundingBox();
  expect(expanded!.y).toBeLessThan(wrapperBeforeExpansion!.y - 80);
  expect(expanded!.height).toBeGreaterThan(wrapperBeforeExpansion!.height + 180);
  expect(expanded!.y).toBeCloseTo(116, 0);
  expect(900 - expanded!.y - expanded!.height).toBeCloseTo(32, 0);
  expect(1440 - expanded!.x - expanded!.width).toBeCloseTo(32, 0);
  await expect(page.locator(".service-item").first()).toHaveCSS("background-color", "rgb(11, 22, 40)");
  const worksHeading = page.locator(".pricing-section__works-heading");
  await expect(worksHeading).toHaveText("Projektet tona");
  await expect(worksHeading).toHaveCSS("opacity", "0");
  await page.screenshot({ path: "test-results/pricing-container-expanded.png" });

  await page.evaluate((target) => window.scrollTo(0, target), positions.servicesEnd + 5.65 * 900);
  await page.waitForTimeout(1000);
  await expect(worksHeading).toHaveCSS("opacity", "0");

  await page.evaluate((target) => window.scrollTo(0, target), positions.servicesEnd + 6.2 * 900);
  await page.waitForTimeout(1000);
  const revealingOpacity = Number(await worksHeading.evaluate((node) => getComputedStyle(node).opacity));
  expect(revealingOpacity).toBeGreaterThan(0);
  expect(revealingOpacity).toBeLessThan(1);
  await page.screenshot({ path: "test-results/pricing-works-heading-revealing.png" });

  await page.evaluate((target) => window.scrollTo(0, target), positions.servicesEnd + 6.6 * 900);
  await page.waitForTimeout(1000);
  await expect(worksHeading).toHaveCSS("opacity", "1");
  const finishedHeading = await worksHeading.boundingBox();
  const finishedPanel = await page.locator(".service-item").first().boundingBox();
  expect(finishedHeading!.x + finishedHeading!.width).toBeLessThan(finishedPanel!.x);
  expect(finishedHeading!.x + finishedHeading!.width / 2).toBeCloseTo(finishedPanel!.x / 2, 0);
  expect(finishedHeading!.y).toBeGreaterThanOrEqual(finishedPanel!.y - 1);
  expect(finishedHeading!.y + finishedHeading!.height).toBeLessThanOrEqual(finishedPanel!.y + finishedPanel!.height + 1);
  await page.screenshot({ path: "test-results/pricing-works-heading.png" });
});

for (const locale of ["sq", "en"]) {
  test(`${locale} vertical works heading fits beside the panel after resizing`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/${locale}`);
    await page.waitForFunction(() => document.body.classList.contains("launch-complete"));
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });

    for (const size of [{ width: 1440, height: 900 }, { width: 1200, height: 600 }, { width: 1920, height: 1080 }]) {
      await page.setViewportSize(size);
      await page.waitForTimeout(250);
      await page.evaluate(() => {
        const section = document.querySelector<HTMLElement>(".pricing-section")!;
        const distance = Number.parseFloat(section.style.getPropertyValue("--pricing-scroll-distance"));
        window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY + innerHeight + distance);
      });
      await page.waitForTimeout(1100);
      const heading = page.locator(".pricing-section__works-heading");
      await expect(heading).toHaveCSS("opacity", "1");
      const text = (await heading.locator("span").boundingBox())!;
      const panel = (await page.locator(".service-item").first().boundingBox())!;
      const navbar = (await page.locator(".global-navbar").boundingBox())!;
      expect(text.x).toBeGreaterThanOrEqual(31);
      expect(panel.x - text.x - text.width).toBeGreaterThanOrEqual(31);
      expect(text.x).toBeCloseTo(panel.x - text.x - text.width, 0);
      expect(text.y).toBeGreaterThanOrEqual(navbar.y + navbar.height + 23);
      expect(size.height - text.y - text.height).toBeGreaterThanOrEqual(31);
      expect(text.y - panel.y).toBeCloseTo(panel.y + panel.height - text.y - text.height, 0);
      await page.screenshot({ path: `test-results/works-heading-${locale}-${size.width}x${size.height}.png` });
    }
  });
}

test("pricing cards remain readable and swipeable on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/sq");
  const wrapper = page.locator(".services-wrapper");
  await expect(wrapper).toHaveCSS("overflow-x", "auto");
  const dimensions = await wrapper.evaluate((node) => ({ visible: node.clientWidth, total: node.scrollWidth }));
  expect(dimensions.total).toBeGreaterThan(dimensions.visible * 3);
  const widths = await page.locator(".service-item").evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));
  expect(Math.min(...widths)).toBeGreaterThan(250);
  const heading = page.locator(".pricing-section__intro h2");
  expect(await heading.evaluate((node) => node.scrollWidth - node.clientWidth)).toBeLessThanOrEqual(1);
  await expect(page.locator(".pricing-section__intro")).toHaveCSS("text-align", "center");
  await expect(page.locator(".service-item__features li").first()).toHaveCSS("border-bottom-width", "0px");
  await page.waitForFunction(() => document.body.classList.contains("launch-complete"));
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    const services = document.querySelector<HTMLElement>(".services-page--embedded")!;
    window.scrollTo(0, services.getBoundingClientRect().bottom + window.scrollY + 100);
  });
  await page.screenshot({ path: "test-results/pricing-mobile.png" });
});

test("English heading stays on one line at the narrowest viewport", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/en");
  const heading = page.locator(".pricing-section__intro h2");
  const metrics = await heading.evaluate((node) => ({ overflow: node.scrollWidth - node.clientWidth, height: node.getBoundingClientRect().height, lineHeight: Number.parseFloat(getComputedStyle(node).lineHeight) }));
  expect(metrics.overflow).toBeLessThanOrEqual(1);
  expect(metrics.height).toBeLessThanOrEqual(metrics.lineHeight + 1);
});

test("English pricing uses compact card content without a fixed Bespoke price", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await expect(page.locator(".pricing-section__works-heading")).toHaveText("Our works");
  await expect(page.locator(".service-item__price")).toHaveText(["From €290", "From €690", "From €1290", "Let's talk →"]);
  await expect(page.locator(".service-item__tier, .service-item__tags, .service-item__price-note")).toHaveCount(0);
  await page.waitForFunction(() => document.body.classList.contains("launch-complete"));
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    const services = document.querySelector<HTMLElement>(".services-page--embedded")!;
    window.scrollTo(0, services.getBoundingClientRect().bottom + window.scrollY + innerHeight * 3);
  });
  await page.waitForTimeout(1000);
  const headingTop = await page.locator(".pricing-section__intro h2").evaluate((node) => node.getBoundingClientRect().top);
  expect(headingTop).toBeGreaterThan(90);
  await page.screenshot({ path: "test-results/pricing-four-cards-en.png" });
});
