-- Baseline: production's schema as `db:push` built it before migrations existed (#113).
-- Recorded as already applied in `production` and `template` without running this DDL there
-- (see docs/development.md#migrations). It only runs on empty databases, such as CI's
-- migration replay. Never edit it: change the schema with a new migration.
CREATE TABLE "language_pairs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "language_pairs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"source_language" text NOT NULL,
	"target_language" text NOT NULL,
	"pair_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "source_name_length_check" CHECK (length(source_language) <= 20),
	CONSTRAINT "target_name_length_check" CHECK (length(target_language) <= 20)
);
--> statement-breakpoint
CREATE TABLE "test_settings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "test_settings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"direction" text DEFAULT 'random' NOT NULL,
	"answer_mode" text DEFAULT 'random' NOT NULL,
	"question_limit" integer DEFAULT 10,
	"time_limit_mins" integer,
	"updated_at" timestamp,
	CONSTRAINT "question_limit_check" CHECK (question_limit IS NULL OR question_limit <= 100),
	CONSTRAINT "time_limit_check" CHECK (time_limit_mins IS NULL OR time_limit_mins <= 60)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"clerk_id" varchar(255) NOT NULL,
	"active_language_pair_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocabulary" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vocabulary_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"language_pair_id" integer NOT NULL,
	"source" text NOT NULL,
	"target" text NOT NULL,
	"total_attempts" integer DEFAULT 0 NOT NULL,
	"correct_attempts" integer DEFAULT 0 NOT NULL,
	"last_attempted_at" timestamp,
	CONSTRAINT "source_word_length_check" CHECK (length(source) <= 50),
	CONSTRAINT "target_word_length_check" CHECK (length(target) <= 50)
);
--> statement-breakpoint
ALTER TABLE "language_pairs" ADD CONSTRAINT "language_pairs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_settings" ADD CONSTRAINT "test_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_language_pair_id_language_pairs_id_fk" FOREIGN KEY ("language_pair_id") REFERENCES "public"."language_pairs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "language_pairs_user_source_target_unique" ON "language_pairs" USING btree ("user_id","source_language","target_language");--> statement-breakpoint
CREATE UNIQUE INDEX "test_settings_user_id_unique" ON "test_settings" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_clerk_id_unique" ON "users" USING btree ("clerk_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vocabulary_language_pair_source_unique" ON "vocabulary" USING btree ("language_pair_id","source");--> statement-breakpoint
CREATE VIEW "public"."user_vocabulary" AS (select "vocabulary"."id", "vocabulary"."language_pair_id", "vocabulary"."source", "vocabulary"."target", "vocabulary"."total_attempts", "vocabulary"."correct_attempts", "vocabulary"."last_attempted_at", "language_pairs"."user_id", "language_pairs"."source_language", "language_pairs"."target_language" from "vocabulary" inner join "language_pairs" on "vocabulary"."language_pair_id" = "language_pairs"."id");