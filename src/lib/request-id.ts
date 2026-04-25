import crypto from "crypto";
import { AsyncLocalStorage } from "async_hooks";

interface RequestContext {
  requestId: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

export function getRequestId(): string {
  return requestContext.getStore()?.requestId ?? "unknown";
}

export function generateRequestId(): string {
  return crypto.randomUUID();
}
