import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    if (action === "payment") {
      const { amount, platformFee, helperEarnings, method } = body;
      
      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (!booking || !booking.helperId) {
        return NextResponse.json({ error: 'Invalid booking or missing helper' }, { status: 400 });
      }

      const payment = await prisma.payment.create({
        data: {
          bookingId,
          amount,
          platformFee,
          helperEarnings,
          method,
          status: "COMPLETED",
          transactionId: `TXN-MOCK-${Date.now()}`
        }
      });

      // Update or Create Wallet for Helper
      const wallet = await prisma.wallet.upsert({
        where: { userId: booking.helperId },
        create: {
          userId: booking.helperId,
          balance: helperEarnings,
        },
        update: {
          balance: { increment: helperEarnings }
        }
      });

      // Create Transaction for Helper
      await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          paymentId: payment.id,
          amount: helperEarnings,
          type: "CREDIT",
          status: "COMPLETED"
        }
      });

      // Notify Helper of Payment
      await prisma.notification.create({
        data: {
          userId: booking.helperId,
          title: "Payment Received",
          body: `You received ৳${helperEarnings} for booking ID: ${bookingId.slice(-5)}.`,
          type: "PAYMENT"
        }
      });

      return NextResponse.json(payment);
    } 
    
    if (action === "review") {
      const { helperId, rating, comment } = body;
      
      const review = await prisma.review.create({
        data: {
          bookingId,
          reviewerId: session.user.id,
          revieweeId: helperId,
          rating,
          comment
        }
      });

      // Notify Helper of Review
      await prisma.notification.create({
        data: {
          userId: helperId,
          title: "New Review Received",
          body: `You received a ${rating}-star review for booking ID: ${bookingId.slice(-5)}.`,
          type: "REVIEW"
        }
      });

      return NextResponse.json(review);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error("Error in checkout:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
