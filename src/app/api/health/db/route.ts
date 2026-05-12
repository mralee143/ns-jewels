import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(): Promise<Response> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, prisma: "connected" });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ ok: false, prisma: "error" }, { status: 503 });
  }
}
