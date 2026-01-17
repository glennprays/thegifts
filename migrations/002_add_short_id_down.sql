-- Drop index
DROP INDEX IF EXISTS "idx_assessment_result_short_id";

-- Remove short_id column
ALTER TABLE "assessment_result"
DROP COLUMN IF EXISTS "short_id";
