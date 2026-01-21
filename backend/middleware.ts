import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // ✅ JANGAN SENTUH API & ASSETS
    if (
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // ✅ PUBLIC ROUTES
    const publicRoutes = ["/login", "/register"];

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // ❗ Middleware TIDAK bisa baca cookie backend
    // Jadi jangan pakai middleware buat auth logic
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico).*)"],
};
