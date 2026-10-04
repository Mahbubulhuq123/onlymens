import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const bookingId = url.searchParams.get('bookingId');

    if (bookingId) {
      await prisma.payment.updateMany({
        where: { bookingId, status: 'PENDING' },
        data: { status: 'FAILED' }
      });
    }

    return NextResponse.redirect(new URL('/customer/dashboard?payment=failed', req.url));
  } catch (error) {
    console.error("Payment Fail Error:", error);
    return NextResponse.redirect(new URL('/customer/dashboard?payment=failed', req.url));
  }
}
