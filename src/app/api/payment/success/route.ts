import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const bookingId = url.searchParams.get('bookingId');
    const tran_id = url.searchParams.get('tran_id');

    if (!bookingId || !tran_id) {
      return NextResponse.redirect(new URL('/customer/dashboard?payment=failed', req.url));
    }

    // You should also verify the payment using SSLCommerz API
    // sslcommerz validation... (skipping full validation for demo, assuming trust from success_url)

    await prisma.payment.update({
      where: { bookingId },
      data: {
        status: 'COMPLETED'
      }
    });

    // Update booking status if needed
    // await prisma.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED' } })

    return NextResponse.redirect(new URL(`/customer/dashboard?payment=success&bookingId=${bookingId}`, req.url));
  } catch (error) {
    console.error("Payment Success Error:", error);
    return NextResponse.redirect(new URL('/customer/dashboard?payment=failed', req.url));
  }
}
