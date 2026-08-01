import { publicEnv } from "@/lib/env.public";

export const SITE_CONFIG = {
  name: publicEnv.site.name,
  title: `${publicEnv.site.name} – Premium KI-Agentur`,
  description:
    "AVYZOR entwickelt Premium-Websites, KI-Chatbots und Automatisierungen für Unternehmen, die Exzellenz erwarten. Ihre KI-Agentur für digitale Transformation auf höchstem Niveau.",
  url: publicEnv.siteUrl,
  email: publicEnv.site.email,
  phone: publicEnv.site.phone,
  phoneHref: publicEnv.site.phoneHref,
  whatsapp: publicEnv.site.whatsapp || "491234567890",
  calendly: publicEnv.calendly || "https://calendly.com/avyzor",
  address: {
    street: publicEnv.site.addressStreet,
    city: publicEnv.site.addressCity,
    zip: publicEnv.site.addressZip,
    country: publicEnv.site.addressCountry,
  },
  legal: {
    name: publicEnv.site.legalName || publicEnv.site.name,
    representative: publicEnv.site.legalRepresentative,
    vatId: publicEnv.site.vatId,
    registerCourt: publicEnv.site.registerCourt,
    registerNumber: publicEnv.site.registerNumber,
  },
  social: {
    linkedin: publicEnv.site.linkedin,
    instagram: publicEnv.site.instagram,
    twitter: publicEnv.site.twitter,
  },
} as const;

export const SERVICES = [
  {
    id: "premium-websites",
    title: "Premium-Websites",
    description:
      "Maßgeschneiderte Web-Erlebnisse, die Ihre Marke auf höchstem Niveau repräsentieren. Schnell, responsiv und conversion-optimiert.",
    icon: "Globe",
    features: [
      "Individuelles Design",
      "Next.js Performance",
      "SEO-Optimierung",
      "Mobile First",
    ],
  },
  {
    id: "ki-chatbots",
    title: "KI-Chatbots",
    description:
      "Intelligente Chatbots, die Ihre Kunden 24/7 betreuen, Leads qualifizieren und Ihren Support entlasten.",
    icon: "Bot",
    features: [
      "GPT-4 Integration",
      "Mehrsprachig",
      "Lead-Qualifizierung",
      "CRM-Anbindung",
    ],
  },
  {
    id: "ki-automatisierungen",
    title: "KI-Automatisierungen",
    description:
      "Automatisieren Sie repetitive Prozesse mit KI und sparen Sie bis zu 80% Ihrer Arbeitszeit.",
    icon: "Zap",
    features: [
      "Workflow-Automation",
      "Datenverarbeitung",
      "E-Mail-Automation",
      "API-Integration",
    ],
  },
  {
    id: "terminbuchung",
    title: "Terminbuchung",
    description:
      "Nahtlose Terminbuchungssysteme, die sich in Ihre Website und Ihr CRM integrieren.",
    icon: "Calendar",
    features: [
      "Online-Kalender",
      "Erinnerungen",
      "CRM-Sync",
      "Zahlungsintegration",
    ],
  },
  {
    id: "crm-integration",
    title: "CRM-Integration",
    description:
      "Verbinden Sie alle Ihre Systeme für einen nahtlosen Datenfluss und maximale Effizienz.",
    icon: "Link",
    features: [
      "HubSpot & Salesforce",
      "Custom APIs",
      "Daten-Sync",
      "Reporting",
    ],
  },
  {
    id: "seo",
    title: "SEO",
    description:
      "Dominieren Sie die Suchergebnisse mit datengetriebener SEO-Strategie und technischer Exzellenz.",
    icon: "Search",
    features: [
      "Keyword-Analyse",
      "Technisches SEO",
      "Content-Strategie",
      "Ranking-Monitoring",
    ],
  },
  {
    id: "wartung",
    title: "Wartung & Support",
    description:
      "Premium-Wartungspakete für maximale Verfügbarkeit, Sicherheit und Performance Ihrer Systeme.",
    icon: "Shield",
    features: [
      "24/7 Monitoring",
      "Security Updates",
      "Performance-Optimierung",
      "Priority Support",
    ],
  },
] as const;

