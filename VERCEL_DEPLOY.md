# Vercel Deployment Guide - Step by Step

## Prerequisites

Before deploying, make sure you have:
- ✅ A GitHub account
- ✅ A Vercel account (sign up at https://vercel.com)
- ✅ All your environment variables ready

## Step 1: Prepare Your Code for Git

First, let's make sure your code is ready to push to GitHub:

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Roast My Wallet app"
   ```

2. **Create a GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., "roast-my-wallet")
   - **DO NOT** initialize with README, .gitignore, or license
   - Copy the repository URL

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Click "Add New Project"

2. **Import Your Repository**:
   - Connect your GitHub account if not already connected
   - Select your "roast-my-wallet" repository
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Add Environment Variables**:
   Click "Environment Variables" and add these one by one:

   **Required Variables:**
   ```
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key_here
   NEXT_PUBLIC_BASE_URL=https://your-project-name.vercel.app
   NEXT_PUBLIC_ROAST_NFT_ADDRESS=0x16BB20cFD193D7803F3d914821d6afC1cB79f5A8
   NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS=your_payment_wallet_address
   ```

   **AI Provider (choose ONE):**
   ```
   OPENAI_API_KEY=your_openai_key
   AI_SERVICE=openai
   ```
   OR
   ```
   ANTHROPIC_API_KEY=your_anthropic_key
   AI_SERVICE=anthropic
   ```

   **Supabase (for leaderboard and roast storage):**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://umjxdkdbhkkcarpitkku.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtanhka2RiaGtrY2FycGl0a2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMjkxNTksImV4cCI6MjA3OTYwNTE1OX0.2am1LZBxemMqKiXsI55quEYbIM1v_1Z-UFUbOK5367s
   ```

   **Important Notes:**
   - For `NEXT_PUBLIC_BASE_URL`: You'll get the actual URL after first deployment. You can update it later.
   - Make sure to select **"Production"**, **"Preview"**, and **"Development"** for each variable
   - Click "Add" after each variable

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (2-3 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

### Option B: Via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Add environment variables when prompted

## Step 3: Update Environment Variables After First Deploy

After your first deployment, you'll get a URL like `https://roast-my-wallet-xyz.vercel.app`

1. **Update NEXT_PUBLIC_BASE_URL**:
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Edit `NEXT_PUBLIC_BASE_URL`
   - Set it to: `https://roast-my-wallet-xyz.vercel.app` (your actual URL)
   - Redeploy the project

## Step 4: Test Your Deployment

### Critical Tests:

1. **Homepage Loads**:
   - Visit your Vercel URL
   - Should see the "Roast My Wallet" interface

2. **Wallet Connection**:
   - Click "Connect Wallet"
   - Should connect successfully

3. **Network Switching**:
   - Connect with a wallet on Ethereum Mainnet
   - Should see "Switch to Base" prompt
   - Click it and verify network switches

4. **Share Links**:
   - Generate a roast
   - Click "Share to Twitter" or "Share to Warpcast"
   - The preview should show your roast certificate image (not generic logo)
   - **Note**: OG images may take a few minutes to cache

5. **Dynamic Roast Pages**:
   - Visit: `https://your-app.vercel.app/roast/0xYOUR_ADDRESS`
   - Should display the roast for that address

6. **Mobile View**:
   - Resize browser to mobile width (375px)
   - Verify buttons are not covered by bottom navigation
   - Check that text is readable

## Step 5: Custom Domain (Optional)

1. **Add Domain in Vercel**:
   - Go to Project Settings > Domains
   - Add your custom domain (e.g., `roastmywallet.xyz`)
   - Follow DNS configuration instructions

2. **Update Environment Variable**:
   - Update `NEXT_PUBLIC_BASE_URL` to your custom domain
   - Redeploy

## Troubleshooting

### Build Fails

- Check the build logs in Vercel dashboard
- Common issues:
  - Missing environment variables
  - TypeScript errors
  - Missing dependencies

### OG Images Not Showing

1. **Wait**: Twitter/Warpcast cache previews. Wait 5-10 minutes after deployment
2. **Clear Cache**: Use these tools:
   - Twitter: https://cards-dev.twitter.com/validator
   - Warpcast: Share link in a new cast
3. **Verify URL**: Make sure `NEXT_PUBLIC_BASE_URL` is correct
4. **Test OG Tags**: Visit `https://your-app.vercel.app/roast/0xADDRESS` and view page source, look for `<meta property="og:image">`

### Network Switch Not Working

- Verify Base network is added to user's wallet
- Check browser console for errors
- Ensure `useSwitchChain` hook is working

### NFT Minting Fails

- Verify contract address is correct: `0x16BB20cFD193D7803F3d914821d6afC1cB79f5A8`
- Check user has USDC on Base
- Verify user is on Base network

## Environment Variables Checklist

Before deploying, make sure you have all these values:

- [ ] `NEXT_PUBLIC_ONCHAINKIT_API_KEY` - From Coinbase Developer Platform
- [ ] `NEXT_PUBLIC_BASE_URL` - Will be your Vercel URL (update after first deploy)
- [ ] `NEXT_PUBLIC_ROAST_NFT_ADDRESS` - `0x16BB20cFD193D7803F3d914821d6afC1cB79f5A8`
- [ ] `NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS` - Your Base wallet address
- [ ] `OPENAI_API_KEY` OR `ANTHROPIC_API_KEY` - Your AI provider key
- [ ] `AI_SERVICE` - `openai` or `anthropic`
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

## Post-Deployment Checklist

- [ ] App loads at Vercel URL
- [ ] Wallet connects successfully
- [ ] Network switching works (test with Ethereum Mainnet wallet)
- [ ] Free roast generates correctly
- [ ] Premium roast payment works ($1 USDC)
- [ ] Share to Twitter shows OG image preview
- [ ] Share to Warpcast shows OG image preview
- [ ] `/roast/[address]` route works
- [ ] Mobile view is accessible (buttons not covered)
- [ ] NFT minting works (2 USDC)
- [ ] Contract is verified on Basescan

## Need Help?

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Test locally first with `npm run build`

---

**Ready to deploy?** Follow the steps above and your app will be live in minutes! 🚀

