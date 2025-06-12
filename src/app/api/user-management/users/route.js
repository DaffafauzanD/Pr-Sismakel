import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getClientIP } from "@/lib/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/next-auth";
import prisma from "../../../../../prisma/client";
import { UserAddSchema } from "@/app/(protected)/user-management/users/forms/user-add-schema";
import { use } from "react";

export async function GET(req){
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const query = searchParams.get('query') || '';
    const sortField = searchParams.get('sort') || 'name';
    const sortDirection = searchParams.get('dir') === 'desc' ? 'desc' : 'asc';
    const roleId = searchParams.get('id_role') || null;

    try{
        const session = await getServerSession(authOptions);

        if(!session){
            return NextResponse.json(
                {message : 'Unathorize request'},
                {status : 401},
            );
        }

        const totalUser = await prisma.user.count({
            where:{
                AND:[
                    ...(id_role && id_role !== 'all' ? [{ id_role }] : []),
                    {
                        OR: [
                            {username : {contains: query, mode: 'insensitive'}},
                        ],
                    },
                ],
            },
        });

        const sortMap = {
            username: {username: sortDirection},
            roleName: {role: {name: sortDirection}},
            created_at: {created_at: sortDirection},
            created_by: {created_by: sortDirection},
            updated_at: {updated_at: sortDirection},
            updated_by: {updated_by: sortDirection},
        };

        const orderBy = sortMap[sortField] || {
            created_at: sortDirection
        };

        const users = await prisma.user.findMany({
            where:{
                AND:[
                    ...(id_role && id_role !== 'all' ? [{ id_role }] : []),
                    {
                        OR:[
                            {username: {contains: query, mode: 'insensitive'}},
                        ],
                    },
                ],
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy,
            select:{
                id: true,
                username: true,
                created_at: true,
                created_by: true,
                updated_at: true,
                updated_by: true,
                role: {
                    select:{
                        id:true,
                        name: true
                    },
                },
            },
        });


        return NextResponse.json({
            data: users,
            pagination: {
                total: totalCount,
                page,
                limit,
            },
        });
    }catch{
        return NextResponse.json(
            {message : "Oops! Something went wrong. Please try again in a moment."},
            {status: 500},
        );
    }
}

export async function POST(request){
    try{
        const session = await getServerSession(authOptions);

        if(!session){
            return NextResponse.json(
                {message: "Unauthorize request"},
                {status: 401}
            );
        }

        const body = await request.json();
        const parsedData = UserAddSchema.safeParse(body);

         if(!parsedData.success){
            return NextResponse.json(
                {message: "Invalid input."},
                {status: 400},
            );
        }

        const {username, id_role} = parsedData.data;

        const existingUser = await prisma.user.findUnique({
            where: {username},
        });

        if(existingUser){
            return NextResponse.json(
                {message: "User Already Registered"},
                {status: 409},
            );
        }

        const existingRole = await prisma.role.findUnique({
            where: {id: id_role},
        });

        if(!existingRole){
            return NextResponse.json(
                {message: "Selected role does not exist. Someone might have deleted it already."},
                {status: 404},
            );
        }

        const result = await prisma.$transaction(async (tx) => {

            const user = await tx.user.create({
                data: {
                    username,
                    id_role,
                },
            });

            return user;
        });

        return NextResponse.json(
            {
                message: "User succesfully added.",
                user: result,
            },
            {
                status: 400
            },
        );


    }catch{
        return NextResponse.json(
            {message: "Oops! Something went wrong. Please try again in a momment,"},
            {status: 500},
        );
    }
}