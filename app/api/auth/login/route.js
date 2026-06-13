import { NextResponse } from "next/server";
import { findUserByEmail, setSessionCookie, verifyPassword } from "@/app/lib/auth";

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await findUserByEmail(email);

  if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role
    }
  });

  setSessionCookie(response, user);
  return response;
}
