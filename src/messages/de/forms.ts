export default {
  contact: {
    name: { label: "Name *", placeholder: "Ihr Name" },
    email: { label: "E-Mail *", placeholder: "ihre@email.de" },
    phone: { label: "Telefon", placeholder: "+49 ..." },
    company: { label: "Unternehmen", placeholder: "Ihre Firma" },
    service: {
      label: "Gewünschte Leistung",
      placeholder: "Leistung wählen (optional)",
    },
    message: {
      label: "Nachricht *",
      placeholder: "Erzählen Sie uns von Ihrem Projekt...",
    },
    submit: "Nachricht senden",
    success: "Vielen Dank! Wir melden uns innerhalb von 24 Stunden.",
    error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
  },
  quote: {
    name: { label: "Name *" },
    email: { label: "E-Mail *" },
    phone: { label: "Telefon" },
    company: { label: "Unternehmen" },
    service: {
      label: "Leistung *",
      placeholder: "Leistung wählen *",
    },
    budget: {
      label: "Budget",
      placeholder: "Budget wählen",
      options: {
        "5000-10000": "5.000 – 10.000 €",
        "10000-20000": "10.000 – 20.000 €",
        "20000+": "20.000 €+",
      },
    },
    timeline: {
      label: "Zeitrahmen",
      placeholder: "Zeitrahmen wählen",
      options: {
        asap: "So schnell wie möglich",
        "1-3-months": "1–3 Monate",
        "3-6-months": "3–6 Monate",
        flexible: "Flexibel",
      },
    },
    description: {
      label: "Projektbeschreibung",
      placeholder: "Beschreiben Sie Ihr Projekt...",
    },
    submit: "Angebot anfordern",
    success:
      "Angebotsanfrage erhalten! Wir erstellen Ihr individuelles Angebot.",
    error: "Fehler beim Senden. Bitte versuchen Sie es erneut.",
  },
  booking: {
    calendlyHint:
      "Für die schnellste Terminbuchung nutzen Sie unseren Online-Kalender:",
    calendlyLink: "Termin über Calendly buchen",
    formToggleClosed: "Alternativ: Anfrage per Formular",
    formToggleOpen: "Anfrage per Formular",
    name: { label: "Name *" },
    email: { label: "E-Mail *" },
    phone: { label: "Telefon" },
    date: { label: "Datum *" },
    time: {
      label: "Uhrzeit *",
      placeholder: "Uhrzeit wählen *",
      suffix: "Uhr",
      noSlots: "Keine Termine verfügbar. Bitte wählen Sie ein anderes Datum.",
    },
    service: {
      label: "Beratungsart",
      placeholder: "Art der Beratung",
      freeConsultation: "Kostenlose Erstberatung",
    },
    notes: {
      label: "Anmerkungen",
      placeholder: "Was möchten Sie besprechen?",
    },
    submit: "Terminanfrage senden",
    success: "Terminanfrage erhalten! Bestätigung per E-Mail folgt.",
    error: "Fehler bei der Buchung. Bitte versuchen Sie es erneut.",
  },
  newsletter: {
    email: {
      label: "E-Mail-Adresse",
      placeholder: "Ihre E-Mail-Adresse",
    },
    submit: "Abonnieren",
    success:
      "Bitte bestätigen Sie Ihre Anmeldung über den Link in Ihrer E-Mail.",
    error: "Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.",
  },
  consent: {
    label: "Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten zu. *",
    privacyLink: "Datenschutzerklärung",
  },
  common: {
    networkError: "Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung.",
    genericError: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    required: "Pflichtfeld",
    sending: "Wird gesendet…",
  },
  validation: {
    nameMin: "Name muss mindestens 2 Zeichen haben.",
    emailInvalid: "Ungültige E-Mail-Adresse.",
    messageMin: "Nachricht muss mindestens 10 Zeichen haben.",
    serviceRequired: "Bitte wählen Sie eine Leistung.",
    dateRequired: "Bitte wählen Sie ein Datum.",
    timeRequired: "Bitte wählen Sie eine Uhrzeit.",
    consentRequired: "Bitte stimmen Sie der Datenschutzerklärung zu.",
  },
};
