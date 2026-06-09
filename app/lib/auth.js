import crypto from "crypto";
import { cookies } from "next/headers";
import { getPostgresPool } from "./postgres";

const sessionCookieName = "style_edit_by_reena_session";
const sessionMaxAge = 60 * 60 * 8;

function getAuthSecret() {
  return process.env.AUTH_SECRET || "development-only-change-me";
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value) {
  return crypto.createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 210000, 64, "sha512").toString("hex");
  return { hash, salt };
}

export function verifyPassword(password, salt, expectedHash) {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(expectedHash, "hex"));
}

export function createSessionToken(user) {
  const payload = base64UrlEncode(
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + sessionMaxAge
    })
  );

  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token) {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature || sign(payload) !== signature) {
    return null;
  }

  const session = JSON.parse(base64UrlDecode(payload));

  if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return session;
}

export function setSessionCookie(response, user) {
  response.cookies.set(sessionCookieName, createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionMaxAge,
    path: "/"
  });
}

export function clearSessionCookie(response) {
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/"
  });
}

export function getSessionFromRequest(request) {
  return readSessionToken(request.cookies.get(sessionCookieName)?.value);
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  return readSessionToken(cookieStore.get(sessionCookieName)?.value);
}

export async function findUserByEmail(email) {
  const pool = getPostgresPool();

  if (!pool) {
    return null;
  }

  const result = await pool.query(
    "SELECT id, email, name, role, password_hash, password_salt FROM users WHERE lower(email) = lower($1) LIMIT 1",
    [email]
  );

  return result.rows[0] || null;
}

export async function createCustomerUser({ firstName, lastName, dateOfBirth, email, phoneNumber, password }) {
  const pool = getPostgresPool();

  if (!pool) {
    return { error: "PostgreSQL is not configured. Set POSTGRES_URL before creating accounts." };
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return { error: "An account already exists for that email address." };
  }

  const { hash, salt } = hashPassword(password);
  const name = `${firstName} ${lastName}`.trim();

  const result = await pool.query(
    `
      INSERT INTO users (
        email,
        name,
        first_name,
        last_name,
        date_of_birth,
        phone_number,
        role,
        password_hash,
        password_salt
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'customer', $7, $8)
      RETURNING id, email, name, role
    `,
    [email, name, firstName, lastName, dateOfBirth, phoneNumber, hash, salt]
  );

  return { user: result.rows[0] };
}

export function isAdmin(session) {
  return session?.role === "admin";
}

export function isCustomer(session) {
  return session?.role === "customer" || isAdmin(session);
}
