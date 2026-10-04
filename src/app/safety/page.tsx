import { cookies } from "next/headers";

export default async function SafetyPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";
  const t = {
    title: lang === "en" ? "Trust & Safety" : "আস্থা এবং নিরাপত্তা",
    desc: lang === "en" ? "Your safety is our top priority. Every helper undergoes strict NID verification. We track all active bookings via GPS, and we maintain a zero-tolerance policy for unsafe behavior." : "আপনার নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার। প্রতিটি সাহায্যকারীকে কঠোর এনআইডি যাচাইয়ের মধ্য দিয়ে যেতে হয়। আমরা জিপিএস এর মাধ্যমে সব অ্যাক্টিভ বুকিং ট্র্যাক করি এবং অনিরাপদ আচরণের ক্ষেত্রে জিরো-টলারেন্স নীতি বজায় রাখি।"
  };
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl text-center">
      <h1 className="text-4xl font-bold mb-6">{t.title}</h1>
      <p className="text-lg text-muted-foreground">{t.desc}</p>
    </div>
  );
}
