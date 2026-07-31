/**
 * Einwandbehandlung – Einwand-Katalog
 *
 * Neue Einwandtypen: Eintrag hinzufügen – fertig.
 */

import type { ObjectionDefinition } from "./types";

export const OBJECTION_CATALOG: ObjectionDefinition[] = [
  {
    id: "too_expensive",
    label: "Preis zu hoch",
    priority: 90,
    patterns: [
      /zu teuer|zu viel|kostet zu|preis.*hoch|sprengt.*budget|finanziell.*schwer/i,
      /kann ich mir nicht leisten|steht nicht zur verfügung/i,
    ],
    summaryTemplate: "Der Kunde empfindet den Preis als zu hoch.",
    empathyExamples: [
      "Das kann ich gut nachvollziehen. Eine Website ist eine Investition.",
      "Das verstehe ich – der Preis spielt eine wichtige Rolle.",
    ],
    explanationHints: [
      "Einstieg ab 1.990 Euro netto als Alternative erwähnen, wenn passend.",
      "Ratenzahlung ansprechen: 50 % Start, 50 % Fertigstellung.",
      "Geschäftlichen Nutzen betonen, nicht den Preis rechtfertigen.",
    ],
    followUpQuestions: [
      "Darf ich fragen, ob Ihre Sorge eher der Gesamtpreis oder die monatliche Belastung ist?",
      "Was hätten Sie ungefähr eingeplant?",
    ],
    nextStepOffers: [
      "Kleineren Umfang besprechen",
      "Unverbindliches Erstgespräch für individuelle Lösung",
    ],
    unresolvedFallback: [
      "Gespräch positiv beenden – kein Druck.",
      "Kontakt per E-Mail oder Erstgespräch anbieten, wenn der Kunde möchte.",
    ],
  },
  {
    id: "need_to_think",
    label: "Muss nachdenken",
    priority: 70,
    patterns: [
      /muss.*(überlegen|nachdenken)|will.*(überlegen|nachdenken)|bedenkzeit/i,
      /nicht so schnell|eile nicht|brauche zeit/i,
    ],
    summaryTemplate: "Der Kunde möchte sich Zeit zum Nachdenken nehmen.",
    empathyExamples: [
      "Das ist völlig in Ordnung – eine durchdachte Entscheidung ist wichtig.",
      "Das verstehe ich gut.",
    ],
    explanationHints: [
      "Raum geben – nicht nachhaken oder Druck ausüben.",
      "Kurz den Mehrwert in Erinnerung rufen, ohne zu verkaufen.",
    ],
    followUpQuestions: [
      "Gibt es etwas Bestimmtes, das Sie sich noch einmal anschauen möchten?",
      "Was wäre Ihnen für die Entscheidung noch wichtig zu wissen?",
    ],
    nextStepOffers: [
      "Später unverbindlich weitersprechen",
      "Informationen per E-Mail zusenden lassen",
    ],
    unresolvedFallback: [
      "Positiv verabschieden – Tür offen lassen.",
      "Kontaktmöglichkeit nennen, ohne Follow-up-Druck.",
    ],
  },
  {
    id: "compare_offers",
    label: "Angebote vergleichen",
    priority: 75,
    patterns: [
      /angebote vergleichen|vergleich|andere anbieter|andere agentur|konkurrenz/i,
      /noch.*(angebote|offerten).*holen|mehrere angebote/i,
    ],
    summaryTemplate: "Der Kunde möchte Angebote vergleichen.",
    empathyExamples: [
      "Das verstehe ich. Viele unserer Kunden haben anfangs ebenfalls Angebote verglichen.",
      "Das ist ein guter Ansatz – Vergleiche bringen Klarheit.",
    ],
    explanationHints: [
      "Fester Ansprechpartner und transparente Festpreise als Differenzierung.",
      "Nicht schlecht über Wettbewerb sprechen.",
      "Auf Entscheidungskriterien des Kunden eingehen.",
    ],
    followUpQuestions: [
      "Darf ich fragen, worauf Sie bei Ihrer Entscheidung besonders achten?",
      "Was wäre für Sie der entscheidende Faktor?",
    ],
    nextStepOffers: [
      "Unverbindliches Erstgespräch für ehrlichen Vergleich",
      "Transparentes Festpreis-Angebot innerhalb von 48 Stunden",
    ],
    unresolvedFallback: [
      "Vergleich respektieren – kein Druck.",
      "Bei Fragen jederzeit erreichbar über Kontaktformular oder E-Mail.",
    ],
  },
  {
    id: "no_budget",
    label: "Kein Budget",
    priority: 85,
    patterns: [
      /kein budget|ohne budget|budget.*(fehlt|nicht|eng)|momentan kein geld/i,
      /finanzielle.*(eng|schwierig)|gerade knapp/i,
    ],
    summaryTemplate: "Der Kunde hat momentan kein Budget.",
    empathyExamples: [
      "Das kann ich gut verstehen – Budget ist oft der limitierende Faktor.",
      "Kein Problem – lassen Sie uns schauen, was möglich ist.",
    ],
    explanationHints: [
      "Niemals ablehnen – kleinerer Umfang oder spätere Erweiterung anbieten.",
      "Einstieg ab 1.990 Euro netto als Option.",
      "Ratenzahlung erwähnen, wenn passend.",
    ],
    followUpQuestions: [
      "Was wäre Ihnen am wichtigsten, wenn Sie starten könnten?",
      "Gibt es einen Zeitraum, in dem sich das Budget ändern könnte?",
    ],
    nextStepOffers: [
      "Schrittweise Lösung planen",
      "Kostenloses Erstgespräch für realistische Einschätzung",
    ],
    unresolvedFallback: [
      "Verständnis zeigen – Tür offen lassen.",
      "Später kontaktieren, wenn Budget da ist.",
    ],
  },
  {
    id: "not_needed_now",
    label: "Gerade nicht benötigt",
    priority: 60,
    patterns: [
      /brauche.*(gerade|aktuell|momentan).*nicht|gerade nicht|aktuell nicht/i,
      /kein bedarf|nicht priorit|steht nicht an/i,
    ],
    summaryTemplate: "Der Kunde sieht aktuell keinen Bedarf.",
    empathyExamples: [
      "Das verstehe ich – Timing ist wichtig.",
      "Das ergibt Sinn.",
    ],
    explanationHints: [
      "Nicht überreden – Bedarf respektieren.",
      "Kurz den langfristigen Nutzen erwähnen, ohne zu drängen.",
    ],
    followUpQuestions: [
      "Gibt es einen Anlass, zu dem es relevant werden könnte?",
      "Was müsste sich ändern, damit es für Sie interessant wird?",
    ],
    nextStepOffers: [
      "Später unverbindlich weitersprechen",
      "Informationen für später bereithalten",
    ],
    unresolvedFallback: [
      "Positiv beenden – kein Druck.",
      "Kontakt jederzeit möglich.",
    ],
  },
  {
    id: "already_has_website",
    label: "Hat bereits Website",
    priority: 65,
    patterns: [
      /habe.*(schon|bereits).*website|bestehende website|alte website/i,
      /website.*(haben|vorhanden|existiert)/i,
    ],
    summaryTemplate: "Der Kunde hat bereits eine Website.",
    empathyExamples: [
      "Das ist gut – dann wissen Sie, worauf es ankommt.",
      "Verstanden – Sie sind also nicht bei null.",
    ],
    explanationHints: [
      "Unterschied zwischen Relaunch, Optimierung und Erweiterung klären.",
      "Nicht sofort Neubau empfehlen – Bedarf verstehen.",
    ],
    followUpQuestions: [
      "Sind Sie mit Ihrer aktuellen Website zufrieden, oder gibt es etwas, das Sie verbessern möchten?",
      "Was funktioniert gut – und was weniger?",
    ],
    nextStepOffers: [
      "Relaunch oder Optimierung besprechen",
      "Kostenlose Einschätzung im Erstgespräch",
    ],
    unresolvedFallback: [
      "Bestehende Website respektieren.",
      "Bei Bedarf später melden.",
    ],
  },
  {
    id: "uncertain",
    label: "Noch unsicher",
    priority: 55,
    patterns: [
      /unsicher|nicht sicher|weiß nicht|zweifle|schwanke/i,
      /noch.*(fragen|klären)|bin mir nicht sicher/i,
    ],
    summaryTemplate: "Der Kunde ist sich noch unsicher.",
    empathyExamples: [
      "Das ist völlig normal – eine solche Entscheidung braucht Klarheit.",
      "Unsicherheit ist ein guter Anlass, erst einmal in Ruhe zu besprechen.",
    ],
    explanationHints: [
      "Klarheit schaffen durch gezielte Fragen, nicht durch Verkauf.",
      "Raum geben – keine Entscheidung erzwingen.",
    ],
    followUpQuestions: [
      "Was würde Ihnen helfen, Klarheit zu gewinnen?",
      "Gibt es einen bestimmten Punkt, der Sie unsicher macht?",
    ],
    nextStepOffers: [
      "Unverbindliches Erstgespräch zur Klärung",
      "Schritt für Schritt gemeinsam durchgehen",
    ],
    unresolvedFallback: [
      "Unsicherheit respektieren.",
      "Kontakt anbieten, wenn der Kunde bereit ist.",
    ],
  },
  {
    id: "bad_experiences",
    label: "Schlechte Erfahrungen",
    priority: 80,
    patterns: [
      /schlechte erfahrung|enttäuscht|abgezockt|nicht zufrieden.*agentur/i,
      /schon.*(schlecht|negativ).*erfahr|vertrauen.*(verloren|schwer)/i,
    ],
    summaryTemplate: "Der Kunde hat schlechte Erfahrungen mit Agenturen gemacht.",
    empathyExamples: [
      "Das verstehe ich – und es ist leider häufiger, als es sein sollte.",
      "Das tut mir leid zu hören.",
    ],
    explanationHints: [
      "Fester Ansprechpartner und transparente Festpreise betonen.",
      "Vertrauen aufbauen durch Verständnis, nicht durch Gegenargumente.",
      "Nicht die Branche schlecht reden.",
    ],
    followUpQuestions: [
      "Was ist Ihnen bei einer Zusammenarbeit besonders wichtig?",
      "Was wäre für Sie ein Zeichen, dass es diesmal anders läuft?",
    ],
    nextStepOffers: [
      "Unverbindliches Kennenlerngespräch ohne Verpflichtung",
      "Transparentes Festpreis-Angebot vor Projektstart",
    ],
    unresolvedFallback: [
      "Vertrauen braucht Zeit – kein Druck.",
      "Bei Interesse jederzeit erreichbar.",
    ],
  },
  {
    id: "need_to_consult_team",
    label: "Muss mit Partner/Team sprechen",
    priority: 72,
    patterns: [
      /partner.*(sprechen|besprechen|fragen)|team.*(sprechen|besprechen|entscheid)/i,
      /chef.*(fragen|besprechen)|geschäftsführ|kollegen.*(fragen|einbezieh)/i,
      /nicht allein.*entscheid|gemeinsam.*entscheid/i,
    ],
    summaryTemplate: "Der Kunde muss mit Partner oder Team sprechen.",
    empathyExamples: [
      "Das ist völlig verständlich – solche Entscheidungen trifft man selten allein.",
      "Gute Idee, das im Team abzustimmen.",
    ],
    explanationHints: [
      "Unterstützung anbieten – z. B. Infos für das Team.",
      "Nicht drängen – Entscheidungsprozess respektieren.",
    ],
    followUpQuestions: [
      "Gibt es Informationen, die ich Ihnen für das Gespräch mitgeben kann?",
      "Was wäre für Ihr Team der wichtigste Punkt?",
    ],
    nextStepOffers: [
      "Gemeinsames Erstgespräch mit Team/Partner",
      "Zusammenfassung per E-Mail für interne Abstimmung",
    ],
    unresolvedFallback: [
      "Entscheidungsprozess respektieren.",
      "Bei Bedarf jederzeit erreichbar.",
    ],
  },
  {
    id: "do_later",
    label: "Später machen",
    priority: 50,
    patterns: [
      /später|nächstes jahr|nächstes quartal|irgendwann|in paar monaten/i,
      /noch nicht.*(jetzt|heute)|verschieb|aufschieb/i,
    ],
    summaryTemplate: "Der Kunde möchte das Projekt verschieben.",
    empathyExamples: [
      "Das verstehe ich – Timing muss stimmen.",
      "Kein Problem – wann es für Sie passt, entscheiden Sie.",
    ],
    explanationHints: [
      "Timing respektieren – nicht überreden.",
      "Kurz den Vorteil frühen Starts erwähnen, nur wenn natürlich passend.",
    ],
    followUpQuestions: [
      "Gibt es einen ungefähren Zeitraum, an den Sie denken?",
      "Was müsste vorher geklärt sein?",
    ],
    nextStepOffers: [
      "Später unverbindlich weitersprechen",
      "Erstgespräch vorab für bessere Planung",
    ],
    unresolvedFallback: [
      "Verschiebung akzeptieren – positiv beenden.",
      "Kontakt offen halten.",
    ],
  },
];

/** Katalog nach ID – für schnellen Lookup. */
export const OBJECTION_BY_ID = Object.fromEntries(
  OBJECTION_CATALOG.map((o) => [o.id, o])
) as Record<string, ObjectionDefinition>;
