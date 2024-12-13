import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/core/utils/sessionUtils";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const isAuthenticated = !!session?.user_id;

  return NextResponse.json({ isAuthenticated });
}
