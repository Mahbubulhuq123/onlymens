"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, MessageSquare, CheckCircle2, AlertCircle, Clock, Loader2, Navigation } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ChatBox from "@/components/ChatBox";

import { MapComponent } from "@/components/MapComponent";
import { useLanguage } from "@/components/language-provider";

export default function ActiveJobClient({ initialBooking }: { initialBooking: any }) {
  const [booking, setBooking] = useState(initialBooking);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const lang = useLanguage();

  const t = {
    activeJob: lang === "en" ? "Active Job" : "সক্রিয় কাজ",
    preparing: lang === "en" ? "Preparing" : "প্রস্তুত হচ্ছে",
    onTheWay: lang === "en" ? "On the way" : "পথে আছে",
    arrived: lang === "en" ? "Arrived" : "পৌঁছেছে",
    inProgress: lang === "en" ? "In Progress" : "চলমান",
    completed: lang === "en" ? "Completed" : "সম্পন্ন",
    statusController: lang === "en" ? "Status Controller" : "স্ট্যাটাস কন্ট্রোলার",
    imOnTheWay: lang === "en" ? "I'm On The Way" : "আমি পথে আছি",
    iHaveArrived: lang === "en" ? "I Have Arrived" : "আমি পৌঁছেছি",
    startJob: lang === "en" ? "Start Job" : "কাজ শুরু করুন",
    completeJob: lang === "en" ? "Complete Job" : "কাজ শেষ করুন",
    jobFinished: lang === "en" ? "Job Finished!" : "কাজ সম্পন্ন!",
    youEarned: lang === "en" ? "You earned ৳" : "আপনি আয় করেছেন ৳",
    returnDash: lang === "en" ? "Return to Dashboard" : "ড্যাশবোর্ডে ফিরে যান",
    customer: lang === "en" ? "Customer" : "কাস্টমার",
    call: lang === "en" ? "Call" : "কল",
    taskInfo: lang === "en" ? "Task Info" : "কাজের তথ্য",
    service: lang === "en" ? "Service" : "সেবা",
    location: lang === "en" ? "Location" : "অবস্থান",
    pending: lang === "en" ? "Pending" : "অপেক্ষমান",
    estEarning: lang === "en" ? "Estimated Earning" : "আনুমানিক আয়",
    reportIssue: lang === "en" ? "Report Issue" : "সমস্যা জানান",
    id: lang === "en" ? "ID:" : "আইডি:"
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/helper/booking-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id, status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setBooking({ ...booking, status: updated.status });
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case "ACCEPTED": return { text: t.preparing, color: "bg-blue-100 text-blue-800 border-blue-200" };
      case "HELPER_ON_THE_WAY": return { text: t.onTheWay, color: "bg-orange-100 text-orange-800 border-orange-200" };
      case "ARRIVED": return { text: t.arrived, color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
      case "IN_PROGRESS": return { text: t.inProgress, color: "bg-primary/20 text-primary border-primary/30" };
      case "COMPLETED": return { text: t.completed, color: "bg-green-100 text-green-800 border-green-200" };
      default: return { text: status, color: "bg-muted text-muted-foreground" };
    }
  };

  const statusInfo = getStatusDisplay(booking.status);

  return (
    <div className="min-h-screen bg-muted/10 relative pb-20">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-primary/10 to-transparent -z-10" />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{t.activeJob}</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
              <span>{t.id} {booking.id.slice(-5)}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Map Area */}
            <div className="w-full h-80 bg-background rounded-3xl flex flex-col items-center justify-center border shadow-xl shadow-primary/5 relative overflow-hidden group">
              <MapComponent address={booking.location?.address || "Customer Location"} />
            </div>

            {/* Job Actions */}
            <Card className="rounded-3xl border-0 shadow-lg bg-card/80 backdrop-blur-md">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> {t.statusController}
                </h2>
                
                <div className="space-y-4">
                  <Button 
                    className={`w-full h-14 text-lg rounded-xl font-bold transition-all ${booking.status === "ACCEPTED" ? "shadow-lg shadow-primary/20 scale-100" : "scale-[0.98] opacity-80"}`}
                    disabled={booking.status !== "ACCEPTED" || isUpdating}
                    onClick={() => handleStatusUpdate("HELPER_ON_THE_WAY")}
                    variant={booking.status === "ACCEPTED" ? "default" : "secondary"}
                  >
                    {isUpdating && booking.status === "ACCEPTED" ? <Loader2 className="w-5 h-5 animate-spin" /> : t.imOnTheWay}
                  </Button>

                  <Button 
                    className={`w-full h-14 text-lg rounded-xl font-bold transition-all ${booking.status === "HELPER_ON_THE_WAY" ? "shadow-lg shadow-primary/20 scale-100" : "scale-[0.98] opacity-80"}`}
                    disabled={booking.status !== "HELPER_ON_THE_WAY" || isUpdating}
                    onClick={() => handleStatusUpdate("ARRIVED")}
                    variant={booking.status === "HELPER_ON_THE_WAY" ? "default" : "secondary"}
                  >
                    {isUpdating && booking.status === "HELPER_ON_THE_WAY" ? <Loader2 className="w-5 h-5 animate-spin" /> : t.iHaveArrived}
                  </Button>
                  
                  <Button 
                    className={`w-full h-14 text-lg rounded-xl font-bold transition-all ${booking.status === "ARRIVED" ? "shadow-lg shadow-primary/20 scale-100" : "scale-[0.98] opacity-80"}`}
                    disabled={booking.status !== "ARRIVED" || isUpdating}
                    onClick={() => handleStatusUpdate("IN_PROGRESS")}
                    variant={booking.status === "ARRIVED" ? "default" : "secondary"}
                  >
                    {isUpdating && booking.status === "ARRIVED" ? <Loader2 className="w-5 h-5 animate-spin" /> : t.startJob}
                  </Button>
                  
                  <Button 
                    className={`w-full h-14 text-lg rounded-xl font-bold transition-all ${booking.status === "IN_PROGRESS" ? "shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 text-white scale-100" : "scale-[0.98] opacity-80"}`}
                    disabled={booking.status !== "IN_PROGRESS" || isUpdating}
                    onClick={() => handleStatusUpdate("COMPLETED")}
                    variant={booking.status === "IN_PROGRESS" ? "default" : "secondary"}
                  >
                    {isUpdating && booking.status === "IN_PROGRESS" ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5 mr-2" /> {t.completeJob}</>}
                  </Button>
                </div>
                
                {booking.status === "COMPLETED" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-bold text-green-900">{t.jobFinished}</h3>
                    <p className="text-sm text-green-800">{t.youEarned}{booking.estimatedPrice}</p>
                    <Button variant="link" className="mt-2 text-green-700" onClick={() => router.push("/helper/dashboard")}>{t.returnDash}</Button>
                  </motion.div>
                )}

              </CardContent>
            </Card>
          </div>

          {/* Details Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-lg bg-card/80 backdrop-blur-md overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-primary to-blue-500" />
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-muted-foreground uppercase tracking-wider text-xs">{t.customer}</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-muted overflow-hidden border-2 border-background shadow-sm">
                    <img src={booking.customer.image || `https://i.pravatar.cc/150?u=${booking.customer.id}`} alt="Customer" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-extrabold text-lg leading-tight">{booking.customer.name || "Customer"}</p>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-1 mt-1">⭐ 4.9 <span className="text-[10px]">(12 trips)</span></p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl h-12 border-primary/20 text-primary hover:bg-primary/5 font-bold">
                    <Phone className="w-4 h-4 mr-2" /> {t.call}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <ChatBox bookingId={booking.id} />
            </div>

            <Card className="rounded-3xl border-0 shadow-lg bg-card/80 backdrop-blur-md">
              <CardContent className="p-6 space-y-5">
                <h3 className="font-bold text-lg text-muted-foreground uppercase tracking-wider text-xs">{t.taskInfo}</h3>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary mt-0.5"><CheckCircle2 className="w-4 h-4" /></div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t.service}</p>
                    <p className="font-bold text-foreground">{booking.service?.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500 mt-0.5"><MapPin className="w-4 h-4" /></div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t.location}</p>
                    <p className="font-bold text-foreground">{booking.location?.address || t.pending}</p>
                  </div>
                </div>

                {booking.notes && (
                  <div className="bg-muted/50 p-4 rounded-2xl border text-sm text-muted-foreground italic">
                    "{booking.notes}"
                  </div>
                )}
                
                <div className="pt-5 border-t border-dashed">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">{t.estEarning}</p>
                  <p className="text-3xl font-black text-primary">৳{booking.estimatedPrice}</p>
                </div>
              </CardContent>
            </Card>

            <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold h-12">
              <AlertCircle className="w-4 h-4 mr-2" /> {t.reportIssue}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
