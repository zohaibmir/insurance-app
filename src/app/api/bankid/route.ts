/**
 * src/app/api/bankid/route.ts
 */
import { NextRequest, NextResponse } from "next/server";
import BankIdController from "@/core/controllers/bankId.controller";

/**
 * Handles GET and POST requests for the BankID API.
 */
export async function GET(request: NextRequest) {
  const method = request.nextUrl.searchParams.get("method");
  const paramsRaw = request.nextUrl.searchParams.get("params");

  let params = {};
  if (paramsRaw) {
    try {
      params = JSON.parse(paramsRaw);
    } catch {
      return NextResponse.json({ error: "Invalid JSON in params" }, { status: 400 });
    }
  }

  try {
    switch (method) {
      case "refresh-qr":
        return await BankIdController.refreshQr(params as { qrStartToken: string; startDate: string });

      case "auth":
        return await BankIdController.authenticate(request);

      case "sign":
        return await BankIdController.sign(request);

      case "collect":
        return await BankIdController.collect(params as { orderRef: string });

      default:
        return BankIdController.unsupportedMethod();
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: false, error: "An unknown error occurred" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const method = request.nextUrl.searchParams.get("method");

  try {
    if (method === "collect") {
      // Parse body for POST requests
      const body = await request.json();
      const { orderRef } = body;

      if (!orderRef) {
        return NextResponse.json(
          { error: "Missing orderRef in the request body" },
          { status: 400 }
        );
      }

      // Call the controller's collect method
      return await BankIdController.collect({ orderRef });
    } else {
      return NextResponse.json({ error: "Invalid method" }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: false, error: "An unknown error occurred" }, { status: 500 });
  }
}
