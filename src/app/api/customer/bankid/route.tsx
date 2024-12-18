import { NextRequest, NextResponse } from "next/server";
import customerService from "@/core/services/customerService";

// Handle POST requests
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { personalNumber } = body;

    // Validate the input
    if (!personalNumber) {
      return NextResponse.json(
        { success: false, error: "Personal number is required." },
        { status: 400 }
      );
    }

    // Fetch user data using the personal number
    const user = await customerService.findCustomerByBankId(personalNumber);

    // Handle the case where the user is not found
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    // Return the user data if found
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching user data:", error);

    // Handle server errors
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
