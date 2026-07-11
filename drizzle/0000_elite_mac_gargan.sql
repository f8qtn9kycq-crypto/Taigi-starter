CREATE TABLE `feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`visitor_id` text NOT NULL,
	`locale` text NOT NULL,
	`learning_stage` integer NOT NULL,
	`screen_width` integer NOT NULL,
	`user_agent` text NOT NULL,
	`usefulness` integer NOT NULL,
	`completed_task` text NOT NULL,
	`blocker` text NOT NULL,
	`comment` text NOT NULL
);
