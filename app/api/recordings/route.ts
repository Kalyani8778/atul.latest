import { NextRequest, NextResponse } from "next/server";

const resolveBackendBaseUrl = () => {
  const explicitBase =
    process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  if (explicitBase) return explicitBase.replace(/\/+$/, "");
  const uploadUrl = process.env.BACKEND_UPLOAD_URL;
  if (uploadUrl) {
    try { return new URL(uploadUrl).origin; } catch { return null; }
  }
  return null;
};

export async function GET(request: NextRequest) {
  const callId = request.nextUrl.searchParams.get("call_id")?.trim();
  if (!callId) {
    return NextResponse.json({ error: "call_id is required." }, { status: 400 });
  }

  const backendBase = resolveBackendBaseUrl();
  if (!backendBase) {
    return NextResponse.json({ error: "Backend URL is not configured." }, { status: 500 });
  }

  const targetUrl = new URL(`${backendBase}/api/recordings`);
  targetUrl.searchParams.set("call_id", callId);

  try {
    const response = await fetch(targetUrl.toString(), { cache: "no-store" });
    let payload: unknown = {};
    try { payload = await response.json(); } catch { payload = {}; }
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reach backend.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
