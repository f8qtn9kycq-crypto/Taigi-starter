import { NextResponse } from "next/server";
import { ensureFeedbackTable } from "../../../db/feedback";

const completionValues = new Set(["yes", "partly", "no"]);
const blockerValues = new Set([
  "none",
  "audio",
  "instructions",
  "navigation",
  "language",
  "srs",
  "other",
]);

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  let input: Record<string, unknown>;
  try {
    input = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (cleanText(input.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const usefulness = Number(input.usefulness);
  const completedTask = cleanText(input.completedTask, 20);
  const blocker = cleanText(input.blocker, 30);
  const comment = cleanText(input.comment, 800);
  const visitorId = cleanText(input.visitorId, 80);
  const locale = input.locale === "en" ? "en" : "zh";
  const learningStage = Math.min(4, Math.max(0, Number(input.learningStage) || 0));
  const screenWidth = Math.min(5000, Math.max(0, Number(input.screenWidth) || 0));

  if (
    !Number.isInteger(usefulness) ||
    usefulness < 1 ||
    usefulness > 5 ||
    !completionValues.has(completedTask) ||
    !blockerValues.has(blocker) ||
    !visitorId
  ) {
    return NextResponse.json({ ok: false, error: "invalid_feedback" }, { status: 400 });
  }

  const db = await ensureFeedbackTable();
  await db
    .prepare(
      `INSERT INTO feedback (
        id, created_at, visitor_id, locale, learning_stage, screen_width,
        user_agent, usefulness, completed_task, blocker, comment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      crypto.randomUUID(),
      new Date().toISOString(),
      visitorId,
      locale,
      learningStage,
      screenWidth,
      cleanText(request.headers.get("user-agent"), 300),
      usefulness,
      completedTask,
      blocker,
      comment,
    )
    .run();

  return NextResponse.json({ ok: true });
}
