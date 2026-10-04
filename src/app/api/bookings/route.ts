import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log("Unauthorized booking attempt");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log("Booking Request Body:", body);
    const { serviceId, location, date, time, estimatedDuration, notes, price } = body;

    if (!serviceId || !location || !date || !price) {
      console.log("Missing fields:", { serviceId, location, date, price });
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Combine date and time into a single DateTime
    // e.g. date: "2026-10-04", time: "15:00" -> "2026-10-04T15:00:00.000Z"
    const bookingDate = new Date(`${date}T${time || '00:00'}:00`);

    const booking = await prisma.booking.create({
      data: {
        customerId: session.user.id,
        serviceId,
        date: bookingDate,
        durationHours: parseFloat(estimatedDuration) || 1,
        estimatedPrice: price,
        notes: notes || null,
        status: 'SEARCHING',
        location: {
          create: {
            address: location
          }
        }
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Booking Creation Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get bookings for this customer
    const bookings = await prisma.booking.findMany({
      where: {
        customerId: session.user.id
      },
      include: {
        service: true,
        helper: true,
        location: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
