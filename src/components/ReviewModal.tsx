"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/components/language-provider";

export default function ReviewModal({ 
  bookingId, 
  revieweeId, 
  revieweeName,
  onReviewSubmitted 
}: { 
  bookingId: string; 
  revieweeId: string; 
  revieweeName: string;
  onReviewSubmitted?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lang = useLanguage();

  const t = {
    leaveReview: lang === "en" ? "Leave Review" : "রিভিউ দিন",
    rateTitle: lang === "en" ? `Rate your experience with ${revieweeName}` : `${revieweeName}-এর সাথে আপনার অভিজ্ঞতা রেট করুন`,
    description: lang === "en" ? "Your feedback helps build trust in our community." : "আপনার মতামত আমাদের কমিউনিটিতে আস্থা তৈরি করতে সাহায্য করে।",
    commentLabel: lang === "en" ? "Write a comment (optional)" : "একটি মন্তব্য লিখুন (ঐচ্ছিক)",
    submit: lang === "en" ? "Submit Review" : "রিভিউ জমা দিন",
    submitting: lang === "en" ? "Submitting..." : "জমা দেওয়া হচ্ছে...",
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, revieweeId, rating, comment }),
      });
      
      if (res.ok) {
        setOpen(false);
        if (onReviewSubmitted) onReviewSubmitted();
      } else {
        alert("Failed to submit review");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="rounded-xl shadow-md font-bold">
          <Star className="w-4 h-4 mr-2 fill-current" /> {t.leaveReview}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t.rateTitle}</DialogTitle>
          <DialogDescription>
            {t.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center">
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star 
                  className={`w-10 h-10 ${(hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`} 
                />
              </button>
            ))}
          </div>
          
          <div className="w-full">
            <label className="text-sm font-semibold mb-2 block">{t.commentLabel}</label>
            <Textarea 
              className="resize-none rounded-xl bg-muted/30" 
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            className="w-full rounded-xl font-bold h-12" 
            onClick={handleSubmit} 
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
            {isSubmitting ? t.submitting : t.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
