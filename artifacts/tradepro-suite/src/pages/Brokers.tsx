import { ExternalLink, TrendingUp, DollarSign, Zap, Shield, Star, Award } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

interface BrokerCard {
  name: string;
  tagline: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface PropFirmCard {
  name: string;
  tagline: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export function Brokers() {
  const { t, dir } = useApp();

  const brokers: BrokerCard[] = [
    {
      name: "Exness",
      tagline: t.brokers.topBrokers === "Top Brokers" ? "Best for beginners" :
               t.brokers.topBrokers === "أفضل الوسطاء" ? "الأفضل للمبتدئين" : "Idéal pour les débutants",
      url: "https://exness.com",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10 border-emerald-500/30",
    },
    {
      name: "XM",
      tagline: t.brokers.topBrokers === "Top Brokers" ? "Best bonus offers" :
               t.brokers.topBrokers === "أفضل الوسطاء" ? "أفضل عروض المكافآت" : "Meilleures offres de bonus",
      url: "https://xm.com",
      icon: <Star className="w-5 h-5" />,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/30",
    },
    {
      name: "ICMarkets",
      tagline: t.brokers.topBrokers === "Top Brokers" ? "Best for scalpers" :
               t.brokers.topBrokers === "أفضل الوسطاء" ? "الأفضل للمضاربين" : "Idéal pour les scalpers",
      url: "https://icmarkets.com",
      icon: <Zap className="w-5 h-5" />,
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-500/10 border-violet-500/30",
    },
  ];

  const propFirms: PropFirmCard[] = [
    {
      name: "FTMO",
      tagline: t.brokers.topBrokers === "Top Brokers" ? "Most trusted prop firm" :
               t.brokers.topBrokers === "أفضل الوسطاء" ? "أكثر شركة دعم موثوقة" : "Prop firm la plus fiable",
      url: "https://ftmo.com",
      icon: <Shield className="w-5 h-5" />,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-500/10 border-yellow-500/30",
    },
    {
      name: "The5ers",
      tagline: t.brokers.topBrokers === "Top Brokers" ? "Best for beginners" :
               t.brokers.topBrokers === "أفضل الوسطاء" ? "الأفضل للمبتدئين" : "Idéal pour les débutants",
      url: "https://the5ers.com",
      icon: <Award className="w-5 h-5" />,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-500/10 border-orange-500/30",
    },
    {
      name: "MyFundedFX",
      tagline: t.brokers.topBrokers === "Top Brokers" ? "Best payout speed" :
               t.brokers.topBrokers === "أفضل الوسطاء" ? "أسرع دفع" : "Paiements les plus rapides",
      url: "https://myfundedfx.com",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10 border-green-500/30",
    },
  ];

  return (
    <div className="space-y-6" dir={dir}>
      {/* Top Brokers */}
      <section>
        <h2 className="font-bold text-base mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-primary inline-block" />
          {t.brokers.topBrokers}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brokers.map((broker) => (
            <BrokerCardComponent
              key={broker.name}
              {...broker}
              buttonLabel={t.brokers.openAccount}
              affiliateLabel={t.brokers.affiliate}
            />
          ))}
        </div>
      </section>

      {/* Top Prop Firms */}
      <section>
        <h2 className="font-bold text-base mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-primary inline-block" />
          {t.brokers.topPropFirms}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {propFirms.map((firm) => (
            <BrokerCardComponent
              key={firm.name}
              {...firm}
              buttonLabel={t.brokers.startChallenge}
              affiliateLabel={t.brokers.affiliate}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function BrokerCardComponent({
  name,
  tagline,
  url,
  icon,
  color,
  bgColor,
  buttonLabel,
  affiliateLabel,
}: {
  name: string;
  tagline: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  buttonLabel: string;
  affiliateLabel: string;
}) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-5 flex flex-col gap-4 hover:shadow-lg hover:border-primary/30 transition-all duration-200 group">
      {/* Icon */}
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", bgColor, color)}>
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-sm text-muted-foreground">{tagline}</p>
      </div>

      {/* Button + affiliate */}
      <div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {buttonLabel}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <p className="text-[10px] text-muted-foreground/60 text-center mt-2">{affiliateLabel}</p>
      </div>
    </div>
  );
}
