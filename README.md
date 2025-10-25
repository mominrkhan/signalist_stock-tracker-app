# Signalist — Stock Market App

This project is a real-time stock market platform for tracking prices, building watchlists, setting price alerts, reading AI-generated digests, and viewing professional charts. It uses a **MongoDB** database for persistence, a **Next.js** application (Server Actions & Route Handlers) to create a RESTful-style backend and serve the UI, and a **React/TypeScript** frontend styled with Tailwind and shadcn/ui.

## Visit The Site

Feel free to check out the [project here!](https://signalistrading.vercel.app/sign-in)

![signalist](https://github.com/user-attachments/assets/90d7e47b-6258-492a-9c56-1663cfbce305)

## Features

- **MongoDB Database:** Stores users, watchlists, alerts, and generated digests with indexes, unique constraints, and timestamps.
- **Next.js Backend:** Server Actions & Route Handlers power CRUD operations, TradingView/Finnhub integrations, and secure session handling. Background jobs run with **Inngest** for alert checks and daily summaries; email is sent with **Nodemailer**.
- **React Frontend:** A modern dark UI using **Tailwind CSS**, **shadcn/ui**, **Radix UI**, and **Framer Motion**. Includes ticker search, watchlists, alert modals, AI news summaries, and embedded **TradingView** charts.

## Prerequisites

Before running this project locally, ensure you have the following installed:

- Node.js and npm
- MongoDB database (local or Atlas)
- Inngest CLI (for background jobs): `npx inngest-cli@latest`
- SMTP credentials for Nodemailer (or a provider like SendGrid/Mailgun)
- API keys: **Finnhub** (market data) and **Gemini** (AI summaries)
- Git / IDE (VS Code, WebStorm, etc.)

## Installation

### Backend Setup

1. **Clone the repository.**
2. **Create a `.env` file** in the project root with your credentials:

   ```env
   NODE_ENV=development
   MONGODB_URI=<your-mongodb-uri>

   # Auth
   BETTER_AUTH_SECRET=<random-32+ chars>
   BETTER_AUTH_URL=http://localhost:3000

   # Data/APIs
   FINNHUB_BASE_URL=https://finnhub.io/api/v1
   NEXT_PUBLIC_NEXT_PUBLIC_FINNHUB_API_KEY=<your-finnhub-key>
   GEMINI_API_KEY=<your-gemini-key>

   # Email
   NODEMAILER_EMAIL=<from-address>
   NODEMAILER_PASSWORD=<app-password-or-smtp-secret>
````

3. **Install dependencies:**

   ```bash
   npm install
   ```
4. **Start background workers** (new terminal):

   ```bash
   npx inngest-cli@latest dev
   ```

### Frontend Setup

1. **Run the Next.js app:**

   ```bash
   npm run dev
   ```
2. Open `http://localhost:3000` in your browser.

## Usage

* Access the application via `http://localhost:3000`.
* Sign up / sign in (Better Auth).
* Search a ticker to view quotes, TradingView charts, and related news.
* Add tickers to your **Watchlist**.
* Create **Price Alerts** (e.g., “AAPL < 150”) — alerts are evaluated by Inngest and notifications are emailed via Nodemailer.
* View your **AI Daily Digest** on the dashboard and in your inbox.
* **(Optional) API endpoints** if you enable Route Handlers:

  * `/api/watchlist` — `GET` (list), `POST` (add), `DELETE` (clear)
  * `/api/alerts` — `GET` (list), `POST` (create)
  * `/api/alerts/{alertId}` — `GET`, `PUT`, `DELETE`
  * `/api/quotes/{symbol}` — `GET` (proxied market data)

## Contributing

Contributions are welcome! If you'd like to enhance this project or report issues, please submit a pull request or open an issue.

```
