# Environment Variables for Vercel Deployment

Copy these environment variables into your Vercel project settings.

## Required Variables

### 1. OnchainKit API Key
```
NEXT_PUBLIC_ONCHAINKIT_API_KEY=Zd4/k4uxtAzzM+EAnnahEdftb15p4XcUKlhl5EbnizCaPSbScC6znWJRxL1oYW4ZenQ8+PCO+UJB1PGdp5HXIg==
```
**Where to get it:** https://portal.cdp.coinbase.com/

### 2. Base URL
```
NEXT_PUBLIC_BASE_URL=https://roast-my-wallet-sigma.vercel.app/
```
**Note:** Update this AFTER your first deployment with your actual Vercel URL

### 3. NFT Contract Address
```
NEXT_PUBLIC_ROAST_NFT_ADDRESS=0x16BB20cFD193D7803F3d914821d6afC1cB79f5A8
```

### 4. Payment Wallet Address
```
NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS=0x115F7cD31F20aBBdf013c37FE04341f55Ab3c262
```
**Format:** `0x...` (42 characters)
**Important:** This is YOUR Base wallet address where USDC payments will be sent when users pay for premium roasts ($1) or friend roasts ($1). This is different from the NFT contract address - NFTs go to the users who mint them, but the USDC payments come to this wallet.

## AI Provider (Gemini)

```
AI_API_KEY=AIzaSyDl6OFi5WqpsbO7Wsya1WSHcM3AmAeR8Pw
AI_SERVICE=gemini
```
**Where to get it:** https://makersuite.google.com/app/apikey

## Alchemy API (Token Detection)

> **CRITICAL**: This is required for detecting all tokens in a wallet!

```
ALCHEMY_API_KEY=your_alchemy_api_key_here
```

**Where to get it:**
1. Go to https://dashboard.alchemy.com/
2. Create a new app
3. **Important**: Select **Base Mainnet** as the chain
4. Copy the API key

**Without this key**: Only ETH, USDC, and WETH will be detected  
**With this key**: ALL tokens on Base will be detected

## Supabase (Optional - for leaderboard and roast storage)

```
NEXT_PUBLIC_SUPABASE_URL=https://umjxdkdbhkkcarpitkku.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtanhka2RiaGtrY2FycGl0a2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMjkxNTksImV4cCI6MjA3OTYwNTE1OX0.2am1LZBxemMqKiXsI55quEYbIM1v_1Z-UFUbOK5367s
```

## Optional Variables

### Base RPC URL (has default)
```
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
```
**Note:** This is optional, defaults to mainnet.base.org if not set

---

## Quick Copy-Paste for Vercel

When adding variables in Vercel, make sure to:
1. Select **Production**, **Preview**, and **Development** for each variable
2. Click "Add" after each variable
3. Update `NEXT_PUBLIC_BASE_URL` after your first deployment

