import { NextRequest } from "next/server";

// In-memory session store (use Redis or a database in production)
const sessionStore = new Map<string, { user_id: string }>();

// /**
//  * Generate a session ID (use a more secure method in production).
//  */
// function generateSessionId(): string {
//   return Math.random().toString(36).substring(2, 15);
// }

/**
 * Set a session.
 * @param sessionId - The session ID.
 * @param data - The session data.
 */
export function setSession(sessionId: string, data: { user_id: string }) {
  sessionStore.set(sessionId, data);
}

/**
 * Get a session by session ID.
 * @param request - The incoming request.
 */
export async function getSession(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value;
  if (sessionId) {
    return sessionStore.get(sessionId) || null;
  }
  return null;
}

/**
 * Clear a session.
 * @param sessionId - The session ID.
 */
export function clearSession(sessionId: string) {
  sessionStore.delete(sessionId);
}
