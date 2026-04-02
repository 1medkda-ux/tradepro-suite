import { useState, useEffect } from "react";
import { Plus, X, TrendingUp, TrendingDown, Award, AlertCircle, Filter } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Trade, NewTradeInput, loadTrades, saveTrades, calcTradeMetrics, computeStats } from "@/lib/journal";
import { instruments } from "@/lib/instruments";
import { cn } from "@/lib/utils";

type FilterResult = "all" | "win" | "loss";

const INITIAL_FORM: NewTradeInput = {
  date: new Date().toISOString().split("T")[0],
  instrument: "EURUSD",
  direction: "buy",
  accountBalance: "",
  entryPrice: "",
  slPrice: "",
  tpPrice: "",
  lotSize: "",
  notes: "",
};

export function Journal() {
  const { t, dir } = useApp();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewTradeInput>(INITIAL_FORM);
  const [filterResult, setFilterResult] = useState<FilterResult>("all");
  const [filterInstrument, setFilterInstrument] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    setTrades(loadTrades());
  }, []);

  const stats = computeStats(trades);

  const filteredTrades = trades.filter((t) => {
    if (filterResult !== "all" && t.result !== filterResult) return false;
    if (filterInstrument && t.instrument !== filterInstrument) return false;
    if (filterDate && t.date !== filterDate) return false;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const metrics = calcTradeMetrics(form);
    const newTrade: Trade = {
      id: Date.now().toString(),
      ...metrics,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTrade, ...trades];
    setTrades(updated);
    saveTrades(updated);
    setForm(INITIAL_FORM);
    setShowForm(false);
  };

  const deleteTrade = (id: string) => {
    const updated = trades.filter((t) => t.id !== id);
    setTrades(updated);
    saveTrades(updated);
  };

  const inputCls = "w-full bg-input/50 border border-input rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors";

  return (
    <div className="space-y-4" dir={dir}>
      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label={t.journal.totalTrades} value={String(stats.totalTrades)} />
        <StatCard label={t.journal.winRate} value={`${stats.winRate}%`} positive={stats.winRate >= 50} />
        <StatCard
          label={t.journal.totalGrowth}
          value={`${stats.totalGrowth >= 0 ? "+" : ""}$${stats.totalGrowth.toFixed(2)}`}
          positive={stats.totalGrowth >= 0}
          negative={stats.totalGrowth < 0}
        />
        <StatCard label={t.journal.avgRR} value={`${stats.avgRR}:1`} />
        <StatCard
          label={t.journal.totalPips}
          value={`${stats.totalPips >= 0 ? "+" : ""}${stats.totalPips}`}
          positive={stats.totalPips >= 0}
          negative={stats.totalPips < 0}
        />
        <StatCard label="Trades" value={`${trades.filter(t => t.result === "win").length}W / ${trades.filter(t => t.result === "loss").length}L`} />
      </div>

      {/* Best/Worst */}
      {(stats.bestTrade || stats.worstTrade) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stats.bestTrade && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">{t.journal.bestTrade}</span>
              </div>
              <p className="font-mono text-sm font-bold text-green-600 dark:text-green-400">
                +${stats.bestTrade.profitLossDollar.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">{stats.bestTrade.instrument} · {stats.bestTrade.date}</p>
            </div>
          )}
          {stats.worstTrade && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-xs font-medium text-red-600 dark:text-red-400">{t.journal.worstTrade}</span>
              </div>
              <p className="font-mono text-sm font-bold text-red-600 dark:text-red-400">
                ${stats.worstTrade.profitLossDollar.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">{stats.worstTrade.instrument} · {stats.worstTrade.date}</p>
            </div>
          )}
        </div>
      )}

      {/* Header + Add button */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          {t.journal.title}
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          {t.journal.newTrade}
        </button>
      </div>

      {/* New Trade Form */}
      {showForm && (
        <div className="bg-card border border-card-border rounded-xl p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">{t.journal.date}</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} required />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">{t.journal.instrument}</label>
                <select value={form.instrument} onChange={(e) => setForm({ ...form, instrument: e.target.value })} className={inputCls}>
                  {instruments.map((i) => <option key={i.symbol} value={i.symbol}>{i.symbol}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">{t.journal.direction}</label>
                <div className="flex gap-2">
                  {(["buy", "sell"] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setForm({ ...form, direction: d })}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-medium border transition-all",
                        form.direction === d
                          ? d === "buy"
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-red-500 text-white border-red-500"
                          : "bg-muted border-border text-muted-foreground"
                      )}
                    >
                      {d === "buy" ? t.journal.buy : t.journal.sell}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">{t.journal.accountBalance}</label>
                <input type="number" value={form.accountBalance} onChange={(e) => setForm({ ...form, accountBalance: e.target.value })} className={inputCls} placeholder="10000" required />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">{t.journal.entryPrice}</label>
                <input type="number" value={form.entryPrice} onChange={(e) => setForm({ ...form, entryPrice: e.target.value })} className={inputCls} placeholder="1.08500" step="0.00001" required />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">{t.journal.slPrice}</label>
                <input type="number" value={form.slPrice} onChange={(e) => setForm({ ...form, slPrice: e.target.value })} className={inputCls} placeholder="1.08300" step="0.00001" required />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">{t.journal.tpPrice}</label>
                <input type="number" value={form.tpPrice} onChange={(e) => setForm({ ...form, tpPrice: e.target.value })} className={inputCls} placeholder="1.08900" step="0.00001" required />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">{t.journal.lotSize}</label>
                <input type="number" value={form.lotSize} onChange={(e) => setForm({ ...form, lotSize: e.target.value })} className={inputCls} placeholder="0.10" step="0.01" required />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">{t.journal.notes}</label>
                <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputCls} placeholder="Trade setup notes..." />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                {t.journal.addTrade}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {t.journal.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-card border border-card-border rounded-xl">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div className="flex gap-1">
          {(["all", "win", "loss"] as FilterResult[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilterResult(f)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                filterResult === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "all" ? t.journal.all : f === "win" ? t.journal.wins : t.journal.losses}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="bg-input/50 border border-input rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <select
          value={filterInstrument}
          onChange={(e) => setFilterInstrument(e.target.value)}
          className="bg-input/50 border border-input rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="">{t.journal.all}</option>
          {instruments.map((i) => <option key={i.symbol} value={i.symbol}>{i.symbol}</option>)}
        </select>
        {(filterResult !== "all" || filterDate || filterInstrument) && (
          <button
            onClick={() => { setFilterResult("all"); setFilterDate(""); setFilterInstrument(""); }}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Trades List */}
      {filteredTrades.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{t.journal.noTrades}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTrades.map((trade) => (
            <TradeRow key={trade.id} trade={trade} onDelete={deleteTrade} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, positive, negative }: { label: string; value: string; positive?: boolean; negative?: boolean }) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-3">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className={cn(
        "text-base font-mono font-bold",
        positive ? "text-green-500" : negative ? "text-red-500" : "text-foreground"
      )}>
        {value}
      </p>
    </div>
  );
}

function TradeRow({ trade, onDelete, t }: { trade: Trade; onDelete: (id: string) => void; t: any }) {
  const isWin = trade.result === "win";
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl border transition-all hover:shadow-sm",
      isWin ? "bg-green-500/5 border-green-500/20 hover:border-green-500/40" : "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
    )}>
      {/* Badge */}
      <span className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase self-start sm:self-auto flex-shrink-0",
        isWin ? "bg-green-500/20 text-green-600 dark:text-green-400" : "bg-red-500/20 text-red-600 dark:text-red-400"
      )}>
        {isWin ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isWin ? t.journal.win : t.journal.loss}
      </span>

      {/* Direction badge */}
      <span className={cn(
        "inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase self-start sm:self-auto flex-shrink-0",
        trade.direction === "buy" ? "bg-blue-500/20 text-blue-600 dark:text-blue-400" : "bg-orange-500/20 text-orange-600 dark:text-orange-400"
      )}>
        {trade.direction === "buy" ? t.journal.buy : t.journal.sell}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-2 items-baseline">
          <span className="font-mono font-semibold text-sm">{trade.instrument}</span>
          <span className="text-xs text-muted-foreground">{trade.date}</span>
          {trade.notes && <span className="text-xs text-muted-foreground truncate max-w-[160px]">{trade.notes}</span>}
        </div>
        <div className="flex flex-wrap gap-3 mt-1">
          <MetaItem label={t.journal.riskDollar} value={`$${trade.riskDollar}`} />
          <MetaItem label={t.journal.riskPips} value={`${trade.riskPips}`} />
          <MetaItem label={t.journal.rr} value={`${trade.rr}:1`} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className={cn("font-mono font-bold text-base", isWin ? "text-green-500" : "text-red-500")}>
            {isWin ? "+" : ""}{trade.profitLossDollar >= 0 ? "+" : ""}${trade.profitLossDollar.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground font-mono">{trade.profitLossPips >= 0 ? "+" : ""}{trade.profitLossPips} pips</p>
        </div>
        <button
          onClick={() => onDelete(trade.id)}
          className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-xs text-muted-foreground">
      <span className="text-[10px] opacity-70">{label}: </span>
      <span className="font-mono">{value}</span>
    </span>
  );
}
