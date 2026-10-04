import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { customerProfile: true }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, phone, address } = await req.json();

    // Update user base fields
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name }
    });

    // Update or create customer profile
    const profile = await prisma.customerProfile.upsert({
      where: { userId: session.user.id },
      update: { phone, address },
      create: {
        userId: session.user.id,
        phone,
        address
      }
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
