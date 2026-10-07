import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LegalPage, type LegalContent } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | OnlyMen",
  description:
    "Learn how OnlyMen collects, uses, and protects your personal information when you book or work as a helper in Bangladesh.",
};

const en: LegalContent = {
  badge: "Legal",
  title: "Privacy Policy",
  intro:
    "Your trust matters. This policy explains what information OnlyMen collects, why we collect it, and the choices you have.",
  updatedLabel: "Last updated",
  updated: "October 7, 2026",
  tocLabel: "On this page",
  sections: [
    {
      id: "information-we-collect",
      title: "Information We Collect",
      paragraphs: ["We collect only what we need to run a safe and reliable helper marketplace:"],
      bullets: [
        "Account details — your name, email address, phone number, and password (stored encrypted).",
        "Helper verification — National ID (NID) details and photos submitted for identity checks.",
        "Booking details — service type, address, date, time, duration, and notes you provide.",
        "Location data — approximate or precise location during active bookings, used for job tracking and safety.",
        "Payment information — transaction IDs and status. Card and mobile wallet details are handled by our payment gateway (SSLCommerz) and never stored on our servers.",
        "Messages, reviews, and ratings you exchange on the platform.",
      ],
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      bullets: [
        "To create and manage your account and match customers with helpers.",
        "To process payments, refunds, and helper payouts.",
        "To verify helper identities and keep the community safe.",
        "To send booking updates, notifications, and important service messages.",
        "To resolve disputes, prevent fraud, and enforce our Terms of Service.",
        "To improve our services through aggregated, anonymized analytics.",
      ],
    },
    {
      id: "sharing",
      title: "How We Share Information",
      paragraphs: [
        "We never sell your personal data. We share information only when necessary:",
      ],
      bullets: [
        "Between customers and helpers — limited details (name, booking address, contact) needed to complete a job.",
        "With service providers — payment processing, hosting, and email delivery partners bound by confidentiality.",
        "With authorities — when required by the laws of Bangladesh or to protect someone's safety.",
      ],
    },
    {
      id: "data-security",
      title: "Data Security",
      paragraphs: [
        "We use industry-standard safeguards including encrypted passwords, HTTPS for all traffic, and role-based access controls. No system is 100% secure, but we continuously work to protect your data.",
      ],
    },
    {
      id: "data-retention",
      title: "Data Retention",
      paragraphs: [
        "We keep your information while your account is active and as long as needed to provide services, meet legal and accounting obligations, and resolve disputes. Verification documents are deleted or anonymized when no longer required.",
      ],
    },
    {
      id: "your-rights",
      title: "Your Rights & Choices",
      bullets: [
        "Access and update your profile information at any time from your dashboard.",
        "Request a copy or deletion of your personal data by contacting us.",
        "Opt out of non-essential notifications.",
        "Disable location access in your device settings (some features may not work).",
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      paragraphs: [
        "We use essential cookies to keep you signed in and remember preferences such as language and theme. We do not use cookies for third-party advertising.",
      ],
    },
    {
      id: "children",
      title: "Children's Privacy",
      paragraphs: [
        "OnlyMen is not intended for anyone under 18. We do not knowingly collect personal information from minors.",
      ],
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      paragraphs: [
        "We may update this policy from time to time. If changes are significant, we will notify you by email or through the platform before they take effect.",
      ],
    },
  ],
  contactTitle: "Questions about your privacy?",
  contactDesc: "Reach out to our team at privacy@onlymen.com.bd or through our contact page and we'll respond within 3 business days.",
  contactCta: "Contact Us",
  relatedLabel: "Terms of Service",
  relatedHref: "/terms",
};

const bn: LegalContent = {
  badge: "আইনি",
  title: "গোপনীয়তা নীতি",
  intro:
    "আপনার আস্থা আমাদের কাছে গুরুত্বপূর্ণ। অনলিমেন কী তথ্য সংগ্রহ করে, কেন করে এবং আপনার কী কী পছন্দ রয়েছে — এই নীতিতে তা ব্যাখ্যা করা হয়েছে।",
  updatedLabel: "সর্বশেষ হালনাগাদ",
  updated: "৭ অক্টোবর, ২০২৬",
  tocLabel: "এই পৃষ্ঠায়",
  sections: [
    {
      id: "information-we-collect",
      title: "আমরা যে তথ্য সংগ্রহ করি",
      paragraphs: ["একটি নিরাপদ ও নির্ভরযোগ্য মার্কেটপ্লেস চালাতে আমরা কেবল প্রয়োজনীয় তথ্যই সংগ্রহ করি:"],
      bullets: [
        "অ্যাকাউন্টের তথ্য — নাম, ইমেইল, ফোন নম্বর এবং পাসওয়ার্ড (এনক্রিপ্ট করে সংরক্ষিত)।",
        "সাহায্যকারী যাচাই — পরিচয় যাচাইয়ের জন্য জমা দেওয়া জাতীয় পরিচয়পত্র (এনআইডি) তথ্য ও ছবি।",
        "বুকিং তথ্য — সেবার ধরন, ঠিকানা, তারিখ, সময়, মেয়াদ এবং আপনার দেওয়া নোট।",
        "লোকেশন — অ্যাক্টিভ বুকিং চলাকালীন কাজ ট্র্যাকিং ও নিরাপত্তার জন্য অবস্থান।",
        "পেমেন্ট তথ্য — লেনদেন আইডি ও স্ট্যাটাস। কার্ড ও মোবাইল ওয়ালেটের তথ্য আমাদের পেমেন্ট গেটওয়ে (SSLCommerz) পরিচালনা করে, আমাদের সার্ভারে সংরক্ষণ করা হয় না।",
        "প্ল্যাটফর্মে আদান-প্রদান করা মেসেজ, রিভিউ ও রেটিং।",
      ],
    },
    {
      id: "how-we-use",
      title: "তথ্য যেভাবে ব্যবহার করি",
      bullets: [
        "অ্যাকাউন্ট তৈরি ও পরিচালনা এবং গ্রাহকদের সাথে সাহায্যকারীর সংযোগ ঘটাতে।",
        "পেমেন্ট, রিফান্ড এবং সাহায্যকারীর পেআউট প্রক্রিয়া করতে।",
        "সাহায্যকারীর পরিচয় যাচাই ও কমিউনিটিকে নিরাপদ রাখতে।",
        "বুকিং আপডেট, নোটিফিকেশন ও গুরুত্বপূর্ণ বার্তা পাঠাতে।",
        "বিরোধ নিষ্পত্তি, প্রতারণা প্রতিরোধ এবং শর্তাবলী কার্যকর করতে।",
        "বেনামী ও সমন্বিত বিশ্লেষণের মাধ্যমে সেবার মান উন্নত করতে।",
      ],
    },
    {
      id: "sharing",
      title: "তথ্য যেভাবে শেয়ার করি",
      paragraphs: ["আমরা কখনোই আপনার ব্যক্তিগত তথ্য বিক্রি করি না। কেবল প্রয়োজন হলে শেয়ার করি:"],
      bullets: [
        "গ্রাহক ও সাহায্যকারীর মধ্যে — কাজ সম্পন্ন করতে প্রয়োজনীয় সীমিত তথ্য (নাম, ঠিকানা, যোগাযোগ)।",
        "সেবা প্রদানকারীদের সাথে — পেমেন্ট, হোস্টিং ও ইমেইল সহযোগী, যারা গোপনীয়তা রক্ষায় বাধ্য।",
        "কর্তৃপক্ষের সাথে — বাংলাদেশের আইন অনুযায়ী প্রয়োজন হলে বা কারো নিরাপত্তা রক্ষায়।",
      ],
    },
    {
      id: "data-security",
      title: "তথ্যের নিরাপত্তা",
      paragraphs: [
        "আমরা এনক্রিপ্টেড পাসওয়ার্ড, সব ট্রাফিকে HTTPS এবং রোল-ভিত্তিক অ্যাক্সেস নিয়ন্ত্রণসহ মানসম্মত সুরক্ষা ব্যবস্থা ব্যবহার করি। কোনো সিস্টেমই শতভাগ নিরাপদ নয়, তবে আমরা নিরন্তর আপনার তথ্য সুরক্ষায় কাজ করি।",
      ],
    },
    {
      id: "data-retention",
      title: "তথ্য সংরক্ষণের মেয়াদ",
      paragraphs: [
        "আপনার অ্যাকাউন্ট সক্রিয় থাকা পর্যন্ত এবং সেবা প্রদান, আইনি ও হিসাবরক্ষণ বাধ্যবাধকতা পূরণ ও বিরোধ নিষ্পত্তির জন্য যতদিন প্রয়োজন, ততদিন তথ্য সংরক্ষণ করা হয়। প্রয়োজন শেষে যাচাইকরণ নথি মুছে ফেলা বা বেনামী করা হয়।",
      ],
    },
    {
      id: "your-rights",
      title: "আপনার অধিকার ও পছন্দ",
      bullets: [
        "ড্যাশবোর্ড থেকে যেকোনো সময় প্রোফাইলের তথ্য দেখুন ও হালনাগাদ করুন।",
        "আমাদের সাথে যোগাযোগ করে আপনার তথ্যের কপি বা মুছে ফেলার অনুরোধ করুন।",
        "অপ্রয়োজনীয় নোটিফিকেশন বন্ধ করুন।",
        "ডিভাইস সেটিংস থেকে লোকেশন অ্যাক্সেস বন্ধ করুন (কিছু ফিচার কাজ নাও করতে পারে)।",
      ],
    },
    {
      id: "cookies",
      title: "কুকিজ",
      paragraphs: [
        "আপনাকে সাইন-ইন রাখতে এবং ভাষা ও থিমের মতো পছন্দ মনে রাখতে আমরা প্রয়োজনীয় কুকিজ ব্যবহার করি। তৃতীয় পক্ষের বিজ্ঞাপনের জন্য আমরা কুকিজ ব্যবহার করি না।",
      ],
    },
    {
      id: "children",
      title: "শিশুদের গোপনীয়তা",
      paragraphs: [
        "অনলিমেন ১৮ বছরের কম বয়সীদের জন্য নয়। আমরা জেনেশুনে অপ্রাপ্তবয়স্কদের কোনো ব্যক্তিগত তথ্য সংগ্রহ করি না।",
      ],
    },
    {
      id: "changes",
      title: "নীতিমালার পরিবর্তন",
      paragraphs: [
        "আমরা সময়ে সময়ে এই নীতি হালনাগাদ করতে পারি। বড় কোনো পরিবর্তন হলে কার্যকর হওয়ার আগে ইমেইল বা প্ল্যাটফর্মের মাধ্যমে আপনাকে জানানো হবে।",
      ],
    },
  ],
  contactTitle: "গোপনীয়তা নিয়ে প্রশ্ন আছে?",
  contactDesc: "privacy@onlymen.com.bd ঠিকানায় অথবা যোগাযোগ পৃষ্ঠার মাধ্যমে আমাদের সাথে যোগাযোগ করুন। আমরা ৩ কর্মদিবসের মধ্যে উত্তর দেব।",
  contactCta: "যোগাযোগ করুন",
  relatedLabel: "ব্যবহারের শর্তাবলী",
  relatedHref: "/terms",
};

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";
  return <LegalPage content={lang === "bn" ? bn : en} />;
}
