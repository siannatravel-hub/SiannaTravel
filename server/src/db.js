import pg from 'pg';
import config from './config.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  // Easypanel interno suele ir sin SSL. Si tu cadena lleva sslmode=require,
  // pg lo respeta; si no, no forzamos SSL.
});

pool.on('error', (err) => {
  console.error('[db] Error inesperado en el pool de Postgres:', err.message);
});

// Helper de consulta parametrizada (siempre $1, $2... nunca interpolar strings).
export function query(text, params) {
  return pool.query(text, params);
}

// Transacción con callback.
export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
