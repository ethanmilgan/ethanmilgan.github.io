import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/app/lib/auth";

export async function GET(request) {
  const session = getSessionFromRequest(request);

  return NextResponse.json({
    user: session
      ? {
          id: session.id,
          email: session.email,
          firstName: session.firstName,
          lastName: session.lastName,
          role: session.role
        }
      : null
  });
}
