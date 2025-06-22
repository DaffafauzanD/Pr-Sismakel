import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { getAccessTokenFromRequest } from "@/lib/api-auth";

/**
 * @swagger
 * /api/user-management/permissions:
 *   get:
 *      summary: Get list of permission with pagination, sorting, and direction
 *      security:
 *      - bearerAuth: []
 *      tags:
 *       - Permissions
 *      parameters:
  *       - in: query
 *         name: query
 *         schema:
 *          type: string
 *         description: search by permission name
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
 *         description: List of permissions     
 */
export async function GET(req){
    const token = await getAccessTokenFromRequest(req);
    if(!token){
        return NextResponse.json(
            { message: 'Unauthorized: No valid Access Token in cookie or Authorization header' },
            { status: 401 },
        );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 0);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const query = searchParams.get('query') || '';
    const sortField = searchParams.get('sort') || 'name';
    const sortDirection = searchParams.get('dir') === 'desc' ? 'desc' : 'asc';

    try{
        const totalCount = await prisma.permission.count({
            where:{
                OR: [
                    { name: {contains: query.toLocaleLowerCase() }}
                ],
            },
        });

        const sortMap = {
            name: { name: sortDirection },
            create_date: {create_date: sortDirection},
            create_by: {create_by: sortDirection},
            update_date: {update_date: sortDirection},
            update_by: {update_by: sortDirection},
        };

        const orderBy = sortMap[sortField] || {create_date: sortDirection};

        const permissions = await prisma.permission.findMany({
            where: {
                OR: [
                    { name: {contains: query.toLocaleLowerCase()} },
                ],
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy,
            select: {
                id: true,
                name: true,
                create_date: true,
                create_by: true,
                update_date: true,
                update_by: true,
            },
        });

        return NextResponse.json({
            data: permissions,
            pagination: {
                total: totalCount,
                page,
                limit,
            },
            status: 200,
            message: 'Succesfuly fetching',
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