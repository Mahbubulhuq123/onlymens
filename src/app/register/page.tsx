"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const lang = useLanguage();
  const t = {
    title: lang === "en" ? "Create Account" : "অ্যাকাউন্ট তৈরি করুন",
    desc: lang === "en" ? "Join OnlyMen and start exploring our services" : "অনলিমেনে যোগ দিন এবং আমাদের সেবা সমূহ উপভোগ করুন",
    invalidError: lang === "en" ? "Something went wrong" : "কিছু একটা ভুল হয়েছে",
    unexpectedError: lang === "en" ? "An unexpected error occurred" : "অপ্রত্যাশিত ত্রুটি ঘটেছে",
    customerBtn: lang === "en" ? "I'm a Customer" : "আমি একজন গ্রাহক",
    helperBtn: lang === "en" ? "I'm a Helper" : "আমি একজন সাহায্যকারী",
    namePlaceholder: lang === "en" ? "Full Name" : "পুরো নাম",
    emailPlaceholder: lang === "en" ? "name@example.com" : "name@example.com",
    passwordPlaceholder: lang === "en" ? "Create a Password" : "পাসওয়ার্ড তৈরি করুন",
    createBtn: lang === "en" ? "Create Account" : "অ্যাকাউন্ট তৈরি করুন",
    haveAccount: lang === "en" ? "Already have an account?" : "আগে থেকেই অ্যাকাউন্ট আছে?",
    signIn: lang === "en" ? "Sign in here" : "এখানে সাইন ইন করুন"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || t.invalidError);
      }

      // Automatically redirect to login page after successful registration
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || t.unexpectedError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card border shadow-2xl rounded-3xl p-8 backdrop-blur-xl bg-opacity-80">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">{t.title}</h1>
            <p className="text-muted-foreground">{t.desc}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Role Selection */}
              <div className="flex p-1 bg-muted rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole("CUSTOMER")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    role === "CUSTOMER" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.customerBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setRole("HELPER")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    role === "HELPER" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.helperBtn}
                </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder={t.namePlaceholder}
                  className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-transparent focus:border-primary focus:bg-background rounded-xl outline-none transition-all duration-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-transparent focus:border-primary focus:bg-background rounded-xl outline-none transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  placeholder={t.passwordPlaceholder}
                  className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-transparent focus:border-primary focus:bg-background rounded-xl outline-none transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-md font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>
                  {t.createBtn} <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              {t.haveAccount}{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                {t.signIn}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
