"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const lang = useLanguage();
  const t = {
    welcome: lang === "en" ? "Welcome Back" : "স্বাগতম",
    desc: lang === "en" ? "Sign in to your OnlyMen account to continue" : "চালিয়ে যেতে আপনার অনলিমেন অ্যাকাউন্টে সাইন ইন করুন",
    emailPlaceholder: lang === "en" ? "name@example.com" : "name@example.com",
    passwordPlaceholder: lang === "en" ? "Password" : "পাসওয়ার্ড",
    invalidCreds: lang === "en" ? "Invalid email or password" : "ভুল ইমেইল বা পাসওয়ার্ড",
    unexpectedError: lang === "en" ? "An unexpected error occurred" : "অপ্রত্যাশিত ত্রুটি ঘটেছে",
    signInBtn: lang === "en" ? "Sign In" : "সাইন ইন",
    noAccount: lang === "en" ? "Don't have an account?" : "অ্যাকাউন্ট নেই?",
    createOne: lang === "en" ? "Create one now" : "এখুনি তৈরি করুন"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(t.invalidCreds);
      } else {
        const session = await getSession();
        if (session?.user?.role === "ADMIN") {
          router.push("/admin");
        } else if (session?.user?.role === "HELPER") {
          router.push("/helper/dashboard");
        } else {
          router.push("/customer/dashboard");
        }
        router.refresh();
      }
    } catch (err) {
      setError(t.unexpectedError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card border shadow-2xl rounded-3xl p-8 backdrop-blur-xl bg-opacity-80">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">{t.welcome}</h1>
            <p className="text-muted-foreground">{t.desc}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-4">
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
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-md font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>
                  {t.signInBtn} <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              {t.noAccount}{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                {t.createOne}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
