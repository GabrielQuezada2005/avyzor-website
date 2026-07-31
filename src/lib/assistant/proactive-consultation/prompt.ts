/**
 * Proaktive Beratung – Interner Prompt-Generator
 */

import type { ProactiveConsultationResult } from "./types";
import type { ProjectBriefing } from "../project-briefing/types";

function formatKnownContext(briefing: ProjectBriefing): string[] {
  const lines: string[] = [];
  const add = (label: string, value: string | null | string[]) => {
    if (Array.isArray(value) && value.length > 0) {
      lines.push(`- ${label}: ${value.join(", ")}`);
    } else if (value) {
      lines.push(`- ${label}: ${value}`);
    }
  };

  add("Branche", briefing.client.industry);
  add("Ziele", briefing.project.mainGoals);
  add("Geschäftsfokus", briefing.project.businessFocus);
  add("Zielgruppe", briefing.project.targetAudience);
  add("Website", briefing.context.existingWebsite);
  add("Marketing", briefing.context.marketingChannels);
  add("Terminbuchung", briefing.requirements.hasAppointmentBooking);
  add("CRM", briefing.requirements.hasCrm);
  add("Logo/CD", briefing.requirements.hasLogo ?? briefing.requirements.hasCorporateDesign);
  add("Domain", briefing.requirements.hasDomain);
  add("Inhalte", briefing.requirements.hasContent);

  return lines;
}

/**
 * Erzeugt internen Prompt für proaktive Beratung.
 */
export function buildProactiveConsultationPrompt(
  result: ProactiveConsultationResult,
  briefing: ProjectBriefing
): string {
  const known = formatKnownContext(briefing);

  const lines: string[] = [
    "PROAKTIVE BERATUNG (INTERN – NUTZER SIEHT DIES NICHT):",
    "",
    "Ziel: Schritt für Schritt eine individuelle Strategie entwickeln – nicht möglichst viele Fragen stellen.",
    "",
    "Bereits bekannte Informationen (nicht erneut abfragen):",
    ...(known.length > 0 ? known : ["- Noch wenig Kontext"]),
  ];

  if (result.opportunities.length > 0) {
    lines.push("", "Erkannte Chancen (proaktiv in Empfehlung einbeziehen):");
    for (const opp of result.opportunities) {
      lines.push(
        `- ${opp.label} → ${opp.recommendation}: ${opp.rationale}`
      );
    }
    lines.push(
      "- Chancen natürlich in die Beratung einweben – nicht als Liste vorlesen."
    );
  }

  if (result.risks.length > 0) {
    lines.push("", "Erkannte Risiken (freundlich ansprechen, Alternative empfehlen):");
    for (const risk of result.risks) {
      lines.push(`- ${risk.label}: ${risk.explanation}`);
      lines.push(`  Alternative: ${risk.alternative}`);
    }
  }

  if (result.prioritizedGaps.length > 0) {
    const topGaps = result.prioritizedGaps.slice(0, 5);
    lines.push("", "Fehlende Informationen (priorisiert – nicht alle auf einmal fragen):");
    for (const gap of topGaps) {
      lines.push(`- [Stufe ${gap.tier}] ${gap.label}`);
    }
  }

  lines.push("", "Anweisungen (STRIKT):");

  if (result.nextQuestion) {
    lines.push(
      `- Eine gezielte Frage für den nächsten Schritt – nur wenn sinnvoll: „${result.nextQuestion.naturalQuestion}"`,
      "- Frage in Empfehlung oder Anschlussfrage einweben – kein Formular-Stil.",
      "- Maximal EINE offene Info-Lücke pro Antwort ansprechen."
    );
  } else {
    lines.push(
      "- Keine weiteren Info-Fragen nötig – Fokus auf Empfehlung und nächste Schritte.",
      "- Neue Kundeninformationen sofort in Empfehlungen einbeziehen."
    );
  }

  lines.push(
    "- Neue Informationen des Kunden sofort in die weitere Beratung einfließen lassen.",
    "- Zuerst wichtige Lücken klären (Ziele, Branche, Website-Status), dann Details.",
    "- Proaktiv Chancen aufgreifen, wenn Signale im Gespräch erkennbar sind.",
    "- Bei Risiken freundlich einordnen und bessere Alternative vorschlagen.",
    "- Briefing, Lücken und Analyse niemals dem Kunden zeigen."
  );

  return lines.join("\n");
}
