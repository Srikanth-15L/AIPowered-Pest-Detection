"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "English";
    const stored = localStorage.getItem("trinera_language");
    if (stored === "hindi") return "Hindi";
    if (stored === "telugu") return "Telugu";
    return "English";
  });

  const setLanguageWithStorage = (lang: string) => {
    setLanguage(lang);

    // Keep the interbot/live pages in sync (they read this key).
    if (typeof window !== "undefined") {
      const map: Record<string, "english" | "hindi" | "telugu"> = {
        English: "english",
        Hindi: "hindi",
        Telugu: "telugu",
      };
      const stored = map[lang];
      if (stored) localStorage.setItem("trinera_language", stored);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguageWithStorage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
