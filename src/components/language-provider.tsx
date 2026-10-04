"use client";

import React, { createContext, useContext } from "react";

type Language = "en" | "bn";

const LanguageContext = createContext<Language>("en");

export function LanguageProvider({ 
  children, 
  lang 
}: { 
  children: React.ReactNode; 
  lang: Language;
}) {
  return (
    <LanguageContext.Provider value={lang}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
