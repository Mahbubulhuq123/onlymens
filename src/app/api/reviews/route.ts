import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { bookingId, revieweeId, rating, comment } = body;

    if (!bookingId || !revieweeId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify booking exists and is completed
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.status !== "COMPLETED") return NextResponse.json({ error: "Booking must be completed to leave a review" }, { status: 400 });

    // Check if review already exists from this user for this booking
    const existingReview = await prisma.review.findFirst({
      where: {
        bookingId,
        reviewerId: session.user.id
      }
    });

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this booking" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        bookingId,
        reviewerId: session.user.id,
        revieweeId,
        rating,
        comment,
      }
    });

    // Notify reviewee
    await prisma.notification.create({
      data: {
        userId: revieweeId,
        title: "New Review",
        body: `You received a ${rating}-star review for booking #${bookingId.slice(-5)}`,
        type: "REVIEW"
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("POST Review Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
