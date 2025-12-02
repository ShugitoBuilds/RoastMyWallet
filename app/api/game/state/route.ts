import { NextRequest, NextResponse } from "next/server";
import { getOrCreateProfile, getJackpot, getGameLeaderboard } from "@/lib/game-db";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const address = searchParams.get("address");

        if (!address) {
            return NextResponse.json({ error: "Address required" }, { status: 400 });
        }

        // 1. Get User Profile
        const profile = await getOrCreateProfile(address);
        if (!profile) {
            return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
        }

        // 2. Get Jackpot for their league
        const jackpot = await getJackpot(profile.league);

        // 3. Get Leaderboard for their league
        const leaderboard = await getGameLeaderboard(profile.league);

        return NextResponse.json({
            profile,
            jackpot,
            leaderboard
        });

    } catch (error) {
        console.error("Error in game state API:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
