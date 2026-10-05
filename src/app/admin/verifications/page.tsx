"use client";

import { useState, useEffect } from "react";
import { Loader2, ArrowLeft, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type HelperProfile = {
  id: string;
  phone: string | null;
  address: string | null;
  hourlyRate: number;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

type Verification = {
  id: string;
  nidNumber: string | null;
  nidFrontImage: string | null;
  nidBackImage: string | null;
  status: "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
  submittedAt: string;
  helperProfile: HelperProfile;
};

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchVerifications = async () => {
    try {
      const res = await fetch("/api/admin/verifications");
      if (res.ok) {
        const data = await res.json();
        setVerifications(data);
      }
    } catch (error) {
      console.error("Error fetching verifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVerifications();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/verifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        // Optimistic update
        setVerifications(prev => prev.map(v => v.id === id ? { ...v, status: newStatus as any } : v));
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "PENDING":
        return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-full text-xs font-bold tracking-wider"><Clock className="w-3 h-3" /> PENDING</span>;
      case "UNDER_REVIEW":
        return <span className="flex items-center gap-1 bg-orange-100 text-orange-800 border border-orange-200 px-3 py-1 rounded-full text-xs font-bold tracking-wider"><ShieldAlert className="w-3 h-3" /> REVIEWING</span>;
      case "VERIFIED":
        return <span className="flex items-center gap-1 bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full text-xs font-bold tracking-wider"><ShieldCheck className="w-3 h-3" /> VERIFIED</span>;
      case "REJECTED":
        return <span className="flex items-center gap-1 bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-full text-xs font-bold tracking-wider"><XCircle className="w-3 h-3" /> REJECTED</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 relative">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="rounded-full shrink-0"><ArrowLeft className="w-5 h-5" /></Button>
              </Link>
              <h1 className="text-3xl font-extrabold tracking-tight">Helper Verification</h1>
            </div>
            <p className="text-muted-foreground ml-12">Review NID submissions and approve new helpers for the marketplace.</p>
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-xl shadow-primary/5 min-h-125">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 animate-spin text-primary/50" />
            </div>
          ) : verifications.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5">
              <ShieldCheck className="w-16 h-16 text-primary/40 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">There are no pending verification requests in the queue.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {verifications.map((v) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    key={v.id} 
                    className="bg-background border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    {/* Status Indicator Stripe */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${
                      v.status === 'PENDING' ? 'bg-yellow-400' :
                      v.status === 'VERIFIED' ? 'bg-green-500' :
                      v.status === 'REJECTED' ? 'bg-red-500' :
                      'bg-orange-500'
                    }`} />
                    
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Left: User Info */}
                      <div className="flex items-start gap-4 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-border pb-6 lg:pb-0 lg:pr-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-muted shrink-0 shadow-sm">
                          <img src={v.helperProfile.user.image || `https://i.pravatar.cc/150?u=${v.helperProfile.user.email}`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-xl mb-1">{v.helperProfile.user.name || "Unknown Helper"}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{v.helperProfile.user.email}</p>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</p>
                            <p className="text-sm font-medium">{v.helperProfile.phone || "Not provided"}</p>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-2">Address</p>
                            <p className="text-sm font-medium line-clamp-1">{v.helperProfile.address || "Not provided"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Middle: NID Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">NID Number</p>
                            <p className="font-mono text-lg font-bold bg-muted/50 inline-block px-3 py-1 rounded-lg border">{v.nidNumber || "N/A"}</p>
                          </div>
                          <div>{getStatusBadge(v.status)}</div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">ID Documents</p>
                          <div className="flex gap-4">
                            {v.nidFrontImage ? (
                              <div className="w-32 h-20 bg-muted rounded-xl border overflow-hidden relative group/img">
                                <img src={v.nidFrontImage} alt="NID Front" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                                  <span className="text-xs font-bold text-white">View Front</span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-32 h-20 bg-muted/50 rounded-xl border border-dashed flex items-center justify-center text-xs text-muted-foreground">No Front</div>
                            )}
                            {v.nidBackImage ? (
                              <div className="w-32 h-20 bg-muted rounded-xl border overflow-hidden relative group/img">
                                <img src={v.nidBackImage} alt="NID Back" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                                  <span className="text-xs font-bold text-white">View Back</span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-32 h-20 bg-muted/50 rounded-xl border border-dashed flex items-center justify-center text-xs text-muted-foreground">No Back</div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Submitted on {new Date(v.submittedAt).toLocaleDateString()} at {new Date(v.submittedAt).toLocaleTimeString()}
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div className="lg:w-48 flex flex-col gap-3 justify-center border-t lg:border-t-0 pt-6 lg:pt-0">
                        {v.status === 'PENDING' || v.status === 'UNDER_REVIEW' ? (
                          <>
                            <Button 
                              onClick={() => handleUpdateStatus(v.id, "VERIFIED")} 
                              disabled={processingId === v.id}
                              className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-500/20"
                            >
                              {processingId === v.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Approve</>}
                            </Button>
                            <Button 
                              onClick={() => handleUpdateStatus(v.id, "REJECTED")} 
                              disabled={processingId === v.id}
                              variant="outline"
                              className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                            >
                              {processingId === v.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4 mr-2" /> Reject</>}
                            </Button>
                          </>
                        ) : v.status === 'VERIFIED' ? (
                          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100 h-full flex flex-col items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-green-600 mb-2" />
                            <span className="text-sm font-bold text-green-800">Helper is active</span>
                            <Button variant="link" size="sm" onClick={() => handleUpdateStatus(v.id, "PENDING")} className="text-xs mt-2 text-green-700/70">Revert to Pending</Button>
                          </div>
                        ) : (
                          <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100 h-full flex flex-col items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-600 mb-2" />
                            <span className="text-sm font-bold text-red-800">Application rejected</span>
                            <Button variant="link" size="sm" onClick={() => handleUpdateStatus(v.id, "PENDING")} className="text-xs mt-2 text-red-700/70">Re-evaluate</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
