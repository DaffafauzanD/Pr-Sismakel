import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/auth/token:
 *   post:
 *     summary: Generate access token for user login
 *     description: Authenticate user with username and password, then return a JWT access token and user info.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *                 example: yourpassword
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
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: Login berhasil, JWT token dikembalikan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: JWT access token
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         username:
 *                           type: string
 *                         id_role:
 *                           type: integer
 *                         roleName:
 *                           type: string
 *                         permissions:
 *                           type: array
 *                           items:
 *                             type: string
 *       400:
 *         description: Username dan password wajib diisi
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
 *                   example: Username dan password wajib diisi.
 *       401:
 *         description: Password salah
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
 *                   example: Password salah
 *       404:
 *         description: User tidak ditemukan
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
 *                   example: User tidak ditemukan
 *       500:
 *         description: Internal Server Error
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
 *                   example: Internal Server Error
 */

export async function POST(req) {
  try {
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
      include: { Role: true }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User tidak ditemukan'
      }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password || '');
    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: 'Password salah'
      }, { status: 401 });
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
    };
    const accessToken = jwt.sign(tokenPayload, process.env.AUTH_SECRET, { expiresIn: '24h' });
    return NextResponse.json({
      success: true,
      message: 'Token generated successfully',
      data: {
        accessToken,
        user: tokenPayload
      }
    });
  } catch (error) {
    console.error('[TOKEN_GENERATE_ERROR]', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error'
    }, { status: 500 });
  }
} 