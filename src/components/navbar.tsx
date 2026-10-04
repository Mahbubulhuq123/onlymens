import * as React from "react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { getServerSession } from "next-auth/next";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "./logout-button";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import NotificationBell from "./NotificationBell";
import { MobileMenu } from "./mobile-menu";

export async function Navbar() {
  const session = await getServerSession(authOptions);
  
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "bn" ? "bn" : "en";

  const t = {
    services: lang === "en" ? "Services" : "সেবা সমূহ",
    howItWorks: lang === "en" ? "How it Works" : "কিভাবে কাজ করে",
    becomeHelper: lang === "en" ? "Become a Helper" : "সাহায্যকারী হোন",
    dashboard: lang === "en" ? "Dashboard" : "ড্যাশবোর্ড",
    login: lang === "en" ? "Log in" : "লগ ইন",
    signup: lang === "en" ? "Sign Up" : "সাইন আপ",
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tighter text-primary">OnlyMen</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/services" className="transition-colors hover:text-foreground/80 text-foreground/60">{t.services}</Link>
          <Link href="/how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60">{t.howItWorks}</Link>
          <Link href="/become-a-helper" className="transition-colors hover:text-foreground/80 text-foreground/60">{t.becomeHelper}</Link>
        </nav>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <LanguageToggle currentLang={lang} />
          <ThemeToggle />
          {session?.user ? (
            <>
              <NotificationBell />
              <Link 
                href="/customer/dashboard" 
                className={buttonVariants({ variant: "ghost" })}
              >
                {t.dashboard}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex" })}
              >
                {t.login}
              </Link>
              <Link 
                href="/register" 
                className={buttonVariants()}
              >
                {t.signup}
              </Link>
            </>
          )}
          <MobileMenu t={{ services: t.services, howItWorks: t.howItWorks, becomeHelper: t.becomeHelper }} />
        </div>
      </div>
    </header>
  );
}
