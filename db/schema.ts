import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const feedback = sqliteTable("feedback", {
  id: text("id").primaryKey(),
  createdAt: text("created_at").notNull(),
  visitorId: text("visitor_id").notNull(),
  locale: text("locale").notNull(),
  learningStage: integer("learning_stage").notNull(),
  screenWidth: integer("screen_width").notNull(),
  userAgent: text("user_agent").notNull(),
  usefulness: integer("usefulness").notNull(),
  completedTask: text("completed_task").notNull(),
  blocker: text("blocker").notNull(),
  comment: text("comment").notNull(),
});
