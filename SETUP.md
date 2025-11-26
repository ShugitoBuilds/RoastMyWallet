# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# OnchainKit Configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# AI Service Configuration  
AI_API_KEY=your_ai_api_key_here
AI_SERVICE=openai

# Payment Configuration
NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS=your_wallet_address_here

# Base Network Configuration
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Getting Your API Keys

1. **OnchainKit API Key**: 
   - Visit [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
   - Create an account and generate an API key
   - Copy the key to `NEXT_PUBLIC_ONCHAINKIT_API_KEY`

2. **AI API Key**:
   - **OpenAI**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
   - **Anthropic**: Get from [Anthropic Console](https://console.anthropic.com/)
   - **Gemini**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Set `AI_SERVICE` to: `openai`, `anthropic`, or `gemini`

3. **Payment Wallet Address**:
   - Your Base wallet address where USDC payments will be sent
   - Format: `0x...` (42 characters)

## 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

## 4. Test the Application

1. Connect your wallet using the Connect Wallet button
2. Click "Get Free Roast" to test the free roast feature
3. Test premium features by clicking the payment buttons (requires USDC)

## 5. Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

### "OnchainKit API key not found"
- Make sure `.env.local` exists and contains `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- Restart the dev server after adding environment variables

### "AI API key not configured"
- Verify `AI_API_KEY` is set in `.env.local`
- Check that `AI_SERVICE` matches your API provider

### Wallet connection fails
- Ensure you're on the Base network
- Check that OnchainKit API key is valid
- Verify Base RPC URL is correct

### Payment transactions fail
- Verify USDC contract address is correct for Base
- Check that payment wallet address is valid
- Ensure you have sufficient USDC balance




