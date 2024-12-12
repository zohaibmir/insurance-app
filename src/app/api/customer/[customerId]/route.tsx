/* eslint-disable */
/**
 * src/app/api/customer/[customerid]/route.ts
 */

import { NextRequest, NextResponse } from "next/server";
import customerService from "@/core/services/customerService";

export async function GET(
  request: NextRequest
) {
  try {
    // Extract and parse customerId from params
    const customerId = 1;

    // Validate if customerId is a valid number
    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: "Invalid customer ID. It must be a number." },
        { status: 400 }
      );
    }

    // Fetch the customer using the service
    const customer = await customerService.findCustomerById(customerId);

    // If no customer is found, return a 404 error
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Return the customer data as a JSON response
    return NextResponse.json(customer, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "An unexpected error occurred" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
