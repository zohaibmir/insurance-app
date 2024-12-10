import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import CustomerService from "@/core/services/customerService";

// Updated API settings
const MARKNADSURVAL_API_URL = "http://api.marknadsurval.se/api/v1/cupdate/";
const MARKNADSURVAL_API_TOKEN = "8c97fcfe-a2d9-44fe-8682-177f54187f74";

export async function POST(request: NextRequest) {
    try {
        // Parse the request body to get the personal number
        const { personalNumber } = await request.json();

        if (!personalNumber) {
            return NextResponse.json(
                { message: "Personal number is required." },
                { status: 400 }
            );
        }

        // Construct the API URL with the personal number
        const apiUrl = `${MARKNADSURVAL_API_URL}${personalNumber}`;

        // Fetch data from the new Marknadsurval API
        const response = await axios.get(apiUrl, {
            headers: {
                "X_TOKEN": MARKNADSURVAL_API_TOKEN, // Updated header for the API
            },
        });

        const data = response.data;

        if (!data) {
            return NextResponse.json(
                { message: "No data received from Marknadsurval API." },
                { status: 404 }
            );
        }

        // Prepare customer data based on the API response
        const customerDetails = {
            bank_id: personalNumber,
            first_name: data.first_name,
            last_name: data.surname,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            postal_code: data.zip,
            apartment_no: data.apartment_no,
        };

        // Use CustomerService to check if the customer exists
        const existingCustomer = await CustomerService.findCustomerByBankId(personalNumber);

        let savedCustomer;

        if (existingCustomer) {
            // If the customer exists, update their details
            savedCustomer = await CustomerService.updateCustomer(
                existingCustomer.customer_id,
                customerDetails
            );
        } else {
            // If the customer does not exist, create a new record
            savedCustomer = await CustomerService.createCustomer(customerDetails);
        }

        // Return the saved customer data
        return NextResponse.json({
            message: "Customer data fetched and saved successfully!",
            customer: savedCustomer,
        });
    } catch (error) {
        console.error("Error in Marknadsurval API:", error);

        if (axios.isAxiosError(error) && error.response) {
            // Handle API errors with detailed response
            return NextResponse.json(
                {
                    message: "Failed to fetch data from Marknadsurval API.",
                    error: error.response.data || error.message,
                },
                { status: error.response.status }
            );
        }

        if (error instanceof Error) {
            // Handle general errors
            return NextResponse.json(
                {
                    message: "An error occurred while processing the request.",
                    error: error.message,
                },
                { status: 500 }
            );
        }

        // Handle unknown errors
        return NextResponse.json(
            { success: false, error: "An unknown error occurred" },
            { status: 500 }
        );
    }
}
