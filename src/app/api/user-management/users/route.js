import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { UserAddSchema } from "@/app/(protected)/user-management/users/forms/user-add-schema";

/**
 * @swagger
 * /api/user-management/users:
 *   get:
 *     summary: Get list of users with pagination, sorting, and direction
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *          type: string
 *         description: search by username
 *         required: false
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *         required: false
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field name to sort by (e.g., created_at)
 *         required: false
 *       - in: query
 *         name: dir
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *         required: false
 *     responses:
 *       200:
 *         description: List of users
 */

export async function GET(req) {
  // Ambil user info dari header yang di-inject oleh middleware
  const userId = req.headers.get('x-user-id');
  const token = req.headers.get('Authorization')
  const userRole = req.headers.get('x-user-role');
  // Jika tidak ada user info, unauthorized
  if (!userRole) {
    return NextResponse.json(
      { message: 'Unauthorized: No valid JWT token' },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const query = searchParams.get('query') || '';
  const sortField = searchParams.get('sort') || 'name';
  const sortDirection = searchParams.get('dir') === 'desc' ? 'desc' : 'asc';
  const id_role = searchParams.get('id_role') || null;

  try {
    const totalCount = await prisma.user.count({
      where: {
        AND: [
          ...(id_role && id_role !== 'all' ? [{ id_role }] : []),
          {
            OR: [
              { username: { contains: query.toLocaleLowerCase(), } },
            ],
          },
        ],
      },
    });

    const sortMap = {
      username: { username: sortDirection },
      role_name: { Role: { name: sortDirection } },
      created_at: { created_at: sortDirection },
      created_by: { created_by: sortDirection },
      updated_at: { updated_at: sortDirection },
      updated_by: { updated_by: sortDirection },
    };

    const orderBy = sortMap[sortField] || { created_at: sortDirection };

    const users = await prisma.user.findMany({
      where: {
        AND: [
          ...(id_role && id_role !== 'all' ? [{ id_role }] : []),
          {
            OR: [
              { username: { contains: query.toLocaleLowerCase(), } },
            ],
          },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      select: {
        id: true,
        username: true,
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
        Role: {
          select: {
            id: true,
            name: true,
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
      status: 200,
      message: 'succeesfuly fetching'
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        message: 'Oops! Something went wrong. Please try again in a moment.',
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request){
    // Ambil user info dari header yang di-inject oleh middleware
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    if(!userId){
        return NextResponse.json(
            {message: "Unauthorized: No valid JWT token"},
            {status: 401}
        );
    }

    try{
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
                status: 200
            },
        );


    }catch{
        return NextResponse.json(
            {message: "Oops! Something went wrong. Please try again in a momment,"},
            {status: 500},
        );
    }
}