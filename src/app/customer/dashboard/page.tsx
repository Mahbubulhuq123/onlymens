import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import { cookies } from "next/headers";
import DashboardClient from "./client-page";

async function DashboardContent({ userId, lang, userName }: { userId: string, lang: string, userName: string }) {
  const bookings = await prisma.booking.findMany({
    where: { customerId: userId },
    include: { service: true, helper: true, location: true, payment: true, reviews: true },
    orderBy: { createdAt: 'desc' }
  });

  const t = {
    welcome: lang === "en" ? "Welcome," : "স্বাগতম,",
    manage: lang === "en" ? "Manage your bookings and profile." : "আপনার বুকিং এবং প্রোফাইল পরিচালনা করুন।",
    bookNow: lang === "en" ? "Book a Helper Now" : "এখনই সাহায্যকারী বুক করুন",
    activeBookings: lang === "en" ? "Active Bookings" : "সক্রিয় বুকিং",
    noActive: lang === "en" ? "You have no active bookings right now." : "আপনার বর্তমানে কোনো সক্রিয় বুকিং নেই।",
    bookingNum: lang === "en" ? "Booking #" : "বুকিং #",
    findingHelper: lang === "en" ? "Finding Helper..." : "সাহায্যকারী খোঁজা হচ্ছে...",
    wait: lang === "en" ? "Please wait" : "অপেক্ষা করুন",
    track: lang === "en" ? "Track Location" : "অবস্থান ট্র্যাক করুন",
    call: lang === "en" ? "Call" : "কল",
    recentHistory: lang === "en" ? "Recent History" : "সাম্প্রতিক ইতিহাস",
    noPast: lang === "en" ? "You don't have any past bookings." : "আপনার কোনো অতীত বুকিং নেই।",
    paid: lang === "en" ? "Paid: ৳" : "পরিশোধিত: ৳",
    rebook: lang === "en" ? "Rebook" : "রিবুক করুন",
    viewReceipt: lang === "en" ? "Receipt" : "রসিদ"
  };

  return <DashboardClient bookings={bookings} userName={userName} t={t} />;
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      <div className="h-24 bg-muted/40 animate-pulse rounded-3xl" />
      <div>
        <div className="h-8 w-48 bg-muted/40 animate-pulse rounded-lg mb-6" />
        <div className="h-64 bg-muted/40 animate-pulse rounded-3xl" />
      </div>
      <div>
        <div className="h-8 w-48 bg-muted/40 animate-pulse rounded-lg mb-6" />
        <div className="h-32 bg-muted/40 animate-pulse rounded-2xl" />
      </div>
    </div>
  );
}

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions);
  
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 relative">
      {/* Background decorations for consistency with Booking page */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 pointer-events-none" />
      
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent userId={session.user.id} lang={lang} userName={session.user.name || "Customer"} />
      </Suspense>
    </div>
  );
}
