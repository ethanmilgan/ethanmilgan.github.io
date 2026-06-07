import { NextResponse } from "next/server";
import { getSessionFromRequest, isCustomer } from "@/app/lib/auth";
import { getOrdersForUser } from "@/app/lib/orders";

export async function GET(request) {
  const session = getSessionFromRequest(request);

  if (!isCustomer(session)) {
    return NextResponse.json({ error: "Sign in is required." }, { status: 401 });
  }

  return NextResponse.json({ orders: await getOrdersForUser(session.id) });
}
