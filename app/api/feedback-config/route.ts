import { NextResponse } from "next/server";
import { env } from "cloudflare:workers";
import { getConfiguredExternalFormUrl } from "../../utils/feedback-mode";

function getExternalFormUrl(): string | null {
  return getConfiguredExternalFormUrl(env.FEEDBACK_EXTERNAL_FORM_URL);
}

export function GET() {
  return NextResponse.json(
    { externalFormUrl: getExternalFormUrl() },
    { headers: { "cache-control": "no-store" } },
  );
}
