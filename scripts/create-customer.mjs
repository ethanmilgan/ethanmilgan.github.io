import crypto from "crypto";
import pg from "pg";

const { Pool } = pg;

const email = process.env.CUSTOMER_EMAIL;
const password = process.env.CUSTOMER_PASSWORD;
const name = process.env.CUSTOMER_NAME || "Customer";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is required.");
}

if (!email || !password) {
  throw new Error("CUSTOMER_EMAIL and CUSTOMER_PASSWORD are required.");
}

const salt = crypto.randomBytes(16).toString("hex");
const passwordHash = crypto.pbkdf2Sync(password, salt, 210000, 64, "sha512").toString("hex");
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

await pool.query(
  `
    INSERT INTO users (email, name, role, password_hash, password_salt)
    VALUES ($1, $2, 'customer', $3, $4)
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      role = 'customer',
      password_hash = EXCLUDED.password_hash,
      password_salt = EXCLUDED.password_salt
  `,
  [email, name, passwordHash, salt]
);

await pool.end();

console.log(`Customer user ready: ${email}`);
