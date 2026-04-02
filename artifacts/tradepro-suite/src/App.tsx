import { useState } from "react";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { Navbar } from "@/components/Navbar";
import { Calculator } from "@/pages/Calculator";
import { Journal } from "@/pages/Journal";
import { Brokers } from "@/pages/Brokers";
import { cn } from "@/lib/utils";
import { Calculator as CalcIcon, BookOpen, Building2 } from "lucide-react";

type Tab = "calculator" | "journal" | "brokers";

function AppContent() {
  const { t, dir } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("calculator");

  const tabs = [
    { id: "calculator" as Tab, label: t.tabs.calculator, icon: CalcIcon },
    { id: "journal" as Tab, label: t.tabs.journal, icon: BookOpen },
    { id: "brokers" as Tab, label: t.tabs.brokers, icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <Navbar />

      {/* Tab Navigation */}
      <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 sm:px-6 py-3.5 text-sm font-medium border-b-2 transition-all duration-150",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        {activeTab === "calculator" && <Calculator />}
        {activeTab === "journal" && <Journal />}
        {activeTab === "brokers" && <Brokers />}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-5 border-t border-border mt-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} TradePro Suite. For informational purposes only.
          </p>
          <button
            onClick={() => setActiveTab("brokers")}
            className="text-xs text-muted-foreground/50 hover:text-primary transition-colors duration-200"
          >
            Sponsored by our partners
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
