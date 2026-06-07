import crypto from "crypto";
import pg from "pg";

const { Pool } = pg;

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "Administrator";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is required.");
}

if (!email || !password) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
}

const salt = crypto.randomBytes(16).toString("hex");
const passwordHash = crypto.pbkdf2Sync(password, salt, 210000, 64, "sha512").toString("hex");
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

await pool.query(
  `
    INSERT INTO users (email, name, role, password_hash, password_salt)
    VALUES ($1, $2, 'admin', $3, $4)
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      role = 'admin',
      password_hash = EXCLUDED.password_hash,
      password_salt = EXCLUDED.password_salt
  `,
  [email, name, passwordHash, salt]
);

await pool.end();

console.log(`Admin user ready: ${email}`);
