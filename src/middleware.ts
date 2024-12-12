import { NextResponse } from "next/server";
import { getSession } from "@/core/utils/sessionUtils"; // Import session utility
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Define routes to protect
  const protectedRoutes = ["/profile", "/dashboard"];

  // Check if the requested route is protected
  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    // Get the session for the current user
    const session = await getSession(request);

    // Check if the user is authenticated
    if (!session || !session.user_id) {
      // Redirect to the home page if not authenticated
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Specify which routes the middleware should apply to
export const config = {
  matcher: ["/profile", "/dashboard"], // Protected routes
};
