import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { ensureFeedbackTable, FeedbackRow } from "../../../../db/feedback";
import { getChatGPTUser } from "../../../chatgpt-auth";
import { csvCell } from "../../../utils/feedback-security";
import { isExternalFeedbackOnly } from "../../../utils/feedback-mode";

export async function GET() {
  if (isExternalFeedbackOnly(env.FEEDBACK_EXTERNAL_FORM_URL)) {
    return NextResponse.json({ error: "external_feedback_only" }, { status: 410 });
  }
  const user = await getChatGPTUser();
  if (!user || !env.FEEDBACK_OWNER_EMAIL || user.email !== env.FEEDBACK_OWNER_EMAIL) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const db = await ensureFeedbackTable();
  const result = await db.prepare("SELECT * FROM feedback ORDER BY created_at DESC").all<FeedbackRow>();
  const headers = ["created_at","locale","learning_stage","screen_width","usefulness","completed_task","blocker","comment"];
  const csv = [headers.join(","), ...(result.results ?? []).map((row) => headers.map((key) => csvCell(row[key as keyof FeedbackRow])).join(","))].join("\n");
  return new Response(csv, {
    headers: {
      "cache-control": "no-store",
      "content-disposition": 'attachment; filename="taigi-feedback.csv"',
      "content-type": "text/csv; charset=utf-8",
      "x-content-type-options": "nosniff",
    },
  });
}
