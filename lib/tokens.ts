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

  const checksummedAddress = safeGetAddress(address);
  if (!checksummedAddress) {
    console.error(`[getTokenBalances] Invalid wallet address: ${address}`);
    return tokens;
  }

  console.log(`[getTokenBalances] Fetching balances for address: ${checksummedAddress}`);

  // Use Alchemy API if available
  const alchemyApiKey = process.env.ALCHEMY_API_KEY;

  // Debug logging to diagnose environment variable loading
  console.info(`[DEBUG] ALCHEMY_API_KEY exists: ${!!alchemyApiKey}`);
  console.info(`[DEBUG] ALCHEMY_API_KEY length: ${alchemyApiKey?.length || 0}`);
  console.info(`[DEBUG] ALCHEMY_API_KEY first 10 chars: ${alchemyApiKey ? alchemyApiKey.substring(0, 10) : 'UNDEFINED'}`);

  if (alchemyApiKey) {
    try {
      console.log(`[getTokenBalances] Using Alchemy API`);

      // Get all token balances from Alchemy
      const response = await fetch(
        `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "alchemy_getTokenBalances",
            params: [checksummedAddress],
            id: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Alchemy API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.result && data.result.tokenBalances) {
        console.log(`[getTokenBalances] Found ${data.result.tokenBalances.length} tokens from Alchemy`);

        // Fetch metadata for each token with a balance
        for (const tokenData of data.result.tokenBalances) {
          const tokenBalance = BigInt(tokenData.tokenBalance || "0");

          if (tokenBalance > BigInt(0)) {
            try {
              const tokenAddress = safeGetAddress(tokenData.contractAddress);
              if (!tokenAddress) continue;

              // Get token metadata from Alchemy
              const metadataResponse = await fetch(
                `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "alchemy_getTokenMetadata",
                    params: [tokenAddress],
                    id: 1,
                  }),
                }
              );

              const metadata = await metadataResponse.json();

              if (metadata.result) {
                const decimals = metadata.result.decimals || 18;
                const symbol = metadata.result.symbol || "UNKNOWN";
                const name = metadata.result.name || "Unknown Token";
                const formattedBalance = formatUnits(tokenBalance, decimals);
                const balanceNumber = parseFloat(formattedBalance);

                // Filter out dust/spam tokens (< 0.0001 balance)
                // Always include major tokens regardless of balance
                const majorTokens = ['ETH', 'WETH', 'USDC', 'USDT', 'DAI'];
                const MINIMUM_BALANCE = 0.0001;

                if (balanceNumber >= MINIMUM_BALANCE || majorTokens.includes(symbol)) {
                  tokens.push({
                    address: tokenAddress,
                    name: name,
                    symbol: symbol,
                    balance: formattedBalance,
                    decimals: decimals,
                  });
                } else {
                  console.info(`[getTokenBalances] Filtered out dust token: ${symbol} (${balanceNumber})`);
                }
              }
            } catch (error) {
              console.error(`[getTokenBalances] Error fetching metadata:`, error);
            }
          }
        }
      }

      // Also get ETH balance
      try {
        const ethBalance = await publicClient.getBalance({
          address: checksummedAddress,
        });

        console.log(`[getTokenBalances] ETH balance raw: ${ethBalance.toString()}`);

        if (ethBalance > 0n) {
          const formattedBalance = formatUnits(ethBalance, 18);
          console.log(`[getTokenBalances] ETH balance formatted: ${formattedBalance}`);

          tokens.unshift({
            address: "0x0000000000000000000000000000000000000000",
            name: "Ethereum",
            symbol: "ETH",
            balance: formattedBalance,
            decimals: 18,
          });
        }
      } catch (ethError) {
        console.error(`[getTokenBalances] Error fetching ETH balance:`, ethError);
      }

      console.info(`[getTokenBalances] Total tokens found: ${tokens.length}`, tokens.map(t => t.symbol));
      console.info(`[getTokenBalances] Detailed token list:`, tokens.map(t => `${t.symbol} (${t.name}): ${t.balance}`));
      return tokens;

    } catch (error) {
      console.error(`[getTokenBalances] Alchemy API error, falling back to hardcoded tokens:`, error);
    }
  }

  // Fallback: Check ETH balance and common tokens if Alchemy fails
  console.log(`[getTokenBalances] Using fallback method (hardcoded tokens)`);

  try {
    const ethBalance = await publicClient.getBalance({
      address: checksummedAddress,
    });

    if (ethBalance > 0n) {
      tokens.push({
        address: "0x0000000000000000000000000000000000000000",
        name: "Ethereum",
        symbol: "ETH",
        balance: formatUnits(ethBalance, 18),
        decimals: 18,
      });
    }
  } catch (ethError) {
    console.error(`[getTokenBalances] Error fetching ETH balance:`, ethError);
  }

  // Get balances for common tokens (fallback)
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
      ]) as [bigint, number, string, string];

      if (balance > BigInt(0)) {
        tokens.push({
          address: tokenAddress,
          name: name,
          symbol: symbol,
          balance: formatUnits(balance, decimals),
          decimals: decimals,
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



