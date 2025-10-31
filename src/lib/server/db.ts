import pkg from 'pg';
const { Pool } = pkg;
import type { Pool as PoolType } from 'pg';
import { DATABASE_URL } from '$env/static/private';

// Create a connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  // Optional production tuning
  max: 10, // max number of clients
  idleTimeoutMillis: 30000 // close idle connections after 30s
});

let activePool: PoolType;
// Reuse the pool across hot reloads in dev
if (process.env.NODE_ENV !== 'production') {
  // @ts-ignore
  globalThis.__pgPool ??= pool;
  // @ts-ignore
  activePool = globalThis.__pgPool as PoolType;
} else {
  activePool = pool;
}
export default activePool;
