"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, CreditCard, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutClient({ booking }: { booking: any }) {
  const router = useRouter();
  const [step, setStep] = useState<"summary" | "payment" | "review" | "done">(booking.payment ? "review" : "summary");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const price = booking.finalPrice || booking.estimatedPrice || 0;
  const platformFee = Math.round(price * 0.15);
  const helperEarnings = price - platformFee;

  const handleMockPayment = async (method: string) => {
    setIsProcessing(true);
    // Simulate network delay for mock payment
    setTimeout(async () => {
      try {
        const res = await fetch("/api/customer/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            action: "payment",
            bookingId: booking.id, 
            amount: price,
            platformFee,
            helperEarnings,
            method
          }),
        });
        if (res.ok) setStep("review");
      } catch (e) {
        console.error(e);
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  const handleReviewSubmit = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/customer/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "review",
          bookingId: booking.id, 
          helperId: booking.helperId,
          rating,
          comment
        }),
      });
      if (res.ok) setStep("done");
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (booking.payment && booking.reviews && booking.reviews.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center p-8 bg-card rounded-3xl shadow-xl max-w-md w-full">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">All Done!</h2>
          <p className="text-muted-foreground mb-6">You've already paid and reviewed this booking.</p>
          <Button onClick={() => router.push("/customer/dashboard")} className="w-full rounded-xl">Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 relative pb-20 pt-12">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-lg">
        
        <AnimatePresence mode="wait">
          {step === "summary" && (
            <motion.div key="summary" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">Job Completed!</h1>
                <p className="text-muted-foreground">Please review the final amount and proceed to payment.</p>
              </div>

              <Card className="rounded-3xl border-0 shadow-2xl shadow-primary/10 bg-card/80 backdrop-blur-xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dashed">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-background shadow-sm shrink-0">
                      <img src={booking.helper?.image || `https://i.pravatar.cc/150?u=${booking.helperId}`} alt="Helper" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{booking.helper?.name}</h3>
                      <p className="text-sm text-muted-foreground">{booking.service?.name}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-muted-foreground font-medium">
                      <span>Base Service</span>
                      <span>৳{booking.service?.basePrice}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground font-medium">
                      <span>Duration Adjustment</span>
                      <span>৳{price - booking.service?.basePrice}</span>
                    </div>
                    <div className="flex justify-between text-xl font-black pt-4 border-t border-dashed text-foreground">
                      <span>Total Amount</span>
                      <span>৳{price}</span>
                    </div>
                  </div>

                  <Button onClick={() => setStep("payment")} className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20 font-bold">
                    Proceed to Payment <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">Select Payment</h1>
                <p className="text-muted-foreground">Total to pay: <strong className="text-foreground">৳{price}</strong></p>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => handleMockPayment("bKash")} 
                  disabled={isProcessing}
                  className="w-full h-20 rounded-3xl bg-[#e2136e] hover:bg-[#c91061] text-white shadow-xl shadow-[#e2136e]/20 flex justify-between px-8 text-xl font-bold"
                >
                  <span>Pay with bKash</span>
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <ChevronRightIcon className="w-6 h-6" />}
                </Button>
                
                <Button 
                  onClick={() => handleMockPayment("Nagad")} 
                  disabled={isProcessing}
                  className="w-full h-20 rounded-3xl bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-xl shadow-red-500/20 flex justify-between px-8 text-xl font-bold"
                >
                  <span>Pay with Nagad</span>
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <ChevronRightIcon className="w-6 h-6" />}
                </Button>

                <Button 
                  onClick={() => handleMockPayment("Card")} 
                  disabled={isProcessing}
                  className="w-full h-20 rounded-3xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 flex justify-between px-8 text-xl font-bold"
                >
                  <span className="flex items-center gap-2"><CreditCard className="w-6 h-6" /> Credit/Debit Card</span>
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <ChevronRightIcon className="w-6 h-6" />}
                </Button>
                
                <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> This is a secure mock payment gateway for the MVP.
                </p>
              </div>
            </motion.div>
          )}

          {step === "review" && (
            <motion.div key="review" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <Card className="rounded-3xl border-0 shadow-2xl shadow-primary/10 bg-card/80 backdrop-blur-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner text-green-600">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-extrabold mb-2">Payment Successful!</h2>
                  <p className="text-muted-foreground mb-8">How was your experience with {booking.helper?.name}?</p>

                  <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="focus:outline-none transition-transform hover:scale-110"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                      >
                        <Star className={`w-12 h-12 ${star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                      </button>
                    ))}
                  </div>

                  <textarea
                    placeholder="Leave a comment (optional)..."
                    className="w-full p-4 bg-muted/50 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-primary/50 transition-shadow mb-6 border-transparent"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <Button 
                    onClick={handleReviewSubmit} 
                    disabled={rating === 0 || isProcessing}
                    className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20 font-bold"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Submit Review"}
                  </Button>
                  <Button variant="ghost" onClick={() => router.push("/customer/dashboard")} className="w-full mt-2 rounded-xl text-muted-foreground">Skip for now</Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="text-center p-8 bg-card rounded-3xl shadow-xl">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6 animate-pulse" />
                <h2 className="text-3xl font-extrabold mb-4">Thank You!</h2>
                <p className="text-muted-foreground mb-8">Your feedback helps keep the OnlyMen community safe and reliable.</p>
                <Button onClick={() => router.push("/customer/dashboard")} className="w-full h-14 text-lg rounded-xl shadow-lg font-bold">Return to Dashboard</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

function ChevronRightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
