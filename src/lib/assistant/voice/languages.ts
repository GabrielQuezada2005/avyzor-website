/**
 * Voice Mode – unterstützte Sprachen
 *
 * Zentral definiert für STT, TTS und manuelle Auswahl.
 */

export interface SupportedLanguage {
  /** BCP-47 Code, z. B. de-DE */
  code: string;
  /** Anzeigename in der UI */
  label: string;
  /** Kurzcode für kompakte Anzeige */
  short: string;
}

/** AVYZOR Voice Mode – unterstützte Sprachen. */
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "de-DE", label: "Deutsch", short: "DE" },
  { code: "en-US", label: "English", short: "EN" },
  { code: "es-ES", label: "Español", short: "ES" },
  { code: "fr-FR", label: "Français", short: "FR" },
  { code: "it-IT", label: "Italiano", short: "IT" },
];

export const DEFAULT_LANGUAGE = "de-DE";

export function getLanguageLabel(code: string): string {
  return (
    SUPPORTED_LANGUAGES.find((l) => l.code === code)?.label ??
    SUPPORTED_LANGUAGES.find((l) => code.startsWith(l.code.split("-")[0]))
      ?.label ??
    code
  );
}
