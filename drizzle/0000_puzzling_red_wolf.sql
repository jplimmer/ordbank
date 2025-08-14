CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `word_list_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`swedish` text NOT NULL,
	`english` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `word_list_table_swedish_unique` ON `word_list_table` (`swedish`);