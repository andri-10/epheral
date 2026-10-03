"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { siteConfig, type Locale } from "@/content/site-config";
import type { Dictionary } from "@/i18n/types";
import { compactContactSchema } from "@/lib/compact-contact";

type Field = "name" | "phone" | "email" | "message";
type FormState = "idle" | "sending" | "success" | "error" | "unavailable" | "rateLimited";
const fields: Field[] = ["name", "phone", "email", "message"];
const phonePrefixes = [
  { code: "AL", dial: "+355" }, { code: "XK", dial: "+383" }, { code: "MK", dial: "+389" }, { code: "ME", dial: "+382" },
  { code: "GR", dial: "+30" }, { code: "IT", dial: "+39" }, { code: "DE", dial: "+49" }, { code: "AT", dial: "+43" },
  { code: "CH", dial: "+41" }, { code: "FR", dial: "+33" }, { code: "GB", dial: "+44" }, { code: "US", dial: "+1" },
];
const yearFormatter = new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Europe/Berlin" });
const currentYear = () => Number(yearFormatter.format(new Date()));
const subscribeYear = (notify: () => void) => {
  const timer = window.setInterval(notify, 60_000);
  return () => window.clearInterval(timer);
};

// Local numbers are often written with a trunk 0 (069…); it is dropped once the country code is added.
const fullPhone = (prefix: string, number: string) => {
  const local = number.trim().replace(/^0+/, "");
  return local ? `${prefix} ${local}` : "";
};

