/** Gemeinsame Fehlerklasse für serverseitige TTS-Generierung. */
export class TtsServiceError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status: number = 500
  ) {
    super(message);
    this.name = "TtsServiceError";
  }
}
