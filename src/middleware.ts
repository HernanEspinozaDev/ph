import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Same secret as in route.ts
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-change-this');

export async function middleware(request: NextRequest) {
    // Only run on /ventas routes
    if (request.nextUrl.pathname.startsWith('/ventas')) {

        // Allow access to login page
        if (request.nextUrl.pathname === '/ventas/login') {
            return NextResponse.next();
        }

        const token = request.cookies.get('admin_session')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/ventas/login', request.url));
        }

        try {
            await jwtVerify(token, JWT_SECRET);
            return NextResponse.next();
        } catch (error) {
            // Invalid token
            return NextResponse.redirect(new URL('/ventas/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/ventas/:path*'],
};
