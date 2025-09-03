# JS Algo Trading Bot

A simple crypto algo trading bot built with **Node.js + CCXT**.

## 🚀 Features
- Runs on Binance, Bitget, etc.
- SMA crossover strategy (5m candles)
- Paper mode (no real trades) by default
- Risk management (daily loss cap, % risk per trade)

## 📂 Setup

### 1. Clone Repo
```bash
git clone https://github.com/your-username/js-algo-bot.git
cd js-algo-bot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env` file
```ini
EXCHANGE=binance
LIVE=false
API_KEY=your_api_key_here
API_SECRET=your_api_secret_here
SYMBOLS=BTC/USDT
TIMEFRAME=5m
RISK_PER_TRADE=1
DAILY_LOSS_CAP=2
BASE_USDT=1000
```

### 4. Run Bot
```bash
npm start
```

## ☁️ Deploy on Render
1. Push this repo to GitHub.
2. Create a new **Web Service** on [Render.com](https://render.com).
3. Connect GitHub repo → Select Node.js → Add environment variables.
4. Deploy & watch logs.

---
⚠️ Disclaimer: Use at your own risk. This bot is for **educational purposes** only.
