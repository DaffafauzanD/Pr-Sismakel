import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/next-auth";
import prisma from "../../../../../prisma/client";


/**
 * @swagger
 * /api/user-management/rolepermissions:
 *   get:
 *      summary: Get list of role permission with pagination, sorting, and direction
 *      security:
 *      - bearerAuth: []
 *      tags:
 *       - Role Permissions
 *      parameters:
  *       - in: query
 *         name: query
 *         schema:
 *          type: string
 *         description: search by role name
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
 *         description: List of role permissions
 */
export async function GET(req){
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const query = searchParams.get('query') || '';
    const sortField = searchParams.get('sort') || 'name';
    const sortDirection = searchParams.get('dir') === 'desc' ? 'desc' : 'asc';
    const id_role = searchParams.get('id_role') || null;

    try{

        const session = await getServerSession(authOptions);

        if(!session){
            return NextResponse.json(
                {message: 'Unauthorize request'},
                {status: 401},
            );
        }

        const totalCount = await prisma.rolePermission.count({
        where: {
            AND: [
            ...(id_role && id_role !== 'all' ? [{ id_role }] : []),
            {
                Role: {
                name: {
                    contains: query.toLowerCase(),
                },
                },
            },
            ],
        },
        });

        
        const sortMap = {
            roleName: { Role: {name: sortDirection} },
            permissionName: { Permission: {name: sortDirection} },
            create_date: { create_date: sortDirection},
            create_by: {create_by: sortDirection},
            update_date: {update_date: sortDirection},
            update_by: {update_by: sortDirection}
        };

        const orderBy = sortMap[sortField] || {create_date: sortDirection};

        const rolePermission = await prisma.rolePermission.findMany({
        where: {
            AND: [
            ...(id_role && id_role !== 'all' ? [{ id_role }] : []),
            {
                OR: [
                {
                    Role: {
                    name: {
                        contains: query.toLowerCase(),
                    },
                    },
                },
                ],
            },
            ],
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        select: {
            id: true,
            id_role: true,
            id_permission: true,
            create_date: true,
            create_by: true,
            update_date: true,
            update_by: true,
            Role: {
            select: {
                id: true,
                name: true,
            },
            },
            Permission: { // <-- Jika ingin ambil permission, pakai relasi ini
            select: {
                id: true,
                name: true,
            },
            },
        },
        });

        return NextResponse.json({
            data: rolePermission,
            pagination: {
                total: totalCount,
                page,
                limit,
            },
            status: 200,
            message: 'succeesfuly fetching'
        });
    }catch(error){
        return NextResponse.json(
            {
                message: 'Oops! Something went wrong. Please try again in a moment.',
                error: error.message,
            },
            { status: 500},
        );
    }
}