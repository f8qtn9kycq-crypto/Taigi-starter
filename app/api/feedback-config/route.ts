import { NextResponse } from "next/server";
import { LEARNER_FEEDBACK_URL } from "../../services/feedback";

export function GET() {
  return NextResponse.json(
    { externalFormUrl: LEARNER_FEEDBACK_URL },
    { headers: { "cache-control": "no-store" } },
  );
}
