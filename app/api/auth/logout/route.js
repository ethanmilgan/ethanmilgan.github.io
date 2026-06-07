import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/app/lib/auth";

export async function POST(request) {
  const response = NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  clearSessionCookie(response);
  return response;
}