export const NEUKUNDEN_PLAN = {
  id: "neukunde",
  name: "Einstieg",
  badge: "NEUKUNDE",
  price: 1990,
  description:
    "Der perfekte Start für Neukunden – professionell online gehen, ohne Premium-Budget.",
  features: [
    "Professionelle Landing Page",
    "Mobile-optimiertes Design",
    "Kontaktformular inklusive",
    "Basis SEO-Setup",
    "Lieferung in 2 Wochen",
    "1 Monat E-Mail-Support",
  ],
  cta: "Jetzt einsteigen",
} as const;

export const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 4990,
    description: "Ideal für ambitionierte Unternehmen, die digital durchstarten wollen.",
    features: [
      "Premium One-Page Website",
      "Responsive Design",
      "Basis SEO-Setup",
      "Kontaktformular",
      "3 Monate Support",
      "SSL & Hosting-Setup",
    ],
    highlighted: false,
    cta: "Anfrage stellen",
  },
  {
    id: "professional",
    name: "Professional",
    price: 9990,
    description: "Das Komplettpaket für Unternehmen, die online dominieren wollen.",
    features: [
      "Multi-Page Premium Website",
      "KI-Chatbot Integration",
      "Erweiterte SEO-Strategie",
      "CRM-Integration",
      "Terminbuchungssystem",
      "6 Monate Premium Support",
      "Analytics Dashboard",
      "Newsletter-Integration",
    ],
    highlighted: true,
    cta: "Anfrage stellen",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 19990,
    description: "Maßgeschneiderte Lösungen für Unternehmen mit höchsten Ansprüchen.",
    features: [
      "Vollständige Digital-Plattform",
      "Custom KI-Automatisierungen",
      "Multi-Channel Chatbots",
      "Enterprise CRM-Setup",
      "Dedicated Account Manager",
      "12 Monate Premium Support",
      "Priority SLA",
      "Schulungen & Workshops",
      "White-Label Option",
    ],
    highlighted: false,
    cta: "Beratung buchen",
  },
] as const;

export const WHY_AVYZOR = [
  {
    title: "Premium-Qualität",
    description:
      "Jedes Projekt wird mit höchster Sorgfalt und Liebe zum Detail umgesetzt – keine Kompromisse.",
    icon: "Award",
  },
  {
    title: "KI-Expertise",
    description:
      "Wir setzen modernste KI-Technologien ein, um Ihnen einen echten Wettbewerbsvorteil zu verschaffen.",
    icon: "Brain",
  },
  {
    title: "Messbare Ergebnisse",
    description:
      "Datengetriebene Strategien mit klaren KPIs – Sie sehen genau, was Ihre Investition bewirkt.",
    icon: "TrendingUp",
  },
  {
    title: "Persönlicher Service",
    description:
      "Ein dedizierter Ansprechpartner begleitet Sie von der Idee bis zum Launch und darüber hinaus.",
    icon: "Users",
  },
] as const;

