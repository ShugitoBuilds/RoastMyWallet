# Environment Variables for Vercel Deployment

Copy these environment variables into your Vercel project settings.

## Required Variables

### 1. OnchainKit API Key
```
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key_here
```
**Where to get it:** https://portal.cdp.coinbase.com/

### 2. Base URL
```
NEXT_PUBLIC_BASE_URL=https://your-project-name.vercel.app
```
**Note:** Update this AFTER your first deployment with your actual Vercel URL

### 3. NFT Contract Address
```
NEXT_PUBLIC_ROAST_NFT_ADDRESS=0x16BB20cFD193D7803F3d914821d6afC1cB79f5A8
```

### 4. Payment Wallet Address
```
NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS=your_wallet_address_here
```
**Format:** `0x...` (42 characters, your Base wallet address)

## AI Provider (Choose ONE)

### Option 1: OpenAI
```
OPENAI_API_KEY=your_openai_key_here
AI_SERVICE=openai
```

### Option 2: Anthropic
```
ANTHROPIC_API_KEY=your_anthropic_key_here
AI_SERVICE=anthropic
```

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

