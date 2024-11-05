import prisma from "@/db";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const hashPassword = await hash(body.password, 10);

  try {
    const user = await prisma.client.create({
      data: {
        email: body.email,
        password: hashPassword,
      },
    });
    console.log(user);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({
      error: error,
    });
  }
};
