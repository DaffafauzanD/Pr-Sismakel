import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

/**
 * @swagger
 * /api/user-management/profile:
 *   get:
 *     summary: Get profile user yang sedang login
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Profile user berhasil diambil
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
 *                     username:
 *                       type: string
 *                     role:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function GET(req) {
    try {
        // Get user info from middleware headers
        const userId = req.headers.get('x-user-id');
        const username = req.headers.get('x-user-username');
        const userRole = req.headers.get('x-user-role');
        const userPermissions = req.headers.get('x-user-permissions');

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: 'User tidak ditemukan'
            }, { status: 401 });
        }

        // Get detailed user info from database
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                Role: {
                    include: {
                        RolePermission: {
                            include: {
                                Permission: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User tidak ditemukan'
            }, { status: 404 });
        }

        const permissions = user.Role?.RolePermission?.map(rp => rp.Permission?.name) || [];

        return NextResponse.json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                role: {
                    id: user.Role?.id,
                    name: user.Role?.name
                },
                permissions,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        });
    } catch (error) {
        console.error('[PROFILE_ERROR]', error);
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });
    }
} 