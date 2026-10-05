import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { MapPin, Calendar, Clock, DollarSign, Star, Briefcase, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { acceptJobAction } from "./actions";

async function HelperDashboardContent({ userId, lang }: { userId: string, lang: string }) {
  // First, find the helper's profile ID
  const helperProfile = await prisma.helperProfile.findUnique({
    where: { userId }
  });

  if (!helperProfile) {
    return (
      <div className="container mx-auto max-w-6xl px-4 md:px-8 mt-12">
        <div className="bg-card/50 backdrop-blur-xl border rounded-3xl p-12 text-center shadow-xl shadow-primary/5">
          <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
          <p className="text-muted-foreground mb-6">You need to complete your onboarding and verification before viewing the dashboard.</p>
          <Link href="/helper/verification">
            <Button size="lg" className="rounded-xl px-8 shadow-lg shadow-primary/20">Go to Verification</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch active/upcoming jobs for this helper using helperProfile.id
  const myJobs = await prisma.booking.findMany({
    where: {
      helperId: helperProfile.id,
      status: {
        in: ["ACCEPTED", "HELPER_ON_THE_WAY", "ARRIVED", "IN_PROGRESS"],
      },
    },
    include: {
      customer: true,
      service: true,
      location: true
    },
    orderBy: {
      date: "asc",
    },
  });

  // Fetch new open requests (status: SEARCHING) that have no helper assigned yet
  const availableRequests = await prisma.booking.findMany({
    where: {
      status: "SEARCHING",
      helperId: null,
    },
    include: {
      customer: true,
      service: true,
      location: true
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const t = {
    upcomingJobs: lang === "en" ? "My Active Jobs" : "আমার বর্তমান কাজ",
    allCaughtUp: lang === "en" ? "You're all caught up!" : "আপনার সব কাজ শেষ!",
    noUpcoming: lang === "en" ? "No active jobs right now. Check the available requests to find your next task." : "এই মুহূর্তে কোনো সক্রিয় কাজ নেই। নতুন কাজ পেতে উপলব্ধ অনুরোধগুলো দেখুন।",
    viewDetails: lang === "en" ? "View Details" : "বিস্তারিত দেখুন",
    availableNear: lang === "en" ? "Available Near You" : "আপনার আশেপাশে উপলব্ধ",
    noRequests: lang === "en" ? "No new requests in your area at the moment. We'll notify you when one pops up!" : "এই মুহূর্তে আপনার এলাকায় নতুন কোনো কাজের অনুরোধ নেই। নতুন অনুরোধ এলে আমরা আপনাকে জানাব!",
    acceptJob: lang === "en" ? "Accept Job" : "কাজ গ্রহণ করুন",
    id: lang === "en" ? "ID:" : "আইডি:",
    location: lang === "en" ? "Location" : "অবস্থান",
    noLocation: lang === "en" ? "No location" : "অবস্থান নেই",
    dateTime: lang === "en" ? "Date & Time" : "তারিখ এবং সময়",
    earnings: lang === "en" ? "Earnings" : "উপার্জন",
    service: lang === "en" ? "Service" : "সেবা",
    locationPending: lang === "en" ? "Location pending" : "অবস্থান অপেক্ষমান",
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
      
      {/* Ambient background decoration */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl mix-blend-multiply opacity-50 -z-10" />

      {/* Left Column: My Active Jobs */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="bg-primary/10 text-primary p-2 rounded-xl"><Briefcase className="h-6 w-6" /></span> 
              {t.upcomingJobs}
            </h2>
          </div>

          {myJobs.length === 0 ? (
            <div className="bg-card/60 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center shadow-xl shadow-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
              <div className="w-20 h-20 bg-background border-2 border-dashed border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-sm">
                <CheckCircle className="h-10 w-10 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{t.allCaughtUp}</h3>
              <p className="text-muted-foreground text-lg">{t.noUpcoming}</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {myJobs.map((job: any) => (
                <div key={job.id} className="bg-card/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-xl shadow-primary/5 hover:-translate-y-1 transition-transform group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-primary to-blue-500"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="space-y-4 flex-1">
                      
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider border border-primary/20">
                          <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                          {job.status.replace(/_/g, " ")}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-lg">{t.id} {job.id.slice(-5)}</span>
                      </div>
                      
                      <div>
                        <h3 className="font-extrabold text-3xl">{job.service?.name || t.service}</h3>
                        {job.notes && <p className="text-muted-foreground mt-2 bg-muted/30 p-3 rounded-xl border text-sm">{job.notes}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center gap-3 bg-card/50 p-3 rounded-2xl border">
                          <div className="bg-primary/10 p-2 rounded-lg text-primary"><MapPin className="w-4 h-4" /></div>
                          <div>
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{t.location}</p>
                            <p className="font-bold text-sm line-clamp-1">{job.location?.address || t.noLocation}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-card/50 p-3 rounded-2xl border">
                          <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500"><Calendar className="w-4 h-4" /></div>
                          <div>
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{t.dateTime}</p>
                            <p className="font-bold text-sm">
                              {new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})} at {new Date(job.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit'})}
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="flex flex-col items-start md:items-end justify-between bg-muted/20 p-6 rounded-3xl border min-w-50">
                      <div className="text-right w-full mb-6">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">{t.earnings}</p>
                        <div className="text-3xl font-extrabold text-foreground">
                          ৳{job.estimatedPrice || 0}
                        </div>
                      </div>
                      <Link href={`/helper/active-job/${job.id}`} className="w-full">
                        <Button className="w-full rounded-xl h-12 shadow-md hover:scale-105 transition-transform group-hover:shadow-primary/20">
                          {t.viewDetails} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Open Requests */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span className="bg-secondary text-secondary-foreground p-2 rounded-xl"><MapPin className="h-6 w-6" /></span> 
          {t.availableNear}
        </h2>

        <div className="bg-card/80 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-xl shadow-primary/5 relative">
          {availableRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed">
                <MapPin className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground font-medium">{t.noRequests}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableRequests.map((request: any) => (
                <div key={request.id} className="bg-background border rounded-2xl p-5 hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <h4 className="font-bold text-lg">{request.service?.name || t.service}</h4>
                    <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg text-sm">৳{request.estimatedPrice || 0}</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-5 space-y-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" /> <span className="line-clamp-1">{request.location?.address || t.locationPending}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0" /> {new Date(request.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <form action={acceptJobAction.bind(null, request.id, helperProfile.id)} className="relative z-10">
                    <Button type="submit" className="w-full rounded-xl shadow-sm hover:scale-[1.02] transition-transform font-bold">
                      {t.acceptJob}
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
        <div className="bg-card border rounded-2xl h-48 animate-pulse shadow-sm" />
      </div>
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="bg-card border rounded-3xl h-96 animate-pulse shadow-sm" />
      </div>
    </div>
  );
}

export default async function HelperDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "HELPER") {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";

  const t = {
    welcome: lang === "en" ? "Welcome back, " : "স্বাগতম, ",
    ready: lang === "en" ? "Ready to make a difference today?" : "আজ কিছু নতুন করতে প্রস্তুত?",
    earnings: lang === "en" ? "Earnings" : "উপার্জন",
    completed: lang === "en" ? "Completed" : "সম্পন্ন",
    rating: lang === "en" ? "Rating" : "রেটিং"
  };

  const stats = {
    earnings: "৳4,500",
    jobsCompleted: 12,
    rating: 4.9,
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header / Greeting */}
      <div className="bg-primary text-primary-foreground py-12 px-4 md:px-8 shadow-sm">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.welcome}{session.user.name?.split(' ')[0] || 'Helper'}! 👋</h1>
            <p className="text-primary-foreground/80 mt-2 text-lg">{t.ready}</p>
          </div>
          <div className="flex bg-background/20 rounded-2xl p-4 backdrop-blur-md border border-white/10 gap-8">
            <div className="text-center">
              <p className="text-sm text-primary-foreground/70 font-medium">{t.earnings}</p>
              <p className="text-2xl font-bold">{stats.earnings}</p>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <p className="text-sm text-primary-foreground/70 font-medium">{t.completed}</p>
              <p className="text-2xl font-bold">{stats.jobsCompleted}</p>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center flex flex-col items-center">
              <p className="text-sm text-primary-foreground/70 font-medium">{t.rating}</p>
              <p className="text-2xl font-bold flex items-center gap-1">
                {stats.rating} <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </p>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <HelperDashboardContent userId={session.user.id} lang={lang} />
      </Suspense>
    </div>
  );
}
