import { NextResponse } from "next/server";

// Handle POST requests
export async function POST() {
  // Clear the JWT token by setting an expired cookie
  const response = NextResponse.json({ message: "Logged out successfully" });
  response.cookies.set("jwtToken", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return response;
}
