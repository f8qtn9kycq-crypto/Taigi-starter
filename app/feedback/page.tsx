import { env } from "cloudflare:workers";
import { notFound } from "next/navigation";
import { ensureFeedbackTable, FeedbackRow } from "../../db/feedback";
import { requireChatGPTUser } from "../chatgpt-auth";

export default async function FeedbackDashboard() {
  const user = await requireChatGPTUser("/feedback");
  if (!env.FEEDBACK_OWNER_EMAIL || user.email !== env.FEEDBACK_OWNER_EMAIL) notFound();
  const db = await ensureFeedbackTable();
  const result = await db.prepare("SELECT * FROM feedback ORDER BY created_at DESC LIMIT 200").all<FeedbackRow>();
  const rows = result.results ?? [];
  const average = rows.length ? rows.reduce((sum, row) => sum + row.usefulness, 0) / rows.length : 0;
  const blockers = rows.reduce<Record<string, number>>((counts, row) => ({ ...counts, [row.blocker]: (counts[row.blocker] ?? 0) + 1 }), {});

  return <main className="feedback-dashboard">
    <header><div><span className="section-label">TAIGI START</span><h1>Prototype feedback</h1></div><a href="/api/feedback/export">Export CSV</a></header>
    <section className="feedback-stats"><article><b>{rows.length}</b><span>responses</span></article><article><b>{average.toFixed(1)}</b><span>average usefulness</span></article><article><b>{Object.entries(blockers).sort((a,b) => b[1]-a[1])[0]?.[0] ?? "—"}</b><span>top blocker</span></article></section>
    <div className="feedback-table-wrap"><table><thead><tr><th>Date</th><th>Score</th><th>Completed</th><th>Blocker</th><th>Stage</th><th>Comment</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{new Date(row.created_at).toLocaleString("zh-TW")}</td><td>{row.usefulness}/5</td><td>{row.completed_task}</td><td>{row.blocker}</td><td>{row.learning_stage + 1}</td><td>{row.comment || "—"}</td></tr>)}</tbody></table></div>
  </main>;
}
