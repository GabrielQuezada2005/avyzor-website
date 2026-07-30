import type { AssistantConfig } from "./types";

export const ASSISTANT_CONFIG: AssistantConfig = {
  name: "AVYZOR Assistant",
  tagline: "Ihr Premium-Berater",
  welcomeMessage:
    "Willkommen bei AVYZOR. Ich bin Ihr digitaler Berater und helfe Ihnen bei Fragen zu unseren Premium-Leistungen, Preisen und Projekten. Wie kann ich Ihnen weiterhelfen?",
  placeholder: "Ihre Nachricht eingeben…",
  offlineMessage:
    "Derzeit im Demo-Modus – echte KI-Integration folgt in Kürze.",
  quickReplies: [
    {
      id: "services",
      label: "Leistungen",
      message: "Welche Leistungen bietet AVYZOR an?",
    },
    {
      id: "pricing",
      label: "Preise",
      message: "Was kosten eure Pakete?",
    },
    {
      id: "contact",
      label: "Kontakt",
      message: "Wie kann ich euch kontaktieren?",
    },
    {
      id: "timeline",
      label: "Projektdauer",
      message: "Wie lange dauert ein typisches Projekt?",
    },
  ],
  intents: [
    {
      id: "greeting",
      keywords: [
        "hallo",
        "hi",
        "hey",
        "guten tag",
        "guten morgen",
        "guten abend",
        "servus",
        "moin",
      ],
      response:
        "Guten Tag! Schön, dass Sie da sind. Ich begleite Sie gerne durch unsere Premium-Leistungen. Fragen Sie mich zu Websites, KI-Chatbots, Automatisierungen oder Preisen.",
    },
    {
      id: "services",
      keywords: [
        "leistung",
        "service",
        "angebot",
        "was bietet",
        "was macht",
        "website",
        "chatbot",
        "automatisierung",
        "seo",
        "crm",
        "terminbuchung",
        "wartung",
      ],
      response:
        "AVYZOR bietet sieben Premium-Leistungen:\n\n• Premium-Websites – maßgeschneidert & conversion-optimiert\n• KI-Chatbots – 24/7 Kundenbetreuung mit GPT-4\n• KI-Automatisierungen – bis zu 80 % Zeitersparnis\n• Terminbuchung – nahtlose Kalender-Integration\n• CRM-Integration – HubSpot, Salesforce & Custom APIs\n• SEO – datengetriebene Suchstrategien\n• Wartung & Support – 24/7 Monitoring\n\nMöchten Sie mehr zu einem Bereich erfahren?",
    },
    {
      id: "pricing",
      keywords: [
        "preis",
        "kosten",
        "paket",
        "budget",
        "investition",
        "teuer",
        "günstig",
        "euro",
        "€",
      ],
      response:
        "Unsere transparenten Pakete:\n\n• Starter – ab 4.990 € (One-Page Website, Basis-SEO, 3 Monate Support)\n• Professional – ab 9.990 € (Multi-Page, KI-Chatbot, CRM, Terminbuchung)\n• Enterprise – ab 19.990 € (Vollplattform, Custom KI, Dedicated Manager)\n\nAlle Pakete ohne versteckte Kosten. Zahlung: 50 % Start, 50 % bei Fertigstellung. Soll ich Sie zum Kontaktformular weiterleiten?",
    },
    {
      id: "contact",
      keywords: [
        "kontakt",
        "erreichen",
        "anfrage",
        "termin",
        "beratung",
        "email",
        "telefon",
        "whatsapp",
      ],
      response:
        "So erreichen Sie uns:\n\n• Kontaktformular – scrollen Sie zum Kontakt-Bereich auf dieser Seite\n• Terminbuchung – Calendly-Link im Kontaktbereich\n• WhatsApp – grüner Button unten rechts\n• E-Mail – kontakt@avyzor.de\n\nWir melden uns innerhalb von 24 Stunden persönlich bei Ihnen.",
    },
    {
      id: "timeline",
      keywords: [
        "dauer",
        "zeit",
        "wann",
        "fertig",
        "projektdauer",
        "wochen",
        "monate",
        "schnell",
      ],
      response:
        "Typische Projektlaufzeiten:\n\n• Starter – 4–6 Wochen\n• Professional – 6–8 Wochen\n• Enterprise – 8–12 Wochen\n\nVor Projektstart erstellen wir einen detaillierten Zeitplan. Express-Optionen sind auf Anfrage möglich.",
    },
    {
      id: "portfolio",
      keywords: [
        "portfolio",
        "referenz",
        "projekt",
        "beispiel",
        "case",
        "kunde",
        "erfolg",
      ],
      response:
        "Unsere Referenzprojekte umfassen u. a.:\n\n• Luxus-Immobilien Portal (+340 % Leads)\n• MedTech KI-Assistent (−60 % Support-Kosten)\n• FinTech Automatisierung (ROI in 3 Monaten)\n• Premium E-Commerce (+180 % Umsatz)\n\nScrollen Sie zum Portfolio-Bereich für Details und Ergebnisse.",
    },
    {
      id: "why",
      keywords: [
        "warum",
        "unterschied",
        "besser",
        "vorteil",
        "qualität",
        "premium",
        "avyzor",
      ],
      response:
        "Was AVYZOR auszeichnet:\n\n• Premium-Qualität – keine Kompromisse, jedes Detail zählt\n• KI-Expertise – GPT-4, Claude & Custom ML\n• Messbare Ergebnisse – klare KPIs und Reporting\n• Persönlicher Service – dedizierter Ansprechpartner\n\nWir arbeiten ausschließlich an Premium-Projekten ab 5.000 € – keine Massenabfertigung.",
    },
    {
      id: "payment",
      keywords: [
        "raten",
        "zahlung",
        "bezahlen",
        "stripe",
        "finanzierung",
      ],
      response:
        "Flexible Zahlungsmodelle:\n\n• Standard: 50 % bei Projektstart, 50 % bei Fertigstellung\n• Enterprise: individuelle Zahlungspläne möglich\n• Online-Zahlung: über Stripe im Preisbereich\n\nGerne besprechen wir ein passendes Modell in einem Erstgespräch.",
    },
  ],
  fallbackResponses: [
    "Das ist eine gute Frage. Für detaillierte Informationen empfehle ich ein persönliches Gespräch – nutzen Sie unser Kontaktformular oder den WhatsApp-Button.",
    "Dazu kann ich Ihnen eine erste Orientierung geben. Für spezifische Anfragen steht Ihnen unser Team gerne zur Verfügung – kontakt@avyzor.de.",
    "Ich helfe Ihnen gerne weiter. Probieren Sie eine unserer Schnellantworten oder stellen Sie Ihre Frage anders – ich bin für Leistungen, Preise und Kontakt da.",
  ],
};
