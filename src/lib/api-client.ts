// AbortSignal.timeout() is modern industry standard
// Supported: Chrome 103+, Firefox 102+, Safari 16.4+, Node 17+
// Automatically handles cleanup - no manual timer needed
// Signal covers both connection AND response body read
// This prevents the common pitfall of timing out connection but hanging on response.json()

// Example 1: Simple GET
// const response = await fetchWithTimeout('/api/tours');
// const tours = await response.json();

// Example 2: POST with idempotency key (prevents double-charge on retry)
// const response = await fetchWithTimeout('/api/payments/initiate', {
//   method: 'POST',
//   body: JSON.stringify(booking),
//   idempotencyKey: crypto.randomUUID(),
//   timeout: 10000,
// });

// Example 3: Using createRequest helper
// const options = createRequest('/api/bookings', 'POST', bookingData);
// const response = await fetchWithTimeout('/api/bookings', options);

// Example 4: Error handling
// try {
//   const response = await fetchWithTimeout(url);
// } catch (error) {
//   if (isTimeoutError(error)) {
//     // Request timed out - show user-friendly error
//   } else {
//     // Other network error
//   }
// }

export interface FetchOptions extends RequestInit {
  timeout?: number;
  idempotencyKey?: string;
  retryable?: boolean;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

export function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof TimeoutError ||
    (error instanceof Error && error.name === "AbortError")
  );
}

export function getDefaultTimeout(endpoint: string): number {
  if (endpoint.includes("/payment")) return 10000;
  if (endpoint.includes("/booking")) return 8000;
  if (endpoint.includes("/search")) return 15000;
  return 10000;
}

export async function fetchWithTimeout<T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<Response> {
  const { timeout = 10000, idempotencyKey, ...rest } = options ?? {};

  // Automatically handles cleanup — covers connection AND response body read
  const signal = AbortSignal.timeout(timeout);

  const headers = new Headers(options?.headers);
  if (idempotencyKey) {
    headers.set("Idempotency-Key", idempotencyKey);
  }

  try {
    const response = await fetch(url, {
      ...rest,
      headers,
      signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new TimeoutError(`Request timed out after ${timeout}ms`);
    }
    throw error;
  }
}

export function createRequest(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: unknown,
  options?: Partial<FetchOptions>
): FetchOptions {
  const headers = new Headers({ "Content-Type": "application/json" });

  const idempotencyKey =
    method !== "GET" ? crypto.randomUUID() : undefined;

  return {
    ...options,
    method,
    headers,
    ...(data !== undefined && { body: JSON.stringify(data) }),
    timeout: options?.timeout ?? getDefaultTimeout(url),
    ...(idempotencyKey && { idempotencyKey }),
  };
}
