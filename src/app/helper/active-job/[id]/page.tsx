import prisma from "@/lib/prisma";
import ActiveJobClient from "./ActiveJobClient";
import { notFound } from "next/navigation";

export default async function ActiveJobPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      service: true,
      location: true
    }
  });

  if (!booking) {
    notFound();
  }

  return <ActiveJobClient initialBooking={booking} />;
}
