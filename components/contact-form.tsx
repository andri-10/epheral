"use client";

import { ArrowUpRight } from "lucide-react";
import { FormEvent, useState } from "react";
import type { Locale } from "@/content/site-config";
import type { Dictionary } from "@/i18n/types";

type State = "idle" | "sending" | "success" | "unavailable" | "error";
type Errors = Partial<Record<"name" | "email" | "business" | "message" | "consent", string>>;

export function ContactForm({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const t = dictionary.contact;

  function validate(form: FormData) {
    const next: Errors = {};
    const required = ["name", "email", "business", "message"] as const;
    required.forEach((field) => { const value = String(form.get(field) ?? "").trim(); if (!value) next[field] = t.validation.required; else if (value.length > (field === "message" ? 3000 : 160)) next[field] = t.validation.tooLong; });
    const email = String(form.get("email") ?? "");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t.validation.email;
    if (form.get("consent") !== "on") next.consent = t.validation.consent;
    return next;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setState("sending");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
      const payload = await response.json() as { status?: string };
      if (response.ok && payload.status === "sent") { setState("success"); formElement.reset(); }
      else if (response.status === 503) setState("unavailable");
      else setState("error");
    } catch { setState("error"); }
  }

  const field = (name: keyof Errors, label: string, type = "text") => (
    <div className="form-field"><label htmlFor={name}>{label}</label><input id={name} name={name} type={type} autoComplete={name === "business" ? "organization" : name} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} />{errors[name] && <span id={`${name}-error`} className="field-error">{errors[name]}</span>}</div>
  );

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <input className="honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input type="hidden" name="locale" value={locale} />
      <div className="form-grid">{field("name", t.name)}{field("email", t.email, "email")}{field("business", t.business)}</div>
      <div className="form-field form-field--wide"><label htmlFor="message">{t.brief}</label><textarea id="message" name="message" rows={5} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} />{errors.message && <span id="message-error" className="field-error">{errors.message}</span>}</div>
      <div className="form-grid form-grid--two"><div className="form-field"><label htmlFor="budget">{t.budget} <span>{t.optional}</span></label><select id="budget" name="budget" defaultValue="">{t.budgetOptions.map((option, index) => <option key={option} value={index === 0 ? "" : option}>{option}</option>)}</select></div><div className="form-field"><label htmlFor="timeline">{t.timeline} <span>{t.optional}</span></label><select id="timeline" name="timeline" defaultValue="">{t.timelineOptions.map((option, index) => <option key={option} value={index === 0 ? "" : option}>{option}</option>)}</select></div></div>
      <div className="consent-field"><input id="consent" name="consent" type="checkbox" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} /><label htmlFor="consent">{t.consent}</label>{errors.consent && <span id="consent-error" className="field-error">{errors.consent}</span>}</div>
      <div className="form-submit"><button type="submit" disabled={state === "sending"}><span>{state === "sending" ? t.sending : t.submit}</span><ArrowUpRight size={18} aria-hidden="true" /></button><div className={`form-status is-${state}`} role="status" aria-live="polite">{state === "success" ? t.success : state === "unavailable" ? t.unavailable : state === "error" ? t.error : ""}</div></div>
    </form>
  );
}
