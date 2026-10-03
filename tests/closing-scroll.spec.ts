import { expect, test } from "@playwright/test";
import { compactContactSchema } from "../lib/compact-contact";
import { POST } from "../app/api/contact/route";
import { NextRequest } from "next/server";

async function scrollToPhase(page: import("@playwright/test").Page, phase: number) {
  await page.evaluate((value) => {
    document.documentElement.style.scrollBehavior = "auto";
    const section = document.querySelector<HTMLElement>(".pricing-section")!;
    window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY + innerHeight * (1 + value));
  }, phase);
  await page.waitForTimeout(1200);
}

for (const locale of ["sq", "en"]) {
  test(`${locale}: works collapse reveals the form and footer without moving the first row`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/${locale}`);
    await page.waitForFunction(() => document.body.classList.contains("launch-complete"));
    for (const size of [{ width: 1440, height: 900 }, { width: 1200, height: 600 }]) {
      await page.setViewportSize(size);
      await page.waitForTimeout(250);
      await scrollToPhase(page, 6.7);
      const panel = page.locator(".service-item").first();
      const full = (await panel.boundingBox())!;
      const firstCard = (await page.locator(".works-gallery__card").first().boundingBox())!;
      await expect(page.locator(".closing-section")).toHaveCSS("visibility", "hidden");
      await scrollToPhase(page, 7.75);
      const midway = (await panel.boundingBox())!;
      expect(midway.y).toBeCloseTo(full.y, 0);
      expect(midway.height).toBeLessThan(full.height - 30);
      await page.screenshot({ path: `test-results/closing-collapse-${locale}-${size.width}.png` });
      await scrollToPhase(page, 8.7);
      const collapsed = (await panel.boundingBox())!;
      const remainingCard = (await page.locator(".works-gallery__card").first().boundingBox())!;
      expect(collapsed.y).toBeCloseTo(full.y, 0);
      expect(collapsed.height).toBeLessThan(full.height * .65);
      expect(remainingCard.y).toBeCloseTo(firstCard.y, 0);
      expect(remainingCard.height).toBeCloseTo(firstCard.height, 0);
      expect(collapsed.y + collapsed.height).toBeGreaterThan(remainingCard.y + remainingCard.height);
      expect(collapsed.y + collapsed.height - remainingCard.y - remainingCard.height).toBeCloseTo(remainingCard.y - collapsed.y, 0);
      await expect(page.locator(".pricing-section__works-heading")).toHaveCSS("opacity", "1");
      const heading = (await page.locator(".pricing-section__works-heading span").boundingBox())!;
      expect(heading.y).toBeGreaterThanOrEqual(collapsed.y - 1);
      expect(heading.y + heading.height).toBeLessThanOrEqual(collapsed.y + collapsed.height + 1);
      await expect(page.locator(".closing-form")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await expect(page.locator(".closing-footer")).toHaveCSS("text-align", "right");
      await expect(page.locator(".closing-footer__brand, .closing-footer__line")).toHaveCount(0);
      await expect(page.locator(".closing-section")).toHaveCSS("opacity", "1");
      await expect(page.locator(".closing-section")).toHaveCSS("pointer-events", "auto");
      await page.locator("#closing-name").click();
      await expect(page.locator("#closing-name")).toBeFocused();
      const form = (await page.locator(".closing-form").boundingBox())!;
      const footer = (await page.locator(".closing-footer").boundingBox())!;
      expect(form.y).toBeGreaterThan(collapsed.y + collapsed.height + 20);
      expect(form.y + form.height).toBeLessThanOrEqual(size.height - 31);
      expect(footer.x).toBeGreaterThan(form.x + form.width);
      expect(footer.x + footer.width).toBeLessThanOrEqual(size.width - 31);
      await expect(page.locator(".closing-footer h2")).toHaveCSS("font-family", 'Gilroy, sans-serif');
      await expect(page.locator(".closing-footer__mark")).toHaveText(`© epheral ${new Date().getFullYear()}`);
      await page.screenshot({ path: `test-results/closing-${locale}-${size.width}x${size.height}.png` });
      await scrollToPhase(page, 6.7);
      await expect(page.locator(".closing-section")).toHaveCSS("visibility", "hidden");
      expect((await panel.boundingBox())!.height).toBeCloseTo(full.height, 0);
      await expect(page.locator(".pricing-section__works-heading")).toHaveCSS("opacity", "1");
    }
  });
}

test("compact enquiry validates phone, accepts no email, and handles delivery states", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await page.waitForFunction(() => document.body.classList.contains("launch-complete"));
  const form = page.locator(".closing-form");
  await form.scrollIntoViewIfNeeded();
  await page.clock.setFixedTime(new Date("2030-06-15T12:00:00Z"));
  await expect(form.locator('input:not([type="hidden"]):not(.honeypot)')).toHaveCount(3);
  await expect(form.locator("textarea")).toHaveValue("");
  await expect(form.locator("textarea")).not.toHaveAttribute("placeholder");
  await expect(form.locator('[name="email"]')).not.toHaveAttribute("required");
  await form.getByRole("button").click();
  await expect(page.locator("#closing-name-error")).toHaveText("This field is required.");
  await expect(page.locator(".closing-footer__mark")).toHaveText("© epheral 2030");
  await form.locator('[name="name"]').fill("Alex Example");
  await form.locator('#closing-phone').fill("abc");
  await form.locator('[name="message"]').fill("I would like to discuss a website.");
  await form.getByRole("button").click();
  await expect(page.locator("#closing-phone-error")).toHaveText("Enter a valid phone number.");
  await expect(form.locator('[name="phonePrefix"]')).toHaveValue("+355");
  await form.locator('#closing-phone').fill("069 123 4567");
  let payload: Record<string, string> = {};
  let responseStatus = 503;
  await page.route("**/api/contact", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: responseStatus, contentType: "application/json", body: JSON.stringify({ status: responseStatus === 200 ? "sent" : responseStatus === 429 ? "rate_limited" : "unavailable" }) });
  });
  await form.getByRole("button").click();
  await expect(form.getByRole("status")).toContainText("currently unavailable");
  expect(payload.email).toBe("");
  expect(payload.phone).toBe("+355 69 123 4567");
  expect(payload.locale).toBe("en");
  expect(compactContactSchema.safeParse(payload).success).toBe(true);
  responseStatus = 429;
  await form.getByRole("button").click();
  await expect(form.getByRole("status")).toContainText("15 minutes");
  responseStatus = 200;
  await form.getByRole("button").click();
  await expect(form.getByRole("status")).toContainText("delivered");
  await expect(form.locator('[name="name"]')).toHaveValue("");
  await page.screenshot({ path: "test-results/closing-mobile.png" });
});

test("compact validation rejects invalid emails and a filled honeypot", () => {
  const valid = { formType: "compact", name: "Alex", phone: "+49 151 12345678", message: "A website enquiry", locale: "sq" };
  expect(compactContactSchema.safeParse(valid).success).toBe(true);
  expect(compactContactSchema.safeParse({ ...valid, email: "alex@example.com" }).success).toBe(true);
  expect(compactContactSchema.safeParse({ ...valid, email: "  " }).success).toBe(true);
  for (const update of [{ phone: "123" }, { email: "invalid" }, { message: " " }, { website: "spam" }, { phone: "+12345678901234567" }]) {
    expect(compactContactSchema.safeParse({ ...valid, ...update }).success).toBe(false);
  }
});

test("delivery includes the phone and omits reply-to when email is empty, retaining the full form contract", async () => {
  const previousFetch = globalThis.fetch;
  const keys = ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"] as const;
  const previousEnv = keys.map((key) => process.env[key]);
  process.env.RESEND_API_KEY = "test-key";
  process.env.CONTACT_TO_EMAIL = "studio@example.com";
  process.env.CONTACT_FROM_EMAIL = "form@example.com";
  const sent: Record<string, unknown>[] = [];
  globalThis.fetch = async (url, options) => {
    expect(url).toBe("https://api.resend.com/emails");
    sent.push(JSON.parse(String(options?.body)));
    return Response.json({ id: "test-delivery" });
  };
  const request = (body: object) => new NextRequest("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": "contact-delivery-unit-test" }, body: JSON.stringify(body) });
  try {
    const compact = { formType: "compact", name: "<Alex>", phone: "+355 69 123 4567", email: "", message: "A website enquiry", locale: "en" };
    expect((await POST(request(compact))).status).toBe(200);
    expect(sent[0]).not.toHaveProperty("reply_to");
    expect(sent[0].html).toContain("+355 69 123 4567");
    expect(sent[0].html).toContain("&lt;Alex&gt;");
    expect((await POST(request({ ...compact, email: "alex@example.com" }))).status).toBe(200);
    expect(sent[1].reply_to).toBe("alex@example.com");
    const full = { name: "Alex", email: "alex@example.com", business: "Example Studio", message: "A website enquiry", consent: "on", locale: "sq" };
    expect((await POST(request(full))).status).toBe(200);
    expect(sent[2].html).toContain("Example Studio");
    expect((await POST(request({ ...full, consent: undefined }))).status).toBe(400);
    expect(sent).toHaveLength(3);
  } finally {
    globalThis.fetch = previousFetch;
    keys.forEach((key, index) => {
      if (previousEnv[index] === undefined) delete process.env[key];
      else process.env[key] = previousEnv[index];
    });
  }
});

test("the contact endpoint rejects invalid compact requests before delivery", async ({ request }) => {
  const body = { formType: "compact", name: "Alex", phone: "123", email: "", message: "A website enquiry", locale: "sq" };
  const limiterKey = `closing-validation-${crypto.randomUUID()}`;
  for (const invalid of [body, { ...body, phone: "+355 69 123 4567", email: "not-an-email" }, { ...body, phone: "+355 69 123 4567", website: "spam" }]) {
    const response = await request.post("/api/contact", { data: invalid, headers: { "x-forwarded-for": limiterKey } });
    expect(response.status()).toBe(400);
    expect((await response.json()).status).toBe("invalid");
  }
});

test("contact and footer remain reachable when motion is reduced", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/sq");
  await page.waitForFunction(() => document.body.classList.contains("launch-complete"));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".closing-section").scrollIntoViewIfNeeded();
  await expect(page.locator(".closing-form")).toBeVisible();
  await expect(page.locator(".closing-footer")).toBeVisible();
  await expect(page.locator(".closing-footer h2")).toHaveText("Le ta bëjmërealitet.");
  await page.screenshot({ path: "test-results/closing-reduced-motion.png" });
});
