import { NextResponse } from "next/server";
import { clearSession } from "@/core/utils/sessionUtils";

export async function POST(request: Request) {
  const sessionId = request.headers.get("Cookie")?.match(/session_id=([^;]*)/)?.[1];
  if (sessionId) {
    clearSession(sessionId);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("session_id", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // Expire the cookie immediately
  });

  return response;
}
