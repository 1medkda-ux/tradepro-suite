import { useState } from "react";
import { AlertTriangle, TrendingUp, Calculator as CalcIcon, ChevronDown } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { instruments, fundedPresets, calcLotSize, priceToPips } from "@/lib/instruments";
import { cn } from "@/lib/utils";

type StopLossMode = "pips" | "price";
type AccountMode = "personal" | "funded";

export function Calculator() {
  const { t, dir } = useApp();

  const [balance, setBalance] = useState("10000");
  const [riskPercent, setRiskPercent] = useState("1");
  const [customRisk, setCustomRisk] = useState("");
  const [useCustomRisk, setUseCustomRisk] = useState(false);
  const [slMode, setSlMode] = useState<StopLossMode>("pips");
  const [pips, setPips] = useState("20");
  const [entryPrice, setEntryPrice] = useState("");
  const [slPrice, setSlPrice] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("EURUSD");
  const [accountMode, setAccountMode] = useState<AccountMode>("personal");
  const [maxDailyLoss, setMaxDailyLoss] = useState("5");
  const [maxTotalLoss, setMaxTotalLoss] = useState("10");
  const [selectedPreset, setSelectedPreset] = useState("");

  const instrument = instruments.find((i) => i.symbol === selectedSymbol) || instruments[0];

  const effectiveRisk = useCustomRisk ? parseFloat(customRisk) || 0 : parseFloat(riskPercent) || 0;

  const stopLossPips =
    slMode === "pips"
      ? parseFloat(pips) || 0
      : priceToPips(parseFloat(entryPrice) || 0, parseFloat(slPrice) || 0, instrument);

  const result = calcLotSize(parseFloat(balance) || 0, effectiveRisk, stopLossPips, instrument);

  const isHighRisk = effectiveRisk > 3;

  const maxDailyLossAmount = (parseFloat(balance) || 0) * (parseFloat(maxDailyLoss) || 0) / 100;
  const maxTotalLossAmount = (parseFloat(balance) || 0) * (parseFloat(maxTotalLoss) || 0) / 100;
  const isFundedViolation =
    accountMode === "funded" &&
    (result.dollarRisk > maxDailyLossAmount || result.dollarRisk > maxTotalLossAmount);

  const riskButtons = ["1", "2", "3", "5"];

  const grouped = {
    forex: instruments.filter((i) => i.category === "forex"),
    metals: instruments.filter((i) => i.category === "metals"),
    crypto: instruments.filter((i) => i.category === "crypto"),
    indices: instruments.filter((i) => i.category === "indices"),
  };

  const catLabels: Record<string, string> = {
    forex: t.calculator.categories.forex,
    metals: t.calculator.categories.metals,
    crypto: t.calculator.categories.crypto,
    indices: t.calculator.categories.indices,
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    const p = fundedPresets.find((f) => f.name === preset);
    if (p) {
      setMaxDailyLoss(String(p.maxDailyLoss));
      setMaxTotalLoss(String(p.maxTotalLoss));
    }
  };

  return (
    <div className="space-y-4" dir={dir}>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Inputs */}
        <div className="space-y-4">
          <div className="bg-card border border-card-border rounded-xl p-4 space-y-4">
            <h2 className="flex items-center gap-2 font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              <CalcIcon className="w-4 h-4 text-primary" />
              {t.calculator.title}
            </h2>

            {/* Account Balance */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                {t.calculator.accountBalance}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono">$</span>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="w-full bg-input/50 border border-input rounded-lg pl-7 pr-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                  placeholder="10000"
                />
              </div>
            </div>

            {/* Risk % */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                {t.calculator.riskPercent}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {riskButtons.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRiskPercent(r); setUseCustomRisk(false); }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-mono font-medium border transition-all duration-150",
                      !useCustomRisk && riskPercent === r
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {r}%
                  </button>
                ))}
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={customRisk}
                    onChange={(e) => { setCustomRisk(e.target.value); setUseCustomRisk(true); }}
                    onFocus={() => setUseCustomRisk(true)}
                    className={cn(
                      "w-20 bg-input/50 border rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors",
                      useCustomRisk ? "border-primary" : "border-input"
                    )}
                    placeholder="0.5"
                    step="0.1"
                    min="0"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            {/* Instrument */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                {t.calculator.instrument}
              </label>
              <div className="relative">
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="w-full bg-input/50 border border-input rounded-lg px-3 py-2 text-sm font-mono appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                >
                  {Object.entries(grouped).map(([cat, items]) => (
                    <optgroup key={cat} label={catLabels[cat]}>
                      {items.map((inst) => (
                        <option key={inst.symbol} value={inst.symbol}>{inst.symbol}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Stop Loss Mode */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                {t.calculator.stopLoss}
              </label>
              <div className="flex gap-2 mb-3">
                {(["pips", "price"] as StopLossMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSlMode(mode)}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150",
                      slMode === mode
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {mode === "pips" ? t.calculator.pipsMode : t.calculator.priceMode}
                  </button>
                ))}
              </div>

              {slMode === "pips" ? (
                <input
                  type="number"
                  value={pips}
                  onChange={(e) => setPips(e.target.value)}
                  className="w-full bg-input/50 border border-input rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                  placeholder="20"
                />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground">{t.calculator.entryPrice}</span>
                    <input
                      type="number"
                      value={entryPrice}
                      onChange={(e) => setEntryPrice(e.target.value)}
                      className="w-full bg-input/50 border border-input rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors mt-1"
                      placeholder="1.08500"
                      step="0.00001"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">{t.calculator.slPrice}</span>
                    <input
                      type="number"
                      value={slPrice}
                      onChange={(e) => setSlPrice(e.target.value)}
                      className="w-full bg-input/50 border border-input rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors mt-1"
                      placeholder="1.08300"
                      step="0.00001"
                    />
                  </div>
                </div>
              )}
              {slMode === "price" && entryPrice && slPrice && (
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  ≈ {stopLossPips.toFixed(1)} {t.calculator.pips}
                </p>
              )}
            </div>
          </div>

          {/* Account Mode */}
          <div className="bg-card border border-card-border rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t.calculator.accountMode}
            </h3>
            <div className="flex gap-2">
              {(["personal", "funded"] as AccountMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAccountMode(mode)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium border transition-all duration-150",
                    accountMode === mode
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {mode === "personal" ? t.calculator.personal : t.calculator.funded}
                </button>
              ))}
            </div>

            {accountMode === "funded" && (
              <div className="space-y-3 pt-1">
                {/* Preset selector */}
                <div className="relative">
                  <select
                    value={selectedPreset}
                    onChange={(e) => handlePresetChange(e.target.value)}
                    className="w-full bg-input/50 border border-input rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  >
                    <option value="">{t.calculator.preset}</option>
                    {fundedPresets.map((p) => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground">{t.calculator.maxDailyLoss}</label>
                    <input
                      type="number"
                      value={maxDailyLoss}
                      onChange={(e) => setMaxDailyLoss(e.target.value)}
                      className="w-full bg-input/50 border border-input rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">{t.calculator.maxTotalLoss}</label>
                    <input
                      type="number"
                      value={maxTotalLoss}
                      onChange={(e) => setMaxTotalLoss(e.target.value)}
                      className="w-full bg-input/50 border border-input rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-card border border-card-border rounded-xl p-4 space-y-4">
            <h2 className="flex items-center gap-2 font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-primary" />
              {t.calculator.results}
            </h2>

            {/* Result Cards */}
            <div className="grid grid-cols-1 gap-3">
              <ResultCard
                label={t.calculator.lotSize}
                value={result.lotSize.toFixed(2)}
                unit="lots"
                highlight
              />
              <div className="grid grid-cols-2 gap-3">
                <ResultCard
                  label={t.calculator.dollarRisk}
                  value={`$${result.dollarRisk.toFixed(2)}`}
                />
                <ResultCard
                  label={t.calculator.pipValue}
                  value={`$${result.pipValue}`}
                  unit="/ pip"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ResultCard
                  label="SL Pips"
                  value={stopLossPips.toFixed(1)}
                  unit="pips"
                />
                <ResultCard
                  label="Risk %"
                  value={`${effectiveRisk}%`}
                  highlight={isHighRisk}
                  danger={isHighRisk}
                />
              </div>
            </div>

            {/* Warnings */}
            {isHighRisk && (
              <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-xs">{t.calculator.riskWarning}</p>
              </div>
            )}
            {isFundedViolation && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 dark:text-red-400">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-xs">{t.calculator.fundedWarning}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  unit,
  highlight,
  danger,
}: {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-3 border transition-all",
        highlight && !danger ? "bg-primary/10 border-primary/30" : "",
        danger ? "bg-red-500/10 border-red-500/30" : "",
        !highlight && !danger ? "bg-muted/50 border-border/50" : ""
      )}
    >
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p
        className={cn(
          "text-xl font-mono font-bold",
          highlight && !danger ? "text-primary" : "",
          danger ? "text-red-500" : "text-foreground"
        )}
      >
        {value}
        {unit && <span className="text-xs font-normal text-muted-foreground ml-1">{unit}</span>}
      </p>
    </div>
  );
}
