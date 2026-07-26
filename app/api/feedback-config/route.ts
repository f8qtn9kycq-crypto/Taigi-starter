import { NextResponse } from "next/server";

function getExternalFormUrl(): string | null {
  const value = typeof process.env.FEEDBACK_EXTERNAL_FORM_URL === "string"
    ? process.env.FEEDBACK_EXTERNAL_FORM_URL.trim()
    : "";
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function GET() {
  return NextResponse.json(
    { externalFormUrl: getExternalFormUrl() },
    { headers: { "cache-control": "no-store" } },
  );
}
