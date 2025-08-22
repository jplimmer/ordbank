CREATE TABLE `test_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`testLength` text,
	`testFormat` text,
	`languageDirection` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `vocabulary` ADD `userId` integer NOT NULL REFERENCES users(id);