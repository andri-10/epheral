import type { Dictionary } from "./types";

export const sq: Dictionary = {
  localeName: "Shqip",
  nav: { work: "Projektet", services: "Shërbimet", process: "Procesi", about: "Rreth studios", contact: "Kontakt", menu: "Hap menunë", close: "Mbyll menunë", pricing: "Çmimet", language: "Gjuha", mainMenu: "Menuja kryesore" },
  common: { primaryCta: "Planifikoni një telefonatë", secondaryCta: "Shiko projektet", learnMore: "Shiko projektin", nextProject: "Projekti tjetër", backHome: "Kthehu në faqen kryesore", replaceAsset: "Pamje orientuese — zëvendësohet me projektin real" },
  hero: {
    eyebrow: "Studio e pavarur dizajni dhe zhvillimi",
    title: "Biznesi juaj ka karakter.\nFaqja duhet ta përcjellë.",
    support: "Faqe interneti me identitet për biznese me diçka reale për të ofruar.",
    stages: [
      { label: "Potenciali", line: "" }, { label: "Drejtimi", line: "Nga ideja, te drejtimi." },
      { label: "Detaji", line: "Çdo detaj ka peshë." }, { label: "Rezultati", line: "Mos e bëni thjesht të bukur, bëjeni tuajin." },
    ],
    scroll: "Lëviz për të parë procesin",
  },
  work: { eyebrow: "Projekte të përzgjedhura", title: "Çdo drejtim nis nga vetë biznesi.", intro: "Tre studime orientuese tregojnë si përshtatet qasja me sektorë dhe nevoja të ndryshme. Përmbajtja dhe pamjet reale shtohen më pas.", viewProject: "Hap studimin" },
  services: {
    eyebrow: "Shërbimet", title: "Gjithçka për biznesin tuaj në një vend.",
    items: [
      { title: "Përvojë në Web", copy: "Një faqe që pasqyron biznesin tuaj dhe e bën të thjeshtë kalimin nga vizita te kontakti ose rezervimi. E menduar për çdo ekran, me dizajn të dallueshëm dhe ndërveprime të kujdesshme.", includes: ["Dizajn dhe zhvillim me porosi", "Përshtatje për telefon, tablet dhe kompjuter", "Formularë kontakti, rezervime dhe integrime"] },
      { title: "Menu digjitale", copy: "Menuja juaj, gjithmonë pranë klientit. Prezantoni produktet me qartësi, mbani ofertat të përditësuara dhe krijoni një përvojë që i përshtatet ambientit tuaj.", includes: ["Qasje përmes QR dhe NFC", "Përditësim i produkteve, çmimeve dhe ofertave", "Menu në disa gjuhë"] },
      { title: "Vlerësim dhe reputacion", copy: "E bëjmë më të lehtë që klientët e kënaqur të ndajnë përvojën e tyre. Një rrugë e shkurtër drejt vlerësimit dhe një mënyrë e qartë për të shfaqur besimin që biznesi juaj ka fituar.", includes: ["Qasje e drejtpërdrejtë te vlerësimet përmes QR dhe NFC", "Integrim i vlerësimeve në faqen tuaj", "Prezantim i dëshmive dhe përvojave të klientëve"] },
      { title: "Kërkim dhe zbulim", copy: "Ndihmojmë që biznesi juaj të gjendet dhe të kuptohet më lehtë online. Organizojmë përmbajtjen dhe bazat teknike që lidhin kërkimin e klientit me ofertën tuaj.", includes: ["Strukturë dhe përmbajtje e përshtatur për kërkim", "Optimizim teknik për motorët e kërkimit", "Dukshmëri lokale dhe profil biznesi në Google"] },
    ],
  },
  pricing: {
    title: "Një ekip që i çon idetë përpara.",
    worksHeading: "Puna jonë",
    items: [
      {
        headline: "Shtëpi digjitale.",
        price: "Nga €290",
        features: ["Dizajn unik · deri në 5 faqe", "Zhvillim për çdo ekran", "Lëvizje, kontakt dhe rezervim", "Bazat e SEO-s", "Konfigurim i analitikës"],
      },
      {
        headline: "Shfletimi bëhet përvojë.",
        price: "Nga €690",
        features: ["Baza e paketës Essential", "Rrëfim përmes shfletimit", "Animacione dhe kalime", "Paralaks dhe ndërveprime", "Galeri interaktive · CMS"],
      },
      {
        headline: "Ekosistem që punon për ju.",
        price: "Nga €1290",
        features: ["Baza e paketës Immersive", "CMS · shumëgjuhësh", "Kërkim dhe konvertime", "Vlerësime · NFC · QR · menu", "Rezervime dhe integrime"],
      },
      {
        headline: "Vizion pa kufij.",
        price: "Flasim →",
        features: ["Aplikacione dhe portale", "Ndërveprim · WebGL · 3D", "Animacion i avancuar", "Panele · API · automatizim", "Arkitekturë CMS me porosi"],
      },
    ],
  },
  closing: {
    formTitle: "Një ide për të ndarë?", phone: "Numri i telefonit", phonePrefix: "Prefiksi i shtetit", nameError: "Shkruani emrin tuaj të plotë.", messageError: "Na tregoni pak më shumë (të paktën 10 karaktere).", message: "Mesazhi juaj", submit: "Dërgo",
    footerTitle: ["Le ta bëjmë", "realitet."], phoneError: "Shkruani një numër telefoni të vlefshëm.",
    unavailable: "Dërgimi i mesazheve është përkohësisht i padisponueshëm. Provoni përsëri më vonë.", rateLimited: "Shumë përpjekje. Provoni përsëri pas 15 minutash.",
  },
  principles: {
    eyebrow: "Parimet", title: "Një faqe e bukur nuk mjafton.", intro: "Duhet të jetë e qartë, e shpejtë dhe e dobishme — pa humbur karakterin.",
    items: [
      { title: "Me identitet", copy: "Një gjuhë vizuale që i përket biznesit tuaj, jo thjesht kategorisë së tij." },
      { title: "Me qëllim", copy: "Çdo vendim ndihmon kuptimin, orientimin ose veprimin." },
      { title: "Me performancë", copy: "Një ndërtim i matur që përgjigjet shpejt dhe funksionon kudo." },
    ],
    signals: ["Aksesueshmëri", "Sjellje responsive", "Asete efikase", "Core Web Vitals", "Reduced motion"],
    targets: "Objektiva teknike: LCP < 2.5s · INP < 200ms · CLS < 0.1",
  },
  process: {
    eyebrow: "Procesi", title: "Pa hapa të tepërt. Pa vendime të paqarta.", intro: "Procesi përshtatet me projektin, por drejtimi dhe vendimet mbeten gjithmonë të qarta.",
    items: [
      { title: "Kuptojmë biznesin", copy: "Nisim nga oferta, klientët dhe pengesa konkrete që faqja duhet të zgjidhë." },
      { title: "Vendosim drejtimin", copy: "Përcaktojmë prioritetet, strukturën dhe tonin para se të hyjmë në detaje." },
      { title: "Dizajnojmë dhe ndërtojmë", copy: "Dizajni dhe kodi ecin bashkë, me prova të vazhdueshme në ekrane reale." },
      { title: "Përsosim dhe publikojmë", copy: "Rregullojmë përmbajtjen, aksesueshmërinë dhe shpejtësinë para publikimit." },
    ],
  },
  about: { eyebrow: "Rreth studios", title: "Punë e afërt. Standard i lartë.", copy: "Jam [Your Name]. Nga [Location], drejtoj një studio të pavarur ku strategjia, dizajni, zhvillimi dhe lëvizja trajtohen si një punë e vetme.", detail: "Punoni drejtpërdrejt me personin që mendon, dizajnon dhe ndërton faqen — me më pak hallka dhe më shumë vëmendje te detajet që kanë rëndësi." },
  contact: {
    eyebrow: "Kontakti", title: "Le të ndërtojmë një faqe që i ngjan vërtet biznesit tuaj.", intro: "Më shkruani pak për biznesin dhe çfarë duhet të arrijë faqja. Do t’ju kthehem me pyetje konkrete dhe një hap të qartë vijues.",
    name: "Emri", email: "Email", business: "Biznesi ose kompania", brief: "Çfarë duhet të bëjë faqja për biznesin tuaj?", budget: "Buxheti", timeline: "Kur dëshironi të nisë?", optional: "Opsionale", consent: "Pranoj që këto të dhëna të përdoren vetëm për përgjigjen ndaj kërkesës sime.", submit: "Dërgo kërkesën", sending: "Duke dërguar…", success: "Kërkesa u dërgua. Do t’ju përgjigjem së shpejti.", unavailable: "Dërgimi nga faqja nuk është konfiguruar ende. Përdorni adresën e emailit pasi të jetë vendosur.", error: "Kërkesa nuk u dërgua. Ju lutem, provoni sërish pas pak.",
    budgetOptions: ["Zgjidhni një interval", "Nën €3,000", "€3,000–€6,000", "€6,000–€12,000", "Mbi €12,000"], timelineOptions: ["Zgjidhni një afat", "Brenda 1 muaji", "1–3 muaj", "3–6 muaj", "Jam fleksibël"],
    validation: { required: "Plotësoni këtë fushë.", email: "Shkruani një adresë emaili të vlefshme.", consent: "Konfirmoni pranimin para dërgimit.", tooLong: "Teksti është tepër i gjatë." },
  },
  footer: { line: "Faqe me identitet, ndërtuar me kujdes.", navigation: "Navigimi", social: "Rrjetet", availability: "I disponueshëm për projekte të përzgjedhura" },
  project: { context: "Konteksti", objective: "Objektivi", direction: "Drejtimi", deliverables: "Çfarë përfshin", placeholder: "Ky është një studim strukturor. Zëvendësojeni me pamjet dhe përmbajtjen e projektit real.", contactLine: "Keni një projekt me të njëjtën nevojë për qartësi?" },
  metadata: { title: "Epheral — Faqe interneti me identitet", description: "Dizajn dhe zhvillim faqesh interneti të dallueshme për biznese me diçka reale për të ofruar." },
};
