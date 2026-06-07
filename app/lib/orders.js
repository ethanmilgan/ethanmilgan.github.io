import { getPostgresPool } from "./postgres";

export async function getOrdersForUser(userId) {
  const pool = getPostgresPool();

  if (!pool) {
    return [];
  }

  const result = await pool.query(
    `
      SELECT id, status, total_cents, created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows.map((order) => ({
    id: order.id,
    status: order.status,
    totalCents: order.total_cents,
    createdAt: order.created_at.toISOString()
  }));
}
