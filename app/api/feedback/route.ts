import { NextResponse } from "next/server";
import { ensureFeedbackTable } from "../../../db/feedback";
import {
  FEEDBACK_RATE_LIMIT_MAX_SUBMISSIONS,
  FEEDBACK_RATE_LIMIT_WINDOW_MS,
  isContentLengthTooLarge,
  isRateLimitAllowed,
  isSameOriginRequest,
  isSupportedJsonContentType,
  MAX_FEEDBACK_BODY_BYTES,
  normalizeRateLimitSource,
  rateLimitWindowStart,
} from "../../utils/feedback-security";

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

async function readBoundedBody(request: Request): Promise<string | null> {
  if (isContentLengthTooLarge(request.headers.get("content-length"))) return null;

  const reader = request.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_FEEDBACK_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

async function hashSource(source: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`taigi-feedback-rate-v1:${source}`),
  );
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function consumeRateLimit(db: D1Database, source: string): Promise<boolean> {
  const windowStart = rateLimitWindowStart(Date.now());
  const sourceHash = await hashSource(source);
  await db
    .prepare("DELETE FROM feedback_rate_limits WHERE window_started_at < ?")
    .bind(windowStart - FEEDBACK_RATE_LIMIT_WINDOW_MS * 2)
    .run();
  const result = await db
    .prepare(
      `INSERT INTO feedback_rate_limits (source_hash, window_started_at, submission_count)
       VALUES (?, ?, 1)
       ON CONFLICT(source_hash) DO UPDATE SET
         window_started_at = CASE
           WHEN feedback_rate_limits.window_started_at = ? THEN feedback_rate_limits.window_started_at
           ELSE excluded.window_started_at
         END,
         submission_count = CASE
           WHEN feedback_rate_limits.window_started_at = ? THEN feedback_rate_limits.submission_count + 1
           ELSE 1
         END
       RETURNING submission_count`,
    )
    .bind(sourceHash, windowStart, windowStart, windowStart)
    .first<{ submission_count: number }>();

  return Boolean(result && isRateLimitAllowed(result.submission_count, FEEDBACK_RATE_LIMIT_MAX_SUBMISSIONS));
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request.url, request.headers.get("origin"))) {
    return NextResponse.json({ ok: false, error: "cross_origin" }, { status: 403 });
  }
  if (!isSupportedJsonContentType(request.headers.get("content-type"))) {
    return NextResponse.json({ ok: false, error: "unsupported_content_type" }, { status: 415 });
  }
  const rateLimitSource = normalizeRateLimitSource(request.headers.get("cf-connecting-ip"));
  if (!rateLimitSource) {
    return NextResponse.json({ ok: false, error: "rate_limit_unavailable" }, { status: 503 });
  }

  const body = await readBoundedBody(request);
  if (body === null) {
    return NextResponse.json({ ok: false, error: "request_too_large" }, { status: 413 });
  }

  let input: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid_object");
    input = parsed as Record<string, unknown>;
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
  if (!(await consumeRateLimit(db, rateLimitSource))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
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
