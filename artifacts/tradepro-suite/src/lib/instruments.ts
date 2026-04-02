export interface Instrument {
  symbol: string;
  category: "forex" | "metals" | "crypto" | "indices";
  pipSize: number;
  pipValuePerLot: number; // USD per standard lot per pip
  contractSize: number;
}

export const instruments: Instrument[] = [
  // Forex
  { symbol: "EURUSD", category: "forex", pipSize: 0.0001, pipValuePerLot: 10, contractSize: 100000 },
  { symbol: "GBPUSD", category: "forex", pipSize: 0.0001, pipValuePerLot: 10, contractSize: 100000 },
  { symbol: "USDJPY", category: "forex", pipSize: 0.01, pipValuePerLot: 9.09, contractSize: 100000 },
  { symbol: "USDCHF", category: "forex", pipSize: 0.0001, pipValuePerLot: 10.5, contractSize: 100000 },
  { symbol: "AUDUSD", category: "forex", pipSize: 0.0001, pipValuePerLot: 10, contractSize: 100000 },
  { symbol: "NZDUSD", category: "forex", pipSize: 0.0001, pipValuePerLot: 10, contractSize: 100000 },
  { symbol: "USDCAD", category: "forex", pipSize: 0.0001, pipValuePerLot: 7.5, contractSize: 100000 },
  { symbol: "EURGBP", category: "forex", pipSize: 0.0001, pipValuePerLot: 12.5, contractSize: 100000 },
  { symbol: "EURJPY", category: "forex", pipSize: 0.01, pipValuePerLot: 9.09, contractSize: 100000 },
  // Metals
  { symbol: "XAUUSD", category: "metals", pipSize: 0.01, pipValuePerLot: 10, contractSize: 100 },
  { symbol: "XAGUSD", category: "metals", pipSize: 0.001, pipValuePerLot: 50, contractSize: 5000 },
  // Crypto
  { symbol: "BTC/USD", category: "crypto", pipSize: 1, pipValuePerLot: 1, contractSize: 1 },
  { symbol: "ETH/USD", category: "crypto", pipSize: 0.1, pipValuePerLot: 0.1, contractSize: 1 },
  { symbol: "SOL/USD", category: "crypto", pipSize: 0.01, pipValuePerLot: 0.01, contractSize: 1 },
  { symbol: "XRP/USD", category: "crypto", pipSize: 0.0001, pipValuePerLot: 0.0001, contractSize: 1 },
  // Indices
  { symbol: "US30", category: "indices", pipSize: 1, pipValuePerLot: 1, contractSize: 1 },
  { symbol: "NAS100", category: "indices", pipSize: 0.1, pipValuePerLot: 1, contractSize: 1 },
  { symbol: "SP500", category: "indices", pipSize: 0.1, pipValuePerLot: 1, contractSize: 1 },
];

export interface FundedPreset {
  name: string;
  maxDailyLoss: number;
  maxTotalLoss: number;
}

export const fundedPresets: FundedPreset[] = [
  { name: "FTMO", maxDailyLoss: 5, maxTotalLoss: 10 },
  { name: "The5ers", maxDailyLoss: 4, maxTotalLoss: 8 },
  { name: "MyFundedFX", maxDailyLoss: 5, maxTotalLoss: 10 },
];

export function calcLotSize(
  balance: number,
  riskPercent: number,
  stopLossPips: number,
  instrument: Instrument
): { lotSize: number; dollarRisk: number; pipValue: number } {
  const dollarRisk = (balance * riskPercent) / 100;
  const pipValue = instrument.pipValuePerLot;
  const lotSize = dollarRisk / (stopLossPips * pipValue);
  return {
    lotSize: Math.max(0, Number(lotSize.toFixed(2))),
    dollarRisk: Number(dollarRisk.toFixed(2)),
    pipValue: Number(pipValue.toFixed(4)),
  };
}

export function priceToPips(entry: number, sl: number, instrument: Instrument): number {
  return Math.abs(entry - sl) / instrument.pipSize;
}
