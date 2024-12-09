import { NextResponse } from "next/server";
import customerService from "@/services/customerService";

export async function GET(
  request: Request,
  { params }: { params: { customerId: string } }
) {
  try {
    const customerId = parseInt(params.customerId);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 }
      );
    }

    const customer = await customerService.findCustomerById(customerId);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch customer" },
      { status: 500 }
    );
  }
}