export const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Luxus-Immobilien Portal",
    category: "Premium Website",
    description: "Exklusive Immobilienplattform mit 360°-Touren und KI-Beratung.",
    image: "/portfolio/luxus-immobilien.jpg",
    results: ["+340% Leads", "2.1s Ladezeit", "98 Lighthouse Score"],
    isExample: true,
  },
  {
    id: 2,
    title: "MedTech KI-Assistent",
    category: "KI-Chatbot",
    description: "Intelligenter Patienten-Assistent für eine führende MedTech-Firma.",
    image: "/portfolio/medtech-ki-assistent.jpg",
    results: ["-60% Support-Kosten", "24/7 Verfügbar", "4.9/5 Zufriedenheit"],
    isExample: true,
  },
  {
    id: 3,
    title: "FinTech Automatisierung",
    category: "KI-Automation",
    description: "End-to-End Automatisierung der Kundenakquise für ein FinTech-Startup.",
    image: "/portfolio/fintech-automatisierung.jpg",
    results: ["80% Zeitersparnis", "+200% Conversion", "ROI in 3 Monaten"],
    isExample: true,
  },
  {
    id: 4,
    title: "Premium E-Commerce",
    category: "Premium Website",
    description: "Luxus-E-Commerce-Plattform mit personalisiertem KI-Shopping-Assistenten.",
    image: "/portfolio/premium-ecommerce.jpg",
    results: ["+180% Umsatz", "+45% AOV", "99.9% Uptime"],
    isExample: true,
  },
] as const;

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Dr. Marcus Weber",
    role: "Geschäftsführer, Weber MedTech GmbH",
    content:
      "AVYZOR hat unsere digitale Präsenz komplett transformiert. Der KI-Chatbot allein spart uns 20 Stunden pro Woche. Absolute Premium-Qualität.",
    rating: 5,
    isExample: true,
  },
  {
    id: 2,
    name: "Sarah Hoffmann",
    role: "Marketing Director, LuxHomes AG",
    content:
      "Von der ersten Beratung bis zum Launch – alles auf höchstem Niveau. Unsere neue Website generiert 3x mehr qualifizierte Leads.",
    rating: 5,
    isExample: true,
  },
  {
    id: 3,
    name: "Thomas Klein",
    role: "CEO, FinFlow Solutions",
    content:
      "Die KI-Automatisierungen von AVYZOR haben unseren Vertrieb revolutioniert. ROI bereits nach 3 Monaten erreicht. Absolut empfehlenswert.",
    rating: 5,
    isExample: true,
  },
  {
    id: 4,
    name: "Julia Richter",
    role: "Inhaberin, Richter & Partner",
    content:
      "Endlich eine Agentur, die versteht, was Premium wirklich bedeutet. Exzellente Kommunikation und Ergebnisse, die überzeugen.",
    rating: 5,
    isExample: true,
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Was unterscheidet AVYZOR von anderen Agenturen?",
    answer:
      "AVYZOR konzentriert sich ausschließlich auf Premium-Projekte ab 5.000 €. Wir kombinieren erstklassiges Design mit modernster KI-Technologie und bieten einen persönlichen, dedizierten Service – keine Massenabfertigung.",
  },
  {
    question: "Wie lange dauert ein typisches Projekt?",
    answer:
      "Je nach Umfang zwischen 4 und 12 Wochen. Ein Starter-Projekt ist in 4–6 Wochen fertig, Enterprise-Lösungen benötigen 8–12 Wochen. Wir erstellen einen detaillierten Zeitplan vor Projektstart.",
  },
  {
    question: "Bieten Sie auch Wartung und Support an?",
    answer:
      "Ja, alle Pakete beinhalten Premium-Support. Zusätzlich bieten wir langfristige Wartungsverträge mit 24/7-Monitoring, Security-Updates und Priority-Support.",
  },
  {
    question: "Kann ich mein Projekt in Raten bezahlen?",
    answer:
      "Ja, wir bieten flexible Zahlungspläne: 50% bei Projektstart, 50% bei Fertigstellung. Für Enterprise-Kunden sind individuelle Zahlungsmodelle möglich.",
  },
  {
    question: "Welche KI-Technologien setzen Sie ein?",
    answer:
      "Wir arbeiten mit GPT-4, Claude, Custom ML-Modellen und modernsten Automatisierungs-Frameworks. Die Technologie wählen wir stets passend zu Ihrem Use Case.",
  },
  {
    question: "Arbeiten Sie auch mit bestehenden Systemen?",
    answer:
      "Absolut. Wir integrieren nahtlos in Ihre bestehende Infrastruktur – CRM, ERP, Buchhaltung, Marketing-Tools und mehr.",
  },
] as const;
