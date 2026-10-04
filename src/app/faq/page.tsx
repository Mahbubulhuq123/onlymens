import { cookies } from "next/headers";

export default async function FaqPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";
  const t = {
    title: lang === "en" ? "Frequently Asked Questions" : "সাধারণ জিজ্ঞাসা",
    desc: lang === "en" ? "Find answers to common questions about booking, payments, and becoming a helper on OnlyMen." : "অনলিমেনে বুকিং, পেমেন্ট এবং সাহায্যকারী হওয়ার ব্যাপারে সাধারণ প্রশ্নগুলোর উত্তর খুঁজুন।"
  };
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl text-center">
      <h1 className="text-4xl font-bold mb-6">{t.title}</h1>
      <p className="text-lg text-muted-foreground">{t.desc}</p>
    </div>
  );
}
