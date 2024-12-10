import { NextRequest, NextResponse } from "next/server";
import bankIdService from "@/services/bankIdService";

export async function GET(request: NextRequest) {
  const method = request.nextUrl.searchParams.get("method");
  let params = request.nextUrl.searchParams.get("params") as any;

  if (params) {
    try {
      params = JSON.parse(params);
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON in params" }, { status: 400 });
    }
  }

  try {
    switch (method) {
      case "refresh-qr": {
        const { qrStartToken, startDate } = params;
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
        const userVisibleData = Buffer.from("Sign the Document", "utf-8").toString("base64");
        const data = await bankIdService.sign(ip, userVisibleData);
        return NextResponse.json({ success: true, data });
      }

      case "collect": {
        const { orderRef } = params;
        if (!orderRef) {
          return NextResponse.json({ error: "orderRef is required" }, { status: 400 });
        }
        const data = await bankIdService.collect(orderRef);
        return NextResponse.json({ success: true, data });
      }

      default:
        return NextResponse.json({ error: "Unknown method" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
