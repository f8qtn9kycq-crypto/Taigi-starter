export function getConfiguredExternalFormUrl(value: unknown): string | null {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return null;

  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function isExternalFeedbackOnly(value: unknown): boolean {
  return getConfiguredExternalFormUrl(value) !== null;
}
