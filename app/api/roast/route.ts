import { NextRequest, NextResponse } from "next/server";
import { generateRoast } from "@/lib/roast-generator";
import { getTokenBalances } from "@/lib/tokens";
import { createScorecard } from "@/lib/scorecard";
import { saveRoast, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, type, submitToLeaderboard } = body;

    if (!address) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
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


