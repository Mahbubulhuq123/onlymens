import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, ShieldCheck } from "lucide-react";
import { cookies } from "next/headers";

export default async function BecomeHelperPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";

  const t = {
    heroTitle1: lang === "en" ? "Turn your free time into " : "আপনার অবসর সময়কে পরিণত করুন ",
    heroTitle2: lang === "en" ? "earnings" : "উপার্জনে",
    heroDesc: lang === "en" ? "Join OnlyMen as a verified helper in Dhaka. Earn money by helping people in your local area with everyday tasks." : "ঢাকায় যাচাইকৃত সাহায্যকারী হিসেবে অনলিমেনে যোগ দিন। আপনার এলাকার মানুষদের দৈনন্দিন কাজে সাহায্য করে অর্থ উপার্জন করুন।",
    applyBtn: lang === "en" ? "Apply to be a Helper" : "সাহায্যকারী হিসেবে আবেদন করুন",
    whyJoin: lang === "en" ? "Why join OnlyMen?" : "অনলিমেনে কেন যোগ দেবেন?",
    payTitle: lang === "en" ? "Great Pay" : "চমৎকার উপার্জন",
    payDesc: lang === "en" ? "Keep 80% of what you charge. You are paid securely through the app directly to your bKash or Nagad." : "আপনার উপার্জনের ৮০% আপনারই থাকবে। অ্যাপের মাধ্যমে বিকাশ বা নগদে নিরাপদে পেমেন্ট পাবেন।",
    flexTitle: lang === "en" ? "Flexible Hours" : "সুবিধাজনক সময়",
    flexDesc: lang === "en" ? "Work when you want. Simply toggle \"Go Online\" in your dashboard to start receiving nearby jobs." : "ইচ্ছেমতো কাজ করুন। ড্যাশবোর্ডে শুধু \"Go Online\" চালু করলেই আশেপাশের কাজ পাওয়া শুরু করবেন।",
    safeTitle: lang === "en" ? "Safe & Secure" : "নিরাপদ ও সুরক্ষিত",
    safeDesc: lang === "en" ? "We verify all customers and track active jobs with GPS for your peace of mind." : "আমরা সকল গ্রাহককে যাচাই করি এবং আপনার নিশ্চিন্তের জন্য জিপিএসের মাধ্যমে সক্রিয় কাজ ট্র্যাক করি।",
    howTitle: lang === "en" ? "How to get started" : "কীভাবে শুরু করবেন",
    step1Title: lang === "en" ? "Register and Create a Profile" : "নিবন্ধন করুন এবং প্রোফাইল তৈরি করুন",
    step1Desc: lang === "en" ? "Sign up with your basic details and let us know what kind of tasks you want to help with." : "প্রাথমিক তথ্য দিয়ে সাইন আপ করুন এবং আপনি কোন ধরনের কাজে সাহায্য করতে চান তা আমাদের জানান।",
    step2Title: lang === "en" ? "Submit NID & Verify" : "এনআইডি জমা দিন এবং যাচাই করুন",
    step2Desc: lang === "en" ? "Upload your NID and a live selfie. For safety, every helper must be verified before accepting jobs." : "আপনার এনআইডি এবং সরাসরি তোলা সেলফি আপলোড করুন। নিরাপত্তার জন্য, কাজ গ্রহণের আগে প্রতিটি সাহায্যকারীকে যাচাই করা হয়।",
    step3Title: lang === "en" ? "Start Earning" : "উপার্জন শুরু করুন",
    step3Desc: lang === "en" ? "Once approved, go online in the app. Accept jobs near you and get paid!" : "অনুমোদিত হওয়ার পর, অ্যাপে অনলাইন হোন। আপনার আশেপাশের কাজ গ্রহণ করুন এবং উপার্জন করুন!",
    signupBtn: lang === "en" ? "Sign Up Now" : "এখুনি সাইন আপ করুন"
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="bg-primary/5 py-24">
        <div className="container mx-auto px-4 max-w-5xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            {t.heroTitle1} <span className="text-primary">{t.heroTitle2}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.heroDesc}
          </p>
          <div className="pt-6">
            <Link href="/register" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-lg rounded-full" })}>
              {t.applyBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">{t.whyJoin}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="text-center">
                <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>{t.payTitle}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                {t.payDesc}
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="text-center">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>{t.flexTitle}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                {t.flexDesc}
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="text-center">
                <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>{t.safeTitle}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                {t.safeDesc}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-secondary/30 py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">{t.howTitle}</h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shrink-0">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">{t.step1Title}</h3>
                <p className="text-muted-foreground">{t.step1Desc}</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shrink-0">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">{t.step2Title}</h3>
                <p className="text-muted-foreground">{t.step2Desc}</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shrink-0">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2">{t.step3Title}</h3>
                <p className="text-muted-foreground">{t.step3Desc}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
             <Link href="/register" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-lg rounded-full" })}>
              {t.signupBtn}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
