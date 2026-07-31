/**
 * Empfehlungssystem – Interner Prompt-Generator
 *
 * Übersetzt Empfehlungen in KI-Anweisungen (unsichtbar für Nutzer).
 */

import type { RecommendationResult } from "./types";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Erzeugt internen Prompt mit Empfehlungslogik für die KI.
 * Der Nutzer sieht diese Analyse nie direkt.
 */
export function buildRecommendationPrompt(result: RecommendationResult): string {
  if (!result.shouldRecommend) {
    return `EMPFEHLUNGS-SYSTEM (INTERN – NUTZER SIEHT DIES NICHT):
Noch nicht genug Kontext für eine Paketempfehlung.
- Kurz beraten (80–180 Wörter, kurze Absätze).
- Eine gezielte Anschlussfrage stellen, um Kontext zu gewinnen.
- Keine Pakete oder Preise nennen, es sei denn der Kunde fragt explizit danach.`;
  }

  const { primary, addOns, needs } = result;
  const lines: string[] = [
    "EMPFEHLUNGS-SYSTEM (INTERN – NUTZER SIEHT DIES NICHT):",
    'Interne Analyse: "Welches Paket bringt diesem Kunden den größten Mehrwert?"',
    "",
  ];

  if (primary.type === "individual") {
    lines.push(
      "Empfehlung: Individuelle Lösung (kein Standardpaket passt optimal).",
      `Gründe: ${primary.reasons.join("; ")}`,
      "",
      "Anweisung an dich:",
      "- Empfehle eine individuelle Lösung – erkläre WARUM kein Standardpaket optimal passt.",
      "- Kurze Absätze (max. 2–3 Sätze), 80–180 Wörter.",
      "- Nach der Empfehlung: eine konkrete Anschlussfrage.",
      "- Biete ein unverbindliches Erstgespräch an, um den Umfang gemeinsam zu definieren."
    );
  } else {
    lines.push(
      `Empfohlenes Paket: ${primary.packageName}${primary.price ? ` (ab ${formatPrice(primary.price)} netto)` : ""}`,
      `Mehrwert: ${primary.valueProposition}`,
      `Gründe: ${primary.reasons.join("; ")}`,
      "",
      "Anweisung an dich:",
      `- Wenn du ein Paket empfiehlst, erkläre WARUM – z. B.: "Auf Grundlage Ihrer Anforderungen würde ich Ihnen das ${primary.packageName}-Paket empfehlen, da …"`,
      "- Kurze Absätze (max. 2–3 Sätze), 80–180 Wörter.",
      "- Nach der Empfehlung: eine konkrete Anschlussfrage zur Priorisierung oder Vertiefung.",
      "- Nenne niemals ein Paket ohne Begründung.",
      "- Bereits Genanntes nicht wiederholen."
    );
  }

  if (needs.goals.length > 0) {
    lines.push("", `Erkannte Ziele: ${needs.goals.join(", ")}`);
  }

  if (needs.features.length > 0) {
    lines.push(`Erkannte Funktionen: ${needs.features.join(", ")}`);
  }

  if (addOns.length > 0) {
    lines.push(
      "",
      "Mögliche Zusatzleistungen (NUR erwähnen wenn natürlich passend, max. 1–2, nicht aufdringlich):"
    );
    for (const addon of addOns) {
      lines.push(`- ${addon.name}: ${addon.reasons[0]}`);
    }
    lines.push(
      "- Zusatzleistungen nur beiläufig ansprechen, wenn sie echten Mehrwert bieten.",
      "- Niemals mehrere Add-ons gleichzeitig pushen."
    );
  }

  lines.push(
    "",
    `Lead-Kategorie: ${result.leadCategory} (Score ${result.leadScore}/100)`,
    "Erwähne Score, interne Analyse oder Kategorie niemals gegenüber dem Nutzer."
  );

  return lines.join("\n");
}

/**
 * Ob genug Kontext für eine Empfehlung vorliegt.
 * Niedrige Scores: erst beraten, nicht empfehlen.
 */
export function shouldGenerateRecommendation(
  messageCount: number,
  leadScore: number
): boolean {
  if (messageCount < 2) return false;
  if (leadScore < 20) return false;
  return true;
}
