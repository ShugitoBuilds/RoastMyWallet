# 🔥 Roast My Wallet

A Farcaster Frame mini-app on Base that connects to users' wallets, analyzes their token holdings, and generates AI-powered roasts. Monetized through $1 USDC payments for premium roasts and friend roasts.

## Features

- **Free Roasts**: Basic AI analysis of wallet holdings
- **Premium Roasts ($1 USDC)**: Detailed, ruthless roasts with full token analysis
- **Roast a Friend ($1 USDC)**: Roast any wallet address (viral sharing feature)
- **Smart Wallets**: Gasless transactions via Coinbase Paymaster
- **Farcaster Frame Support**: Works as an interactive Frame in social media posts

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Blockchain**: Base (Coinbase L2)
- **SDK**: OnchainKit by Coinbase
- **Wallets**: Smart Wallets with gasless transactions
- **AI**: Configurable AI service (OpenAI, Anthropic, Gemini, etc.)

## Setup

### Prerequisites

- Node.js 18+ and npm
- OnchainKit API key (get from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/))
- AI API key (OpenAI, Anthropic, or Gemini)
- Base wallet address for receiving payments

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Roast My Wallet"
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
# OnchainKit Configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# AI Service Configuration
AI_API_KEY=your_ai_api_key_here
AI_SERVICE=openai  # Options: openai, anthropic, gemini

# Payment Configuration
NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS=your_wallet_address_here

# Base Network Configuration
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Your deployment URL
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /api
    /frame
      route.ts          # Frame API handler
      /image
        route.ts        # Frame image generation
    /roast
      route.ts          # Roast generation API
  /components
    WalletConnect.tsx   # OnchainKit wallet integration
    RoastDisplay.tsx   # Display roasts
    PaymentButton.tsx  # USDC payment component
  /lib
    roast-generator.ts # AI roast generation
    payments.ts        # Payment processing
    tokens.ts          # Token balance fetching
  layout.tsx           # OnchainKitProvider setup
  page.tsx             # Main Frame page
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

The app will be available at `https://your-project.vercel.app`

### Frame Deployment

To use as a Farcaster Frame:

1. Deploy to Vercel (or your hosting provider)
2. Update `NEXT_PUBLIC_BASE_URL` to your production URL
3. Share the Frame URL: `https://your-project.vercel.app/api/frame`

## Monetization

- **Free Roast**: Basic analysis (limited, less savage)
- **Premium Roast**: $1 USDC payment for detailed, ruthless roast
- **Roast a Friend**: $1 USDC payment to roast any wallet address

All payments are processed on-chain using USDC on Base.

## Smart Wallets

The app uses Smart Wallets with Coinbase Paymaster for gasless transactions, providing a seamless user experience without requiring users to hold ETH for gas fees.

## AI Configuration

The app supports multiple AI providers:

- **OpenAI**: Set `AI_SERVICE=openai` and provide OpenAI API key
- **Anthropic**: Set `AI_SERVICE=anthropic` and provide Anthropic API key
- **Gemini**: Set `AI_SERVICE=gemini` and provide Google API key

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.




