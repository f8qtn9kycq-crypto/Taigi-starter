import { env } from "cloudflare:workers";

const createTableSql = `CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  learning_stage INTEGER NOT NULL,
  screen_width INTEGER NOT NULL,
  user_agent TEXT NOT NULL,
  usefulness INTEGER NOT NULL,
  completed_task TEXT NOT NULL,
  blocker TEXT NOT NULL,
  comment TEXT NOT NULL
)`;

export async function ensureFeedbackTable() {
  const db = env.DB;
  if (!db) throw new Error("Feedback database is unavailable");
  await db.batch([
    db.prepare(createTableSql),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS feedback_created_at_idx ON feedback (created_at DESC)",
    ),
  ]);
  return db;
}

export type FeedbackRow = {
  id: string;
  created_at: string;
  visitor_id: string;
  locale: string;
  learning_stage: number;
  screen_width: number;
  user_agent: string;
  usefulness: number;
  completed_task: string;
  blocker: string;
  comment: string;
};
