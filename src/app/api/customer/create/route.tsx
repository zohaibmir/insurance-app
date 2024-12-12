/**
 * src/app/api/customer/create/route.ts
 */
import { NextResponse } from "next/server";
import customerService from "@/core/services/customerService";
import { createCustomerSchema } from "@/core/validations/customerValidation";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    // Validate data
    const validatedData = createCustomerSchema.parse(requestBody);

    // Create customer
    const newCustomer = await customerService.createCustomer(validatedData);

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {

      return NextResponse.json({ error: error.message || "Failed to create customer" }, { status: 400 });
    }

    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
