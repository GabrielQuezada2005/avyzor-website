export class ServiceUnavailableError extends Error {
  readonly code = "SERVICE_UNAVAILABLE";

  constructor(message = "Backend-Dienste sind nicht konfiguriert") {
    super(message);
    this.name = "ServiceUnavailableError";
  }
}

export class PersistenceError extends Error {
  readonly code = "PERSISTENCE_ERROR";

  constructor(message = "Daten konnten nicht gespeichert werden") {
    super(message);
    this.name = "PersistenceError";
  }
}

export class EmailDeliveryError extends Error {
  readonly code = "EMAIL_ERROR";

  constructor(message = "E-Mail konnte nicht versendet werden") {
    super(message);
    this.name = "EmailDeliveryError";
  }
}
