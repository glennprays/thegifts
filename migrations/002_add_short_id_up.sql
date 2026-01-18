-- Add short_id column to assessment_result table (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'assessment_result' AND column_name = 'short_id'
    ) THEN
        ALTER TABLE "assessment_result" ADD COLUMN "short_id" VARCHAR(12) UNIQUE;
    END IF;
END $$;

-- Create index on short_id for fast lookups (idempotent)
CREATE INDEX IF NOT EXISTS "idx_assessment_result_short_id" ON "assessment_result"("short_id");
