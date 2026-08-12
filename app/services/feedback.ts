export function getExternalFormUrl(
  value: string | undefined = process.env.FEEDBACK_EXTERNAL_FORM_URL,
): string | null {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
