ALTER TABLE `users_table` RENAME TO `users`;--> statement-breakpoint
ALTER TABLE `word_list_table` RENAME TO `vocabulary`;--> statement-breakpoint
DROP INDEX `word_list_table_swedish_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `vocabulary_swedish_unique` ON `vocabulary` (`swedish`);