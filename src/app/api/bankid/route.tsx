import { NextRequest, NextResponse } from "next/server";
import bankIdService from "@/services/bankIdService";

// Define the type for params if needed
interface Params {
  qrStartToken?: string;
  startDate?: string;
  orderRef?: string;
}

export async function GET(request: NextRequest) {
  // Get the method and params from the request
  const method = request.nextUrl.searchParams.get("method");
  const paramsRaw = request.nextUrl.searchParams.get("params");

  // Parse params if they exist
  let params: Params = {};
  if (paramsRaw) {
    try {
      params = JSON.parse(paramsRaw);
    } catch {
      return NextResponse.json({ error: "Invalid JSON in params" }, { status: 400 });
    }
  }

  try {
    switch (method) {
      case "refresh-qr": {
        const { qrStartToken, startDate } = params;
        if (!qrStartToken || !startDate) {
          return NextResponse.json(
            { error: "qrStartToken and startDate are required for refresh-qr" },
            { status: 400 }
          );
        }

        const qrData = await bankIdService.refreshQr(
          qrStartToken,
          new Date(startDate)
        );
        return NextResponse.json({ success: true, qrData });
      }

      case "auth": {
        const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
        console.log("Here is the ip" + ip);
        const data = await bankIdService.authenticate(ip);
        console.log(data);
        return NextResponse.json({ success: true, data });
      }

      case "sign": {
        const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
        const userVisibleData = Buffer.from("Sign the Document", "utf-8").toString(
          "base64"
        );
        const data = await bankIdService.sign(ip, userVisibleData);
        return NextResponse.json({ success: true, data });
      }

      case "collect": {
        const { orderRef } = params;
        if (!orderRef) {
          return NextResponse.json(
            { error: "orderRef is required for collect" },
            { status: 400 }
          );
        }

        const data = await bankIdService.collect(orderRef);
        return NextResponse.json({ success: true, data });
      }

      default:
        return NextResponse.json({ error: "Unknown method" }, { status: 400 });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: "Unknown error occurred" }, { status: 500 });
  }
}
