import { SignJWT, jwtVerify, JWTPayload } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.SESSION_SECRET || "your-secret-key");

// Generate a token
export async function generateToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(SECRET_KEY);
}

// Verify a token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload; // The decoded payload
  } catch (err) {
    console.error("Token verification failed:", err);
    return null; // Invalid or expired token
  }
}
