import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // In production, verify session.user.id matches the booking.helper.id
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { bookingId, status } = await req.json();

    if (!bookingId || !status) {
      return NextResponse.json({ error: 'Booking ID and status are required' }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status }
    });

    let statusText = status;
    if (status === 'HELPER_ON_THE_WAY') statusText = 'Helper is on the way';
    if (status === 'ARRIVED') statusText = 'Helper has arrived';
    if (status === 'IN_PROGRESS') statusText = 'Job is in progress';
    if (status === 'COMPLETED') statusText = 'Job has been completed';

    await prisma.notification.create({
      data: {
        userId: booking.customerId,
        title: "Booking Update",
        body: `Your booking (ID: ${bookingId.slice(-5)}) status is now: ${statusText}.`,
        type: "BOOKING"
      }
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
