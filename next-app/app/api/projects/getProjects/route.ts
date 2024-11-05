import prisma from "@/db";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    console.log(session);
    if (!session) {
      return NextResponse.json({ error: "Unauthorizd" }, { status: 400 });
    }
    const projects = await prisma.project.findMany({
      where: {
        clientId: session.user.id,
      },
    });
    return NextResponse.json({ projects }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
