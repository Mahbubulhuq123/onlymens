import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Star, MapPin, CheckCircle2, Clock, ShieldCheck, User as UserIcon } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function HelperOwnProfileContent({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      helperProfile: {
        include: {
          skills: true,
          verification: true,
        }
      }
    }
  });

  if (!user || user.role !== "HELPER" || !user.helperProfile) {
    redirect("/login");
  }

  const [reviewStats, totalJobs, recentReviews] = await Promise.all([
    prisma.review.aggregate({
      where: { revieweeId: userId },
      _avg: { rating: true },
      _count: { rating: true }
    }),
    prisma.booking.count({
      where: { helperId: userId, status: "COMPLETED" }
    }),
    prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: {
          select: { name: true, image: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  const avgRating = reviewStats._avg.rating ? reviewStats._avg.rating.toFixed(1) : "0.0";
  const totalReviews = reviewStats._count.rating;
  const isVerified = user.helperProfile.verification?.status === "VERIFIED";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button variant="outline" asChild>
          <Link href={`/helper/${userId}`}>View Public Profile</Link>
        </Button>
      </div>

      <div className="bg-card backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-background shadow-xl overflow-hidden bg-muted">
              {user.image ? (
                <img src={user.image} alt={user.name || "Helper"} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-full h-full p-6 text-muted-foreground" />
              )}
            </div>
            {isVerified && (
              <div className="absolute bottom-1 right-1 bg-background rounded-full p-1 shadow-md">
                <ShieldCheck className="w-8 h-8 text-blue-500" />
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
              <h2 className="text-2xl font-extrabold flex items-center justify-center md:justify-start gap-2">
                {user.name || "Unknown Helper"} 
              </h2>
              <div className="text-lg font-bold text-primary">
                ৳{user.helperProfile.hourlyRate}/hr
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5 font-bold text-foreground bg-primary/10 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> 
                {avgRating} ({totalReviews} Reviews)
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                {totalJobs} Jobs Completed
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.helperProfile.workingArea || "Dhaka"}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">My Skills</h3>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {user.helperProfile.skills.length > 0 ? (
                  user.helperProfile.skills.map(skill => (
                    <span key={skill.id} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-lg border border-border">
                      {skill.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No skills added yet.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Recent Feedback</h2>

        {recentReviews.length === 0 ? (
          <div className="bg-muted/30 border-2 border-dashed rounded-2xl p-10 text-center">
            <Star className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">No reviews yet</h3>
            <p className="text-muted-foreground text-sm mt-1">Complete jobs to start receiving feedback from customers.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recentReviews.map(review => (
              <div key={review.id} className="bg-card border rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                      {review.reviewer.image ? (
                        <img src={review.reviewer.image} alt="Reviewer" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{review.reviewer.name || "Customer"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}`} 
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    "{review.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function HelperProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 relative pb-20">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading profile...</div>}>
        <HelperOwnProfileContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}
