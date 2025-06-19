import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "../../../../../../prisma/client";
import authOptions from "@/app/api/auth/[...nextauth]/next-auth";
import { getAccessTokenFromRequest } from "@/lib/api-auth";

/**
 * @swagger
 * /api/user-management/roles/select:
 *   get:
 *     summary: Get all roles
 *     description: Returns a list of all roles
 *     responses:
 *       200:
 *         description: List of roles
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
    try{
        const token = getAccessTokenFromRequest(req);
        if (!token) {
          return NextResponse.json(
            { message: 'Unauthorized: No valid Access Token in cookie or Authorization header' },
            { status: 401 },
          );
        }

        const roles = await prisma.role.findMany({
            select:{
                id:true,
                name:true,
            },
            orderBy:{
                name: 'asc',
            },
        });

        return NextResponse.json(roles);
    }catch{
        return NextResponse.json(
            {message: 'Oops! Something went wrong, Please try again in a momment'},
            {status: 500}
        );
    }
}