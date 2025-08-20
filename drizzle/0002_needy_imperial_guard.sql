ALTER TABLE `vocabulary` RENAME COLUMN "swedish" TO "source";--> statement-breakpoint
ALTER TABLE `vocabulary` RENAME COLUMN "english" TO "target";--> statement-breakpoint
DROP INDEX `vocabulary_swedish_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `vocabulary_source_unique` ON `vocabulary` (`source`);