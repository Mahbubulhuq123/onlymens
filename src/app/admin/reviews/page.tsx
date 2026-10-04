import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminReviewsClient from "./client-page";

export const metadata = {
  title: "Review Moderation | Admin | OnlyMen",
};

export default async function AdminReviewsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const reviews = await prisma.review.findMany({
    include: {
      reviewer: {
        select: { name: true, image: true }
      },
      reviewee: {
        select: { name: true, image: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <AdminReviewsClient initialReviews={reviews} />
    </div>
  );
}
