import prisma from "@/db";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    console.log(session);
    const { projectName, projectDescription } = await req.json();
    if (!session) {
      return NextResponse.json({ error: "Unauthorizd" }, { status: 400 });
    }
    const project = await prisma.project.create({
      data: {
        title: projectName,
        description: projectDescription,
        clientId: session.user.id,
      },
    });
    return NextResponse.json(
      { message: "project added successfully", project },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
