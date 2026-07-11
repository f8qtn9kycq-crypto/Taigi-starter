import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { ensureFeedbackTable, FeedbackRow } from "../../../../db/feedback";
import { getChatGPTUser } from "../../../chatgpt-auth";

function csvCell(value: unknown) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }

export async function GET() {
  const user = await getChatGPTUser();
  if (!user || !env.FEEDBACK_OWNER_EMAIL || user.email !== env.FEEDBACK_OWNER_EMAIL) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const db = await ensureFeedbackTable();
  const result = await db.prepare("SELECT * FROM feedback ORDER BY created_at DESC").all<FeedbackRow>();
  const headers = ["created_at","locale","learning_stage","screen_width","usefulness","completed_task","blocker","comment"];
  const csv = [headers.join(","), ...(result.results ?? []).map((row) => headers.map((key) => csvCell(row[key as keyof FeedbackRow])).join(","))].join("\n");
  return new Response(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="taigi-feedback.csv"' } });
}
