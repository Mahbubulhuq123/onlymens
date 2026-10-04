import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cookies } from "next/headers";

export default async function HowItWorksPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";

  const t = {
    title: lang === "en" ? "How OnlyMen Works" : "অনলিমেন যেভাবে কাজ করে",
    subtitle: lang === "en" ? "Getting help has never been this easy. See exactly how our platform matches you with the perfect local helper." : "সাহায্য পাওয়া এর আগে কখনও এতো সহজ ছিল না। দেখুন কীভাবে আমাদের প্ল্যাটফর্ম আপনার সাথে নিখুঁত স্থানীয় সাহায্যকারীকে ম্যাচ করিয়ে দেয়।",
    step1Title: lang === "en" ? "Tell us what you need" : "আপনার কী প্রয়োজন তা আমাদের জানান",
    step1Desc: lang === "en" ? "Select from our list of services like Shopping Assistance, Moving Help, or Errands. Enter your location in Dhaka, the date, time, and how long you expect the task to take." : "আমাদের সেবার তালিকা থেকে শপিং সহায়তা, স্থানান্তর বা অন্য যেকোনো কাজ বেছে নিন। ঢাকায় আপনার লোকেশন, তারিখ, সময় এবং কাজ শেষ হতে কতক্ষণ লাগতে পারে তা লিখুন।",
    step1Ui: lang === "en" ? "Service Selection UI" : "সেবা বাছাইকরণ ইউআই",
    step2Title: lang === "en" ? "Get matched instantly" : "সাথে সাথে ম্যাচ হয়ে যান",
    step2Desc: lang === "en" ? "We calculate an upfront estimated price. You can either select a specific verified helper nearby or let us automatically assign the closest available helper to you." : "আমরা অগ্রিম আনুমানিক মূল্য নির্ধারণ করি। আপনি চাইলে কাছাকাছি থাকা নির্দিষ্ট সাহায্যকারী বেছে নিতে পারেন বা আমাদের উপর ছেড়ে দিতে পারেন স্বয়ংক্রিয়ভাবে সাহায্যকারী নির্ধারণ করার জন্য।",
    step2Ui: lang === "en" ? "Matching & Map UI" : "ম্যাচিং এবং ম্যাপ ইউআই",
    step3Title: lang === "en" ? "Track and communicate" : "ট্র্যাক করুন এবং যোগাযোগ করুন",
    step3Desc: lang === "en" ? "Once a helper accepts, track their location in real-time. You can chat or call them securely through the app if you need to provide more details." : "সাহায্যকারী কাজ গ্রহণ করার পর, রিয়েল-টাইমে তার অবস্থান ট্র্যাক করুন। বিস্তারিত কিছু জানানোর জন্য আপনি অ্যাপের মাধ্যমে নিরাপদে চ্যাট বা কল করতে পারেন।",
    step3Ui: lang === "en" ? "Active Booking & Chat UI" : "অ্যাক্টিভ বুকিং এবং চ্যাট ইউআই",
    step4Title: lang === "en" ? "Complete and pay" : "কাজ সম্পূর্ণ করুন এবং পেমেন্ট দিন",
    step4Desc: lang === "en" ? "When the job is done, the helper marks it complete. Payment is processed securely through bKash, Nagad, or Card. Don't forget to leave a review!" : "কাজ শেষ হলে, সাহায্যকারী সেটি সম্পূর্ণ হিসেবে মার্ক করে। পেমেন্ট বিকাশ, নগদ বা কার্ডের মাধ্যমে নিরাপদে পরিশোধ করা হয়। রিভিউ দিতে ভুলবেন না!",
    step4Ui: lang === "en" ? "Payment & Review UI" : "পেমেন্ট এবং রিভিউ ইউআই",
    readyTitle: lang === "en" ? "Ready to get started?" : "শুরু করতে প্রস্তুত?",
    bookNow: lang === "en" ? "Book a Helper Now" : "এখনই সাহায্যকারী বুক করুন"
  };

  return (
    <div className="flex flex-col flex-1">
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            {t.title}
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-24">
            
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl mb-6">1</div>
                <h2 className="text-3xl font-bold mb-4">{t.step1Title}</h2>
                <p className="text-lg text-muted-foreground">{t.step1Desc}</p>
              </div>
              <div className="w-full md:w-1/2 bg-muted rounded-2xl h-75 border shadow-sm flex items-center justify-center">
                <span className="text-muted-foreground font-medium">{t.step1Ui}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="w-full md:w-1/2">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl mb-6">2</div>
                <h2 className="text-3xl font-bold mb-4">{t.step2Title}</h2>
                <p className="text-lg text-muted-foreground">{t.step2Desc}</p>
              </div>
              <div className="w-full md:w-1/2 bg-muted rounded-2xl h-75 border shadow-sm flex items-center justify-center">
                <span className="text-muted-foreground font-medium">{t.step2Ui}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl mb-6">3</div>
                <h2 className="text-3xl font-bold mb-4">{t.step3Title}</h2>
                <p className="text-lg text-muted-foreground">{t.step3Desc}</p>
              </div>
              <div className="w-full md:w-1/2 bg-muted rounded-2xl h-75 border shadow-sm flex items-center justify-center">
                <span className="text-muted-foreground font-medium">{t.step3Ui}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="w-full md:w-1/2">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl mb-6">4</div>
                <h2 className="text-3xl font-bold mb-4">{t.step4Title}</h2>
                <p className="text-lg text-muted-foreground">{t.step4Desc}</p>
              </div>
              <div className="w-full md:w-1/2 bg-muted rounded-2xl h-75 border shadow-sm flex items-center justify-center">
                <span className="text-muted-foreground font-medium">{t.step4Ui}</span>
              </div>
            </div>

          </div>
          
          <div className="mt-24 text-center border-t pt-16">
            <h3 className="text-2xl font-bold mb-6">{t.readyTitle}</h3>
            <Link href="/customer/book" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-lg rounded-full" })}>
              {t.bookNow}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
