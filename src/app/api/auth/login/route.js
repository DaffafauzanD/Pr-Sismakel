import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login dan dapatkan token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token berhasil dibuat
 *       401:
 *         description: Autentikasi gagal
 */
export async function POST(req){
    const {username, password} = await req.json();

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

    const token = jwt.sign({
        id: user.id,
        username: user.username,
        id_role: user.Role?.name,
    },
        process.env.AUTH_SECRET,
        { expiresIn: '1d'}
    );

    return NextResponse.json({token});
}