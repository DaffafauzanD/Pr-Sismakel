import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { getAccessTokenFromRequest } from "@/lib/api-auth";
import { RoleSchema } from "@/app/(protected)/user-management/roles/forms/role-schema";
import { isUnique } from "@/lib/db";
import { hasPermission, hasRole, getRbacPayload } from "@/lib/rbac";

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
    // Cek permission untuk membaca data role
    if (!hasPermission(req, 'role.read')) {
        return NextResponse.json(
            { message: 'Forbidden: Insufficient permissions to read roles' },
            { status: 403 }
        );
    }

    // Ambil data RBAC untuk logging
    const rbacData = getRbacPayload(req);
    if (rbacData) {
        console.log(`[ROLE_LIST] Request by ${rbacData.username} (${rbacData.roleName})`);
    }

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
/**
 * @swagger
 * /api/user-management/roles:
 *   post:
 *     summary: Create a new role with permissions
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - permissions
 *             properties:
 *               name:
 *                 type: string
 *                 description: Role name (must be unique)
 *                 example: "editor"
 *               permissions:
 *                 type: array
 *                 description: Array of permission IDs to assign to the role
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Role ID
 *                     name:
 *                       type: string
 *                       description: Role name
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: Creation timestamp
 *                     created_by:
 *                       type: integer
 *                       description: User ID who created the role
 *                     RolePermission:
 *                       type: array
 *                       description: Associated permissions
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           Permission:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Role created successfully"
 *       400:
 *         description: Bad request - validation error or duplicate role name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Name must be unique"
 *       401:
 *         description: Unauthorized - no valid access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: No valid Access Token in cookie or Authorization header"
 *       403:
 *         description: Forbidden - insufficient permissions or admin role required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: Insufficient permissions to create roles"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Oops! Something went wrong. Please try again in a moment."
 *                 error:
 *                   type: object
 *                   description: Error details
 */
export async function POST(request){
    // Cek permission untuk membuat role baru
    if (!hasPermission(request, 'role.create')) {
        return NextResponse.json(
            { message: 'Forbidden: Insufficient permissions to create roles' },
            { status: 403 }
        );
    }

    // Cek role - hanya admin yang bisa membuat role
    if (!hasRole(request, 'admin')) {
        return NextResponse.json(
            { message: 'Forbidden: Admin role required to create roles' },
            { status: 403 }
        );
    }

    // Ambil data RBAC untuk logging dan audit trail
    const rbacData = getRbacPayload(request);
    if (rbacData) {
        console.log(`[ROLE_CREATE] Request by ${rbacData.username} (${rbacData.roleName})`);
    }

    try{
        const token = await getAccessTokenFromRequest(request)
        if(!token){
            return NextResponse.json(
                { message: 'Unauthorized: No valid Access Token in cookie or Authorization header' },
                { status: 401 },
            )
        }

        const body = await request.json();

        const parsedData = RoleSchema.safeParse(body);
        if(!parsedData.success){
            return NextResponse.json(
                { message: 'Invalid input. Please check your data and try again.' },
                { status: 400 },
            );
        }

        const { name, permissions } = parsedData.data;
        
        const isUniqueRole = await isUnique('Role', {name});
        if(!isUniqueRole){
            return NextResponse.json(
                { message: 'Name must be unique'},
                { status: 400},
            );
        }

        const createdRole = await prisma.$transaction(async (tx) => {
            const newRole = await tx.Role.create({
                data: {
                    name,
                    created_by: rbacData?.username || 'unknown', // Tambahkan audit trail
                }
            });

            // Jika ada permissions, buat role permissions
            if (permissions && permissions.length > 0) {
                const rolePermissions = permissions.map(permissionId => ({
                    id_role: newRole.id,
                    id_permission: permissionId,
                    created_by: rbacData?.username || 'unknown',
                }));

                await tx.RolePermission.createMany({
                    data: rolePermissions
                });
            }

            return newRole;
        });

        return NextResponse.json({
            message: 'Role created successfully',
            data: createdRole
        }, { status: 201 });

    }catch(error){
        console.error('[ROLE_CREATE_ERROR]', error);
        return NextResponse.json(
            { message: 'Oops! Something went wrong. Please try again in a moment.' },
            { status: 500 }
        );
    }
}