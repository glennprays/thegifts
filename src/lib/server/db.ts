import pkg from 'pg';
const { Pool } = pkg;
import type { Pool as PoolType } from 'pg';
import { env } from '$env/dynamic/private';

declare global {
  var __pgPool: PoolType | undefined;
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000
});

let activePool: PoolType;
if (env.NODE_ENV !== 'production') {
  globalThis.__pgPool ??= pool;
  activePool = globalThis.__pgPool;
} else {
  activePool = pool;
}
export default activePool;
