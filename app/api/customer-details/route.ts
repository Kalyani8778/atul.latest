import { NextRequest, NextResponse } from "next/server";

const resolveBackendBaseUrl = () => {
  const explicitBase =
    process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  if (explicitBase) {
    return explicitBase.replace(/\/+$/, "");
  }

  const uploadUrl = process.env.BACKEND_UPLOAD_URL;
  if (uploadUrl) {
    try {
      return new URL(uploadUrl).origin;
    } catch (_error) {
      return null;
    }
  }

  return null;
};

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone")?.trim();
  const id = request.nextUrl.searchParams.get("id")?.trim();
  const email = request.nextUrl.searchParams.get("email")?.trim();

  if (!phone && !id && !email) {
    return NextResponse.json(
      { error: "Provide at least one query parameter: id, email, or phone." },
      { status: 400 }
    );
  }

  const backendBase = resolveBackendBaseUrl();
  if (!backendBase) {
    return NextResponse.json(
      { error: "Backend URL is not configured." },
      { status: 500 }
    );
  }

  const targetUrl = new URL(`${backendBase}/api/customer-details`);
  if (phone) targetUrl.searchParams.set("phone", phone);
  if (id) targetUrl.searchParams.set("id", id);
  if (email) targetUrl.searchParams.set("email", email);

  try {
    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      cache: "no-store",
    });

    let payload: unknown = {};
    try {
      payload = await response.json();
    } catch (_error) {
      payload = {};
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reach backend.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
