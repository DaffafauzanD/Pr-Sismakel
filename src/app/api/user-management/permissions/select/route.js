import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";
import { getAccessTokenFromRequest } from "@/lib/api-auth";

/**
 * @swagger
 * /api/user-management/permissions/select:
 *   get:
 *     summary: Get list of permissions without filters
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Permissions
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function GET(req){
    const token = await getAccessTokenFromRequest(req)
    if(!token){
        return NextResponse.json(
            { message: 'Unauthorized: No valid Access Token in cookie or Authorization header' },
            { status: 401 },
        )
    }

    try{
        const permissions = await prisma.permission.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(permissions)
    }catch(error){
        return NextResponse.json(
            {message: 'Oops! Something went wrong, Please try again in a momment'},
            {status: 500}
        );
    }
}