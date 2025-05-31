import { NextResponse } from "next/server";

import prisma from "../../../../prisma/client/";

export async function GET(){
    try{
        const result = await prisma.MST_USER.findMany();

        return NextResponse.json(
        {
            succeeded:true,
            message:"List Data User",
            data: result
        },
        {
            status:200
        }
    );
    }catch(exception){

    }
}