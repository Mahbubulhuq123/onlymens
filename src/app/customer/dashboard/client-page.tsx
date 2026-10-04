"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { MapPin, Clock, CheckCircle2, ChevronRight, Activity, Calendar, FileText, Phone, MoreHorizontal, MessageSquare, Star } from "lucide-react";
import ChatBox from "@/components/ChatBox";
import ReviewModal from "@/components/ReviewModal";
import { useSession } from "next-auth/react";

export default function DashboardClient({ bookings, userName, t }: any) {
  const { data: session } = useSession();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const activeBookings = bookings.filter((b: any) => 
    ['PENDING', 'SEARCHING', 'ACCEPTED', 'CONFIRMED', 'HELPER_ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
  );
  const pastBookings = bookings.filter((b: any) => 
    ['COMPLETED', 'CANCELLED', 'DISPUTED'].includes(b.status)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
      
      {/* Header section with glassmorphism */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 bg-card/40 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-xl shadow-primary/5"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            {t.welcome} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{userName}!</span>
          </h1>
          <p className="text-muted-foreground text-lg">{t.manage}</p>
        </div>
        <Link href="/customer/book" className={buttonVariants({ size: "lg", className: "rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform h-14 px-8 text-lg" })}>
          <span className="flex items-center gap-2">
            <Activity className="w-5 h-5" /> {t.bookNow}
          </span>
        </Link>
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold mb-6 flex items-center gap-3"
      >
        <span className="bg-primary/10 text-primary p-2 rounded-xl"><Activity className="w-6 h-6" /></span>
        {t.activeBookings}
      </motion.h2>
      
      {activeBookings.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center p-12 border-2 border-dashed rounded-3xl text-muted-foreground mb-12 bg-muted/20 backdrop-blur-sm"
        >
          <div className="bg-background/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border">
            <Clock className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <p className="text-lg">{t.noActive}</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 mb-12"
        >
          {activeBookings.map((booking: any) => (
            <motion.div variants={itemVariants} key={booking.id} className="relative overflow-hidden group">
              {/* Animated gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-purple-500 opacity-20 group-hover:opacity-40 transition-opacity rounded-3xl -z-10 blur-xl"></div>
              
              <div className="bg-background/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl p-6 sm:p-8 relative z-10 transition-transform group-hover:-translate-y-1">
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  <div className="space-y-6 flex-1">
                    
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider border border-primary/20 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                        {booking.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-lg">{t.bookingNum}{booking.id.slice(-5)}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-3xl font-extrabold mb-2">{booking.service?.name || "Service"}</h3>
                      {booking.notes && <p className="text-muted-foreground max-w-2xl text-sm bg-muted/30 p-3 rounded-xl border">{booking.notes}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 bg-card/50 p-4 rounded-2xl border">
                        <div className="bg-primary/10 p-3 rounded-xl text-primary"><MapPin className="w-5 h-5" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Location</p>
                          <p className="font-bold text-sm line-clamp-1">{booking.location?.address || "No location provided"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-card/50 p-4 rounded-2xl border">
                        <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500"><Calendar className="w-5 h-5" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Date & Time</p>
                          <p className="font-bold text-sm">
                            {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {new Date(booking.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-background border p-8 rounded-3xl min-w-[280px] relative overflow-hidden shadow-inner">
                    {/* Decorative bg inside helper card */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
                    
                    {booking.helper ? (
                      <div className="relative z-10 w-full flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full border-4 border-background shadow-xl overflow-hidden mb-4 relative">
                          <img src={booking.helper.image || "https://i.pravatar.cc/150?u="+booking.helper.id} alt="Helper" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-bold text-xl mb-1">{booking.helper.name}</h4>
                        <p className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-6">Assigned Helper</p>
                        
                        <div className="flex gap-2 w-full flex-wrap justify-center">
                          <Button className="flex-1 rounded-xl shadow-md h-12 min-w-[80px]" size="sm">
                            <MapPin className="w-4 h-4 mr-2" /> {t.track}
                          </Button>
                          <Button 
                            variant={activeChat === booking.id ? "default" : "outline"}
                            className="flex-1 rounded-xl h-12 border-2 min-w-[80px]" 
                            size="sm"
                            onClick={() => setActiveChat(activeChat === booking.id ? null : booking.id)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" /> Chat
                          </Button>
                          <Button variant="outline" className="flex-1 rounded-xl h-12 border-2 min-w-[80px]" size="sm">
                            <Phone className="w-4 h-4 mr-2" /> {t.call}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center relative z-10">
                        <div className="w-24 h-24 rounded-full bg-background border-2 border-dashed border-primary/30 flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Activity className="w-10 h-10 text-primary animate-pulse" />
                        </div>
                        <p className="font-bold text-lg mb-2">{t.findingHelper}</p>
                        <p className="text-sm text-muted-foreground bg-background px-4 py-1.5 rounded-full border shadow-sm inline-block">{t.wait}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Chat Section */}
                <AnimatePresence>
                  {activeChat === booking.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: "auto", opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t overflow-hidden"
                    >
                      <div className="p-6">
                        <ChatBox bookingId={booking.id} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold mb-6 flex items-center gap-3"
      >
        <span className="bg-secondary p-2 rounded-xl"><FileText className="w-6 h-6 text-secondary-foreground" /></span>
        {t.recentHistory}
      </motion.h2>
      
      {pastBookings.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed rounded-3xl text-muted-foreground bg-card/30">
          {t.noPast}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {pastBookings.map((booking: any) => (
            <motion.div variants={itemVariants} key={booking.id} className="bg-card hover:bg-muted/30 transition-colors border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-inner ${
                  booking.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 
                  booking.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {booking.status === 'COMPLETED' ? <CheckCircle2 className="w-7 h-7" /> : <MoreHorizontal className="w-7 h-7" />}
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{booking.service?.name || "Service"}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground font-medium">
                    <span className="bg-background px-2 py-0.5 rounded border">
                      {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className={booking.status === 'COMPLETED' ? "text-foreground font-bold" : ""}>
                      {booking.status === 'CANCELLED' ? 'Cancelled' : `${t.paid}${booking.estimatedPrice || booking.finalPrice || 0}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0 items-center">
                {booking.status === 'COMPLETED' ? (
                  <>
                    {!booking.reviews?.some((r: any) => r.reviewerId === session?.user?.id) && booking.helperId ? (
                      <ReviewModal 
                        bookingId={booking.id} 
                        revieweeId={booking.helperId} 
                        revieweeName={booking.helper?.name || "Helper"} 
                        onReviewSubmitted={() => window.location.reload()}
                      />
                    ) : (
                      <span className="text-sm font-semibold text-muted-foreground flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" /> Reviewed
                      </span>
                    )}
                    <Button variant="ghost" size="sm" className="flex-1 sm:flex-none rounded-xl group">
                      {t.viewReceipt} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl border-2 font-semibold">{t.rebook}</Button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
