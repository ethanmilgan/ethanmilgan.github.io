import { getPostgresPool } from "../app/lib/postgres.js";

const pool = getPostgresPool();

if (!pool) {
  throw new Error("POSTGRES_URL is required to initialize PostgreSQL tables.");
}

await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    first_name TEXT,
    last_name TEXT,
    date_of_birth DATE,
    phone_number TEXT,
    role TEXT NOT NULL DEFAULT 'customer',
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer';
  ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL DEFAULT '';
  ALTER TABLE users ADD COLUMN IF NOT EXISTS password_salt TEXT NOT NULL DEFAULT '';

  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'pending',
    total_cents INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS orders_user_id_created_at_idx ON orders(user_id, created_at DESC);
`);

await pool.end();

console.log("Initialized PostgreSQL users and orders tables.");
