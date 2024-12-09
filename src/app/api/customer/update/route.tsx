import { NextResponse } from "next/server";
import customerService from "@/services/customerService";
import { updateCustomerSchema } from "@/validations/customerValidation";

export async function PUT(request: Request) {
    try {
        const requestBody = await request.json();

        // Validate data
        const validatedData = updateCustomerSchema.parse(requestBody);

        // Extract customer_id
        const { customer_id, ...updateData } = validatedData;

        // Update customer
        const updatedCustomer = await customerService.updateCustomer(
            customer_id,
            updateData
        );

        return NextResponse.json(updatedCustomer, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to update customer" },
            { status: 400 }
        );
    }
}
