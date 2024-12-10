import { NextRequest, NextResponse } from "next/server";
import bankIdService from "@/services/bankIdService";

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
      case "refresh-qr": {
        const { qrStartToken, startDate } = params as { qrStartToken: string; startDate: string };

        if (!qrStartToken || !startDate) {
          return NextResponse.json(
            { error: "qrStartToken and startDate are required for refresh-qr" },
            { status: 400 }
          );
        }

        const qrData = await bankIdService.refreshQr(qrStartToken, new Date(startDate));
        return NextResponse.json({ success: true, qrData });
      }

      case "auth": {
        const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
        const data = await bankIdService.authenticate(ip);
        return NextResponse.json({ success: true, data });
      }

      case "sign": {
        const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
        const userVisibleData = Buffer.from("Sign the Document").toString("base64");
        const data = await bankIdService.sign(ip, userVisibleData);
        return NextResponse.json({ success: true, data });
      }

      case "collect": {
        const { orderRef } = params as { orderRef: string };

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
        return NextResponse.json(
          { error: "Unknown method. Supported methods: auth, sign, collect, refresh-qr" },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: false, error: "An unknown error occurred" }, { status: 500 });
  }
}