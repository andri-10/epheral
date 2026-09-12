import type { Dictionary } from "./types";

export const sq: Dictionary = {
  localeName: "Shqip",
  nav: { work: "Projektet", services: "Shërbimet", process: "Procesi", about: "Rreth studios", contact: "Kontakt", menu: "Hap menunë", close: "Mbyll menunë" },
  common: { primaryCta: "Flasim për projektin", secondaryCta: "Shiko projektet", learnMore: "Shiko projektin", nextProject: "Projekti tjetër", backHome: "Kthehu në faqen kryesore", replaceAsset: "Pamje orientuese — zëvendësohet me projektin real" },
  hero: {
    eyebrow: "Studio e pavarur dizajni dhe zhvillimi",
    title: "Biznesi juaj lë përshtypje. Edhe faqja e tij duhet ta bëjë.",
    support: "Strategji, dizajn dhe zhvillim për biznese me një ofertë të mirë dhe ambicie për ta paraqitur siç duhet.",
    stages: [
      { label: "Potencial", line: "Ka diçka të mirë këtu." }, { label: "Qartësi", line: "Fillimisht, qartësojmë çfarë ka rëndësi." },
      { label: "Drejtim", line: "Qartësia merr formë." }, { label: "Ndërtim", line: "Ndërveprimi i jep jetë." },
      { label: "Përsosje", line: "Çdo detaj mban peshën e vet." }, { label: "Rezultat", line: "Tani, ndihet si biznesi juaj." },
    ],
    scroll: "Lëviz për të parë procesin",
  },
  work: { eyebrow: "Projekte të përzgjedhura", title: "Çdo drejtim nis nga vetë biznesi.", intro: "Tre studime orientuese tregojnë si përshtatet qasja me sektorë dhe nevoja të ndryshme. Përmbajtja dhe pamjet reale shtohen më pas.", viewProject: "Hap studimin" },
  services: {
    eyebrow: "Shërbimet", title: "Qartësi në fillim. Cilësi deri në fund.",
    items: [
      { title: "Strategji dhe strukturë", copy: "Qartësojmë ofertën, audiencën dhe rrugën që duhet të ndjekë vizitori. Pastaj i japim përmbajtjes rendin e duhur.", includes: ["Hierarki përmbajtjeje", "UX dhe arkitekturë faqesh"] },
      { title: "Dizajn dhe ndërveprim", copy: "Një gjuhë vizuale me karakter, e kthyer në ndërfaqe që ndihet e qartë dhe e natyrshme në çdo ekran.", includes: ["Drejtim vizual", "Lëvizje dhe integrim 3D"] },
      { title: "Zhvillim dhe performancë", copy: "Dizajni kthehet në kod të shpejtë, të aksesueshëm dhe të lehtë për t’u mirëmbajtur.", includes: ["Zhvillim frontend", "Optimizim dhe mbështetje në publikim"] },
    ],
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
    name: "Emri", email: "Email", business: "Biznesi ose kompania", brief: "Çfarë duhet të bëjë faqja për biznesin tuaj?", budget: "Buxheti", timeline: "Kur dëshironi të nisë?", optional: "Jo e detyrueshme", consent: "Pranoj që këto të dhëna të përdoren vetëm për përgjigjen ndaj kërkesës sime.", submit: "Dërgo kërkesën", sending: "Duke dërguar…", success: "Kërkesa u dërgua. Do t’ju përgjigjem së shpejti.", unavailable: "Dërgimi nga faqja nuk është konfiguruar ende. Përdorni adresën e emailit pasi të jetë vendosur.", error: "Kërkesa nuk u dërgua. Ju lutem, provoni sërish pas pak.",
    budgetOptions: ["Zgjidhni një interval", "Nën €3,000", "€3,000–€6,000", "€6,000–€12,000", "Mbi €12,000"], timelineOptions: ["Zgjidhni një afat", "Brenda 1 muaji", "1–3 muaj", "3–6 muaj", "Jam fleksibël"],
    validation: { required: "Plotësoni këtë fushë.", email: "Shkruani një adresë emaili të vlefshme.", consent: "Konfirmoni pranimin para dërgimit.", tooLong: "Teksti është tepër i gjatë." },
  },
  footer: { line: "Faqe me identitet, ndërtuar me kujdes.", navigation: "Navigimi", social: "Rrjetet", availability: "I disponueshëm për projekte të përzgjedhura" },
  project: { context: "Konteksti", objective: "Objektivi", direction: "Drejtimi", deliverables: "Çfarë përfshin", placeholder: "Ky është një studim strukturor. Zëvendësojeni me pamjet dhe përmbajtjen e projektit real.", contactLine: "Keni një projekt me të njëjtën nevojë për qartësi?" },
  metadata: { title: "Living Canvas — Faqe interneti me identitet", description: "Dizajn dhe zhvillim faqesh interneti të dallueshme për biznese me diçka reale për të ofruar." },
};
