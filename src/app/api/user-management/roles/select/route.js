import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "../../../../../../prisma/client";
import authOptions from "@/app/api/auth/[...nextauth]/next-auth";

export async function GET(){
    try{
        const session = await getServerSession(authOptions);

        if(!session){
            return NextResponse.json(
                {message: "Unauthorize request"},
                {status: 401},
            );
        }

        const roles = await prisma.role.findMany({
            select:{
                id:true,
                name:true,
            },
            orderBy:{
                name: 'asc',
            },
        });

        return NextResponse.json({
            data: roles,
            message: 'Data roles succeessfuly fetch',
            status: 400,
        });
    }catch{
        return NextResponse.json(
            {message: 'Oops! Something went wrong, Please try again in a momment'},
            {status: 500}
        );
    }
}