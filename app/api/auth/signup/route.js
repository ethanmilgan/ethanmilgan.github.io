import { NextResponse } from "next/server";
import { createCustomerUser, setSessionCookie } from "@/app/lib/auth";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  const {
    firstName,
    lastName,
    dateOfBirth,
    email,
    phoneNumber,
    password,
    confirmPassword
  } = await request.json();

  if (!firstName || !lastName || !dateOfBirth || !email || !phoneNumber || !password || !confirmPassword) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  const result = await createCustomerUser({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    dateOfBirth,
    email: email.trim(),
    phoneNumber: phoneNumber.trim(),
    password
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const response = NextResponse.json({ user: result.user });
  setSessionCookie(response, result.user);
  return response;
}
