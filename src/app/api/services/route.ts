import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // In a real app we check if session exists and role is ADMIN
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { name, description, basePrice, icon } = await req.json();

    if (!name || basePrice === undefined) {
      return NextResponse.json({ error: 'Name and Base Price are required' }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        basePrice: parseFloat(basePrice),
        icon: icon || null,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Service Creation Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    await prisma.service.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Service Deletion Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
