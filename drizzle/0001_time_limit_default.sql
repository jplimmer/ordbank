-- Restores the default schema.ts declared but production never had. Only new rows get it:
-- existing NULLs mean "no time limit" and stay as they are.
ALTER TABLE "test_settings" ALTER COLUMN "time_limit_mins" SET DEFAULT 5;