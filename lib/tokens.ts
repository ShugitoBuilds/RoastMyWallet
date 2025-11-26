import { createPublicClient, http, formatUnits, fallback, getAddress } from "viem";
import { base } from "viem/chains";

// Use multiple RPC endpoints with fallback for reliability
const publicClient = createPublicClient({
  chain: base,
  transport: fallback([
    http(process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org"),
    http("https://base.llamarpc.com"),
    http("https://1rpc.io/base"),
  ]),
});

// Helper to safely checksum an address
function safeGetAddress(address: string): `0x${string}` | null {
  try {
    return getAddress(address);
  } catch {
    console.error(`[safeGetAddress] Invalid address: ${address}`);
    return null;
  }
}

// ERC20 ABI for token balance
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
] as const;

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
}

// Common Base token addresses - will be checksummed at runtime
const COMMON_TOKEN_ADDRESSES = [
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
  "0x4200000000000000000000000000000000000006", // WETH
];

export async function getTokenBalances(address: `0x${string}`): Promise<TokenInfo[]> {
  const tokens: TokenInfo[] = [];

  // Ensure address is properly checksummed
  const checksummedAddress = safeGetAddress(address);
  if (!checksummedAddress) {
    console.error(`[getTokenBalances] Invalid wallet address: ${address}`);
    return tokens;
  }

  console.log(`[getTokenBalances] Fetching balances for address: ${checksummedAddress}`);

  // Get ETH balance with error handling
  try {
    const ethBalance = await publicClient.getBalance({ address: checksummedAddress });
    console.log(`[getTokenBalances] ETH balance raw: ${ethBalance.toString()}`);
    
    if (ethBalance > BigInt(0)) {
      const formattedBalance = formatUnits(ethBalance, 18);
      console.log(`[getTokenBalances] ETH balance formatted: ${formattedBalance}`);
      tokens.push({
        address: "0x0000000000000000000000000000000000000000",
        name: "Ethereum",
        symbol: "ETH",
        balance: formattedBalance,
        decimals: 18,
      });
    } else {
      console.log(`[getTokenBalances] ETH balance is zero`);
    }
  } catch (ethError) {
    console.error(`[getTokenBalances] Error fetching ETH balance:`, ethError);
  }

  // Get balances for common tokens
  for (const rawTokenAddress of COMMON_TOKEN_ADDRESSES) {
    const tokenAddress = safeGetAddress(rawTokenAddress);
    if (!tokenAddress) continue;
    
    try {
      const checksummedWalletAddress = safeGetAddress(address);
      if (!checksummedWalletAddress) continue;
      
      const [balance, decimals, symbol, name] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [checksummedWalletAddress],
        }),
        publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "decimals",
        }),
        publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "symbol",
        }),
        publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "name",
        }),
      ]);

      if (balance > BigInt(0)) {
        tokens.push({
          address: tokenAddress,
          name: name as string,
          symbol: symbol as string,
          balance: formatUnits(balance, decimals as number),
          decimals: decimals as number,
        });
      }
    } catch (error) {
      // Token might not exist or contract might not support these functions
      console.error(`[getTokenBalances] Error fetching token ${tokenAddress}:`, error);
    }
  }

  console.log(`[getTokenBalances] Total tokens found: ${tokens.length}`, tokens.map(t => t.symbol));
  return tokens;
}

export function analyzeTokens(tokens: TokenInfo[]): {
  totalTokens: number;
  hasDeadCoins: boolean;
  hasMemeCoins: boolean;
  tokenSummary: string;
} {
  const totalTokens = tokens.length;
  const tokenNames = tokens.map((t) => t.symbol).join(", ");
  
  // Simple heuristics for "dead coins" - tokens with very low balances
  const hasDeadCoins = tokens.some(
    (t) => parseFloat(t.balance) < 0.0001 && t.symbol !== "ETH"
  );

  // Heuristic for meme coins - common meme coin patterns
  const memePatterns = /PEPE|DOGE|SHIB|FLOKI|BONK|WIF|MEME/i;
  const hasMemeCoins = tokens.some((t) => memePatterns.test(t.symbol));

  return {
    totalTokens,
    hasDeadCoins,
    hasMemeCoins,
    tokenSummary: tokenNames || "No tokens found",
  };
}



