import { NextResponse } from "next/server";

import prisma from "../../../../prisma/client";

export async function GET() {
  try {
    const users = await prisma.user.findMany();

    return NextResponse.json({
      sucess: true,
      message: "List Data Posts",
      data: users,
    },
    {
      status: 200,
    }
);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}