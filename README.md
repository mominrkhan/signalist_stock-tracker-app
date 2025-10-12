This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## ⚠️ Important: Finnhub API Rate Limits

This application uses the Finnhub API to fetch stock market data. The **free tier** has the following limits:
- **60 API calls per minute**
- When the limit is reached, you'll see a 429 error

### Solutions:

1. **Upgrade your Finnhub plan**: Visit [Finnhub Pricing](https://finnhub.io/pricing) to get a higher rate limit
2. **Use caching**: The app already implements caching to reduce API calls:
   - Stock profiles: cached for 1 hour
   - Financial metrics: cached for 30 minutes
   - News: cached for 5 minutes
3. **Wait and retry**: Rate limits reset after 1 minute

### Graceful Degradation:

The app is now configured to handle rate limits gracefully:
- Returns placeholder data (—) when API limits are reached
- Displays warnings in console instead of crashing
- Shows empty states for news and search when limits are hit

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
