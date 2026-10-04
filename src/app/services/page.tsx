import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Truck, Users, Briefcase, Printer, Coffee, HeartHandshake, HelpCircle } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function ServicesPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";

  const t = {
    title: lang === "en" ? "Our Services" : "আমাদের সেবা সমূহ",
    desc: lang === "en" ? "Find the right helper for your specific needs. All our helpers are verified and ready to assist you." : "আপনার নির্দিষ্ট প্রয়োজনের জন্য সঠিক সাহায্যকারী খুঁজুন। আমাদের সকল সাহায্যকারী যাচাইকৃত এবং আপনাকে সাহায্য করার জন্য প্রস্তুত।",
    bookNow: lang === "en" ? "Book Now" : "বুক করুন",
    services: lang === "en" ? [
      { title: "Shopping Assistance", desc: "Carry bags or assist while shopping in busy markets." },
      { title: "Moving Help", desc: "An extra pair of hands for lifting and moving items." },
      { title: "Queue Assistance", desc: "Wait in line for tickets, banking, or events." },
      { title: "Errands", desc: "Collect or submit documents and packages." },
      { title: "Office Help", desc: "Short-term help with filing, organizing, or simple office tasks." },
      { title: "Event Assistance", desc: "Help with setup, serving, or managing guests at small events." },
      { title: "Elderly Assistance", desc: "Everyday non-medical help for seniors." },
      { title: "Custom Task", desc: "Describe your own legal and safe short-term task." }
    ] : [
      { title: "শপিং সহায়তা", desc: "ব্যস্ত বাজারে শপিং করার সময় ব্যাগ বহন বা সাহায্য করা।" },
      { title: "স্থানান্তর সহায়তা", desc: "জিনিসপত্র তোলা এবং সরানোর জন্য অতিরিক্ত হাতের সাহায্য।" },
      { title: "লাইনে দাঁড়ানোর সাহায্য", desc: "টিকেট, ব্যাংকিং বা ইভেন্টের জন্য লাইনে অপেক্ষা করা।" },
      { title: "ছোটখাটো কাজ", desc: "দলিল বা প্যাকেজ সংগ্রহ এবং জমা দেওয়া।" },
      { title: "অফিসের কাজ", desc: "ফাইলিং, গোছানো বা ছোটখাটো অফিসিয়াল কাজের জন্য স্বল্পমেয়াদি সাহায্য।" },
      { title: "ইভেন্ট সহায়তা", desc: "ছোট ইভেন্টে সেটআপ, পরিবেশন বা অতিথি ব্যবস্থাপনায় সাহায্য করা।" },
      { title: "বয়স্কদের সহায়তা", desc: "বয়স্কদের জন্য প্রতিদিনের সাধারণ সাহায্য (চিকিৎসা ছাড়া)।" },
      { title: "কাস্টম কাজ", desc: "আপনার নিজের বৈধ ও নিরাপদ স্বল্পমেয়াদি কাজ বর্ণনা করুন।" }
    ]
  };

  const renderIcon = (idx: number) => {
    switch (idx) {
      case 0: return <ShoppingBag className="w-6 h-6" />;
      case 1: return <Truck className="w-6 h-6" />;
      case 2: return <Users className="w-6 h-6" />;
      case 3: return <Briefcase className="w-6 h-6" />;
      case 4: return <Printer className="w-6 h-6" />;
      case 5: return <Coffee className="w-6 h-6" />;
      case 6: return <HeartHandshake className="w-6 h-6" />;
      case 7: return <HelpCircle className="w-6 h-6" />;
      default: return <HelpCircle className="w-6 h-6" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-xl text-muted-foreground">{t.desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {t.services.map((service, idx) => {
          return (
            <Card key={idx} className="hover:border-primary/50 transition-all hover:shadow-md h-full flex flex-col">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {renderIcon(idx)}
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-base mb-6">{service.desc}</CardDescription>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Link href={`/customer/book?serviceName=${encodeURIComponent(service.title)}`} className={buttonVariants({ variant: "outline", className: "w-full" })}>
                  {t.bookNow}
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
