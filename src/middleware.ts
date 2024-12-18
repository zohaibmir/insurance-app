import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/core/utils/sessionUtils";

export async function middleware(req: NextRequest) {
  // Get the token from cookies
  const token = req.cookies.get("token")?.value;
  //const token = req.cookies.get("token")?.value;
  console.log("Token received 1:", token);

  // If no token is present, redirect to the home page ("/")
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // Verify the token (make sure `verifyToken` is asynchronous if needed)
    const user = await verifyToken(token);

    if (!user) {
      // If the token is invalid or expired, redirect to the home page
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Optionally, attach the user info to the request headers for downstream use
    req.headers.set("user", JSON.stringify(user));

    // Allow the request to continue
    return NextResponse.next();
  } catch (err) {
    console.error("Token verification error:", err);
    // Redirect to the home page if token verification fails
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// Configure middleware to protect specific routes
export const config = {
  matcher: ["/protected/:path*", "/dashboard/:path*"], // Add all the routes you want to protect
};
