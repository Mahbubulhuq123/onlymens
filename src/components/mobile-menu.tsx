"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { signOut } from "next-auth/react";

interface MobileMenuProps {
  t: {
    services: string;
    howItWorks: string;
    becomeHelper: string;
    dashboard: string;
    login: string;
    signup: string;
  };
  session?: any;
}

export function MobileMenu({ t, session }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden flex items-center">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && mounted && document.body ? createPortal(
        <div className="fixed inset-0 z-100 flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 transition-opacity" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar */}
          <div 
            className="relative z-101 w-72 h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-2xl font-bold tracking-tighter text-primary">OnlyMen</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <nav className="flex flex-col gap-6 text-lg font-medium">
              <Link 
                href="/services" 
                className="transition-colors hover:text-primary text-zinc-900 dark:text-zinc-100"
                onClick={() => setIsOpen(false)}
              >
                {t.services}
              </Link>
              <Link 
                href="/how-it-works" 
                className="transition-colors hover:text-primary text-zinc-900 dark:text-zinc-100"
                onClick={() => setIsOpen(false)}
              >
                {t.howItWorks}
              </Link>
              <Link 
                href="/become-a-helper" 
                className="transition-colors hover:text-primary text-zinc-900 dark:text-zinc-100"
                onClick={() => setIsOpen(false)}
              >
                {t.becomeHelper}
              </Link>
              {session?.user ? (
                <>
                  <Link 
                    href="/customer/dashboard" 
                    className="transition-colors hover:text-primary text-zinc-900 dark:text-zinc-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {t.dashboard}
                  </Link>
                  <button 
                    onClick={() => { setIsOpen(false); signOut({ callbackUrl: "/" }); }}
                    className="text-left transition-colors hover:text-primary text-zinc-900 dark:text-zinc-100"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="transition-colors hover:text-primary text-zinc-900 dark:text-zinc-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {t.login}
                  </Link>
                  <Link 
                    href="/register" 
                    className="transition-colors hover:text-primary text-zinc-900 dark:text-zinc-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {t.signup}
                  </Link>
                </>
              )}
            </nav>
            
            <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 pt-6 text-sm text-zinc-500 text-center">
              &copy; {new Date().getFullYear()} OnlyMen.
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  );
}
