"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function LanguageToggle({ currentLang = "en" }: { currentLang?: "en" | "bn" }) {
  const router = useRouter()
  
  const toggleLang = () => {
    const nextLang = currentLang === "en" ? "bn" : "en"
    document.cookie = `lang=${nextLang}; path=/; max-age=31536000`
    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLang}
      className="font-bold px-2 w-10"
    >
      {currentLang === "en" ? "BN" : "EN"}
    </Button>
  )
}
