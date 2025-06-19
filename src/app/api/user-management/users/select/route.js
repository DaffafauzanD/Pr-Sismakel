import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "../../../../../../prisma/client";
import authOptions from "@/app/api/auth/[...nextauth]/next-auth";
import { getAccessTokenFromRequest } from "@/lib/api-auth";
/**
 * @swagger
 * /api/user-management/users/select:
 *   get:
 *     summary: Get list of users without filters
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: List of users
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
export async function  GET(req) {
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
        const session = await getServerSession(authOptions);

        if(!session){
            return NextResponse.json(
                {message: 'Unauthorize request'},
                {status: 401}
            );
        }

        const users = await prisma.user.findMany({
            where:{
                OR:[
                    {username: {contains: query.toLocaleLowerCase()}},
                ],
            },
            select:{
                id:true,
                username: true,
                created_at: true,
                created_by: true,
                updated_at: true,
                updated_by: true,
            },
            include:{
                Role: true
            },
        });

        return NextResponse.json({
            data: users,
            message: 'Data users successfuly fetch',
            status: 200,
        });
    }catch{
        return NextResponse.json(
            {message: 'Oops! Something went wrong, Please try again in a momment'},
            {status: 500},
        );
    }
}