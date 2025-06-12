import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "../../../../../../prisma/client";
import authOptions from "@/app/api/auth/[...nextauth]/next-auth";

export async function  GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    try{
        const session = await getServerSession(authOptions);

        if(!session){
            return NextResponse.json(
                {message: 'Unauthorize request'},
                {status: 401}
            );
        }

        const users = await prisma.user.findMany({
            where:{
                OR:[
                    {username: {contains: query, mode: 'insesitive'}},
                ],
            },
            select:{
                id:true,
                username: true,
                created_at: true,
                created_by: true,
                updated_at: true,
                updated_by: true,
            },
            include:{
                Role: true
            },
        });

        return NextResponse.json({
            data: users,
            message: 'Data users successfuly fetch',
            status:400,
        });
    }catch{
        return NextResponse.json(
            {message: 'Oops! Something went wrong, Please try again in a momment'},
            {status: 500},
        );
    }
}