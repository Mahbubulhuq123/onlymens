import { cookies } from "next/headers";

export default async function ContactPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";
  const t = {
    title: lang === "en" ? "Contact Us" : "যোগাযোগ করুন",
    desc: lang === "en" ? "Need help? Our support team is available 24/7. Email us at support@onlymen.com.bd or call our hotline." : "সাহায্য প্রয়োজন? আমাদের সাপোর্ট টিম ২৪/৭ উপস্থিত। support@onlymen.com.bd এ ইমেইল করুন অথবা আমাদের হটলাইনে কল করুন।"
  };
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl text-center">
      <h1 className="text-4xl font-bold mb-6">{t.title}</h1>
      <p className="text-lg text-muted-foreground">{t.desc}</p>
    </div>
  );
}
