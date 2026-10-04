"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ChevronRight, ChevronLeft, UploadCloud, ShieldCheck, User, Camera, FileText, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";

export default function VerificationPage() {
  const [step, setStep] = useState(0); // 0 = check status, 1 = profile, 2 = docs, 3 = review, 4 = success/pending
  const [status, setStatus] = useState<string | null>(null);
  
  // Form State
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [nidNumber, setNidNumber] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const lang = useLanguage();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/helper/verification")
      .then(res => {
        if(res.status === 401) router.push("/login");
        return res.json();
      })
      .then(data => {
        if (data.helperProfile?.verification) {
          setStatus(data.helperProfile.verification.status);
          setStep(4);
        } else {
          setStep(1); // start onboarding
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [router]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/helper/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          bio, 
          skills: skills.split(",").map(s => s.trim()).filter(s => s),
          nidNumber 
        })
      });
      if(res.ok) {
        setStatus("PENDING");
        setStep(4);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: "Profile", icon: User },
    { title: "Identity", icon: ShieldCheck },
    { title: "Review", icon: FileText }
  ];

  if (isLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  // Pending/Approved View
  if (step === 4) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/80 backdrop-blur-xl border rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-primary/10"
        >
          {status === 'APPROVED' ? (
            <>
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">You're Verified!</h2>
              <p className="text-muted-foreground mb-8">Your account is fully active. You can now accept jobs and start earning.</p>
              <Button onClick={() => router.push('/helper/dashboard')} size="lg" className="rounded-xl px-8 h-12">Go to Dashboard</Button>
            </>
          ) : status === 'REJECTED' ? (
            <>
              <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Verification Rejected</h2>
              <p className="text-muted-foreground mb-8">Unfortunately, we could not verify your identity. Please contact support.</p>
              <Button onClick={() => setStep(1)} variant="outline" size="lg" className="rounded-xl px-8 h-12 border-2">Re-submit Documents</Button>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Under Review</h2>
              <p className="text-muted-foreground mb-8 text-lg">We've received your application. Our team is verifying your documents. This usually takes 24-48 hours.</p>
              <Button onClick={() => router.push('/helper/dashboard')} variant="outline" size="lg" className="rounded-xl px-8 h-12 border-2">Go to Dashboard</Button>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // Onboarding Wizard
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl relative">
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10" />

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Helper Verification</h1>
        <p className="text-muted-foreground">Complete your profile to start earning with OnlyMen.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-10 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-500"
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((s, i) => {
          const isActive = step >= i + 1;
          const isCurrent = step === i + 1;
          return (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 shadow-sm ${
                isActive ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-lg' : 'bg-background border-2 border-muted text-muted-foreground'
              }`}>
                <s.icon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
              </div>
              <span className={`text-xs font-bold mt-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{s.title}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-card/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-primary/5 min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-6">Profile Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Your Bio</label>
                  <Textarea 
                    value={bio} 
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell us about yourself and your experience..." 
                    className="min-h-[120px] rounded-xl bg-muted/50 border-transparent focus:bg-background resize-none" 
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Skills & Services (Comma separated)</label>
                  <Input 
                    value={skills} 
                    onChange={e => setSkills(e.target.value)}
                    placeholder="e.g. Electrician, Plumbing, Delivery" 
                    className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-6">Identity Verification</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block">National ID (NID) Number</label>
                  <Input 
                    value={nidNumber} 
                    onChange={e => setNidNumber(e.target.value)}
                    placeholder="Enter your 10 or 17 digit NID number" 
                    className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background" 
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-semibold text-sm">Upload NID (Front)</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  </div>
                  
                  <div className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-semibold text-sm">Take a Selfie</p>
                    <p className="text-xs text-muted-foreground mt-1">Match face with NID</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2 bg-primary/5 p-3 rounded-lg border border-primary/10">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" /> Your data is securely encrypted and used only for identity verification purposes.
                </p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-6">Review Application</h2>
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-2xl border">
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Bio</p>
                  <p className="font-medium">{bio || "Not provided"}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl border">
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Skills</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills ? skills.split(",").map((s,i) => <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{s.trim()}</span>) : "None"}
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl border">
                  <p className="text-sm font-semibold text-muted-foreground mb-1">NID Number</p>
                  <p className="font-medium">{nidNumber || "Not provided"}</p>
                </div>
                
                <div className="flex items-start gap-3 mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-800 dark:text-orange-200">By submitting, you agree to our terms of service and confirm that the provided information is accurate.</p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <div className="mt-10 flex justify-between pt-6 border-t">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="rounded-xl font-semibold">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          ) : <div />}
          
          {step < 3 ? (
            <Button onClick={() => setStep(s => s + 1)} className="rounded-xl px-8 shadow-lg shadow-primary/20">
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-xl px-8 shadow-lg shadow-primary/20">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
