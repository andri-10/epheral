import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="sq"><body><main className="not-found"><span className="eyebrow">404</span><h1>Faqja nuk u gjet.</h1><Link className="button button--primary" href="/sq">Kthehu në faqen kryesore</Link></main></body></html>
  );
}
