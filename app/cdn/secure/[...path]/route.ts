
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;

    // Reconstruct the PocketBase URL
    // Expected path format: /cdn/secure/collectionId/recordId/filename
    if (path.length < 3) {
        return new NextResponse("Invalid path", { status: 400 });
    }

    const [collectionId, recordId, filename] = path;
    const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;

    // Construct upstream URL
    const targetUrl = `${pbUrl}/api/files/${collectionId}/${recordId}/${filename}`;

    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            return new NextResponse("Asset not found", { status: response.status });
        }

        // Forward headers (ContentType, CacheControl)
        const headers = new Headers();
        headers.set("Content-Type", response.headers.get("Content-Type") || "application/octet-stream");
        headers.set("Cache-Control", "public, max-age=31536000, immutable"); // Cache for 1 year

        // Return streamed response
        return new NextResponse(response.body, {
            status: 200,
            headers: headers
        });

    } catch (error) {
        console.error("CDN Proxy Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
