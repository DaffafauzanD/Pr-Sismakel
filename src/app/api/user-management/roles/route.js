import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { getAccessTokenFromRequest } from "@/lib/api-auth";

/**
 * @swagger
 * /api/user-management/roles:
 *   get:
 *      summary: Get list of roles with pagination, sorting, and direction
 *      security:
 *      - bearerAuth: []
 *      tags:
 *       - Roles
 *      parameters:
  *       - in: query
 *         name: query
 *         schema:
 *          type: string
 *         description: search by roles name
 *         required: false
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *         required: false
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field name to sort by (e.g., created_at)
 *         required: false
 *       - in: query
 *         name: dir
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *         required: false
 *      responses:
 *        200:
 *         description: List of roles     
 */
export async function GET(req){
    const token = await getAccessTokenFromRequest(req);
    if(!token){
        return NextResponse.json(
            { message: 'Unauthorized: No valid Access Token in cookie or Authorization header' },
            { status: 401 },
        )
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const query = searchParams.get('query') || '';
    const sortField = searchParams.get('sort') || 'name';
    const sortDirection = searchParams.get('dir') === 'desc' ? 'desc' : 'asc';

    try{
        const totalCount = await prisma.role.count({
            where: {
                OR: [
                    {name : {contains: query.toLowerCase() } },
                ],
            },
        });

        const sortMap = {
            name: { name: sortDirection},
            created_at: { created_at: sortDirection},
            created_by: { created_by: sortDirection},
            updated_at: { updated_at: sortDirection},
            updated_by: { updated_by: sortDirection},
        };

        const orderBy = sortMap[sortField] || {created_at: sortDirection};

        const role = await prisma.role.findMany({
            where: {
                OR: [
                    {name: { contains: query.toLowerCase()} },
                ],
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy,
            select: {
                id: true,
                name: true,
                created_at: true,
                created_by: true,
                updated_at: true,
                updated_by: true,
                RolePermission: {
                    select: {
                        id: true,
                        Permission: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({
            data: role,
            pagination: {
                total: totalCount,
                page,
                limit,
            },
            status: 200,
            message: 'Successfully fetching',
        });
        
    }catch(error){
        return NextResponse.json(
            { 
                message: 'Oops! Something went wrong. Please try again in a moment.',
                error: error,
            },
            { status: 500},
        );
    }
}