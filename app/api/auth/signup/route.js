import { NextResponse } from "next/server";
import { createCustomerUser, setSessionCookie } from "@/app/lib/auth";
import { cleanDate, cleanEmail, cleanPassword, cleanText, readJsonObject } from "@/app/lib/input-validation";

export async function POST(request) {
  const body = await readJsonObject(request);
  const firstName = cleanText(body?.firstName, 80);
  const lastName = cleanText(body?.lastName, 80);
  const dateOfBirth = cleanDate(body?.dateOfBirth);
  const email = cleanEmail(body?.email);
  const phoneNumber = cleanText(body?.phoneNumber, 30);
  const password = cleanPassword(body?.password);
  const confirmPassword = cleanPassword(body?.confirmPassword);

  if (!firstName || !lastName || !dateOfBirth || !email || !phoneNumber || !password || !confirmPassword) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  const result = await createCustomerUser({
    firstName,
    lastName,
    dateOfBirth,
    email,
    phoneNumber,
    password
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const response = NextResponse.json({ user: result.user });
  setSessionCookie(response, result.user);
  return response;
}
