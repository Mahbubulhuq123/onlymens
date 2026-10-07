import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LegalPage, type LegalContent } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service | OnlyMen",
  description:
    "The rules and conditions for using OnlyMen — Bangladesh's on-demand hourly helper marketplace — as a customer or helper.",
};

const en: LegalContent = {
  badge: "Legal",
  title: "Terms of Service",
  intro:
    "These terms govern your use of OnlyMen. By creating an account or making a booking, you agree to the conditions below.",
  updatedLabel: "Last updated",
  updated: "October 7, 2026",
  tocLabel: "On this page",
  sections: [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      paragraphs: [
        "By accessing or using OnlyMen (the \"Platform\"), you confirm that you are at least 18 years old and agree to these Terms and our Privacy Policy. If you do not agree, please do not use the Platform.",
      ],
    },
    {
      id: "platform-role",
      title: "Our Role",
      paragraphs: [
        "OnlyMen is a marketplace that connects customers with independent helpers for hourly tasks. Helpers are independent service providers, not employees of OnlyMen. We facilitate bookings, payments, and communication, but we do not directly perform the services.",
      ],
    },
    {
      id: "accounts",
      title: "Accounts",
      bullets: [
        "You must provide accurate, current, and complete information.",
        "You are responsible for keeping your password secure and for all activity on your account.",
        "One person may not maintain multiple accounts of the same type.",
        "We may suspend accounts that provide false information or violate these Terms.",
      ],
    },
    {
      id: "customers",
      title: "Customer Responsibilities",
      bullets: [
        "Describe tasks honestly and provide a safe working environment.",
        "Be present or reachable at the booked address and time.",
        "Do not request illegal, hazardous, or out-of-scope work.",
        "Treat helpers with respect — harassment of any kind is not tolerated.",
      ],
    },
    {
      id: "helpers",
      title: "Helper Responsibilities",
      bullets: [
        "Complete NID verification before accepting jobs.",
        "Arrive on time, perform tasks professionally, and keep location sharing on during active jobs.",
        "Do not solicit customers to pay or book outside the Platform.",
        "Maintain a respectful, safe, and honest conduct at all times.",
      ],
    },
    {
      id: "payments",
      title: "Bookings, Payments & Fees",
      paragraphs: [
        "Prices are shown at the time of booking and are based on the hourly rate and duration. Payments are processed securely through our payment partner (SSLCommerz) or other supported methods.",
      ],
      bullets: [
        "OnlyMen charges a service fee, which is shown before you confirm a booking.",
        "Helpers receive their earnings minus the platform commission after job completion.",
        "Extra time beyond the booked duration is billed at the same hourly rate when agreed by both parties.",
      ],
    },
    {
      id: "cancellations",
      title: "Cancellations & Refunds",
      bullets: [
        "Customers may cancel free of charge until a helper accepts the booking.",
        "Cancellations after acceptance may incur a cancellation fee.",
        "If a helper does not show up, you are eligible for a full refund.",
        "Refunds are returned to the original payment method within 7–10 business days.",
      ],
    },
    {
      id: "reviews",
      title: "Reviews & Content",
      paragraphs: [
        "Reviews must be honest and based on genuine experiences. We may remove content that is abusive, misleading, discriminatory, or violates the law. By posting content, you grant OnlyMen a non-exclusive license to display it on the Platform.",
      ],
    },
    {
      id: "prohibited",
      title: "Prohibited Activities",
      bullets: [
        "Fraud, impersonation, or providing false verification documents.",
        "Harassment, threats, or discrimination against any user.",
        "Bypassing Platform payments or fees.",
        "Attempting to hack, scrape, or disrupt the Platform.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      paragraphs: [
        "To the maximum extent permitted by law, OnlyMen is not liable for indirect or consequential damages arising from services performed by helpers. Our total liability for any claim is limited to the amount you paid for the booking in question. We nevertheless investigate every safety report and support users in resolving disputes.",
      ],
    },
    {
      id: "termination",
      title: "Suspension & Termination",
      paragraphs: [
        "You may close your account at any time. We may suspend or terminate access if you breach these Terms, create risk for other users, or as required by law.",
      ],
    },
    {
      id: "governing-law",
      title: "Governing Law",
      paragraphs: [
        "These Terms are governed by the laws of the People's Republic of Bangladesh. Any disputes shall be subject to the exclusive jurisdiction of the courts of Dhaka.",
      ],
    },
    {
      id: "changes",
      title: "Changes to These Terms",
      paragraphs: [
        "We may revise these Terms from time to time. Continued use of the Platform after changes take effect means you accept the updated Terms.",
      ],
    },
  ],
  contactTitle: "Have a question about these terms?",
  contactDesc: "Email us at support@onlymen.com.bd or reach out through our contact page — we're happy to help.",
  contactCta: "Contact Us",
  relatedLabel: "Privacy Policy",
  relatedHref: "/privacy",
};

