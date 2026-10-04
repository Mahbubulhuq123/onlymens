import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const store_id = process.env.SSLCOMMERZ_STORE_ID || 'testbox';
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD || 'testpassword';
const is_live = false; // true for live, false for sandbox

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, service: true }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const tran_id = `REF-${bookingId}-${Date.now()}`;
    const amount = booking.estimatedPrice;

    const data = new URLSearchParams();
    data.append('store_id', store_id);
    data.append('store_passwd', store_passwd);
    data.append('total_amount', amount.toString());
    data.append('currency', 'BDT');
    data.append('tran_id', tran_id);
    data.append('success_url', `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payment/success?bookingId=${bookingId}&tran_id=${tran_id}`);
    data.append('fail_url', `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payment/fail?bookingId=${bookingId}`);
    data.append('cancel_url', `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payment/cancel?bookingId=${bookingId}`);
    data.append('ipn_url', `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payment/ipn`);
    data.append('shipping_method', 'Courier');
    data.append('product_name', booking.service.name);
    data.append('product_category', 'Service');
    data.append('product_profile', 'general');
    data.append('cus_name', booking.customer.name || 'Customer');
    data.append('cus_email', booking.customer.email || 'customer@example.com');
    data.append('cus_add1', 'Dhaka');
    data.append('cus_add2', 'Dhaka');
    data.append('cus_city', 'Dhaka');
    data.append('cus_state', 'Dhaka');
    data.append('cus_postcode', '1000');
    data.append('cus_country', 'Bangladesh');
    data.append('cus_phone', '01711111111');
    data.append('cus_fax', '01711111111');
    data.append('ship_name', booking.customer.name || 'Customer');
    data.append('ship_add1', 'Dhaka');
    data.append('ship_add2', 'Dhaka');
    data.append('ship_city', 'Dhaka');
    data.append('ship_state', 'Dhaka');
    data.append('ship_postcode', '1000');
    data.append('ship_country', 'Bangladesh');

    const initUrl = is_live ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php' : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
    const response = await fetch(initUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data.toString()
    });

    const apiResponse = await response.json();
    console.log("SSLCommerz API Response:", apiResponse);
    
    if (apiResponse?.status === 'FAILED') {
      console.error("SSLCommerz Payment Failed:", apiResponse.failedreason);
      return NextResponse.json({ 
        error: `Payment gateway error: ${apiResponse.failedreason}. Make sure you added your SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD in the .env file.` 
      }, { status: 400 });
    }

    if (apiResponse?.GatewayPageURL) {
      // Create a pending payment record
      await prisma.payment.upsert({
        where: { bookingId },
        update: {
          amount: amount,
          transactionId: tran_id,
          status: 'PENDING'
        },
        create: {
          bookingId: bookingId,
          amount: amount,
          platformFee: amount * 0.1, // assuming 10% platform fee
          helperEarnings: amount * 0.9,
          transactionId: tran_id,
          method: 'SSLCOMMERZ',
          status: 'PENDING'
        }
      });

      return NextResponse.json({ url: apiResponse.GatewayPageURL });
    }

    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 });
  } catch (error) {
    console.error("Payment Init Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
