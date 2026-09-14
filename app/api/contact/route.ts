import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(254),
  business: z.string().trim().min(1).max(160),
  message: z.string().trim().min(1).max(3000),
  budget: z.string().trim().max(100).optional().default(""),
  timeline: z.string().trim().max(100).optional().default(""),
  consent: z.literal("on"),
  website: z.string().max(0).optional().default(""),
  locale: z.enum(["sq", "en"]),
});

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function rateLimited(key: string) {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || record.resetAt < now) { attempts.set(key, { count: 1, resetAt: now + WINDOW_MS }); return false; }
  record.count += 1;
  return record.count > MAX_ATTEMPTS;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

export async function POST(request: NextRequest) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(key)) return NextResponse.json({ status: "rate_limited" }, { status: 429 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ status: "invalid" }, { status: 400 }); }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ status: "invalid", fields: parsed.error.flatten().fieldErrors }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from || to.includes("[Email Address]")) {
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }

  const data = parsed.data;
  const lines = [
    ["Name", data.name], ["Email", data.email], ["Business", data.business],
    ["Budget", data.budget || "Not provided"], ["Timeline", data.timeline || "Not provided"],
    ["Locale", data.locale], ["Message", data.message],
  ];
  const html = lines.map(([label, value]) => `<p><strong>${label}</strong><br>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`).join("");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: data.email, subject: `Epheral enquiry — ${data.business}`, html }),
    });
    if (!response.ok) return NextResponse.json({ status: "delivery_failed" }, { status: 502 });
    return NextResponse.json({ status: "sent" });
  } catch {
    return NextResponse.json({ status: "delivery_failed" }, { status: 502 });
  }
}

// Replace the in-memory limiter with a shared store (for example Upstash) when
// deploying across multiple server instances.
