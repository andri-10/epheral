import type { Locale } from "@/content/site-config";
import { siteConfig } from "@/content/site-config";
import type { Dictionary } from "@/i18n/types";
import { ContactForm } from "@/components/contact-form";

export function ContactSection({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  return (
    <section className="contact-band" id="contact"><div className="section contact-inner"><div className="contact-heading" data-reveal><span className="eyebrow">06 · {dictionary.contact.eyebrow}</span><h2>{dictionary.contact.title}</h2><p>{dictionary.contact.intro}</p><span className="contact-email">{siteConfig.email}</span></div><ContactForm locale={locale} dictionary={dictionary} /></div></section>
  );
}
