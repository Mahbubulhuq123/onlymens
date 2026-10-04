import Link from "next/link";
import { cookies } from "next/headers";

export async function Footer() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";

  const t = {
    description: lang === "en" ? "The on-demand hourly helper marketplace for your everyday tasks in Bangladesh." : "বাংলাদেশে আপনার দৈনন্দিন কাজের জন্য অন-ডিমান্ড ঘণ্টাভিত্তিক সাহায্যকারী মার্কেটপ্লেস।",
    forCustomers: lang === "en" ? "For Customers" : "গ্রাহকদের জন্য",
    browseServices: lang === "en" ? "Browse Services" : "সেবা সমূহ দেখুন",
    howItWorks: lang === "en" ? "How it Works" : "কিভাবে কাজ করে",
    trustSafety: lang === "en" ? "Trust & Safety" : "আস্থা এবং নিরাপত্তা",
    faq: lang === "en" ? "FAQ" : "সাধারণ জিজ্ঞাসা",
    forHelpers: lang === "en" ? "For Helpers" : "সাহায্যকারীদের জন্য",
    becomeHelper: lang === "en" ? "Become a Helper" : "সাহায্যকারী হোন",
    helperGuidelines: lang === "en" ? "Helper Guidelines" : "সাহায্যকারী নির্দেশিকা",
    earningsPayments: lang === "en" ? "Earnings & Payments" : "উপার্জন এবং পেমেন্ট",
    company: lang === "en" ? "Company" : "কোম্পানি",
    aboutUs: lang === "en" ? "About Us" : "আমাদের সম্পর্কে",
    contact: lang === "en" ? "Contact" : "যোগাযোগ",
    privacyPolicy: lang === "en" ? "Privacy Policy" : "গোপনীয়তা নীতি",
    termsOfService: lang === "en" ? "Terms of Service" : "ব্যবহারের শর্তাবলী",
    allRightsReserved: lang === "en" ? "OnlyMen. All rights reserved." : "অনলিমেন। সর্বস্বত্ব সংরক্ষিত।"
  };

  return (
    <footer className="border-t bg-background py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold tracking-tighter text-primary">OnlyMen</h3>
          <p className="text-sm text-muted-foreground">
            {t.description}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">{t.forCustomers}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/services" className="hover:text-foreground">{t.browseServices}</Link></li>
            <li><Link href="/how-it-works" className="hover:text-foreground">{t.howItWorks}</Link></li>
            <li><Link href="/safety" className="hover:text-foreground">{t.trustSafety}</Link></li>
            <li><Link href="/faq" className="hover:text-foreground">{t.faq}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">{t.forHelpers}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/become-a-helper" className="hover:text-foreground">{t.becomeHelper}</Link></li>
            <li><Link href="/helper/guidelines" className="hover:text-foreground">{t.helperGuidelines}</Link></li>
            <li><Link href="/helper/earnings" className="hover:text-foreground">{t.earningsPayments}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">{t.company}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">{t.aboutUs}</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">{t.contact}</Link></li>
            <li><Link href="/privacy" className="hover:text-foreground">{t.privacyPolicy}</Link></li>
            <li><Link href="/terms" className="hover:text-foreground">{t.termsOfService}</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} {t.allRightsReserved}
      </div>
    </footer>
  );
}
