import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    app: "Mahira Laundry",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
