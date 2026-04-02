export interface Trade {
  id: string;
  date: string;
  instrument: string;
  direction: "buy" | "sell";
  accountBalance: number;
  entryPrice: number;
  slPrice: number;
  tpPrice: number;
  lotSize: number;
  notes: string;
  // Calculated
  riskDollar: number;
  riskPips: number;
  profitLossDollar: number;
  profitLossPips: number;
  rr: number;
  result: "win" | "loss";
  createdAt: string;
}

export interface NewTradeInput {
  date: string;
  instrument: string;
  direction: "buy" | "sell";
  accountBalance: string;
  entryPrice: string;
  slPrice: string;
  tpPrice: string;
  lotSize: string;
  notes: string;
}

const STORAGE_KEY = "tradepro-journal";

export function loadTrades(): Trade[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTrades(trades: Trade[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
}

export function calcTradeMetrics(input: NewTradeInput): Omit<Trade, "id" | "createdAt"> {
  const entry = parseFloat(input.entryPrice) || 0;
  const sl = parseFloat(input.slPrice) || 0;
  const tp = parseFloat(input.tpPrice) || 0;
  const lot = parseFloat(input.lotSize) || 0;
  const balance = parseFloat(input.accountBalance) || 0;

  const slPips = Math.abs(entry - sl) / 0.0001;
  const tpPips = Math.abs(tp - entry) / 0.0001;
  const riskPips = slPips;
  const riskDollar = slPips * lot * 10;

  const profitLossPips = input.direction === "buy" ? tp - entry : entry - tp;
  const profitLossPipValue = profitLossPips / 0.0001;
  const profitLossDollar = profitLossPipValue * lot * 10;

  const rr = riskPips > 0 ? parseFloat((tpPips / riskPips).toFixed(2)) : 0;
  const result: "win" | "loss" = profitLossDollar >= 0 ? "win" : "loss";

  return {
    date: input.date,
    instrument: input.instrument,
    direction: input.direction,
    accountBalance: balance,
    entryPrice: entry,
    slPrice: sl,
    tpPrice: tp,
    lotSize: lot,
    notes: input.notes,
    riskDollar: parseFloat(riskDollar.toFixed(2)),
    riskPips: parseFloat(riskPips.toFixed(1)),
    profitLossDollar: parseFloat(profitLossDollar.toFixed(2)),
    profitLossPips: parseFloat(profitLossPipValue.toFixed(1)),
    rr,
    result,
  };
}

export function computeStats(trades: Trade[]) {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winRate: 0,
      totalGrowth: 0,
      avgRR: 0,
      totalPips: 0,
      bestTrade: null as Trade | null,
      worstTrade: null as Trade | null,
    };
  }

  const wins = trades.filter((t) => t.result === "win");
  const winRate = (wins.length / trades.length) * 100;
  const totalGrowth = trades.reduce((sum, t) => sum + t.profitLossDollar, 0);
  const avgRR = trades.reduce((sum, t) => sum + t.rr, 0) / trades.length;
  const totalPips = trades.reduce((sum, t) => sum + t.profitLossPips, 0);
  const bestTrade = trades.reduce((best, t) => (!best || t.profitLossDollar > best.profitLossDollar ? t : best), null as Trade | null);
  const worstTrade = trades.reduce((worst, t) => (!worst || t.profitLossDollar < worst.profitLossDollar ? t : worst), null as Trade | null);

  return {
    totalTrades: trades.length,
    winRate: parseFloat(winRate.toFixed(1)),
    totalGrowth: parseFloat(totalGrowth.toFixed(2)),
    avgRR: parseFloat(avgRR.toFixed(2)),
    totalPips: parseFloat(totalPips.toFixed(1)),
    bestTrade,
    worstTrade,
  };
}
