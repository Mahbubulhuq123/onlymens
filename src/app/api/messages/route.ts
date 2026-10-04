import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });

    // Ensure user is part of the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { customerId: true, helperId: true },
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    if (booking.customerId !== session.user.id && booking.helperId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized access to this booking" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { bookingId },
      include: {
        sender: {
          select: { id: true, name: true, image: true, role: true }
        }
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET Messages Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { bookingId, content } = body;

    if (!bookingId || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // Validate access
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { customerId: true, helperId: true },
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.customerId !== session.user.id && booking.helperId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const recipientId = session.user.id === booking.customerId ? booking.helperId : booking.customerId;
    
    if (!recipientId) return NextResponse.json({ error: "No recipient found" }, { status: 400 });

    const message = await prisma.message.create({
      data: {
        content,
        bookingId,
        senderId: session.user.id,
        receiverId: recipientId
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true, role: true }
        }
      }
    });

    // Notify the other party
    await prisma.notification.create({
      data: {
        userId: recipientId,
        title: "New Message",
        body: `You received a new message regarding booking #${bookingId.slice(-5)}`,
        type: "MESSAGE"
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("POST Message Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
