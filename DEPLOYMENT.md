# Roast My Wallet - Deployment Guide

## Smart Contract Information

### RoastNFT Contract

- **Contract Address**: `0x16BB20cFD193D7803F3d914821d6afC1cB79f5A8`
- **Network**: Base Mainnet (Chain ID: 8453)
- **Contract Type**: ERC721 with USDC payments
- **Mint Price**: 2 USDC

### Contract Verification

The contract was deployed via Remix IDE. To verify the contract source code on Basescan:

#### Option 1: Automatic Verification (Remix)

If the contract was deployed with verification enabled in Remix:
1. Go to [Basescan Contract Page](https://basescan.org/address/0x16BB20cFD193D7803F3d914821d6afC1cB79f5A8)
2. The contract should already be verified

#### Option 2: Manual Verification

1. Go to [Basescan Verify Contract](https://basescan.org/verifyContract)
2. Enter the contract address: `0x16BB20cFD193D7803F3d914821d6afC1cB79f5A8`
3. Select:
   - Compiler Type: `Solidity (Single file)`
   - Compiler Version: `v0.8.20` (or the version used during deployment)
   - Open Source License: `MIT`
4. Paste the flattened contract source code
5. If constructor arguments were used, encode them using the ABI encoder

### Contract Source Code

The RoastNFT contract is an ERC721 token with the following features:
- Minting requires USDC payment (2 USDC)
- Each token has a unique tokenURI pointing to the roast metadata
- Owner can update the payment wallet and mint price
- Uses OpenZeppelin contracts for ERC721 and Ownable

---

## Vercel Deployment

### Environment Variables

Set these environment variables in your Vercel project settings:

```bash
# Required
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app

# NFT Contract
NEXT_PUBLIC_ROAST_NFT_ADDRESS=0x16BB20cFD193D7803F3d914821d6afC1cB79f5A8

# Payment
NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS=your_payment_wallet

# AI Provider (choose one)
OPENAI_API_KEY=your_openai_key
# OR
ANTHROPIC_API_KEY=your_anthropic_key

# Supabase (optional, for leaderboard)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deployment Steps

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   - Add all required environment variables
   - Make sure `NEXT_PUBLIC_BASE_URL` matches your Vercel domain

3. **Deploy**
   - Vercel will automatically build and deploy
   - The app will be available at your Vercel URL

4. **Custom Domain (Optional)**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Update `NEXT_PUBLIC_BASE_URL` to match

---

## Post-Deployment Checklist

### Critical Checks

- [ ] **Network Switching**: Test connecting with a wallet on Ethereum Mainnet
  - The app should prompt to switch to Base automatically
  - Verify the "Switch to Base" button works

- [ ] **Share Links**: Test sharing a roast
  - Share to Twitter/X and verify the OG image shows
  - Share to Warpcast and verify the preview works
  - The preview should show the specific roast certificate, not generic logo

- [ ] **Mobile Testing**: Test on mobile wallet browsers
  - Rainbow Wallet
  - Coinbase Wallet
  - MetaMask Mobile
  - Verify buttons are not covered by bottom navigation

- [ ] **Contract Verification**: Check Basescan
  - Go to the contract page
  - Verify the source code is visible
  - If not, follow manual verification steps above

- [ ] **Dynamic Roast Pages**: Test `/roast/[address]` route
  - Navigate to a roast page directly
  - Verify the roast data loads correctly
  - Verify share buttons work

### Security Checks

- [ ] USDC approval amount is correct (2 USDC for NFT)
- [ ] Payment wallet address is correct
- [ ] Contract is verified on Basescan
- [ ] No private keys exposed in environment variables

---

## Farcaster Frame Testing

To test the Farcaster Frame:

1. Go to [Warpcast Frame Debugger](https://warpcast.com/~/developers/frames)
2. Enter your app URL
3. Verify:
   - Frame image loads correctly
   - Buttons are visible
   - Click actions work as expected

---

## Troubleshooting

### OG Images Not Loading

1. Check that `NEXT_PUBLIC_BASE_URL` is set correctly
2. Verify the `/api/scorecard/[id]` endpoint returns an image
3. Clear Twitter/Warpcast preview cache

### Network Switch Not Working

1. Ensure the wallet supports network switching
2. Check that Base network is configured in the wallet
3. Verify `useSwitchChain` hook is imported correctly

### NFT Minting Fails

1. Check user has sufficient USDC balance
2. Verify USDC approval was successful
3. Check contract address is correct
4. Verify user is on Base network

### Supabase Not Saving

1. Check Supabase URL and anon key are correct
2. Verify the `roasts` table exists with correct schema
3. Check Row Level Security policies allow inserts

---

## Contract Addresses Reference

| Contract | Address | Network |
|----------|---------|---------|
| RoastNFT | `0x16BB20cFD193D7803F3d914821d6afC1cB79f5A8` | Base Mainnet |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | Base Mainnet |

---

## Links

- [Basescan Contract](https://basescan.org/address/0x16BB20cFD193D7803F3d914821d6afC1cB79f5A8)
- [OpenSea Collection](https://opensea.io/collection/roast-my-wallet-nft)
- [Warpcast Frame Debugger](https://warpcast.com/~/developers/frames)
