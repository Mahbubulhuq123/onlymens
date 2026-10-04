"use client";

import { useState } from "react";
import { Star, Trash2, Search, User as UserIcon, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminReviewsClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredReviews = reviews.filter((r) => 
    r.reviewer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reviewee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== id));
      } else {
        alert("Failed to delete review");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting review");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Review Moderation</h1>
          <p className="text-muted-foreground">Monitor and manage customer feedback.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Search by user, helper, or comment..." 
            className="pl-10 h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed rounded-3xl text-muted-foreground bg-muted/30">
            <Star className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-lg">No reviews found.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  {/* Reviewer */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                      {review.reviewer.image ? (
                        <img src={review.reviewer.image} alt="Reviewer" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-full h-full p-1.5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{review.reviewer.name}</p>
                      <p className="text-xs text-muted-foreground">Customer</p>
                    </div>
                  </div>
                  
                  <span className="text-muted-foreground">→</span>
                  
                  {/* Reviewee */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                      {review.reviewee.image ? (
                        <img src={review.reviewee.image} alt="Reviewee" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-full h-full p-1.5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{review.reviewee.name}</p>
                      <p className="text-xs text-muted-foreground">Helper</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}`} 
                      />
                    ))}
                  </div>
                  {review.comment ? (
                    <p className="text-sm bg-muted/30 p-3 rounded-lg border">{review.comment}</p>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">No comment provided.</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <span className="bg-muted px-2 py-1 rounded">Booking #{review.bookingId.slice(-5)}</span>
                  <span>{new Date(review.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="w-full md:w-auto flex justify-end">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="rounded-xl flex-1 md:flex-none"
                  onClick={() => handleDelete(review.id)}
                  disabled={deletingId === review.id}
                >
                  {deletingId === review.id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete Review
                </Button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
