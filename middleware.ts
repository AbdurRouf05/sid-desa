import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    // Check Host header, fallback to X-Forwarded-Host (for proxies)
    const hostname = request.headers.get("host") || request.headers.get("x-forwarded-host") || "";

    // SID Sumberanyar Logic: If hostname starts with 'cp', treat as ADMIN.
    // We check if "cp." is present in the hostname as a simple check.
    // This supports both cp.sumberanyar.local and cp.sumberanyar.id
    const isAdmin = hostname.includes("cp.");

    console.log("Middleware Debug:", { hostname, pathname: url.pathname, isAdmin });

    // 1. Bot Protection (Simple User-Agent Block) - Global
    const ua = request.headers.get("user-agent") || "";
    const badBots = ["GPTBot", "CCBot", "Omgilibot", "FacebookBot"];
    if (badBots.some((bot) => ua.includes(bot))) {
        return new NextResponse("Access Denied", { status: 403 });
    }

    // 2. CSP Headers (Preserve security)
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.tawk.to https://embed.tawk.to https://analytics.google.com https://www.instagram.com https://platform.instagram.com https://www.tiktok.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://db-desa.sumberanyar.id https://db-bmtnulmj.sagamuda.cloud https://images.unsplash.com https://img.youtube.com https://*.cdninstagram.com;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://www.youtube.com https://www.tiktok.com https://www.instagram.com https://embed.tawk.to;
    connect-src 'self' https://db-desa.sumberanyar.id https://db-bmtnulmj.sagamuda.cloud https://analytics.google.com wss://*.tawk.to;
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `
        .replace(/\s{2,}/g, " ")
        .trim();

    // 3. Subdomain Routing
    if (isAdmin) {
        // [ADMIN ROUTE]
        // If accessing root /, rewrite to /panel/dashboard (or redirect)
        if (url.pathname === "/") {
            return NextResponse.redirect(new URL("/panel/dashboard", request.url));
        }

        // Rewrite path to include /panel for group route routing
        const newUrl = new URL(request.url);
        if (!url.pathname.startsWith("/panel") && !url.pathname.startsWith("/cdn") && !url.pathname.startsWith("/api")) {
            newUrl.pathname = `/panel${url.pathname}`;
            const response = NextResponse.rewrite(newUrl);
            response.headers.set("Content-Security-Policy", cspHeader);
            response.headers.set("X-Frame-Options", "DENY");
            return response;
        }

        const response = NextResponse.next();
        response.headers.set("Content-Security-Policy", cspHeader);
        response.headers.set("X-Frame-Options", "DENY");
        return response;
    } else {
        // [PUBLIC ROUTE]
        
        // 1. Block Admin Path on Public Domain
        if (url.pathname.startsWith("/panel")) {
            url.pathname = "/private/secure/not-found";
            return NextResponse.rewrite(url);
        }

        // 2. Rewrite / to /home
        if (url.pathname === "/") {
            url.pathname = "/home";
            const response = NextResponse.rewrite(url);
            response.headers.set("Content-Security-Policy", cspHeader);
            return response;
        }

        // Standard Public Routes
        const response = NextResponse.next();
        response.headers.set("Content-Security-Policy", cspHeader);
        return response;
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
