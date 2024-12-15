/**
 * src/core/controllers/bankid.controller.ts
 */
import { NextRequest, NextResponse } from "next/server";
import bankIdService from "@/core/services/bankIdService";
import { setSession } from "@/core/utils/sessionUtils";
import customerService from "@/core/services/customerService";

class BankIdController {
  /**
   * Refreshes the QR code for an ongoing session.
   */
  async refreshQr(params: { qrStartToken: string; startDate: string }) {
    const { qrStartToken, startDate } = params;

    if (!qrStartToken || !startDate) {
      return NextResponse.json(
        { error: "qrStartToken and startDate are required for refresh-qr" },
        { status: 400 }
      );
    }

    const qrData = await bankIdService.refreshQr(qrStartToken, new Date(startDate));
    return NextResponse.json({ success: true, qrData });
  }

  /**
   * Starts the authentication process with BankID.
   */
  async authenticate(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const data = await bankIdService.authenticate(ip);
    return NextResponse.json({ success: true, data });
  }

  /**
   * Starts the signing process with BankID.
   */
  async sign(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userVisibleData = Buffer.from("Sign the Document").toString("base64");
    const data = await bankIdService.sign(ip, userVisibleData);
    return NextResponse.json({ success: true, data });
  }

  /**
   * Collects the status of an ongoing BankID process.
   */
  async collect(params: { orderRef: string }) {
    const { orderRef } = params;

    if (!orderRef) {
      return NextResponse.json(
        { error: "orderRef is required for collect" },
        { status: 400 }
      );
    }

    const data = await bankIdService.collect(orderRef);
    if (data.status === "complete") {
      const personalNumber = data.completionData?.user?.personalNumber;

      if (personalNumber) {
        // Generate a session ID
        const sessionId = Math.random().toString(36).substring(2);

        // Save the user's ID (personalNumber) in the session
        setSession(sessionId, { user_id: personalNumber });

        const customer = await customerService.findCustomerByBankId(personalNumber);
        if (customer?.email && customer?.phone) {
          const response = NextResponse.json({ redirectTo: "/dashboard" });
          response.cookies.set("session_id", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
          });
        }
      }
    }
    return NextResponse.json({ success: true, data });
  }

  /**
   * Handles unsupported methods.
   */
  unsupportedMethod() {
    return NextResponse.json(
      { error: "Unknown method. Supported methods: auth, sign, collect, refresh-qr" },
      { status: 400 }
    );
  }
}

// Assign the instance of the controller to a named variable
const bankIdController = new BankIdController();

// Export the named variable
export default bankIdController;