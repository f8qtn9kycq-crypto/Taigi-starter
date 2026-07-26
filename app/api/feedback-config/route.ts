import { NextResponse } from "next/server";
import { env } from "cloudflare:workers";

function getExternalFormUrl(): string | null {
  const value = typeof env.FEEDBACK_EXTERNAL_FORM_URL === "string" ? env.FEEDBACK_EXTERNAL_FORM_URL.trim() : "";
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
