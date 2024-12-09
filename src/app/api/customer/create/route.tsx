import { NextResponse } from "next/server";
import customerService from "@/services/customerService";
import { createCustomerSchema } from "@/validations/customerValidation";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    // Validate data
    const validatedData = createCustomerSchema.parse(requestBody);

    // Create customer
    const newCustomer = await customerService.createCustomer(validatedData);

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create customer" },
      { status: 400 }
    );
  }
}
