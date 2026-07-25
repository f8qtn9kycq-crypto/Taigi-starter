export const MAX_FEEDBACK_BODY_BYTES = 16 * 1024;
export const FEEDBACK_RATE_LIMIT_WINDOW_MS = 60 * 1000;
export const FEEDBACK_RATE_LIMIT_MAX_SUBMISSIONS = 5;

export function isSameOriginRequest(requestUrl: string, origin: string | null): boolean {
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(requestUrl).origin;
  } catch {
    return false;
  }
}

export function isSupportedJsonContentType(contentType: string | null): boolean {
  return contentType?.split(";", 1)[0].trim().toLowerCase() === "application/json";
}

export function isContentLengthTooLarge(
  contentLength: string | null,
  maxBytes = MAX_FEEDBACK_BODY_BYTES,
): boolean {
  if (!contentLength) return false;
  const parsed = Number(contentLength);
  return !Number.isSafeInteger(parsed) || parsed < 0 || parsed > maxBytes;
}

export function rateLimitWindowStart(nowMs: number): number {
  return Math.floor(nowMs / FEEDBACK_RATE_LIMIT_WINDOW_MS) * FEEDBACK_RATE_LIMIT_WINDOW_MS;
}

export function isRateLimitAllowed(
  submissionCount: number,
  maxSubmissions = FEEDBACK_RATE_LIMIT_MAX_SUBMISSIONS,
): boolean {
  return Number.isInteger(submissionCount) && submissionCount <= maxSubmissions;
}

export function csvCell(value: unknown): string {
  const text = String(value ?? "");
  const safeText = /^[\u0000-\u0020]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}
