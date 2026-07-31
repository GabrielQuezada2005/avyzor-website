/**
 * Persönlichkeitsanalyse – Profil-Katalog
 *
 * Neue Persönlichkeitstypen: Eintrag hinzufügen – fertig.
 */

import type {
  CommunicationTraits,
  PersonalityAdaptations,
  PersonalityProfileDefinition,
} from "../types";

function adaptations(
  overrides: Partial<PersonalityAdaptations>
): PersonalityAdaptations {
  return {
    tone: "Professionell und natürlich",
    wordChoice: "Klar und verständlich",
    detailDepth: "Mittel – angepasst an den Kontext",
    responseLength: "2 bis 4 Sätze",
    followUpCount: "Maximal eine Rückfrage",
    salesStrategy: "Beratend, nicht verkäuferisch",
    explanationDepth: "Praxisnah mit geschäftlichem Nutzen",
    conversationPace: "Dem Kunden folgen",
    ...overrides,
  };
}

export const PERSONALITY_PROFILE_CATALOG: PersonalityProfileDefinition[] = [
  {
    id: "analytical",
    label: "Analytisch",
    scoreTraits: (t, text) => {
      let s = 0;
      if (t.tone === "factual") s += 30;
      if (t.questionDetail === "deep") s += 25;
      if (t.avgSentenceLength === "long") s += 15;
      if (/vergleich|analyse|daten|fakten|begründ|struktur/i.test(text)) s += 20;
      return s;
    },
    adaptations: adaptations({
      tone: "Sachlich und präzise",
      detailDepth: "Strukturiert mit klaren Begründungen",
      explanationDepth: "Logisch aufgebaut – erst Einordnung, dann Fazit",
      responseLength: "3 bis 4 Sätze mit klarer Struktur",
      followUpCount: "Eine gezielte Rückfrage zur Klärung",
    }),
  },
  {
    id: "technical",
    label: "Technisch",
    scoreTraits: (t, text) => {
      let s = 0;
      if (t.vocabulary === "technical") s += 35;
      if (t.expertise === "expert") s += 30;
      if (t.expertise === "intermediate") s += 15;
      if (/api|integration|framework|technik|system|hosting|ssl/i.test(text)) s += 20;
      return s;
    },
    adaptations: adaptations({
      tone: "Kompetent und präzise",
      wordChoice: "Fachlich korrekt, aber verständlich",
      detailDepth: "Mehr technische Details, wenn relevant",
      explanationDepth: "Technische Zusammenhänge kurz erklären",
      responseLength: "3 bis 5 Sätze bei technischen Fragen",
    }),
  },
  {
    id: "business",
    label: "Geschäftlich",
    scoreTraits: (t, text) => {
      let s = 0;
      if (t.vocabulary === "business") s += 35;
      if (/umsatz|roi|kunden|conversion|wachstum|strategie|unternehmen/i.test(text)) s += 25;
      if (t.writingStyle === "formal") s += 10;
      return s;
    },
    adaptations: adaptations({
      tone: "Geschäftlich und ergebnisorientiert",
      wordChoice: "Business-Sprache – Nutzen und Ergebnisse",
      explanationDepth: "Geschäftlicher Mehrwert und ROI betonen",
      salesStrategy: "Auf Geschäftsergebnisse fokussieren",
    }),
  },
  {
    id: "price_oriented",
    label: "Preisorientiert",
    scoreTraits: (t, text) => {
      let s = 0;
      if (t.budgetOrientation === "price") s += 40;
      if (/preis|kosten|budget|günstig|teuer|raten|euro|€/i.test(text)) s += 30;
      return s;
    },
    adaptations: adaptations({
      tone: "Verständnisvoll und transparent",
      wordChoice: "Fokus auf Nutzen, ROI und flexible Lösungen",
      explanationDepth: "Preis-Leistung und Optionen erklären",
      salesStrategy: "Wert betonen, Alternativen und Ratenzahlung ansprechen",
      responseLength: "2 bis 3 Sätze, klar und ehrlich",
    }),
  },
  {
    id: "cautious",
    label: "Vorsichtig",
    scoreTraits: (t, text) => {
      let s = 0;
      if (t.decisionBehavior === "cautious") s += 40;
      if (t.decisionSpeed === "slow") s += 20;
      if (/unsicher|überlegen|vorsichtig|noch nicht|vergleichen/i.test(text)) s += 25;
      return s;
    },
    adaptations: adaptations({
      tone: "Geduldig und vertrauensvoll",
      detailDepth: "Gründlich, aber nicht überwältigend",
      followUpCount: "Eine sanfte Rückfrage, kein Druck",
      salesStrategy: "Vertrauen aufbauen, Raum geben",
      conversationPace: "Langsam und respektvoll",
      responseLength: "2 bis 3 Sätze, beruhigend",
    }),
  },
  {
    id: "decisive",
    label: "Entscheidungsfreudig",
    scoreTraits: (t, text) => {
      let s = 0;
      if (t.decisionBehavior === "decisive") s += 40;
      if (t.decisionSpeed === "fast") s += 25;
      if (/loslegen|starten|beauftragen|termin|ja,? gerne/i.test(text)) s += 25;
      return s;
    },
    adaptations: adaptations({
      tone: "Selbstbewusst und direkt",
      responseLength: "2 bis 3 Sätze, klar und konkret",
      followUpCount: "Keine unnötigen Rückfragen – direkt antworten",
      salesStrategy: "Konkrete nächste Schritte anbieten",
      conversationPace: "Zügig und lösungsorientiert",
    }),
  },
  {
    id: "emotional",
    label: "Emotional",
    scoreTraits: (t, text) => {
      let s = 0;
      if (t.tone === "emotional") s += 45;
      if (/freue|begeistert|sorge|frustriert|enttäuscht|!!/i.test(text)) s += 30;
      return s;
    },
    adaptations: adaptations({
      tone: "Warm, empathisch und menschlich",
      wordChoice: "Emotionen anerkennen, dann sachlich einordnen",
      explanationDepth: "Erst Verständnis, dann Information",
      followUpCount: "Eine einfühlsame Rückfrage",
      salesStrategy: "Vertrauen vor Information",
    }),
  },
  {
    id: "curious",
    label: "Neugierig",
    scoreTraits: (t, text) => {
      let s = 0;
      if (t.questionDetail === "deep") s += 25;
      if (t.questionDetail === "moderate") s += 15;
      const questionCount = (text.match(/\?/g) ?? []).length;
      if (questionCount >= 2) s += 30;
      if (/wie funktioniert|was passiert|könnten sie|interessiert mich/i.test(text)) s += 20;
      return s;
    },
    adaptations: adaptations({
      tone: "Engagiert und informativ",
      detailDepth: "Etwas ausführlicher, wenn der Kunde viele Fragen stellt",
      followUpCount: "Gerne eine Rückfrage zum Weiterentdecken",
      explanationDepth: "Hintergründe kurz mitliefern",
      responseLength: "3 bis 4 Sätze",
    }),
  },
  {
    id: "hurried",
    label: "Eilig",
    scoreTraits: (t, text) => {
      let s = 0;
      if (t.decisionSpeed === "fast") s += 35;
      if (t.avgSentenceLength === "short") s += 20;
      if (/sofort|schnell|asap|dringend|eilig|kurz/i.test(text)) s += 35;
      return s;
    },
    adaptations: adaptations({
      tone: "Direkt und effizient",
      responseLength: "1 bis 2 Sätze – maximal knapp",
      detailDepth: "Nur das Wesentliche",
      followUpCount: "Keine Rückfrage, wenn nicht zwingend nötig",
      explanationDepth: "Kurz und auf den Punkt",
      conversationPace: "Schnell – keine Umschweife",
      salesStrategy: "Schnelle Lösung und nächster Schritt",
    }),
  },
  {
    id: "premium",
    label: "Premium-orientiert",
    scoreTraits: (t, text) => {
      let s = 0;
      if (t.budgetOrientation === "premium") s += 40;
      if (/premium|exklusiv|qualität|beste|hochwertig|erstklassig/i.test(text)) s += 35;
      if (t.politeness === "high") s += 10;
      return s;
    },
    adaptations: adaptations({
      tone: "Exklusiv und kompetent, nicht protzig",
      wordChoice: "Qualität, Exklusivität und langfristigen Mehrwert betonen",
      explanationDepth: "Premium-Positionierung durch Ergebnisse, nicht durch Floskeln",
      salesStrategy: "Individuelle Lösung und persönlicher Service hervorheben",
      responseLength: "2 bis 4 Sätze, souverän",
    }),
  },
];
