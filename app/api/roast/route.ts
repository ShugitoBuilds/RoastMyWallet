import { NextRequest, NextResponse } from "next/server";
import { generateRoast } from "@/lib/roast-generator";
import { getTokenBalances } from "@/lib/tokens";
import { createScorecard } from "@/lib/scorecard";
import { saveRoast, isSupabaseConfigured } from "@/lib/supabase";
import { createPublicClient, http, fallback } from "viem";
import { mainnet } from "viem/chains";

// Initialize public client for ENS resolution with reliable RPCs
const transport = process.env.ALCHEMY_API_KEY
  ? http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`)
  : fallback([
    http("https://cloudflare-eth.com"),
    http("https://rpc.ankr.com/eth"),
    http() // Default fallback
  ]);

const publicClient = createPublicClient({
  chain: mainnet,
  transport,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { address, type, submitToLeaderboard } = body;

    if (!address) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Handle ENS names
    if (address.endsWith(".eth")) {
      try {
        const resolvedAddress = await publicClient.getEnsAddress({
          name: address,
        });

        if (resolvedAddress) {
          address = resolvedAddress;
        } else {
          return NextResponse.json(
            { error: "Could not resolve ENS name" },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error("ENS resolution error:", error);
        return NextResponse.json(
          { error: "Failed to resolve ENS name" },
          { status: 400 }
        );
      }
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: "Invalid wallet address format" },
        { status: 400 }
      );
    }

    const roastType = type || "free";
    if (!["free", "premium", "friend"].includes(roastType)) {
      return NextResponse.json(
        { error: "Invalid roast type" },
        { status: 400 }
      );
    }

    // Generate the roast
    const roast = await generateRoast({
      address: address as string,
      type: roastType as "free" | "premium" | "friend",
    });

    // Get token data for scorecard
    let scorecard = null;
    try {
      const tokens = await getTokenBalances(address as `0x${string}`);
      scorecard = createScorecard(
        address,
        tokens,
        roast,
        roastType as "free" | "premium" | "friend"
      );

      // Save to Supabase if configured (always save for share functionality)
      if (isSupabaseConfigured()) {
        await saveRoast(scorecard, submitToLeaderboard || false);
      }
    } catch (scorecardError) {
      console.error("Error creating scorecard:", scorecardError);
      // Continue without scorecard
    }

    return NextResponse.json({ roast, scorecard });
  } catch (error) {
    console.error("Error in roast API:", error);
    return NextResponse.json(
      { error: "Failed to generate roast" },
      { status: 500 }
    );
  }
}


