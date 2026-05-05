import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const backendUrl =
    process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { error: "Backend URL not configured." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const response = await fetch(`${backendUrl}/api/knowledge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to add knowledge." },
      { status: 502 }
    );
  }
}
