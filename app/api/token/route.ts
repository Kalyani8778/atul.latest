import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const backendUrl =
    process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  if (!backendUrl) {
    return NextResponse.json({ error: "Backend URL not configured." }, { status: 503 });
  }

  // Forward the agent's Supabase auth token so the backend can resolve
  // their department and assign the correct Twilio client identity.
  const headers: HeadersInit = {};
  const auth = req.headers.get("authorization");
  if (auth) headers["authorization"] = auth;

  try {
    const response = await fetch(`${backendUrl}/api/token`, { cache: "no-store", headers });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch token from backend." }, { status: 502 });
  }
}
