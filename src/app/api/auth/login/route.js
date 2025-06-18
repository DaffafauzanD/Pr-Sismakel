import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login menggunakan username dan password untuk mendapatkan JWT token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Data tidak lengkap
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Password salah
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(req){
    try{
        // Support both form data and JSON
        let username, password;
        
        const contentType = req.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const body = await req.json();
            username = body.username;
            password = body.password;
        } else {
            const formData = await req.formData();
            username = formData.get('username');
            password = formData.get('password');
        }

        if (!username || !password) {
            return NextResponse.json({ 
                success: false,
                message: 'Username dan password wajib diisi.' 
            }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { username },
            include: { 
                Role: true 
            }
        });

        if(!user){
            return NextResponse.json({
                success: false,
                message: 'User tidak ditemukan'
            }, {status: 404});
        }

        const isValid = await bcrypt.compare(password, user.password || '');

        if(!isValid){
            return NextResponse.json({
                success: false,
                message: 'Password salah'
            }, {status: 401});
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
            id_role: user.id_role,
            roleName: role?.name || 'Unknown',
            permissions
        }

        const accessToken = jwt.sign(tokenPayload, process.env.AUTH_SECRET, { expiresIn: '24h' });

        return NextResponse.json({
            success: true,
            message: 'Login berhasil',
            data: {
                accessToken,
                user: tokenPayload
            }
        });
    }catch(error){
        console.error('[LOGIN_ERROR]', error);
        return NextResponse.json({ 
            success: false,
            message: 'Internal Server Error' 
        }, { status: 500 });
    }
}