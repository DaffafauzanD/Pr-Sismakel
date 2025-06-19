import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get informasi user yang sedang login
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informasi user berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     username:
 *                       type: string
 *                       example: admin
 *                     id_role:
 *                       type: string
 *                       example: "1"
 *                     roleName:
 *                       type: string
 *                       example: admin
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["read", "write", "delete"]
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
export async function GET(req) {
  try {
    const cookie = req.headers.get('cookie');
    let token = null;
    let rbacPayload = null;

    if (cookie) {
      const tokenMatch = cookie.match(/accessToken=([^;]+)/);
      const rbacMatch = cookie.match(/rbacPayload=([^;]+)/);

      if (tokenMatch) token = tokenMatch[1];
      if (rbacMatch) {
        try {
          rbacPayload = JSON.parse(decodeURIComponent(rbacMatch[1]));
        } catch (e) {
          rbacPayload = null;
        }
      }
    }

    // ⛔ Unauthorized jika tidak ada token
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No valid Access Token in cookie' },
        { status: 401 }
      );
    }

    // Buat Authorization Header secara eksplisit
    const requestHeaders = new Headers();
    requestHeaders.set('Authorization', `Bearer ${token}`);
    requestHeaders.set('Content-Type', 'application/json');


    // ✅ Verifikasi token JWT
    let payload;
    try {
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.AUTH_SECRET)
      );
      payload = verified.payload;
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid' },
        { status: 401 }
      );
    }

    //🟡 Jika Anda perlu fetch ke API internal/eksternal:
    // const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/`, {
    //   headers: requestHeaders,
    // });
    // const apiData = await apiResponse.json();

    return NextResponse.json({
      success: true,
      data: {
        id: payload.id,
        username: payload.username,
        id_role: payload.id_role,
        roleName: payload.roleName,
        permissions: payload.permissions || [],
        accessToken: token
      }
    });

  } catch (error) {
    console.error('[GET_USER_INFO_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
