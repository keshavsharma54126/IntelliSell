import prisma from "@/db";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    console.log(session);
    const { projectId } = await req.json();
    if (!session) {
      return NextResponse.json({ error: "Unauthorizd" }, { status: 400 });
    }
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      return NextResponse.json({ error: "no project found " });
    }
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });
    return NextResponse.json(
      { message: "project deleted successfully" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
