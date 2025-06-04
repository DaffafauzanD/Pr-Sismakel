import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";

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

                return {
                    id: user.id,
                    username: user.username || 'Anonymous',
                    id_role: user.id_role,
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

                    token.id = user.id,
                        token.username = user.username,
                        token.id_role = user.id_role;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.id_role = token.id_role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
};

export default authOptions;