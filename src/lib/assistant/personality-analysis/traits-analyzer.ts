/**
 * Persönlichkeitsanalyse – Merkmalserkennung
 *
 * Analysiert Schreibstil, Satzlänge, Wortwahl, Höflichkeit u. a.
 */

import type { CommunicationTraits } from "./types";
import type { ScoringMessage } from "../lead-scoring/types";

function getUserMessages(messages: ScoringMessage[]): ScoringMessage[] {
  return messages.filter((m) => m.role === "user");
}

function joinUserText(messages: ScoringMessage[]): string {
  return getUserMessages(messages)
    .map((m) => m.content)
    .join("\n");
}

function containsAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

function avgWordsPerSentence(text: string): number {
  const sentences = text.split(/[.!?…]+/).filter((s) => s.trim().length > 0);
  if (sentences.length === 0) return 0;
  const totalWords = sentences.reduce(
    (sum, s) => sum + s.trim().split(/\s+/).length,
    0
  );
  return totalWords / sentences.length;
}

function analyzeWritingStyle(text: string): CommunicationTraits["writingStyle"] {
  const lower = text.toLowerCase();
  if (containsAny(lower, [/\b(sie|ihnen|ihrer)\b/i]) && !/\bdu\b|\bdich\b|\bdir\b/i.test(lower)) {
    return "formal";
  }
  if (containsAny(lower, [/\b(du|dich|dir|hey|hi|hallo)\b/i])) {
    return "informal";
  }
  return "neutral";
}

function analyzeSentenceLength(text: string): CommunicationTraits["avgSentenceLength"] {
  const avg = avgWordsPerSentence(text);
  if (avg <= 8) return "short";
  if (avg <= 18) return "medium";
  return "long";
}

function analyzeVocabulary(text: string): CommunicationTraits["vocabulary"] {
  const lower = text.toLowerCase();
  if (
    containsAny(lower, [
      /api|sdk|framework|next\.?js|react|seo|crm|hosting|ssl|backend|frontend|integration/i,
    ])
  ) {
    return "technical";
  }
  if (
    containsAny(lower, [
      /roi|umsatz|kunden|conversion|lead|strategie|unternehmen|geschäft|investition|mehrwert/i,
    ])
  ) {
    return "business";
  }
  return "simple";
}

function analyzePoliteness(text: string): CommunicationTraits["politeness"] {
  const lower = text.toLowerCase();
  let score = 0;
  if (containsAny(lower, [/bitte|danke|vielen dank|freundlich|gerne/i])) score += 2;
  if (containsAny(lower, [/\b(sie|ihnen)\b/i])) score += 1;
  if (containsAny(lower, [/verdammt|mist|unverschämt|schlecht/i])) score -= 2;
  if (score >= 2) return "high";
  if (score <= 0) return "low";
  return "medium";
}

function analyzeExpertise(text: string): CommunicationTraits["expertise"] {
  const lower = text.toLowerCase();
  const techTerms = (
    lower.match(
      /api|sdk|framework|next\.?js|react|seo|crm|hosting|ssl|backend|frontend|integration|automatisierung|chatbot/g
    ) ?? []
  ).length;
  if (techTerms >= 3) return "expert";
  if (techTerms >= 1) return "intermediate";
  return "novice";
}

function analyzeDecisionBehavior(text: string): CommunicationTraits["decisionBehavior"] {
  const lower = text.toLowerCase();
  if (
    containsAny(lower, [
      /unsicher|überlegen|nachdenken|vergleichen|vorsichtig|noch nicht/i,
    ])
  ) {
    return "cautious";
  }
  if (
    containsAny(lower, [
      /loslegen|beauftragen|starten|termin buchen|ja,? gerne|machen wir/i,
    ])
  ) {
    return "decisive";
  }
  return "balanced";
}

function analyzeBudgetOrientation(text: string): CommunicationTraits["budgetOrientation"] {
  const lower = text.toLowerCase();
  if (
    containsAny(lower, [
      /premium|exklusiv|qualität|beste|hochwertig|kein kompromiss|erstklassig/i,
    ])
  ) {
    return "premium";
  }
  if (
    containsAny(lower, [
      /preis|kosten|budget|günstig|teuer|raten|euro|€|investition/i,
    ])
  ) {
    return "price";
  }
  return "balanced";
}

function analyzeQuestionDetail(messages: ScoringMessage[]): CommunicationTraits["questionDetail"] {
  const userMessages = getUserMessages(messages);
  const questions = userMessages.filter((m) => m.content.includes("?"));
  const avgQuestionLength =
    questions.length > 0
      ? questions.reduce((sum, m) => sum + m.content.length, 0) / questions.length
      : 0;

  if (questions.length >= 3 && avgQuestionLength > 60) return "deep";
  if (questions.length >= 1 && avgQuestionLength > 30) return "moderate";
  return "shallow";
}

function analyzeDecisionSpeed(
  text: string,
  messageCount: number
): CommunicationTraits["decisionSpeed"] {
  const lower = text.toLowerCase();
  if (
    containsAny(lower, [
      /sofort|schnell|asap|dringend|eilig|heute|morgen|zeitnah/i,
    ])
  ) {
    return "fast";
  }
  if (
    containsAny(lower, [/später|irgendwann|überlegen|noch nicht|in paar monaten/i]) ||
    messageCount >= 6
  ) {
    return "slow";
  }
  return "medium";
}

function analyzeTone(text: string): CommunicationTraits["tone"] {
  const lower = text.toLowerCase();
  if (
    containsAny(lower, [
      /freue mich|begeistert|sorge|frustriert|enttäuscht|toll|super|schrecklich|!!/i,
    ])
  ) {
    return "emotional";
  }
  if (
    containsAny(lower, [
      /daten|fakten|analyse|vergleich|statistik|konkret|genau|begründ/i,
    ])
  ) {
    return "factual";
  }
  return "neutral";
}

/**
 * Analysiert Kommunikationsmerkmale aus dem Gesprächsverlauf.
 * Wird bei jeder Nachricht neu berechnet – Profile können sich ändern.
 */
export function analyzeCommunicationTraits(
  messages: ScoringMessage[]
): CommunicationTraits {
  const text = joinUserText(messages);
  const messageCount = getUserMessages(messages).length;

  return {
    writingStyle: analyzeWritingStyle(text),
    avgSentenceLength: analyzeSentenceLength(text),
    vocabulary: analyzeVocabulary(text),
    politeness: analyzePoliteness(text),
    expertise: analyzeExpertise(text),
    decisionBehavior: analyzeDecisionBehavior(text),
    budgetOrientation: analyzeBudgetOrientation(text),
    questionDetail: analyzeQuestionDetail(messages),
    decisionSpeed: analyzeDecisionSpeed(text, messageCount),
    tone: analyzeTone(text),
  };
}
