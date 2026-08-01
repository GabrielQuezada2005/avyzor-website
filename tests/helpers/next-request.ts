import { NextRequest } from "next/server";

interface MockRequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  ip?: string;
  omitForwardedFor?: boolean;
}

export function createMockRequest(options: MockRequestOptions = {}): NextRequest {
  const {
    method = "POST",
    body,
    headers = {},
    ip = "127.0.0.1",
    omitForwardedFor = false,
  } = options;

  const requestHeaders = new Headers({
    "content-type": "application/json",
    ...headers,
  });

  if (!omitForwardedFor && !requestHeaders.has("x-forwarded-for")) {
    requestHeaders.set("x-forwarded-for", ip);
  }

  return new NextRequest("http://localhost/api/test", {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function parseJsonResponse<T = unknown>(
  response: Response
): Promise<{ status: number; body: T }> {
  const json = (await response.json()) as T;
  return { status: response.status, body: json };
}
