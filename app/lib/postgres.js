import pg from "pg";

const { Pool } = pg;

let pool;

export function getPostgresPool() {
  if (!process.env.POSTGRES_URL) {
    return null;
  }

  pool =
    pool ||
    new Pool({
      connectionString: process.env.POSTGRES_URL
    });

  return pool;
}