export function ClosingSection({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const t = dictionary.closing;
  const contact = dictionary.contact;
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [filled, setFilled] = useState<Partial<Record<Field, boolean>>>({});
  const [state, setState] = useState<FormState>("idle");
  const year = useSyncExternalStore(subscribeYear, currentYear, () => null);

  const values = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "");
    return {
      formType: "compact", locale, website: text("website"),
      name: text("name"), email: text("email"), message: text("message"),
      phone: fullPhone(text("phonePrefix"), text("phoneNumber")),
      phoneNumber: text("phoneNumber"),
    };
  };

  const fieldError = (field: Field, value: ReturnType<typeof values>): string | undefined => {
    const raw = (field === "phone" ? value.phoneNumber : value[field]).trim();
    if (field === "email") return raw && !compactContactSchema.shape.email.safeParse(raw).success ? contact.validation.email : undefined;
    if (!raw) return contact.validation.required;
    if (field === "name") return raw.length < 2 ? t.nameError : raw.length > 160 ? contact.validation.tooLong : undefined;
    if (field === "phone") {
      const localDigits = raw.replace(/\D/g, "").replace(/^0+/, "").length;
      return /[^\d\s().-]/.test(raw) || localDigits < 6 || !compactContactSchema.shape.phone.safeParse(value.phone).success ? t.phoneError : undefined;
    }
    return raw.length < 10 ? t.messageError : raw.length > 3000 ? contact.validation.tooLong : undefined;
  };

  // Validate a field when the visitor leaves it, then live while they fix it.
  const revalidate = (field: Field, form: HTMLFormElement | null, force: boolean) => {
    if (!form || (!force && !errors[field])) return;
    const message = fieldError(field, values(form));
    setErrors((current) => ({ ...current, [field]: message }));
  };
  const track = (field: Field) => ({
    onBlur: (event: { currentTarget: HTMLInputElement | HTMLTextAreaElement }) => revalidate(field, event.currentTarget.form, true),
    onChange: (event: { currentTarget: HTMLInputElement | HTMLTextAreaElement }) => {
      const hasValue = event.currentTarget.value.trim() !== "";
      setFilled((current) => current[field] === hasValue ? current : { ...current, [field]: hasValue });
      revalidate(field, event.currentTarget.form, false);
    },
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const value = values(form);
    const next: Partial<Record<Field, string>> = {};
    for (const field of fields) next[field] = fieldError(field, value);
    const firstInvalid = fields.find((field) => next[field]);
    const { phoneNumber: _, ...payload } = value;
    const result = compactContactSchema.safeParse(payload);
    if (firstInvalid || !result.success) {
      setErrors(next);
      setState("idle");
      form.querySelector<HTMLElement>(`#closing-${firstInvalid ?? "name"}`)?.focus();
      return;
    }
    setErrors({});
    setState("sending");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(result.data) });
      const body = await response.json() as { status?: string };
      if (response.ok && body.status === "sent") { setState("success"); form.reset(); setFilled({}); }
      else setState(response.status === 503 ? "unavailable" : response.status === 429 ? "rateLimited" : "error");
    } catch { setState("error"); }
  }

  const errorProps = (field: Field) => ({ "aria-invalid": Boolean(errors[field]), "aria-describedby": errors[field] ? `closing-${field}-error` : undefined });
  const errorText = (field: Field) => errors[field] && <span className="closing-form__error" id={`closing-${field}-error`}>{errors[field]}</span>;
  const fieldClass = (field: Field, extra = "") => `closing-form__field ${extra} ${filled[field] ? "is-filled" : ""} ${errors[field] ? "is-invalid" : ""}`;

  return (
    <section className="closing-section" id="contact" aria-labelledby="closing-title">
      <form className="closing-form" onSubmit={submit} noValidate aria-labelledby="closing-form-title">
        <h3 id="closing-form-title">{t.formTitle}</h3>
        <input className="honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <div className="closing-form__fields">
          <div className={fieldClass("name")}>
            <div className="closing-form__control">
              <input id="closing-name" name="name" type="text" autoComplete="name" required maxLength={160} {...errorProps("name")} {...track("name")} />
              <label htmlFor="closing-name">{contact.name}</label>
            </div>
            {errorText("name")}
          </div>
          <div className={fieldClass("phone", "closing-form__field--phone")}>
            <div className="closing-form__control">
              <span className="closing-form__prefix">
                <select name="phonePrefix" aria-label={t.phonePrefix} defaultValue="+355" onChange={(event) => revalidate("phone", event.currentTarget.form, false)}>
                  {phonePrefixes.map((prefix) => <option key={prefix.code} value={prefix.dial}>{prefix.code} {prefix.dial}</option>)}
                </select>
                <ChevronDown size={14} aria-hidden="true" />
              </span>
              <span className="closing-form__input">
                <input id="closing-phone" name="phoneNumber" type="tel" inputMode="tel" autoComplete="tel-national" required maxLength={20} {...errorProps("phone")} {...track("phone")} />
                <label htmlFor="closing-phone">{t.phone}</label>
              </span>
            </div>
            {errorText("phone")}
          </div>
          <div className={fieldClass("email")}>
            <div className="closing-form__control">
              <input id="closing-email" name="email" type="email" autoComplete="email" maxLength={254} {...errorProps("email")} {...track("email")} />
              <label htmlFor="closing-email">{contact.email} <span>({contact.optional})</span></label>
            </div>
            {errorText("email")}
          </div>
        </div>
        <div className={fieldClass("message", "closing-form__message")}>
          <div className="closing-form__control">
            <textarea id="closing-message" name="message" rows={3} required maxLength={3000} {...errorProps("message")} {...track("message")} />
            <label htmlFor="closing-message">{t.message}</label>
          </div>
          {errorText("message")}
        </div>
        <div className="closing-form__actions">
          <p className="closing-form__status" role="status" aria-live="polite">{state === "success" ? contact.success : state === "unavailable" ? t.unavailable : state === "rateLimited" ? t.rateLimited : state === "error" ? contact.error : ""}</p>
          <button type="submit" disabled={state === "sending"}>{state === "sending" ? contact.sending : t.submit}<ArrowUpRight size={16} aria-hidden="true" /></button>
        </div>
      </form>
      <footer className="closing-footer">
        <h2 id="closing-title">{t.footerTitle.map((line) => <span key={line}>{line}</span>)}</h2>
        <p className="closing-footer__mark">© {siteConfig.name.toLowerCase()} {year}</p>
      </footer>
    </section>
  );
}
