import { NextRequest, NextResponse } from "next/server";
import { generateRoast } from "@/lib/roast-generator";
import { getTokenBalances } from "@/lib/tokens";
import { createScorecard } from "@/lib/scorecard";
import { saveRoast, isSupabaseConfigured, getActiveSeason, updatePlayer, logRoastEvent, checkRoastCooldown, incrementPot } from "@/lib/supabase";
import { calculatePoints } from "@/lib/game-logic";
import { createPublicClient, http, fallback } from "viem";
import { mainnet } from "viem/chains";

// Initialize public client for ENS resolution with reliable RPCs
// Initialize public client for ENS resolution with reliable RPCs
const transports = [];

// Add Alchemy if configured and not a placeholder
const alchemyKey = process.env.ALCHEMY_API_KEY;
if (alchemyKey && !alchemyKey.includes("YOUR_NEW_ALCHEMY_API_KEY")) {
  transports.push(http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`));
}

// Add reliable public fallbacks with explicit timeouts
transports.push(http("https://cloudflare-eth.com", { timeout: 10_000 }));
transports.push(http("https://eth.llama.rpc.com", { timeout: 10_000 }));
transports.push(http("https://rpc.ankr.com/eth", { timeout: 10_000 }));
transports.push(http("https://1rpc.io/eth", { timeout: 10_000 }));

const transport = fallback(transports);

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

    // --- GAMIFICATION LOGIC ---
    // Default roaster to target if not provided (self-roast)
    const roaster = body.roasterAddress || address;

    // 1. Anti-Spam Check
    if (isSupabaseConfigured()) {
      const isSpam = await checkRoastCooldown(roaster, address);
      if (isSpam) {
        return NextResponse.json(
          { error: "You've already roasted this wallet in the last 24 hours. Give them a break!" },
          { status: 429 }
        );
      }
    }

    // Generate the roast
    const roast = await generateRoast({
      address: address as string,
      type: roastType as "free" | "premium" | "friend",
    });

    // 2. Game State Updates
    if (isSupabaseConfigured()) {
      try {
        const activeSeason = await getActiveSeason();

        if (activeSeason) {
          // Calculate Points
          const isFriendRoast = roaster.toLowerCase() !== (address as string).toLowerCase();
          const { points } = calculatePoints(new Date(activeSeason.start_time), isFriendRoast);

          // Update Player
          await updatePlayer(roaster, points);

          // Log Event
          await logRoastEvent(roaster, address as string, roastType, points);

          // Increment Pot (e.g., $0.50 per roast)
          await incrementPot(activeSeason.id, 0.50);
        }
      } catch (gameError) {
        console.error("Error updating game state:", gameError);
        // Don't fail the roast if game logic fails
      }
    }

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


