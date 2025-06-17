import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login menggunakan username dan password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     id_role:
 *                       type: string
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Data tidak lengkap
 *       401:
 *         description: Password salah
 *       404:
 *         description: User tidak ditemukan
 */
export async function POST(req){
    try{
        const formData = await req.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!username || !password) {
            return NextResponse.json({ message: 'Username dan password wajib diisi.' }, { status: 400 });
        }

        const user = await prisma.user
        .findUnique(
            {where: {username} },
            {include: {Role: true}}
        );

        if(!user){
            return NextResponse.json({message: 'User tidak ditemukan'}, {status: 404});
        }

        const isValid = await bcrypt.compare(password, user.password || '');

        if(!isValid){
            return NextResponse.json({message: 'Password Salah'}, {status: 401});
        }

            const role = await prisma.role.findUnique({
            where: { id: user.id_role },
            include: {
            RolePermission: {
                include: {
                Permission: true,
                },
            },
            },
        });

        const permissions = role?.RolePermission?.map(p => p.Permission?.name) || [];

        const tokenPayload = {
            id: user.id,
            username: user.username,
            roleName: role.name,
            permissions
        }

        const token = jwt.sign(tokenPayload, process.env.AUTH_SECRET, { expiresIn: '24h' });

        return NextResponse.json({
            token,
            user: tokenPayload,
            status: 200
        });
    }catch(error){
        console.error('[LOGIN_ERROR]', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}