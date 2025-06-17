import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/auth/callback/Credentials:
 *   get:
 *     summary: Login dengan username dan password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Login berhasil
 *       400:
 *         description: Data tidak lengkap
 *       401:
 *         description: Password salah
 *       404:
 *         description: User tidak ditemukan
 */
const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials || !credentials.username || !credentials.password) {
                    throw new Error(
                        JSON.stringify({
                            code: 400,
                            message: "Please enter both username and password."
                        }),
                    );
                }

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                });

                if (!user) {
                    throw new Error(
                        JSON.stringify({
                            code: 404,
                            message: "User not found. Please register first."
                        }),
                    );
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password || '',
                );

                if (!isPasswordValid) {
                    throw new Error(
                        JSON.stringify({
                            code: 401,
                            message: "Invalid credentials. Incorrect password.",
                        }),
                    );
                }

                const role = await prisma.role.findUnique({
                    where: {id: user.id_role},
                    include: {
                        RolePermission:{
                            include:{
                                Permission: true
                            },
                        },
                    },
                });

                console.log("role ::", JSON.stringify(role, null, 2));

                return {
                    id: user.id,
                    username: user.username || 'Anonymous',
                    id_role: user.id_role,
                    permissions: role?.RolePermission?.map(p => p.Permission?.name) || [],
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
            async profile(profile) {
                const existingUser = await prisma.user.findUnique({
                    where: { username: profile.username },
                    include: {
                        role: true,
                    },
                });

                if (existingUser) {
                    return {
                        id: existingUser.id,
                        username: existingUser.username,
                        id_role: existingUser.id_role,
                    };
                }

                const defaultRole = await prisma.role.findFirst({
                    where: { username: "kasir" },
                });

                if (!defaultRole) {
                    throw new Error(
                        'Default role not found. Unable to create a new user.',
                    );
                }

                const newUser = await prisma.user.create({
                    data: {
                        username: profile.username,
                        password: '',
                        id_role: defaultRole.id,
                        created_by: 'SYSTEM'
                    },
                });

                return {
                    id: newUser.id,
                    username: newUser.username,
                    id_role: newUser.id_role,
                };
            },
        }),
    ],

    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user, session, trigger }) {
            if (trigger == 'update' && session?.user) {
                token = session.user;
            } else {
                if (user && user.id_role) {
                    const role = await prisma.role.findUnique({
                        where: { id: user.id_role },
                    });

                    const accessToken = jwt.sign(
                    {
                        id: user.id,
                        username: user.username,
                        id_role: user.id_role,
                        permissions: user.permissions    
                    },
                    process.env.AUTH_SECRET,
                    { expiresIn: '24h'}
                    );

                    token.id = user.id,
                    token.id_role = role.id,
                    token.roleName = role.name,
                    token.username = user.username,
                    token.permissions = user.permissions
                    token.accessToken = accessToken
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user = token;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
};

export default authOptions;