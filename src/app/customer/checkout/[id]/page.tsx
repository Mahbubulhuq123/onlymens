import prisma from "@/lib/prisma";
import CheckoutClient from "./CheckoutClient";
import { notFound } from "next/navigation";

export default async function CustomerCheckoutPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      helper: true,
      reviews: true,
      payment: true
    }
  });

  if (!booking) {
    notFound();
  }

  return <CheckoutClient booking={booking} />;
}
