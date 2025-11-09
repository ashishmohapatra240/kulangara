import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protect /admin routes on the server and enforce role-based access.
// Delivery partners can only access /admin/orders and related actions.

const ADMIN_PATH = '/admin';
const LOGIN_PATH = '/admin/login';
const REGISTER_PATH = '/admin/register';

const ALLOW_FOR_ALL_ADMINS = new Set(['SUPER_ADMIN', 'ADMIN']);
const ALLOW_FOR_DELIVERY_ORDERS_ONLY = new Set(['DELIVERY_PARTNER']);

export async function middleware(request: NextRequest) {
    // Feature-flag the middleware to avoid accidental lockouts in dev or
    // when API is on a different origin. Enable by setting
    // NEXT_PUBLIC_ENABLE_ADMIN_MIDDLEWARE=true
    if (process.env["NEXT_PUBLIC_ENABLE_ADMIN_MIDDLEWARE"] !== 'true') {
        return NextResponse.next();
    }
    const { pathname } = request.nextUrl;

    // Skip auth for auth pages themselves
    if (pathname === LOGIN_PATH || pathname === REGISTER_PATH) {
        return NextResponse.next();
    }

    if (!pathname.startsWith(ADMIN_PATH)) {
        return NextResponse.next();
    }

    const apiBase = process.env["NEXT_PUBLIC_API_URL"] || '';
    // If API base is not configured or is a different origin than the current site,
    // we cannot reliably forward auth cookies from the browser to the API in middleware.
    // In that case, skip server-side auth and let client-side guards handle it.
    try {
        const requestOrigin = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
        if (!apiBase || !apiBase.startsWith(requestOrigin)) {
            return NextResponse.next();
        }
    } catch {
        // If any parsing fails, fallback to allowing the request
        return NextResponse.next();
    }

    try {
        // Validate session and get user
        const refreshUrl = `${apiBase}/api/v1/auth/refresh`;
        const cookieHeader = request.headers.get('cookie') || '';

        const response = await fetch(refreshUrl, {
            method: 'POST',
            headers: {
                cookie: cookieHeader,
                'content-type': 'application/json',
            },
            // Ensure middleware fetch does not cache user state
            cache: 'no-store',
        });

        if (!response.ok) {
            const url = request.nextUrl.clone();
            url.pathname = LOGIN_PATH;
            url.searchParams.set('next', pathname);
            return NextResponse.redirect(url);
        }

        const data = await response.json();
        const user = data?.data?.user ?? data?.user ?? null;
        const role: string | undefined = user?.role;

        if (!role) {
            const url = request.nextUrl.clone();
            url.pathname = LOGIN_PATH;
            url.searchParams.set('next', pathname);
            return NextResponse.redirect(url);
        }

        // Delivery Partner can access only orders routes
        if (ALLOW_FOR_DELIVERY_ORDERS_ONLY.has(role)) {
            const isOrdersPath = pathname.startsWith('/admin/orders');
            if (!isOrdersPath) {
                const url = request.nextUrl.clone();
                url.pathname = '/admin/orders';
                return NextResponse.redirect(url);
            }
            return NextResponse.next();
        }

        // Admins/Super Admins can access everything under /admin
        if (ALLOW_FOR_ALL_ADMINS.has(role)) {
            return NextResponse.next();
        }

        // Otherwise, block
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    } catch {
        const url = request.nextUrl.clone();
        url.pathname = LOGIN_PATH;
        url.searchParams.set('next', pathname);
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: ['/admin/:path*'],
};


