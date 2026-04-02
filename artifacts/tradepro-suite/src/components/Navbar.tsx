import { Sun, Moon, TrendingUp, Globe } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { theme, toggleTheme, language, setLanguage, t, dir } = useApp();

  const languages: { code: Language; label: string; nativeLabel: string }[] = [
    { code: "en", label: "English", nativeLabel: "EN" },
    { code: "ar", label: "Arabic", nativeLabel: "AR" },
    { code: "fr", label: "French", nativeLabel: "FR" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/30">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight">
              <span className="text-primary">Trade</span>
              <span className="text-foreground">Pro</span>
              <span className="text-muted-foreground font-normal text-sm ml-1">Suite</span>
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    "px-2 py-1 rounded-md text-xs font-medium transition-all duration-200",
                    language === lang.code
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title={lang.label}
                >
                  {lang.nativeLabel}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-lg border border-border",
                "bg-muted hover:bg-accent/10 hover:border-primary/40",
                "transition-all duration-200 text-muted-foreground hover:text-primary"
              )}
              title={theme === "dark" ? t.nav.lightMode : t.nav.darkMode}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
