import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.set({
    name: "token",
    value: "",
    maxAge: 0,
    path: "/",
    expires: new Date(0),
    sameSite: "strict",
    httpOnly: true,
  });

  return response;
}

export async function POST() {
  return GET();
}
