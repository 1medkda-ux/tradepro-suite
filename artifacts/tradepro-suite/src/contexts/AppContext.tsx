import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, translations, Translations } from "@/lib/i18n";

type Theme = "dark" | "light";

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  dir: "ltr" | "rtl";
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("tradepro-theme");
    return (saved as Theme) || "dark";
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("tradepro-language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("tradepro-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("tradepro-language", language);
  }, [language]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = translations[language];
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, setLanguage, t, dir }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
