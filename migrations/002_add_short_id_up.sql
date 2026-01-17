-- Add short_id column to assessment_result table
ALTER TABLE "assessment_result"
ADD COLUMN "short_id" VARCHAR(12) UNIQUE;

-- Create index on short_id for fast lookups
CREATE INDEX "idx_assessment_result_short_id" ON "assessment_result"("short_id");
