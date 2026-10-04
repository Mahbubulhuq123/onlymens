import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const verifications = await prisma.helperVerification.findMany({
      orderBy: { submittedAt: 'desc' },
      include: {
        helperProfile: {
          include: {
            user: true,
            skills: true,
          }
        }
      }
    });
    
    return NextResponse.json(verifications);
  } catch (error) {
    console.error("Error fetching verifications:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Verification ID and status are required' }, { status: 400 });
    }

    const verification = await prisma.helperVerification.update({
      where: { id },
      data: {
        status,
        reviewedAt: new Date(),
      }
    });

    return NextResponse.json(verification);
  } catch (error) {
    console.error("Error updating verification:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
