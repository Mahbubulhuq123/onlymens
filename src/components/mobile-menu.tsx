"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  t: {
    services: string;
    howItWorks: string;
    becomeHelper: string;
  };
}

export function MobileMenu({ t }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100">
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background border-l p-6 shadow-lg sm:max-w-sm flex flex-col h-full animate-in slide-in-from-right">
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
                className="transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {t.services}
              </Link>
              <Link 
                href="/how-it-works" 
                className="transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {t.howItWorks}
              </Link>
              <Link 
                href="/become-a-helper" 
                className="transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {t.becomeHelper}
              </Link>
            </nav>
            
            <div className="mt-auto border-t pt-6 text-sm text-muted-foreground text-center">
              &copy; {new Date().getFullYear()} OnlyMen.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
