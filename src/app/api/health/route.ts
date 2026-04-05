import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "tro-choi-hou",
    time: new Date().toISOString(),
  });
}
