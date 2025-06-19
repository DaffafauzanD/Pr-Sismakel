import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "../../../../../../prisma/client";
import authOptions from "@/app/api/auth/[...nextauth]/next-auth";
import { getAccessTokenFromRequest } from "@/lib/api-auth";

/**
 * @swagger
 * /api/user-management/rolepermissions/select:
 *   get:
 *     summary: Get list of role permissions without filters
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Role Permissions
 *     responses:
 *       200:
 *         description: List of role permissions
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
    const token = getAccessTokenFromRequest(req);
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized: No valid Access Token in cookie or Authorization header' },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    try{
        const session = getServerSession(authOptions);

        if(!session){
            return NextResponse.json(
                {message: 'Unauthorize request'},
                {status: 401},
            );
        }

        const rolePermissions = await prisma.rolePermission.findMany({
            where:{
                OR:[
                    {
                        Role: {
                            username: {contains: query.toLocaleLowerCase()},
                        },
                    },
                ],
            },
            select:{
                id: true,
                id_role: true,
                id_permission: true,
                create_date: true,
                create_by: true,
                update_date: true,
                update_by: true,
            },
            include:{
                Role: true,
                Permission: true,
            },
        });

        return NextResponse.json({
            data: rolePermissions,
            message: 'Succeesfuly fetching',
            status: 200,
        });
    }catch(error){
        return NextResponse.json(
            {message: 'Oops! Something went wrong, Please try again in a momment'},
            {status: 500},
        )
    }
}