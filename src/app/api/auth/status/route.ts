import { verifyToken } from "@/core/utils/sessionUtils";
import { NextResponse } from "next/server";
import customerService from "@/core/services/customerService";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Get the cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // If no token is found, return a 401 Unauthorized response
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized", isAuthenticated: false },
        { status: 401 }
      );
    }

    // Verify the token
    const user = await verifyToken(token); // Assuming verifyToken is asynchronous
    const personalNumber = (user?.customer as { personalNumber: string }).personalNumber;
    const customer = await customerService.findCustomerByBankId(personalNumber);

    // If the token is invalid or expired, return a 401 Unauthorized response
    if (!customer) {
      return NextResponse.json(
        { error: "Invalid or expired token", isAuthenticated: false },
        { status: 401 }
      );
    }

    // If the token is valid, return success and user info
    return NextResponse.json(
      { success: true, isAuthenticated: true, customer: customer },
      { status: 200 }
    );
  } catch (error) {
    // Handle unexpected server errors
    console.error("Error in /api/auth/status:", error);
    return NextResponse.json(
      { error: "Internal Server Error", isAuthenticated: false },
      { status: 500 }
    );
  }
}
