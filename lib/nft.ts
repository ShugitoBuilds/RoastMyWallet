import { ScorecardData } from "./scorecard";

// Contract addresses
export const ROAST_NFT_ADDRESS = process.env.NEXT_PUBLIC_ROAST_NFT_ADDRESS as `0x${string}` | undefined;
export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;

// Mint price: 2 USDC (6 decimals)
export const NFT_MINT_PRICE = BigInt(2 * 10 ** 6);

// RoastNFT ABI (only the functions we need)
export const ROAST_NFT_ABI = [
  {
    name: "mint",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "uri", type: "string" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

// ERC20 ABI for USDC approval
export const ERC20_APPROVE_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

// Generate token URI for the NFT metadata
export function generateTokenURI(scorecard: ScorecardData): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://roastmywallet.xyz";
  
  // Create metadata JSON
  const metadata = {
    name: `Roast Certificate #${scorecard.id}`,
    description: `A permanent record of portfolio shame. Grade: ${scorecard.grade}. "${scorecard.roastText.substring(0, 100)}..."`,
    image: `${baseUrl}/api/scorecard/${scorecard.id}?grade=${scorecard.grade}&gradeColor=${encodeURIComponent(scorecard.gradeColor)}&wallet=${scorecard.walletAddress.slice(0, 6)}...${scorecard.walletAddress.slice(-4)}&bagholder=${scorecard.topBagholder}&timeBroke=${encodeURIComponent(scorecard.timeUntilBroke)}&tokenCount=${scorecard.tokenCount}&roastType=${scorecard.roastType}`,
    external_url: baseUrl,
    attributes: [
      {
        trait_type: "Grade",
        value: scorecard.grade,
      },
      {
        trait_type: "Score",
        value: scorecard.score,
      },
      {
        trait_type: "Top Bagholder",
        value: scorecard.topBagholder,
      },
      {
        trait_type: "Time Until Broke",
        value: scorecard.timeUntilBroke,
      },
      {
        trait_type: "Token Count",
        value: scorecard.tokenCount,
      },
      {
        trait_type: "Roast Type",
        value: scorecard.roastType,
      },
      {
        trait_type: "Has Meme Coins",
        value: scorecard.hasMemeCoins ? "Yes" : "No",
      },
      {
        trait_type: "Has Dead Coins",
        value: scorecard.hasDeadCoins ? "Yes" : "No",
      },
    ],
  };

  // For a real implementation, you'd upload this to IPFS
  // For now, we'll use a data URI or API endpoint
  return `${baseUrl}/api/nft/metadata/${scorecard.id}`;
}

// Check if NFT minting is available
export function isNFTMintingAvailable(): boolean {
  return !!ROAST_NFT_ADDRESS;
}

// Get OpenSea URL for a minted NFT
export function getOpenSeaUrl(tokenId: number): string {
  return `https://opensea.io/assets/base/${ROAST_NFT_ADDRESS}/${tokenId}`;
}

// Get BaseScan URL for a minted NFT
export function getBaseScanUrl(tokenId: number): string {
  return `https://basescan.org/token/${ROAST_NFT_ADDRESS}?a=${tokenId}`;
}



