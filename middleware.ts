import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Protected paths
    if (pathname.startsWith('/sekolah')) {
        // Allow auth pages even without token
        if (
            pathname.startsWith('/sekolah/login') ||
            pathname.startsWith('/sekolah/register') ||
            pathname.startsWith('/sekolah/verify') ||
            pathname.startsWith('/sekolah/forgot-password') ||
            pathname.startsWith('/sekolah/reset-password')
        ) {
            // If user has token and tries to go to login/register, redirect to dashboard
            if (token) {
                return NextResponse.redirect(new URL('/sekolah/dashboard', request.url));
            }
            return NextResponse.next();
        }

        // Default protection for other /sekolah routes (dashboard, documents)
        if (!token) {
            return NextResponse.redirect(new URL('/sekolah/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/sekolah/:path*'],
};
