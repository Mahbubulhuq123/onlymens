import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PaymentsClient } from "./PaymentsClient";

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const payments = await prisma.payment.findMany({
    include: {
      booking: {
        include: {
          customer: { select: { name: true, email: true } },
          helper: { select: { name: true, email: true } },
          service: { select: { name: true } },
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return <PaymentsClient initialPayments={payments} />;
}
