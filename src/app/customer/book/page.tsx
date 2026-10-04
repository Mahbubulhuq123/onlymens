"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, ArrowRight, ShieldCheck, Loader2, Sparkles, Navigation, Calendar, Activity, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { motion, AnimatePresence } from "framer-motion";
import { MapComponent } from "@/components/MapComponent";

type Service = {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  icon?: string;
};

function BookHelperContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [location, setLocation] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("1");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [customPrice, setCustomPrice] = useState("");

  const lang = useLanguage();
  
  const t = {
    onDemandAssistance: lang === "en" ? "On-Demand Assistance" : "তাৎক্ষণিক সহায়তা",
    bookA: lang === "en" ? "Book a " : "বুক করুন একজন ",
    helper: lang === "en" ? "Helper" : "সাহায্যকারী",
    subtitle: lang === "en" ? "Get an extra pair of hands exactly when and where you need them." : "আপনার ঠিক যখন এবং যেখানে প্রয়োজন, তখন একজন সাহায্যকারী পান।",
    step1Title: lang === "en" ? "What do you need help with?" : "আপনার কী ধরনের সাহায্য প্রয়োজন?",
    step1Desc: lang === "en" ? "Select a service to get started." : "শুরু করতে একটি সেবা নির্বাচন করুন।",
    noServices: lang === "en" ? "No services available at the moment." : "এই মুহূর্তে কোন সেবা উপলব্ধ নেই।",
    taskDetailsTitle: lang === "en" ? "Task Details (Optional)" : "কাজের বিবরণ (ঐচ্ছিক)",
    taskDetailsPlaceholder: lang === "en" ? "e.g. I need help carrying 5 heavy bags from the supermarket to my 3rd-floor apartment..." : "যেমন: সুপারমার্কেট থেকে আমার ৩য় তলার অ্যাপার্টমেন্টে ৫টি ভারী ব্যাগ নিয়ে যেতে সাহায্য দরকার...",
    continue: lang === "en" ? "Continue" : "চালিয়ে যান",
    step2Title: lang === "en" ? "Where and When?" : "কোথায় এবং কখন?",
    step2Desc: lang === "en" ? "Set the location and time for the task." : "কাজের জন্য স্থান এবং সময় নির্ধারণ করুন।",
    taskLocation: lang === "en" ? "Task Location" : "কাজের স্থান",
    taskLocationPlaceholder: lang === "en" ? "Enter specific location in Dhaka (e.g. Gulshan-2, Road 43)" : "ঢাকায় নির্দিষ্ট স্থান লিখুন (যেমন: গুলশান-২, রোড ৪৩)",
    date: lang === "en" ? "Date" : "তারিখ",
    time: lang === "en" ? "Time" : "সময়",
    estimatedDuration: lang === "en" ? "Estimated Duration" : "আনুমানিক সময়কাল",
    hour1: lang === "en" ? "1 Hour" : "১ ঘণ্টা",
    hour2: lang === "en" ? "2 Hours" : "২ ঘণ্টা",
    hour3: lang === "en" ? "3 Hours" : "৩ ঘণ্টা",
    hour4: lang === "en" ? "4 Hours" : "৪ ঘণ্টা",
    hour5: lang === "en" ? "5+ Hours" : "৫+ ঘণ্টা",
    back: lang === "en" ? "Back" : "ফিরে যান",
    reviewDetails: lang === "en" ? "Review Details" : "বিবরণ দেখুন",
    step3Title: lang === "en" ? "Estimated Cost" : "আনুমানিক খরচ",
    step3Desc: lang === "en" ? "Review your booking before finding a helper." : "সাহায্যকারী খোঁজার আগে আপনার বুকিংয়ের বিবরণ দেখুন।",
    hourSuffix: lang === "en" ? "hour(s)" : "ঘণ্টা",
    priceNote: (price: number) => lang === "en" ? `Base rate is ৳${price}/hr. Actual price may vary slightly depending on the exact time spent.` : `ভিত্তি মূল্য ৳${price}/ঘণ্টা। ব্যয়িত প্রকৃত সময়ের উপর নির্ভর করে মূল্য সামান্য পরিবর্তিত হতে পারে।`,
    findHelpers: lang === "en" ? "Find Helpers" : "সাহায্যকারী খুঁজুন",
    step4Title: lang === "en" ? "Nearby Helpers" : "নিকটবর্তী সাহায্যকারী",
    step4Desc: lang === "en" ? "Matching you with the best available people." : "আপনার জন্য সেরা উপলব্ধ ব্যক্তিদের সাথে মেলানো হচ্ছে।",
    live: lang === "en" ? "LIVE" : "লাইভ",
    topRated: lang === "en" ? "Top Rated" : "সেরা রেট প্রাপ্ত",
    completed: lang === "en" ? "completed" : "সম্পন্ন",
    away: lang === "en" ? "away" : "দূরে",
    request: lang === "en" ? "Request" : "অনুরোধ করুন",
    orAutoMatch: lang === "en" ? "Or Auto-Match" : "অথবা স্বয়ংক্রিয়ভাবে মেলান",
    autoMatchBtn: lang === "en" ? "Let us find the nearest helper" : "আমাদেরকে নিকটবর্তী সাহায্যকারী খুঁজে বের করতে দিন",
    goBack: lang === "en" ? "Go Back" : "ফিরে যান",
    generalAssistance: lang === "en" ? "General assistance" : "সাধারণ সহায়তা",
    paymentMethod: lang === "en" ? "Payment Method" : "পেমেন্ট পদ্ধতি",
    payOnline: lang === "en" ? "Pay Online (SSLCommerz)" : "অনলাইনে পেমেন্ট করুন (SSLCommerz)",
    payCOD: lang === "en" ? "Cash on Delivery (COD)" : "ক্যাশ অন ডেলিভারি (COD)",
    customTaskPrice: lang === "en" ? "Enter your proposed price per hour" : "আপনার প্রস্তাবিত মূল্য লিখুন (প্রতি ঘন্টা)",
  };

  const translateServiceName = (name: string | undefined) => {
    if (!name) return "";
    if (lang === "en") return name;
    const map: Record<string, string> = {
      "Shopping Assistance": "শপিং সহায়তা",
      "Moving Help": "মালামাল সরানো",
      "Queue Assistance": "লাইনে দাঁড়ানো",
      "Errands": "টুকিটাকি কাজ",
      "Event Help": "ইভেন্ট সহায়তা",
      "Event Assistance": "ইভেন্ট সহায়তা",
      "Office Help": "অফিস সহায়তা",
      "Personal Assistance": "ব্যক্তিগত সহায়তা",
      "Elderly Assistance": "বয়স্ক সহায়তা",
      "Custom Task": "কাস্টম টাস্ক",
      "Other": "অন্যান্য"
    };
    return map[name] || name;
  };

  const translateServiceDesc = (desc: string | null | undefined) => {
    if (!desc) return t.generalAssistance;
    if (lang === "en") return desc;
    if (desc.includes("Describe your own")) return "আপনার নিজস্ব আইনি এবং নিরাপদ স্বল্পমেয়াদী কাজের বিবরণ দিন।";
    if (desc.includes("Everyday non-medical")) return "বয়স্কদের জন্য দৈনন্দিন নন-মেডিকেল সাহায্য।";
    if (desc.includes("Help with setup")) return "ছোট ইভেন্টে সেটআপ, পরিবেশন বা অতিথি পরিচালনায় সহায়তা।";
    if (desc.includes("Short-term help with filing")) return "ফাইলিং, গোছানো বা সাধারণ অফিসের কাজে স্বল্পমেয়াদী সাহায্য।";
    if (desc.includes("Wait in line for tickets")) return "টিকিট, ব্যাংকিং বা ইভেন্টের জন্য লাইনে অপেক্ষা করা।";
    if (desc.includes("Collect or submit documents")) return "নথিপত্র এবং প্যাকেজ সংগ্রহ বা জমা দেওয়া।";
    return desc;
  };
  
  useEffect(() => {
    fetch("/api/services")
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setIsLoadingServices(false);
        
        const sid = searchParams.get("serviceId");
        const sname = searchParams.get("serviceName");
        
        if (sid) {
          const found = data.find((s: Service) => s.id === sid);
          if (found) setSelectedServiceId(found.id);
        } else if (sname) {
          const found = data.find((s: Service) => s.name.toLowerCase() === sname.toLowerCase());
          if (found) setSelectedServiceId(found.id);
        }
      })
      .catch(() => setIsLoadingServices(false));
  }, [searchParams]);

  const selectedService = services.find(s => s.id === selectedServiceId);
  const basePrice = selectedService?.name === "Custom Task" 
    ? (Number(customPrice) || 0) 
    : (selectedService?.basePrice || 0);
  const estimatedPrice = basePrice * Number(estimatedDuration);

  const handleBook = async () => {
    setIsBooking(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          location,
          date,
          time,
          estimatedDuration,
          notes,
          price: estimatedPrice
        }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        let errorMessage = "Failed to book service";
        try {
          const errorData = await res.json();
          if (errorData.error) errorMessage = errorData.error;
        } catch (e) {}
        throw new Error(errorMessage);
      }
      const booking = await res.json();
      
      if (paymentMethod === "ONLINE") {
        try {
          const paymentRes = await fetch("/api/payment/init", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId: booking.id }),
          });
          
          const paymentData = await paymentRes.json();
          if (paymentData.url) {
            window.location.href = paymentData.url;
            return;
          }
        } catch (paymentErr) {
          console.error("Failed to initialize payment:", paymentErr);
        }
      }

      router.push("/customer/dashboard?booked=true");
    } catch (err: any) {
      setError(err.message);
      setIsBooking(false);
    }
  };

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/20 pt-8 pb-20 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        
        {/* Header section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{t.onDemandAssistance}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {t.bookA} <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">{t.helper}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8 relative px-2">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full -z-10" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500 ease-out -z-10" 
            style={{ width: `${((step - 1) / 3) * 100}%` }} 
          />
          
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                s === step 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/20 scale-110' 
                  : s < step 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background border-2 border-muted text-muted-foreground'
              }`}
            >
              {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-xl bg-background/80 border border-white/20 shadow-2xl rounded-3xl p-6 md:p-10 overflow-hidden">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold">{t.step1Title}</h2>
                  <p className="text-muted-foreground mt-1">{t.step1Desc}</p>
                </div>
                
                {isLoadingServices ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
                ) : services.length === 0 ? (
                  <div className="text-center p-8 border-2 border-dashed rounded-2xl text-muted-foreground bg-muted/30">
                    {t.noServices}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((s) => (
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={s.id}
                        onClick={() => setSelectedServiceId(s.id)}
                        className={`p-5 rounded-2xl cursor-pointer transition-all border-2 ${
                          selectedServiceId === s.id 
                            ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary/50' 
                            : 'border-muted hover:border-primary/50 bg-card hover:bg-muted/30'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-lg">{translateServiceName(s.name)}</p>
                          <div className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md">
                            ৳{s.basePrice}/hr
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{translateServiceDesc(s.description)}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6">
                  <label className="text-sm font-semibold mb-2 block">{t.taskDetailsTitle}</label>
                  <textarea 
                    className="w-full bg-muted/50 border-transparent focus:bg-background border focus:border-primary rounded-xl p-4 min-h-25 resize-none transition-all focus:ring-4 focus:ring-primary/10 outline-none" 
                    placeholder={t.taskDetailsPlaceholder}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="w-full h-14 text-lg mt-6 rounded-xl shadow-lg shadow-primary/25" 
                  disabled={!selectedServiceId} 
                  onClick={() => setStep(2)}
                >
                  {t.continue} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold">{t.step2Title}</h2>
                  <p className="text-muted-foreground mt-1">{t.step2Desc}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-primary" /> {t.taskLocation}
                      </label>
                      <Input 
                        className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10"
                        placeholder={t.taskLocationPlaceholder}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" /> {t.date}
                        </label>
                        <Input 
                          type="date" 
                          className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10"
                          value={date} 
                          onChange={(e) => setDate(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" /> {t.time}
                        </label>
                        <Input 
                          type="time" 
                          className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10"
                          value={time} 
                          onChange={(e) => setTime(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" /> {t.estimatedDuration}
                      </label>
                      <div className="relative">
                        <select 
                          className="w-full h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background border focus:border-primary focus:ring-4 focus:ring-primary/10 px-4 appearance-none outline-none font-medium"
                          value={estimatedDuration}
                          onChange={(e) => setEstimatedDuration(e.target.value)}
                        >
                          <option value="1">{t.hour1}</option>
                          <option value="2">{t.hour2}</option>
                          <option value="3">{t.hour3}</option>
                          <option value="4">{t.hour4}</option>
                          <option value="5">{t.hour5}</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                          ▼
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block w-full h-[320px]">
                    <MapComponent address={location || "Enter location to preview..."} />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-10">
                  <Button variant="outline" className="w-1/3 h-14 rounded-xl font-semibold border-2" onClick={() => setStep(1)}>{t.back}</Button>
                  <Button className="w-2/3 h-14 text-lg rounded-xl shadow-lg shadow-primary/25" disabled={!location || !date || !time} onClick={() => setStep(3)}>
                    {t.reviewDetails} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold">{t.step3Title}</h2>
                  <p className="text-muted-foreground mt-1">{t.step3Desc}</p>
                </div>
                
                <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-blue-500/10 border-2 border-primary/20 rounded-3xl p-8 text-center shadow-inner">
                  {/* Decorative blur inside card */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10 translate-x-1/2 -translate-y-1/2" />
                  
                  <div className="inline-flex items-center justify-center p-3 bg-background rounded-2xl shadow-sm mb-4 border border-white/10">
                    <span className="font-semibold">{translateServiceName(selectedService?.name)}</span>
                    <span className="mx-3 text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{estimatedDuration} {t.hourSuffix}</span>
                  </div>
                  
                  {selectedService?.name === "Custom Task" && (
                    <div className="mb-6 max-w-xs mx-auto">
                      <label className="text-sm font-semibold mb-2 block">{t.customTaskPrice}</label>
                      <Input 
                        type="number" 
                        min="0"
                        className="h-14 rounded-xl text-center text-xl font-bold bg-background border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        placeholder="৳ 0"
                      />
                    </div>
                  )}

                  <h3 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-b from-primary to-primary/60 mb-2">
                    <span className="text-4xl">৳</span>{estimatedPrice}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mt-4 max-w-xs mx-auto">
                    {t.priceNote(selectedService?.basePrice || 0)}
                  </p>
                </div>
                
                <div className="mt-8 space-y-4 text-left">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" /> {t.paymentMethod}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div 
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary/50' : 'border-muted hover:border-primary/50 bg-card'}`}
                      onClick={() => setPaymentMethod('ONLINE')}
                    >
                      <span className="font-bold text-center">{t.payOnline}</span>
                    </div>
                    <div 
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${paymentMethod === 'COD' ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary/50' : 'border-muted hover:border-primary/50 bg-card'}`}
                      onClick={() => setPaymentMethod('COD')}
                    >
                      <span className="font-bold text-center">{t.payCOD}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-10">
                  <Button variant="outline" className="w-1/3 h-14 rounded-xl font-semibold border-2" onClick={() => setStep(2)}>{t.back}</Button>
                  <Button className="w-2/3 h-14 text-lg rounded-xl shadow-lg shadow-primary/25" onClick={() => setStep(4)}>
                    {t.findHelpers} <Sparkles className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-medium flex items-start gap-3">
                    <span className="bg-destructive/20 p-1 rounded-full"><Activity className="w-4 h-4" /></span>
                    {error}
                  </motion.div>
                )}
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{t.step4Title}</h2>
                    <p className="text-muted-foreground text-sm">{t.step4Desc}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-xs font-bold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    {t.live}
                  </div>
                </div>
                
                <div className="space-y-4 relative">
                  {/* Helper Card - Premium UI */}
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="relative overflow-hidden border-2 border-primary/20 bg-background/50 backdrop-blur-sm rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-lg shadow-primary/5"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    
                    <div className="flex gap-4 items-center w-full">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-background shadow-md overflow-hidden shrink-0 z-10 relative">
                          <img src="https://i.pravatar.cc/150?u=rahim" alt="Rahim" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-background rounded-full z-20" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between sm:justify-start gap-2 mb-1">
                          <h4 className="font-bold text-lg flex items-center gap-1">Rahim <ShieldCheck className="w-5 h-5 text-blue-500" /></h4>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase tracking-wider hidden sm:inline-block">{t.topRated}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1 font-medium text-foreground"><span className="text-yellow-500">★</span> 4.9</span>
                          <span>•</span>
                          <span>127 {t.completed}</span>
                          <span>•</span>
                          <span>1.2 km {t.away}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleBook} disabled={isBooking} className="w-full sm:w-auto h-12 px-8 rounded-xl shrink-0 shadow-md shadow-primary/20">
                      {isBooking ? <Loader2 className="w-5 h-5 animate-spin" /> : t.request}
                    </Button>
                  </motion.div>
                </div>

                <div className="flex items-center gap-4 py-8">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{t.orAutoMatch}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <Button 
                  className="w-full h-14 text-lg rounded-xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-foreground shadow-none" 
                  variant="outline" 
                  onClick={handleBook} 
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" /> {t.autoMatchBtn}
                    </span>
                  )}
                </Button>
                
                <div className="mt-6 text-center">
                  <Button variant="link" className="text-muted-foreground" onClick={() => setStep(3)}>
                    {t.goBack}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function BookHelper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
      <BookHelperContent />
    </Suspense>
  );
}

