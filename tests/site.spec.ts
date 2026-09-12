import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile-360", width: 360, height: 800 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "landscape-tablet", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "large-desktop", width: 1920, height: 1080 },
];

for (const viewport of viewports) {
  test(`${viewport.name} has no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/sq");
    await expect(page.locator("h1")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({ path: `test-results/${viewport.name}.png`, fullPage: false });
  });
}

test("locale routes, switcher and project route work", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const rootResponse = await page.goto("/");
  expect(rootResponse?.url()).toContain("/sq");
  await page.getByRole("link", { name: "EN — English" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Make your business");
  await page.goto("/en/work/pilates-studio");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pilates Studio");
});

test("desktop canvas renders and scrubs in both directions", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  const canvas = page.locator("canvas.story-canvas");
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(500);
  const initialHasPixels = await canvas.evaluate((node: HTMLCanvasElement) => {
    const context = node.getContext("2d");
    if (!context || !node.width || !node.height) return false;
    const pixel = context.getImageData(Math.floor(node.width * .75), Math.floor(node.height * .5), 1, 1).data;
    return pixel[0] + pixel[1] + pixel[2] > 0;
  });
  expect(initialHasPixels).toBeTruthy();
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3.4));
  await expect(page.locator(".story-copy.is-active h2")).toContainText(/Designed|Built|Have/);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.1));
  await expect(page.locator(".story-copy.is-active")).toContainText(/Every strong|Structure/);
});

for (const viewport of [
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
]) {
  test(`canvas contains the full frame at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/en");
    const canvas = page.locator("canvas.story-canvas");
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveAttribute("data-draw-bounds", /.+/);
    const metrics = await canvas.evaluate((node) => {
      const canvasNode = node as HTMLCanvasElement;
      const [x, y, width, height] = (canvasNode.dataset.drawBounds ?? "").split(",").map(Number);
      const rect = canvasNode.getBoundingClientRect();
      return { x, y, width, height, canvasWidth: canvasNode.width, canvasHeight: canvasNode.height, cssWidth: rect.width, cssHeight: rect.height };
    });
    expect(metrics.cssWidth).toBeCloseTo(viewport.width, 0);
    expect(metrics.cssHeight).toBeCloseTo(viewport.height, 0);
    expect(metrics.x).toBeGreaterThanOrEqual(-0.5);
    expect(metrics.y).toBeGreaterThanOrEqual(-0.5);
    expect(metrics.x + metrics.width).toBeLessThanOrEqual(metrics.canvasWidth + 0.5);
    expect(metrics.y + metrics.height).toBeLessThanOrEqual(metrics.canvasHeight + 0.5);
  });
}

test("mobile loads a poster instead of the full sequence", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const frames = new Set<string>();
  page.on("request", (request) => { if (request.url().includes("/animations/canvas/")) frames.add(request.url()); });
  await page.goto("/sq");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(350);
  expect(await page.locator("canvas.story-canvas").count()).toBe(0);
  expect(await page.locator(".story-poster img").count()).toBe(1);
  expect(frames.size).toBeLessThanOrEqual(2);
});

test("reduced motion uses normal document flow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await expect(page.locator("canvas.story-canvas")).toHaveCount(0);
  await expect(page.locator(".mobile-stages article")).toHaveCount(5);
  await expect(page.getByText("Have something worth making tangible?")).toBeVisible();
});

test("contact form reports unavailable without Resend", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en#contact");
  await expect(page.getByRole("button", { name: "Send enquiry" })).toBeEnabled();
  await page.getByLabel("Name", { exact: true }).fill("Test Person");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("Business or company").fill("Test Business");
  await page.getByLabel("What would you like to create?").fill("A new website for local testing.");
  await page.getByLabel(/I accept|I agree/).check();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("not configured");
});

test("mobile menu locks the page and closes after navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/sq");
  await page.getByRole("button", { name: "Hap menunë" }).click();
  await expect(page.locator(".mobile-menu")).toHaveClass(/is-open/);
  expect(await page.locator("body").evaluate((node) => getComputedStyle(node).overflow)).toBe("hidden");
  await page.locator(".mobile-menu").getByRole("link", { name: "Shërbimet" }).click();
  await expect(page.locator(".mobile-menu")).not.toHaveClass(/is-open/);
});

test("capture lower-section visual QA", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/sq");
  await expect(page.locator("canvas.story-canvas")).toBeVisible();
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    const target = document.querySelector("#work");
    if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "test-results/work-section.png", fullPage: false });
  await page.evaluate(() => document.querySelector("#services")?.scrollIntoView());
  await page.waitForTimeout(200);
  await page.screenshot({ path: "test-results/services-section.png", fullPage: false });
  await page.evaluate(() => document.querySelector(".principles-band")?.scrollIntoView());
  await page.waitForTimeout(200);
  await page.screenshot({ path: "test-results/principles-section.png", fullPage: false });
  await page.evaluate(() => document.querySelector("#process")?.scrollIntoView());
  await page.waitForTimeout(200);
  await page.screenshot({ path: "test-results/process-section.png", fullPage: false });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/sq");
  await expect(page.getByRole("button", { name: "Dërgo kërkesën" })).toBeEnabled();
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    const target = document.querySelector("#contact");
    if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "test-results/contact-mobile.png", fullPage: false });
});
