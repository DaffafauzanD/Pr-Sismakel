import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ['/api/auth', '/api/docs'];

export async function middleware(req){
    const { pathname } = req.nextUrl;
    
    console.log('🔍 Middleware running for path:', pathname);

    if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
        console.log('✅ Public path, skipping middleware');
        return NextResponse.next();
    }

    console.log('🔒 Protected path, checking authentication...');

    // Ambil token dari cookie accessToken
    let token = null;
    const cookie = req.headers.get('cookie');
    if (cookie) {
        const match = cookie.match(/accessToken=([^;]+)/);
        if (match) token = match[1];
    }
    // Jika tidak ada di cookie, cek Authorization header
    if (!token) {
        const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }
    console.log('🔍 Token length:', token ? token.length : 'Missing');
    if(!token){
        console.log('❌ No token found in cookie or Authorization header');
        return NextResponse.json({message: 'Unauthorized: No Token'}, {status: 401});
    }

    try{
        console.log('🔍 Verifying JWT token...');
        const {payload} = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.AUTH_SECRET)
        );

        console.log('✅ JWT verified, payload:', {
            id: payload.id,
            username: payload.username,
            role: payload.roleName || payload.id_role
        });

        // Create new headers with user info
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', payload.id);
        requestHeaders.set('x-user-username', payload.username);
        requestHeaders.set('x-user-role', payload.roleName || payload.id_role);
        requestHeaders.set('x-user-permissions', JSON.stringify(payload.permissions || []));

        console.log('✅ Headers injected, proceeding...');

        // Return response with updated headers
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }catch(error){
        console.error('❌ Middleware JWT Error:', error);
        return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }
}

export const config = {
  matcher: ['/api/:path*'],
};