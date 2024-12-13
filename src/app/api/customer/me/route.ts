import { NextRequest, NextResponse } from "next/server";
import customerService from "@/core/services/customerService";
import { getSession } from "@/core/utils/sessionUtils";

export async function GET(request: NextRequest) {
  try {
    // Get the session for the current user
    const session = await getSession(request);

    if (!session || !session.user_id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 } // Unauthorized
      );
    }

    // Fetch the customer data using the session user_id
    const customer = await customerService.findCustomerByBankId(session.user_id);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error("Error fetching customer data:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 } // Internal Server Error
    );
  }
}
