import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(
      password,
      admin.password
    );

    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      adminId: admin.id,
    });
  } catch {
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}