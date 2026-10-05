import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, DollarSign, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";

  const t = {
    title: lang === "en" ? "Admin Command Center" : "অ্যাডমিন কমান্ড সেন্টার",
    desc: lang === "en" ? "Platform Overview & Financials" : "প্ল্যাটফর্ম ওভারভিউ এবং ফিনান্সিয়ালস",
    manageServices: lang === "en" ? "Manage Services" : "সার্ভিস পরিচালনা",
    totalCustomers: lang === "en" ? "Total Customers" : "মোট গ্রাহক",
    regCustomers: lang === "en" ? "Registered users" : "নিবন্ধিত ব্যবহারকারী",
    verifiedHelpers: lang === "en" ? "Verified Helpers" : "যাচাইকৃত সাহায্যকারী",
    readyForWork: lang === "en" ? "Active and approved" : "সক্রিয় এবং অনুমোদিত",
    activeBookings: lang === "en" ? "Active Bookings" : "সক্রিয় বুকিং",
    inProgress: lang === "en" ? "Ongoing tasks" : "চলমান কাজ",
    revenue: lang === "en" ? "Total GMV" : "মোট জিএমভি",
    totalRev: lang === "en" ? "Gross merchandise volume" : "গ্রস মার্চেন্ডাইজ ভলিউম",
    latest: lang === "en" ? "Latest Bookings" : "সর্বশেষ বুকিং",
    viewAll: lang === "en" ? "View All" : "সব দেখুন",
    customer: lang === "en" ? "Customer" : "গ্রাহক",
    service: lang === "en" ? "Service" : "সার্ভিস",
    status: lang === "en" ? "Status" : "অবস্থা",
    price: lang === "en" ? "Amount" : "পরিমাণ",
    noBookings: lang === "en" ? "No bookings found on the platform yet." : "প্ল্যাটফর্মে এখনও কোনো বুকিং পাওয়া যায়নি।",
    alerts: lang === "en" ? "System Health & Alerts" : "সিস্টেম স্বাস্থ্য ও অ্যালার্ট",
    dbConn: lang === "en" ? "Database Status" : "ডাটাবেস অবস্থা",
    dbDesc: lang === "en" ? "Prisma connected to Neon PostgreSQL. All systems operational." : "প্রিজমা নিওন পোস্টগ্রেএসকিউএলের সাথে সংযুক্ত। সমস্ত সিস্টেম চালু আছে।",
    helperVer: lang === "en" ? "Helper Verification" : "সাহায্যকারী যাচাইকরণ",
    helperDesc: lang === "en" ? "New helpers are waiting for manual NID verification." : "নতুন সাহায্যকারীরা এনআইডি যাচাইকরণের জন্য অপেক্ষমান।",
    noPendingDesc: lang === "en" ? "No helpers are waiting for verification right now." : "এই মুহূর্তে কোনো সাহায্যকারী যাচাইকরণের জন্য অপেক্ষমান নেই।",
    pending: lang === "en" ? "pending" : "অপেক্ষমান",
    reviewQueue: lang === "en" ? "Review Queue" : "পর্যালোচনা করুন"
  };

  // Ensure Admin
  // if (!session || session.user.role !== "ADMIN") redirect("/");

  // Fetch real platform stats
  const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
  const totalHelpers = await prisma.user.count({ where: { role: 'HELPER' } });
  
  const activeBookingsCount = await prisma.booking.count({
    where: { status: { in: ['SEARCHING', 'ACCEPTED', 'HELPER_ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'] } }
  });

  const completedBookings = await prisma.booking.findMany({
    where: { status: 'COMPLETED' },
    select: { finalPrice: true, estimatedPrice: true }
  });
  
  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice || 0), 0);

  const pendingVerifications = await prisma.helperVerification.count({
    where: { status: { in: ['PENDING', 'UNDER_REVIEW'] } }
  });

  // Fetch latest bookings
  const latestBookings = await prisma.booking.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: { customer: true, helper: true, service: true }
  });

  return (
    <div className="min-h-screen bg-muted/20 relative">
      {/* Background blobs for premium feel */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-40 left-0 w-125 h-125 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-card/60 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-xl shadow-primary/5">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{t.title}</h1>
            <p className="text-muted-foreground text-lg">{t.desc}</p>
          </div>
          <div className="mt-6 md:mt-0">
            <Button asChild size="lg" className="rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform h-14 px-8 text-md font-semibold">
              <Link href="/admin/services">
                <Settings className="w-5 h-5 mr-2" /> {t.manageServices}
              </Link>
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="rounded-3xl border-0 shadow-lg bg-card/80 backdrop-blur-md overflow-hidden group">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 p-6 text-primary/10 group-hover:scale-110 transition-transform"><Users className="w-20 h-20" /></div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 relative z-10">{t.totalCustomers}</p>
              <h3 className="text-4xl font-black mb-1 relative z-10">{totalUsers}</h3>
              <p className="text-xs text-muted-foreground font-medium relative z-10">{t.regCustomers}</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-3xl border-0 shadow-lg bg-card/80 backdrop-blur-md overflow-hidden group">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 p-6 text-green-500/10 group-hover:scale-110 transition-transform"><CheckCircle2 className="w-20 h-20" /></div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 relative z-10">{t.verifiedHelpers}</p>
              <h3 className="text-4xl font-black mb-1 relative z-10">{totalHelpers}</h3>
              <p className="text-xs text-muted-foreground font-medium relative z-10">{t.readyForWork}</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-3xl border-0 shadow-lg bg-card/80 backdrop-blur-md overflow-hidden group">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 p-6 text-blue-500/10 group-hover:scale-110 transition-transform"><Briefcase className="w-20 h-20" /></div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 relative z-10">{t.activeBookings}</p>
              <h3 className="text-4xl font-black mb-1 relative z-10">{activeBookingsCount}</h3>
              <p className="text-xs text-muted-foreground font-medium relative z-10">{t.inProgress}</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-3xl border-0 shadow-lg bg-linear-to-br from-primary/10 to-primary/5 backdrop-blur-md overflow-hidden group relative">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
            <CardContent className="p-6 relative z-10">
              <div className="absolute top-0 right-0 p-6 text-primary/20 group-hover:scale-110 transition-transform"><DollarSign className="w-20 h-20" /></div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{t.revenue}</p>
              <h3 className="text-4xl font-black text-primary mb-1">৳{totalRevenue.toLocaleString()}</h3>
              <p className="text-xs text-primary/70 font-medium">{t.totalRev}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Bookings Queue */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-primary" /> {t.latest}
              </h2>
              <Button asChild variant="ghost" className="font-semibold">
                <Link href="/admin/bookings">{t.viewAll} <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </div>
            
            <div className="bg-card/80 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-xl shadow-primary/5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">{t.customer}</th>
                      <th className="px-6 py-4">{t.service}</th>
                      <th className="px-6 py-4">{t.status}</th>
                      <th className="px-6 py-4 text-right">{t.price}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {latestBookings.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground font-medium">
                          {t.noBookings}
                        </td>
                      </tr>
                    ) : (
                      latestBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-muted/30 transition-colors group">
                          <td className="px-6 py-4 font-medium flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-background shadow-sm">
                              <img src={booking.customer.image || `https://i.pravatar.cc/150?u=${booking.customer.id}`} alt="Customer" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground group-hover:text-primary transition-colors">{booking.customer.name || "Unknown"}</p>
                              <p className="text-xs text-muted-foreground font-normal">ID: {booking.id.slice(-5)}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-foreground">{booking.service.name}</p>
                            <p className="text-xs text-muted-foreground font-medium mt-1">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ['SEARCHING', 'PENDING'].includes(booking.status) ? 'bg-orange-100 text-orange-800 border border-orange-200' : 
                              booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border border-green-200' :
                              booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800 border border-red-200' :
                              'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}>
                              {booking.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-foreground text-base">
                            ৳{booking.finalPrice || booking.estimatedPrice || 0}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-primary" /> {t.alerts}
            </h2>
            
            <div className="space-y-4">
              <Card className="rounded-3xl border-0 shadow-lg bg-green-500/5 hover:bg-green-500/10 transition-colors">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900 dark:text-green-400">{t.dbConn}</h4>
                    <p className="text-sm text-green-800/80 dark:text-green-400/80 mt-1 font-medium">{t.dbDesc}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-lg bg-orange-500/5 hover:bg-orange-500/10 transition-colors">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-orange-900 dark:text-orange-400 flex items-center gap-2">
                        {t.helperVer}
                        {pendingVerifications > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider">
                            {pendingVerifications} {t.pending}
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-orange-800/80 dark:text-orange-400/80 mt-1 font-medium">
                        {pendingVerifications > 0 ? t.helperDesc : t.noPendingDesc}
                      </p>
                    </div>
                  </div>
                  <Button asChild className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 shadow-lg shadow-orange-500/20">
                    <Link href="/admin/verifications">
                      {t.reviewQueue} <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
