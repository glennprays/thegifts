-- Baseline schema for thegifts on Cloudflare D1 (SQLite).
-- Fresh start: existing PostgreSQL rows are imported via idempotent
-- INSERT OR REPLACE statements (see scripts/export-pg-to-d1 generation).

CREATE TABLE IF NOT EXISTS assessment_result (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    answer TEXT NOT NULL,
    result TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    short_id TEXT UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_assessment_result_short_id ON assessment_result(short_id);
