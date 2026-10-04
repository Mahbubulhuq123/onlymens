import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingBag, 
  Truck, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  UserCheck,
  Star,
  Zap,
  TrendingUp
} from "lucide-react";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import { cookies } from "next/headers";

// Separate component for data fetching so the main page doesn't block
async function LiveServices() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";
  
  const t = {
    expertHelp: lang === "en" ? "Expert help available for this service." : "এই সেবার জন্য বিশেষজ্ঞের সাহায্য পাওয়া যাবে।",
    book: lang === "en" ? "Book" : "বুক",
    noServices: lang === "en" ? "No services available right now." : "বর্তমানে কোনো সেবা পাওয়া যাচ্ছে না।"
  };

  const services = await prisma.service.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  const translateServiceName = (name: string) => {
    if (lang === "en") return name;
    const map: Record<string, string> = {
      "Shopping Assistance": "শপিং সহায়তা",
      "Moving Help": "মালামাল সরানো",
      "Queue Assistance": "লাইনে দাঁড়ানো",
      "Errands": "টুকিটাকি কাজ",
      "Office Help": "অফিস সহায়তা",
      "Event Assistance": "ইভেন্ট সহায়তা",
      "Elderly Assistance": "বয়স্কদের সহায়তা",
      "Custom Task": "কাস্টম কাজ"
    };
    return map[name] || name;
  };

  const translateServiceDesc = (desc: string) => {
    if (lang === "en") return desc;
    const map: Record<string, string> = {
      "Carry bags or assist while shopping in busy markets.": "ব্যস্ত বাজারে শপিং করার সময় ব্যাগ বহন বা সাহায্য করা।",
      "An extra pair of hands for lifting and moving items.": "জিনিসপত্র তোলা এবং সরানোর জন্য অতিরিক্ত হাতের সাহায্য।",
      "Wait in line for tickets, banking, or events.": "টিকেট, ব্যাংকিং বা ইভেন্টের জন্য লাইনে অপেক্ষা করা।",
      "Collect or submit documents and packages.": "দলিল বা প্যাকেজ সংগ্রহ এবং জমা দেওয়া।",
      "Short-term help with filing, organizing, or simple office tasks.": "ফাইলিং, গোছানো বা ছোটখাটো অফিসিয়াল কাজের জন্য স্বল্পমেয়াদি সাহায্য।",
      "Help with setup, serving, or managing guests at small events.": "ছোট ইভেন্টে সেটআপ, পরিবেশন বা অতিথি ব্যবস্থাপনায় সাহায্য করা।",
      "Everyday non-medical help for seniors.": "বয়স্কদের জন্য প্রতিদিনের সাধারণ সাহায্য (চিকিৎসা ছাড়া)।",
      "Describe your own legal and safe short-term task.": "আপনার নিজের বৈধ ও নিরাপদ স্বল্পমেয়াদি কাজ বর্ণনা করুন।"
    };
    return map[desc] || desc;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.length > 0 ? services.map((service: any, index: number) => (
        <Card key={service.id} className="group hover:-translate-y-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl bg-background/60 backdrop-blur-xl border-border/50 animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${index * 100}ms` }}>
          <CardHeader>
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
              <Briefcase className="w-7 h-7" />
            </div>
            <CardTitle className="text-2xl">{translateServiceName(service.name)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{service.description ? translateServiceDesc(service.description) : t.expertHelp}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-bold text-lg">৳{service.basePrice}/hr</span>
              <Link href={`/customer/book?serviceId=${service.id}`} className={buttonVariants({ variant: "ghost", size: "sm", className: "group-hover:bg-primary group-hover:text-primary-foreground" })}>
                {t.book}
              </Link>
            </div>
          </CardContent>
        </Card>
      )) : (
        <div className="col-span-full text-center p-8 border border-dashed rounded-xl text-muted-foreground">
          {t.noServices}
        </div>
      )}
    </div>
  );
}

