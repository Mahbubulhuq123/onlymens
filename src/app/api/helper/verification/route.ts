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

    const helperProfile = await prisma.helperProfile.findUnique({
      where: { userId: session.user.id },
      include: { verification: true }
    });

    return NextResponse.json({ helperProfile });
  } catch (error) {
    console.error("Verification GET error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { nidNumber, nidFrontImage, nidBackImage, selfieImage, skills } = body;

    // Ensure User exists and update role if needed
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: 'HELPER' }
    });

    const skillOperations = {
      connectOrCreate: (skills || []).map((s: string) => ({
        where: { name: s },
        create: { name: s }
      }))
    };

    // Create or update Helper Profile
    const helperProfile = await prisma.helperProfile.upsert({
      where: { userId: session.user.id },
      update: { 
        skills: { set: [], ...skillOperations } 
      },
      create: {
        userId: session.user.id,
        skills: skillOperations,
      }
    });

    // Create or update Verification request
    const verification = await prisma.helperVerification.upsert({
      where: { helperProfileId: helperProfile.id },
      update: {
        nidNumber,
        nidFrontImage: nidFrontImage || "mock-url",
        nidBackImage: nidBackImage || "mock-url",
        status: 'PENDING',
        submittedAt: new Date()
      },
      create: {
        helperProfileId: helperProfile.id,
        nidNumber,
        nidFrontImage: nidFrontImage || "mock-url",
        nidBackImage: nidBackImage || "mock-url",
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, verification });
  } catch (error) {
    console.error("Verification POST error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