const bn: LegalContent = {
  badge: "আইনি",
  title: "ব্যবহারের শর্তাবলী",
  intro:
    "এই শর্তাবলী অনলিমেন ব্যবহারের নিয়ম নির্ধারণ করে। অ্যাকাউন্ট তৈরি বা বুকিং করার মাধ্যমে আপনি নিচের শর্তগুলোতে সম্মত হচ্ছেন।",
  updatedLabel: "সর্বশেষ হালনাগাদ",
  updated: "৭ অক্টোবর, ২০২৬",
  tocLabel: "এই পৃষ্ঠায়",
  sections: [
    {
      id: "acceptance",
      title: "শর্তাবলী গ্রহণ",
      paragraphs: [
        "অনলিমেন (\"প্ল্যাটফর্ম\") ব্যবহার করে আপনি নিশ্চিত করছেন যে আপনার বয়স কমপক্ষে ১৮ বছর এবং আপনি এই শর্তাবলী ও আমাদের গোপনীয়তা নীতিতে সম্মত। সম্মত না হলে অনুগ্রহ করে প্ল্যাটফর্ম ব্যবহার করবেন না।",
      ],
    },
    {
      id: "platform-role",
      title: "আমাদের ভূমিকা",
      paragraphs: [
        "অনলিমেন একটি মার্কেটপ্লেস যা গ্রাহকদের ঘণ্টাভিত্তিক কাজের জন্য স্বাধীন সাহায্যকারীদের সাথে যুক্ত করে। সাহায্যকারীরা স্বাধীন সেবা প্রদানকারী, অনলিমেনের কর্মচারী নন। আমরা বুকিং, পেমেন্ট ও যোগাযোগে সহায়তা করি, তবে সরাসরি সেবা প্রদান করি না।",
      ],
    },
    {
      id: "accounts",
      title: "অ্যাকাউন্ট",
      bullets: [
        "আপনাকে সঠিক, হালনাগাদ ও সম্পূর্ণ তথ্য দিতে হবে।",
        "পাসওয়ার্ড সুরক্ষিত রাখা এবং অ্যাকাউন্টের সব কার্যকলাপের দায়িত্ব আপনার।",
        "একজন ব্যক্তি একই ধরনের একাধিক অ্যাকাউন্ট রাখতে পারবেন না।",
        "মিথ্যা তথ্য দিলে বা শর্ত ভঙ্গ করলে অ্যাকাউন্ট স্থগিত করা হতে পারে।",
      ],
    },
    {
      id: "customers",
      title: "গ্রাহকের দায়িত্ব",
      bullets: [
        "কাজের সঠিক বিবরণ দিন এবং নিরাপদ কর্মপরিবেশ নিশ্চিত করুন।",
        "বুক করা ঠিকানা ও সময়ে উপস্থিত বা যোগাযোগযোগ্য থাকুন।",
        "অবৈধ, ঝুঁকিপূর্ণ বা নির্ধারিত সীমার বাইরের কাজের অনুরোধ করবেন না।",
        "সাহায্যকারীদের সম্মান করুন — যেকোনো ধরনের হয়রানি বরদাস্ত করা হবে না।",
      ],
    },
    {
      id: "helpers",
      title: "সাহায্যকারীর দায়িত্ব",
      bullets: [
        "কাজ গ্রহণের আগে এনআইডি যাচাই সম্পন্ন করুন।",
        "সময়মতো পৌঁছান, পেশাদারিত্বের সাথে কাজ করুন এবং অ্যাক্টিভ জবের সময় লোকেশন শেয়ারিং চালু রাখুন।",
        "প্ল্যাটফর্মের বাইরে পেমেন্ট বা বুকিংয়ের জন্য গ্রাহককে প্রলুব্ধ করবেন না।",
        "সর্বদা সম্মানজনক, নিরাপদ ও সৎ আচরণ বজায় রাখুন।",
      ],
    },
    {
      id: "payments",
      title: "বুকিং, পেমেন্ট ও ফি",
      paragraphs: [
        "বুকিংয়ের সময় ঘণ্টাপ্রতি রেট ও মেয়াদের ভিত্তিতে মূল্য দেখানো হয়। পেমেন্ট আমাদের পেমেন্ট সহযোগী (SSLCommerz) বা অন্যান্য সমর্থিত মাধ্যমে নিরাপদে প্রক্রিয়া করা হয়।",
      ],
      bullets: [
        "অনলিমেন একটি সার্ভিস ফি নেয়, যা বুকিং নিশ্চিত করার আগে দেখানো হয়।",
        "কাজ শেষে প্ল্যাটফর্ম কমিশন বাদে সাহায্যকারী তার উপার্জন পান।",
        "উভয় পক্ষ সম্মত হলে নির্ধারিত সময়ের অতিরিক্ত সময় একই ঘণ্টাপ্রতি রেটে বিল করা হয়।",
      ],
    },
    {
      id: "cancellations",
      title: "বাতিলকরণ ও রিফান্ড",
      bullets: [
        "সাহায্যকারী বুকিং গ্রহণের আগ পর্যন্ত গ্রাহক বিনামূল্যে বাতিল করতে পারবেন।",
        "গ্রহণের পর বাতিল করলে বাতিলকরণ ফি প্রযোজ্য হতে পারে।",
        "সাহায্যকারী উপস্থিত না হলে আপনি সম্পূর্ণ রিফান্ড পাবেন।",
        "রিফান্ড ৭–১০ কর্মদিবসের মধ্যে মূল পেমেন্ট মাধ্যমে ফেরত দেওয়া হয়।",
      ],
    },
    {
      id: "reviews",
      title: "রিভিউ ও কনটেন্ট",
      paragraphs: [
        "রিভিউ অবশ্যই সৎ ও প্রকৃত অভিজ্ঞতার ভিত্তিতে হতে হবে। অপমানজনক, বিভ্রান্তিকর, বৈষম্যমূলক বা আইনবিরোধী কনটেন্ট আমরা সরিয়ে ফেলতে পারি। কনটেন্ট পোস্ট করে আপনি অনলিমেনকে তা প্ল্যাটফর্মে প্রদর্শনের অ-একচেটিয়া অনুমতি দিচ্ছেন।",
      ],
    },
    {
      id: "prohibited",
      title: "নিষিদ্ধ কার্যকলাপ",
      bullets: [
        "প্রতারণা, ছদ্মবেশ ধারণ বা মিথ্যা যাচাইকরণ নথি প্রদান।",
        "যেকোনো ব্যবহারকারীকে হয়রানি, হুমকি বা বৈষম্য।",
        "প্ল্যাটফর্মের পেমেন্ট বা ফি এড়িয়ে যাওয়া।",
        "প্ল্যাটফর্ম হ্যাক, স্ক্র্যাপ বা ব্যাহত করার চেষ্টা।",
      ],
    },
    {
      id: "liability",
      title: "দায়বদ্ধতার সীমা",
      paragraphs: [
        "আইনের অনুমোদিত সর্বোচ্চ সীমা পর্যন্ত, সাহায্যকারীদের প্রদত্ত সেবা থেকে উদ্ভূত পরোক্ষ ক্ষতির জন্য অনলিমেন দায়ী নয়। যেকোনো দাবির ক্ষেত্রে আমাদের মোট দায় সংশ্লিষ্ট বুকিংয়ে আপনার পরিশোধিত অর্থের মধ্যে সীমাবদ্ধ। তবুও আমরা প্রতিটি নিরাপত্তা অভিযোগ তদন্ত করি এবং বিরোধ নিষ্পত্তিতে সহায়তা করি।",
      ],
    },
    {
      id: "termination",
      title: "স্থগিতকরণ ও বাতিল",
      paragraphs: [
        "আপনি যেকোনো সময় অ্যাকাউন্ট বন্ধ করতে পারেন। শর্ত ভঙ্গ, অন্য ব্যবহারকারীদের জন্য ঝুঁকি সৃষ্টি বা আইনি প্রয়োজনে আমরা অ্যাক্সেস স্থগিত বা বাতিল করতে পারি।",
      ],
    },
    {
      id: "governing-law",
      title: "প্রযোজ্য আইন",
      paragraphs: [
        "এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের আইন দ্বারা পরিচালিত। যেকোনো বিরোধ ঢাকার আদালতের একচেটিয়া এখতিয়ারাধীন থাকবে।",
      ],
    },
    {
      id: "changes",
      title: "শর্তাবলীর পরিবর্তন",
      paragraphs: [
        "আমরা সময়ে সময়ে এই শর্তাবলী সংশোধন করতে পারি। পরিবর্তন কার্যকর হওয়ার পর প্ল্যাটফর্ম ব্যবহার অব্যাহত রাখলে আপনি হালনাগাদ শর্তাবলী মেনে নিয়েছেন বলে গণ্য হবে।",
      ],
    },
  ],
  contactTitle: "শর্তাবলী নিয়ে প্রশ্ন আছে?",
  contactDesc: "support@onlymen.com.bd ঠিকানায় ইমেইল করুন অথবা যোগাযোগ পৃষ্ঠার মাধ্যমে আমাদের সাথে যোগাযোগ করুন।",
  contactCta: "যোগাযোগ করুন",
  relatedLabel: "গোপনীয়তা নীতি",
  relatedHref: "/privacy",
};

export default async function TermsPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";
  return <LegalPage content={lang === "bn" ? bn : en} />;
}
