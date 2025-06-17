import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ['/api/auth', '/api/docs'];

export async function middleware(req){
    const { pathname } = req.nextUrl;

    if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    const token = req.headers.get('authorization')?.replace('Bearer', '');

    if(!token){
        return NextResponse.json({message: 'Unauthorize: No Token'}, {status: 401});
    }

    try{
        const {payload} = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.AUTH_SECRET)
        );

        req.headers.get('x-user-role', payload.role);
        req.headers.get('x-user-id', payload.id);
        req.headers.get('x-user-id', payload.username);
        req.header.get('x-user-permission', JSON.stringify(payload.permissions || []));

        return NextResponse.next();
    }catch(error){
        return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }
}

export const config = {
  matcher: ['/api/:path*'],
};