export class AssistantServiceError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(
    message: string,
    code = "ASSISTANT_ERROR",
    status = 500
  ) {
    super(message);
    this.name = "AssistantServiceError";
    this.code = code;
    this.status = status;
  }
}

export class AssistantApiError extends Error {
  readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "AssistantApiError";
    this.code = code;
  }
}