// Loading fallback for Suspense
function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="bg-background/60 backdrop-blur-xl border-border/50">
          <CardHeader>
            <div className="w-14 h-14 rounded-2xl bg-muted animate-pulse mb-6" />
            <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mt-4">
              <div className="h-4 bg-muted animate-pulse rounded w-full" />
              <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function Home() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";

  const t = {
    liveLocation: lang === "en" ? "Live across Dhaka, Bangladesh" : "ঢাকা, বাংলাদেশে লাইভ",
    heroTitlePrefix: lang === "en" ? "Need an " : "আপনার কি ",
    heroTitleHighlight: lang === "en" ? "extra pair" : "অতিরিক্ত হাতের",
    heroTitleSuffix: lang === "en" ? " of hands?" : " প্রয়োজন?",
    heroDescription: lang === "en" ? "Hire a trusted, verified local helper by the hour. From running errands to moving furniture—we've got you covered." : "ঘণ্টা হিসেবে বিশ্বস্ত এবং যাচাইকৃত স্থানীয় সাহায্যকারী নিয়োগ দিন। আপনার কাজ থেকে শুরু করে ফার্নিচার সরানো পর্যন্ত—সবকিছুতে আমরা আছি।",
    bookHelperNow: lang === "en" ? "Book a Helper Now" : "এখনই সাহায্যকারী বুক করুন",
    becomeHelper: lang === "en" ? "Become a Helper" : "সাহায্যকারী হোন",
    verifiedPros: lang === "en" ? "Verified Pros" : "যাচাইকৃত পেশাদার",
    instantMatching: lang === "en" ? "Instant Matching" : "তাৎক্ষণিক ম্যাচিং",
    trackRealTime: lang === "en" ? "Track in Real-Time" : "সরাসরি ট্র্যাক করুন",
    servicesTitle: lang === "en" ? "Services ready to be booked" : "যেসব সেবা বুক করার জন্য প্রস্তুত",
    servicesDesc: lang === "en" ? "Choose from our live catalog of services, created directly from the platform." : "আমাদের প্ল্যাটফর্ম থেকে সরাসরি তৈরি করা লাইভ ক্যাটালগ থেকে বেছে নিন।",
    exploreServices: lang === "en" ? "Explore all services" : "সব সেবা দেখুন",
    howItWorksTitle: lang === "en" ? "Simple as 1-2-3" : "১-২-৩ এর মতই সহজ",
    howItWorksDesc: lang === "en" ? "Get help in minutes with our streamlined booking process." : "আমাদের সহজ বুকিং প্রক্রিয়ার মাধ্যমে কয়েক মিনিটে সাহায্য পান।",
    step1Title: lang === "en" ? "Request" : "অনুরোধ করুন",
    step1Desc: lang === "en" ? "Tell us what you need help with, where, and for how long." : "আপনার কি সাহায্য লাগবে, কোথায় এবং কতক্ষণের জন্য তা আমাদের জানান।",
    step2Title: lang === "en" ? "Match" : "ম্যাচিং",
    step2Desc: lang === "en" ? "We instantly notify nearby verified helpers who can accept your job." : "আমরা সাথে সাথেই কাছের যাচাইকৃত সাহায্যকারীদের জানাই যারা আপনার কাজ করতে পারবে।",
    step3Title: lang === "en" ? "Relax" : "নিশ্চিন্ত থাকুন",
    step3Desc: lang === "en" ? "Your helper arrives, completes the task, and you pay securely." : "আপনার সাহায্যকারী পৌঁছাবে, কাজ শেষ করবে এবং আপনি নিরাপদে পেমেন্ট করবেন।",
    trustBadge: lang === "en" ? "Enterprise Grade Safety" : "এন্টারপ্রাইজ গ্রেড নিরাপত্তা",
    trustTitle: lang === "en" ? "Your safety is our absolute priority" : "আপনার নিরাপত্তা সীমাহীন অগ্রাধিকার",
    trustDesc: lang === "en" ? "We take trust seriously. Every helper on our platform goes through a rigorous identity verification process before they can accept tasks." : "আমরা আস্থাকে গুরুত্ব সহকারে নিই। প্রতিটি সাহায্যকারী কাজ গ্রহণ করার আগে কঠোর পরিচয় যাচাইকরণের মধ্য দিয়ে যায়।",
    nidVerification: lang === "en" ? "NID Verification" : "এনআইডি যাচাইকরণ",
    nidDesc: lang === "en" ? "Government ID checked" : "সরকারি আইডি যাচাইকৃত",
    liveTracking: lang === "en" ? "Live Tracking" : "লাইভ ট্র্যাকিং",
    liveTrackingDesc: lang === "en" ? "GPS tracking during jobs" : "কাজের সময় জিপিএস ট্র্যাকিং",
    transparentRatings: lang === "en" ? "Transparent Ratings" : "স্বচ্ছ রেটিং",
    transparentRatingsDesc: lang === "en" ? "Community driven trust" : "কমিউনিটি চালিত আস্থা",
    support247: lang === "en" ? "24/7 Support" : "২৪/৭ সাপোর্ট",
    supportDesc: lang === "en" ? "Always here to help" : "সর্বদা সাহায্য করতে প্রস্তুত",
    topSkills: lang === "en" ? "Top Skills" : "শীর্ষ দক্ষতা",
    hourlyRate: lang === "en" ? "Hourly Rate" : "ঘণ্টায় রেট",
    statusLabel: lang === "en" ? "Status" : "স্ট্যাটাস",
    availableNow: lang === "en" ? "Available Now" : "এখনই পাওয়া যাচ্ছে"
  };

  // Data fetching is now delegated to LiveServices component

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Dynamic Hero Section */}
      <section className="relative px-4 pt-28 pb-32 md:pt-40 md:pb-48 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-background" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]" />
        
        <div className="container mx-auto max-w-6xl text-center space-y-10 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center rounded-full border border-primary/30 px-4 py-1.5 text-sm font-medium text-primary bg-primary/5 backdrop-blur-md shadow-sm mb-4 hover:bg-primary/10 transition-colors cursor-default">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary mr-2 animate-ping" />
            {t.liveLocation}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-tight drop-shadow-sm">
            {t.heroTitlePrefix}<span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">{t.heroTitleHighlight}</span>{t.heroTitleSuffix}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            {t.heroDescription}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link 
              href="/customer/book"
              className={buttonVariants({ size: "lg", className: "w-full sm:w-auto h-14 px-10 text-lg rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300" })}
            >
              {t.bookHelperNow}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/become-a-helper"
              className={buttonVariants({ size: "lg", variant: "outline", className: "w-full sm:w-auto h-14 px-10 text-lg rounded-full hover:bg-muted/50 border-2 transition-colors duration-300" })}
            >
              {t.becomeHelper}
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-16 text-muted-foreground text-sm font-semibold">
            <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border backdrop-blur-sm shadow-sm hover:border-primary/50 transition-colors">
              <ShieldCheck className="w-5 h-5 text-primary" /> {t.verifiedPros}
            </div>
            <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border backdrop-blur-sm shadow-sm hover:border-primary/50 transition-colors">
              <Zap className="w-5 h-5 text-yellow-500" /> {t.instantMatching}
            </div>
            <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border backdrop-blur-sm shadow-sm hover:border-primary/50 transition-colors">
              <MapPin className="w-5 h-5 text-blue-500" /> {t.trackRealTime}
            </div>
          </div>
        </div>
      </section>

      {/* Live Services Section with Glassmorphism */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-muted/30 -skew-y-2 transform origin-top-left -z-10" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{t.servicesTitle}</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t.servicesDesc}</p>
          </div>
          
          <Suspense fallback={<ServicesSkeleton />}>
            <LiveServices />
          </Suspense>
          
          <div className="text-center mt-16">
            <Link 
              href="/customer/book"
              className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-full font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300" })}
            >
              {t.exploreServices}
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works - Modern Steps */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">{t.howItWorksTitle}</h2>
            <p className="text-muted-foreground text-xl">{t.howItWorksDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-1 bg-linear-to-r from-primary/10 via-primary/40 to-primary/10 -z-10 rounded-full" />
            
            <div className="flex flex-col items-center text-center space-y-6 group">
              <div className="w-32 h-32 rounded-3xl bg-background border border-muted shadow-2xl flex items-center justify-center relative group-hover:-translate-y-4 transition-transform duration-500">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/10 to-transparent" />
                <span className="text-5xl font-black text-primary relative z-10 font-mono">1</span>
              </div>
              <h3 className="text-2xl font-bold">{t.step1Title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed px-4">{t.step1Desc}</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-6 group">
              <div className="w-32 h-32 rounded-3xl bg-background border border-muted shadow-2xl flex items-center justify-center relative group-hover:-translate-y-4 transition-transform duration-500 delay-100">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-500/10 to-transparent" />
                <span className="text-5xl font-black text-blue-500 relative z-10 font-mono">2</span>
              </div>
              <h3 className="text-2xl font-bold">{t.step2Title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed px-4">{t.step2Desc}</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-6 group">
              <div className="w-32 h-32 rounded-3xl bg-background border border-muted shadow-2xl flex items-center justify-center relative group-hover:-translate-y-4 transition-transform duration-500 delay-200">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-green-500/10 to-transparent" />
                <span className="text-5xl font-black text-green-500 relative z-10 font-mono">3</span>
              </div>
              <h3 className="text-2xl font-bold">{t.step3Title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed px-4">{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Trust Section */}
      <section className="py-32 bg-zinc-950 text-zinc-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 md:w-200 md:h-200 bg-primary/20 rounded-full blur-[100px] md:blur-[150px] opacity-50 pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full bg-zinc-800/50 border border-zinc-700 px-4 py-1.5 text-sm font-medium text-zinc-300">
                <ShieldCheck className="w-4 h-4 mr-2 text-primary" /> {t.trustBadge}
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">{t.trustTitle}</h2>
              <p className="text-zinc-400 text-xl leading-relaxed">
                {t.trustDesc}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="p-3 bg-zinc-800 rounded-xl text-primary"><CheckCircle2 className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-semibold text-lg text-zinc-100">{t.nidVerification}</h4>
                    <p className="text-sm text-zinc-400 mt-1">{t.nidDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="p-3 bg-zinc-800 rounded-xl text-primary"><MapPin className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-semibold text-lg text-zinc-100">{t.liveTracking}</h4>
                    <p className="text-sm text-zinc-400 mt-1">{t.liveTrackingDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="p-3 bg-zinc-800 rounded-xl text-primary"><Star className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-semibold text-lg text-zinc-100">{t.transparentRatings}</h4>
                    <p className="text-sm text-zinc-400 mt-1">{t.transparentRatingsDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="p-3 bg-zinc-800 rounded-xl text-primary"><Users className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-semibold text-lg text-zinc-100">{t.support247}</h4>
                    <p className="text-sm text-zinc-400 mt-1">{t.supportDesc}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating UI Element */}
            <div className="relative mx-auto w-full max-w-md lg:ml-auto">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/30 to-blue-500/30 blur-2xl rounded-full" />
              
              <div className="bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 p-8 rounded-4xl shadow-2xl relative z-10 transform lg:rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground p-4 rounded-2xl shadow-xl shadow-primary/20 rotate-12">
                  <TrendingUp className="w-8 h-8" />
                </div>
                
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 rounded-full border-2 border-primary/50 overflow-hidden relative">
                    <div className="absolute inset-0 border-[3px] border-transparent border-t-primary rounded-full animate-spin" />
                    <img src="https://i.pravatar.cc/150?u=rahim2" alt="Helper" className="w-full h-full object-cover p-1 rounded-full" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold flex items-center gap-2 text-zinc-100">Rahim <ShieldCheck className="w-6 h-6 text-primary" /></h4>
                    <p className="text-zinc-400 flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 4.9 (142 completed jobs)
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-zinc-800/50">
                    <span className="text-zinc-400">{t.topSkills}</span>
                    <span className="font-semibold text-zinc-200">Heavy Lifting, Shopping</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-zinc-800/50">
                    <span className="text-zinc-400">{t.hourlyRate}</span>
                    <span className="font-semibold text-primary text-xl">৳300</span>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <span className="text-zinc-400">{t.statusLabel}</span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-green-500/20 text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" /> {t.availableNow}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
