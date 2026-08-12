import { NextResponse } from "next/server";
import { getExternalFormUrl } from "../../services/feedback";

export function GET() {
  return NextResponse.json(
    { externalFormUrl: getExternalFormUrl() },
    { headers: { "cache-control": "no-store" } },
  );
}
