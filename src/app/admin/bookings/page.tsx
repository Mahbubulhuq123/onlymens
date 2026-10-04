import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { BookingsClient } from "./BookingsClient";

export default async function AdminBookingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
    include: {
      customer: { select: { name: true, email: true, image: true } },
      helper: { select: { name: true, email: true, image: true } },
      service: { select: { name: true } },
      location: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return <BookingsClient initialBookings={bookings} />;
}
