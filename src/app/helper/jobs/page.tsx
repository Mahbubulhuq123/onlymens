"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

type Job = {
  id: string;
  date: string;
  time: string;
  estimatedDuration: number;
  estimatedPrice: number;
  notes: string;
  customer: { name: string; image: string | null };
  service: { name: string; icon: string | null };
  location: { address: string } | null;
};

export default function HelperJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const lang = useLanguage();
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/helper/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptJob = async (id: string) => {
    setAcceptingId(id);
    try {
      const res = await fetch("/api/helper/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id }),
      });

      if (res.ok) {
        // Redirect to active job page
        router.push(`/helper/active-job/${id}`);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to accept job");
        fetchJobs(); // Refresh list
      }
    } catch (error) {
      console.error("Failed to accept job", error);
      alert("An error occurred");
    } finally {
      setAcceptingId(null);
    }
  };

  const t = {
    title: lang === "en" ? "Available Jobs" : "উপলব্ধ কাজ",
    noJobs: lang === "en" ? "No available jobs at the moment." : "এই মুহূর্তে কোনো কাজ উপলব্ধ নেই।",
    accept: lang === "en" ? "Accept Job" : "কাজ গ্রহণ করুন",
    accepting: lang === "en" ? "Accepting..." : "গ্রহণ করা হচ্ছে...",
    duration: lang === "en" ? "hours" : "ঘন্টা",
    price: lang === "en" ? "Est. Pay: " : "আনুমানিক আয়: ",
    date: lang === "en" ? "Date: " : "তারিখ: ",
    time: lang === "en" ? "Time: " : "সময়: ",
    refresh: lang === "en" ? "Refresh" : "রিফ্রেশ করুন",
    requestedBy: lang === "en" ? "Requested by" : "অনুরোধ করেছেন",
    noLocation: lang === "en" ? "Location not provided" : "অবস্থান দেওয়া হয়নি",
    tbd: lang === "en" ? "TBD" : "নির্ধারিত হবে",
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <h1 className="text-3xl font-black mb-8">{t.title}</h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
          <p className="text-xl text-muted-foreground">{t.noJobs}</p>
          <Button variant="outline" className="mt-4" onClick={fetchJobs}>
            {t.refresh}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="flex flex-col">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{job.service.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{t.requestedBy} {job.customer.name}</p>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                    ৳{job.estimatedPrice}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-1 space-y-3 text-sm">
                <div className="flex items-start text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                  <span>{job.location?.address || t.noLocation}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2 shrink-0" />
                  <span>{job.date ? format(new Date(job.date), "PPP") : t.tbd}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 shrink-0" />
                    <span>{job.time}</span>
                  </div>
                  <span className="bg-muted px-2 py-0.5 rounded text-xs">{job.estimatedDuration} {t.duration}</span>
                </div>
                {job.notes && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs italic border border-border/50">
                    "{job.notes}"
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/40">
                <Button 
                  className="w-full font-bold h-12 rounded-xl"
                  onClick={() => handleAcceptJob(job.id)}
                  disabled={acceptingId === job.id}
                >
                  {acceptingId === job.id ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.accepting}</>
                  ) : (
                    <><CheckCircle2 className="mr-2 h-5 w-5" /> {t.accept}</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
