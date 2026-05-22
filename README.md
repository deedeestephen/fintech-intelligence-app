# FinTrack: Unified Financial Intelligence App

FinTrack is a "Personal CFO" application designed to cure financial fragmentation. Modern individuals suffer from having their money scattered across physical banks, mobile money wallets, multiple virtual cards, and hidden recurring subscriptions. FinTrack solves this problem by acting as an intelligent aggregation layer that unifies your entire financial life in one place.

## How it Solves the Problem
- **Total Visibility**: Aggregates all expenses, income, and cash flow across different platforms.
- **Subscription Burn Rate**: Automatically detects recurring subscriptions (like Netflix, Spotify) and calculates your exact monthly burn rate, preventing silent leakage.
- **Goal Discipline**: Forces financial discipline by giving visual feedback on savings milestones.
- **Advanced Intelligence Layer**: An AI-powered backend that detects spending anomalies (preventing fraud and overspending) and gives behavioral insights (e.g., "You spend 18% more on weekends").

## Features
- **Dynamic Theming:** Seamless transition between an OLED-optimized Dark Mode and a crisp Light Mode, driven by system preferences or manual overrides.
- **Intelligent Dashboard:** Executive summary of your Net Worth, Financial Health Score, and predictive End-of-Month expense forecasts.
- **Smart Analytics:** Mathematical detection of anomalous charges and personalized savings tips.
- **Offline First:** Caches financial summaries locally so you're never locked out of your financial truth.

## Tech Stack
- **Frontend**: React Native (Expo Router)
- **UI Framework**: TailwindCSS via NativeWind (v4) with Zustand for global state management.
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: MongoDB (Mongoose)

## How to Run Locally

### 1. Backend (Node.js API)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file with a `MONGO_URI` (e.g. `mongodb://127.0.0.1:27017/fintech_db`) and `JWT_SECRET`.
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend (React Native Expo App)
1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo bundler:
   ```bash
   npm run start
   ```
4. Press `a` for Android Emulator, `i` for iOS Simulator, or scan the QR code using the Expo Go app on your physical device.

## Deployment Strategy
- **Backend Deployment**: The Node.js Express server is built to be easily containerized and deployed to AWS ECS, Heroku, or Vercel. Ensure `MONGO_URI` points to a cloud cluster (like MongoDB Atlas).
- **Frontend Deployment**: The React Native app can be built into standalone binaries (.apk / .aab for Android, .ipa for iOS) using EAS Build (`eas build --profile production`) and pushed to Google Play and the App Store.

## Seed the Database with Demo Data

A fully featured seed script ships with the backend. It generates **60 days of realistic financial transactions**, 5 subscriptions (including an anomalous charge to trigger AI detection), and 4 savings goals — all linked to a ready-made demo account.

```bash
cd backend
npm run seed
```

### Demo Login Credentials
| Field    | Value                  |
|----------|------------------------|
| Email    | demo@fintrack.app      |
| Password | password123            |

## How FinTrack Improves Daily Lives

The average person loses **$348/year** to subscriptions they've forgotten about and **$1,200+/year** to poor spending habits they cannot see. FinTrack directly attacks this problem by:

1. **Eliminating Financial Blind Spots** — Every dollar across every platform is visible in one dashboard.
2. **AI-Powered Anomaly Alerts** — Unusual charges are flagged the moment they occur, preventing fraud and overspending.
3. **Behavioral Coaching** — Personalized weekly insights like "You spent 22% more this weekend" create awareness that drives behaviour change.
4. **Goal Accountability** — Visible savings progress bars keep users motivated and on-track toward their financial milestones.
5. **Subscription Leakage Prevention** — Auto-detection of recurring charges and cancellation recommendations can save users hundreds per year.

> FinTrack is not just a tracker — it's your personal CFO, working 24/7 to protect and grow your wealth.

