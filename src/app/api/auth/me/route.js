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
        const authHeader = req.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({
                success: false,
                message: 'Token tidak ditemukan'
            }, { status: 401 });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(process.env.AUTH_SECRET)
            );

            return NextResponse.json({
                success: true,
                data: {
                    id: payload.id,
                    username: payload.username,
                    id_role: payload.id_role,
                    roleName: payload.roleName,
                    permissions: payload.permissions || []
                }
            });
        } catch (jwtError) {
            return NextResponse.json({
                success: false,
                message: 'Token tidak valid'
            }, { status: 401 });
        }
    } catch (error) {
        console.error('[ME_ERROR]', error);
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });
    }
} 