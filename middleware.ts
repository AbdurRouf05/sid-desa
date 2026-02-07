import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get("host") || "";

    // Logic: If hostname starts with 'cp', treat as ADMIN.
    // We check if "cp." is present in the hostname as a simple check.
    // This supports both cp.bmtnulmj.local and cp.bmtnulmj.id
    const isAdmin = hostname.includes("cp.");

    console.log("Middleware Debug:", { hostname, pathname: url.pathname, isAdmin });

    // 1. Bot Protection (Simple User-Agent Block) - Global
    const ua = request.headers.get("user-agent") || "";
    const badBots = ["GPTBot", "CCBot", "Omgilibot", "FacebookBot"];
    if (badBots.some((bot) => ua.includes(bot))) {
        return new NextResponse("Access Denied", { status: 403 });
    }

    // 2. CSP Headers (Preserve security)
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://analytics.google.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://minio.sagamuda.cloud;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `
        .replace(/\s{2,}/g, " ")
        .trim();

    // 3. Subdomain Routing
    if (isAdmin) {
        // [ADMIN ROUTE]
        // If accessing root /, redirect to /dashboard
        if (url.pathname === "/") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // Rewrite path to include (admin) invisible folder
        // Note: checks to avoid double-rewriting if already rewritten are internal to Next.js usually
        // but explicit rewrite is safer.
        // EXCEPTION: CDN and specific public assets should not be rewritten to /panel
        const newUrl = new URL(request.url);
        if (!url.pathname.startsWith("/panel") && !url.pathname.startsWith("/cdn")) {
            newUrl.pathname = `/panel${url.pathname}`;
        }

        // Optimization: If the path is already correct (starts with /panel), use next()
        // This avoids unnecessary rewrites and potential conflicts.
        if (newUrl.pathname === url.pathname) {
            const response = NextResponse.next();
            response.headers.set("X-Frame-Options", "DENY");
            return response;
        }

        // Add Security Headers
        const response = NextResponse.rewrite(newUrl);
        // response.headers.set("Content-Security-Policy", cspHeader);
        response.headers.set("X-Frame-Options", "DENY");
        return response;
    } else {
        // [PUBLIC ROUTE]

        // 1. Block Admin Path on Public Domain
        if (url.pathname.startsWith("/panel")) {
            // Stealth Mode: Rewrite to a definitely non-existent path to trigger 404.
            // Rewriting to "/404" specifically can sometimes loop if Next.js tries to treat it as a page.
            url.pathname = "/private/secure/not-found";
            return NextResponse.rewrite(url);
        }

        // EXCEPTION: Development Page (Do not rewrite)
        if (url.pathname.startsWith("/development")) {
            return NextResponse.next();
        }

        // Standard Public Routes
        // We no longer rewrite to /home as we moved the homepage to app/page.tsx
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
