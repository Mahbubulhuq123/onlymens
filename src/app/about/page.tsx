import { cookies } from "next/headers";

export default async function AboutPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";
  const t = {
    title: lang === "en" ? "About OnlyMen" : "অনলিমেন সম্পর্কে",
    desc: lang === "en" ? "OnlyMen is Dhaka's premier on-demand hourly helper marketplace. Our mission is to connect people who need an extra pair of hands with trusted, verified locals looking to earn on a flexible schedule." : "অনলিমেন হলো ঢাকার শীর্ষস্থানীয় অন-ডিমান্ড ঘণ্টাভিত্তিক সাহায্যকারী মার্কেটপ্লেস। আমাদের লক্ষ্য হলো যাদের একটু অতিরিক্ত হাতের সাহায্য প্রয়োজন তাদের সাথে নির্ভরযোগ্য এবং যাচাইকৃত স্থানীয় সাহায্যকারীদের যুক্ত করা, যারা সুবিধাজনক সময়ে উপার্জন করতে চান।"
  };
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl text-center">
      <h1 className="text-4xl font-bold mb-6">{t.title}</h1>
      <p className="text-lg text-muted-foreground">{t.desc}</p>
    </div>
  );
}
