import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "HELPER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only get jobs that are pending and have no helper assigned
    const jobs = await prisma.booking.findMany({
      where: {
        status: "PENDING",
        helperId: null,
      },
      include: {
        service: true,
        location: true,
        customer: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Fetch Jobs Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "HELPER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Attempt to accept the job atomically
    const booking = await prisma.booking.update({
      where: {
        id: bookingId,
        status: "PENDING", // Ensure it's still pending
      },
      data: {
        helperId: session.user.id,
        status: "ACCEPTED",
      }
    });

    // Notify customer
    await prisma.notification.create({
      data: {
        userId: booking.customerId,
        title: "Helper Assigned",
        body: `A helper has accepted your booking (ID: ${bookingId.slice(-5)}) and is preparing.`,
        type: "BOOKING"
      }
    });

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error("Accept Job Error:", error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Job is no longer available" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
