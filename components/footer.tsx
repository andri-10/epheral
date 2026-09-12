import Link from "next/link";
import type { Locale } from "@/content/site-config";
import { siteConfig } from "@/content/site-config";
import type { Dictionary } from "@/i18n/types";

export function Footer({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const other = locale === "sq" ? "en" : "sq";
  return (
    <footer className="site-footer">
      <div className="footer-lead"><span className="wordmark">{siteConfig.name}</span><p>{dictionary.footer.line}</p></div>
      <div className="footer-columns">
        <div><span className="footer-label">{dictionary.footer.navigation}</span><Link href={`/${locale}#work`}>{dictionary.nav.work}</Link><Link href={`/${locale}#services`}>{dictionary.nav.services}</Link><Link href={`/${locale}#process`}>{dictionary.nav.process}</Link><Link href={`/${locale}#about`}>{dictionary.nav.about}</Link></div>
        <div><span className="footer-label">{dictionary.footer.social}</span><span>{siteConfig.social.instagram}</span><span>{siteConfig.social.linkedin}</span></div>
        <div><span className="footer-label">{dictionary.localeName}</span><Link href={`/${other}`} lang={other}>{other.toUpperCase()} · {other === "sq" ? "Shqip" : "English"}</Link><span>{siteConfig.location}</span></div>
      </div>
      <div className="footer-base"><span>© {new Date().getFullYear()} {siteConfig.name}</span><span>{dictionary.footer.availability}</span></div>
    </footer>
  );
}
