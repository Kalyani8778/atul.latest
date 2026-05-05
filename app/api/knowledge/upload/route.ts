import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const backendUrl =
    process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  if (!backendUrl) {
    return NextResponse.json({ error: "Backend URL not configured." }, { status: 503 });
  }

  // Forward the raw body + Content-Type directly — do NOT parse FormData and
  // reconstruct it. Parsing destroys the multipart boundary that multer needs,
  // and reconstruction can fail on large files.
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.startsWith("multipart/form-data")) {
    return NextResponse.json({ error: "Expected multipart/form-data." }, { status: 400 });
  }

  let body: Blob;
  try {
    body = await req.blob();
  } catch {
    return NextResponse.json({ error: "Failed to read upload body." }, { status: 400 });
  }

  try {
    const response = await fetch(`${backendUrl}/api/knowledge/upload`, {
      method: "POST",
      headers: { "content-type": contentType },
      body,
    });

    // Backend might return a non-JSON error page on crash — handle gracefully
    const text = await response.text();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Backend returned non-JSON:", text.slice(0, 200));
      return NextResponse.json(
        { error: `Backend error (${response.status})` },
        { status: 502 }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    console.error("Upload proxy error:", msg);
    return NextResponse.json({ error: `Upload failed: ${msg}` }, { status: 502 });
  }
}
