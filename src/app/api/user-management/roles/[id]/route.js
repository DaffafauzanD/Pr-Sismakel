import { NextResponse } from "next/server";
import { getAccessTokenFromRequest } from "@/lib/api-auth";
import prisma from "../../../../../../prisma/client";
import { isUnique } from "@/lib/db";
import { hasPermission, hasRole, getRbacPayload } from "@/lib/rbac";
import { RoleSchema } from "@/app/(protected)/user-management/roles/forms/role-schema";

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the role
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: Name of the role
 *         description:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           description: Description of the role
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of permission IDs associated with this role
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Whether the role is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the role was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the role was last updated
 * 
 * /api/user-management/roles/{id}:
 *   put:
 *     summary: Update a role by ID
 *     description: Updates the details of an existing role. Requires admin role and 'role.update' permission.
 *     tags:
 *       - Roles
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the role to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 description: Name of the role
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 description: Description of the role
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of permission IDs to assign to this role
 *               isActive:
 *                 type: boolean
 *                 description: Whether the role should be active
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *                 message:
 *                   type: string
 *                   example: "Role updated successfully"
 *       400:
 *         description: Invalid input
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
 *                   example: "Invalid input. Please check your data and try again."
 *       401:
 *         description: Unauthorized - No valid Access Token
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
 *                   example: "Unauthorized: No valid Access Token in cookie or Authorization header"
 *       403:
 *         description: Forbidden - Insufficient permissions or not admin
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
 *                   example: "Forbidden: Insufficient permissions to update roles"
 *       404:
 *         description: Role not found
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
 *                   example: "Record not found. Someone might have deleted it already."
 */

export async function PUT(req, context){
    if(!hasPermission(req, 'role.update')){
        return NextResponse.json(
            { message: 'Forbidden: Insufficient permissions to create roles' },
            { status: 403 }
        );
    }

    if(!hasRole(req, 'admin')){
        return NextResponse.json(
            { message: 'Forbidden: Admin role required to update roles' },
            { status: 403 }
        );
    }
    
    const rbacData = getRbacPayload(req);

    try{
        const token = await getAccessTokenFromRequest(req)
        if(!token){
            return NextResponse.json(
                { message: 'Unauthorized: No valid Access Token in cookie or Authorization header' },
                { status: 401 },
            );
        }

        const { params } = context;
        const { id } = await params;

        if(!id){
            return NextResponse.json({error: 'Invalid Input'}, {status: 400});
        }

        const existingRole = await prisma.role.findUnique({
            where: {id},
        });
        if(!existingRole){
            return NextResponse.json(
                { message: 'Record not found. Someone might have deleted it already.' },
                { status: 404 },
            )
        }

        const body = await req.json();

        const parsedData = RoleSchema.safeParse(body);
        if(!parsedData.success){
            return NextResponse.json(
                { message: 'Invalid input. Please check your data and try again.' },
                { status: 400 },
            );
        }

        const { name, permissions } = parsedData.data;

        const isNameUnique = await isUnique('Role', { name }, { id });
        if(!isNameUnique){
            return NextResponse.json(
                { message: 'Name must be unique' },
                { status: 400 },
            );
        }

        const updateRole = await prisma.$transaction(async (tx) => {
            const role = await tx.role.update({
                where: {id},
                data: {
                    name,
                    updated_at: new Date(),
                    updated_by: rbacData?.username || 'SYSTEM',
                },
            });

            await tx.rolePermission.deleteMany({
                where: {id_role: id},
            });

            if(permissions && permissions?.length > 0){
                const newPermissions= permissions.map((permissionId) => ({
                    id_role: id,
                    id_permission: permissionId,
                    update_date: new Date(),
                    update_by: rbacData?.username,
                    create_by: rbacData?.username,
                }));

                await tx.rolePermission.createMany({
                    data: newPermissions,
                });
            }

            return role;
        });

        return NextResponse.json({
            message: 'Role update successfully',
            data: updateRole
        }, { status: 201 });
    }catch(error){
        console.error('[ROLE_UPDATE_ERROR]', error);
        return NextResponse.json(
            { message: 'Oops! Something went wrong. Please try again in a moment.' },
            { status: 500 }
        );
    }
}