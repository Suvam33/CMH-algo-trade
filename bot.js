import ccxt from "ccxt";
import cron from "node-cron";
import { SMA } from "technicalindicators";
import dotenv from "dotenv";

dotenv.config();

const exchangeId = process.env.EXCHANGE || "binance";
const exchangeClass = ccxt[exchangeId];
const exchange = new exchangeClass({
  apiKey: process.env.API_KEY,
  secret: process.env.API_SECRET,
  password: process.env.PASSPHRASE || undefined,
  enableRateLimit: true,
});

const symbols = (process.env.SYMBOLS || "BTC/USDT").split(",");
const timeframe = process.env.TIMEFRAME || "5m";
const riskPerTrade = parseFloat(process.env.RISK_PER_TRADE || "1");
const dailyLossCap = parseFloat(process.env.DAILY_LOSS_CAP || "5");
let dailyLoss = 0;
const paper = process.env.LIVE !== "true";
const baseUSDT = parseFloat(process.env.BASE_USDT || "1000");

console.log(`Bot started on ${exchangeId} for ${symbols.join(", ")} | Paper mode: ${paper}`);

async function fetchOHLCV(symbol) {
  return await exchange.fetchOHLCV(symbol, timeframe, undefined, 100);
}

function calculateSignal(ohlcv) {
  const closes = ohlcv.map(c => c[4]);
  const fast = SMA.calculate({ period: 10, values: closes });
  const slow = SMA.calculate({ period: 21, values: closes });
  const lastFast = fast[fast.length - 1];
  const lastSlow = slow[slow.length - 1];
  if (lastFast > lastSlow) return "buy";
  if (lastFast < lastSlow) return "sell";
  return "hold";
}

async function trade(symbol) {
  try {
    const ohlcv = await fetchOHLCV(symbol);
    const signal = calculateSignal(ohlcv);
    console.log(`${symbol} → ${signal}`);
    if (paper) return;

    const balance = await exchange.fetchBalance();
    const usdt = balance.total.USDT;
    const riskAmt = (usdt * riskPerTrade) / 100;

    if (signal === "buy" && dailyLoss < dailyLossCap) {
      console.log(`Placing BUY for ${symbol} with ~${riskAmt} USDT`);
      // await exchange.createMarketBuyOrder(symbol, riskAmt);
    }
    if (signal === "sell") {
      console.log(`Placing SELL for ${symbol}`);
      // await exchange.createMarketSellOrder(symbol, riskAmt);
    }
  } catch (e) {
    console.error(`Error in ${symbol}:`, e.message);
  }
}

cron.schedule("*/5 * * * *", () => {
  console.log("--- Tick ---", new Date().toLocaleTimeString());
  symbols.forEach(trade);
});
