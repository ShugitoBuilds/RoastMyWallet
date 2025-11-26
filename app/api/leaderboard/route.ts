import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard, getRecentRoasts, isSupabaseConfigured } from "@/lib/supabase";

// Mock data for when Supabase is not configured
const MOCK_LEADERBOARD = [
  {
    id: "mock_1",
    wallet_address: "0x1234...5678",
    grade: "F-",
    grade_color: "#991b1b",
    score: 5,
    top_bagholder: "RUGCOIN",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock_2",
    wallet_address: "0xabcd...efgh",
    grade: "F",
    grade_color: "#dc2626",
    score: 15,
    top_bagholder: "SCAMTOKEN",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock_3",
    wallet_address: "0x9876...5432",
    grade: "D-",
    grade_color: "#ef4444",
    score: 25,
    top_bagholder: "HOPIUM",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock_4",
    wallet_address: "0xdead...beef",
    grade: "D",
    grade_color: "#f97316",
    score: 35,
    top_bagholder: "MOONSHOT",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock_5",
    wallet_address: "0xcafe...babe",
    grade: "D+",
    grade_color: "#f97316",
    score: 45,
    top_bagholder: "PEPE",
    created_at: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "worst";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Return mock data for demo purposes
      return NextResponse.json({
        entries: MOCK_LEADERBOARD.slice(0, limit),
        isMock: true,
      });
    }

    let entries;
    if (type === "recent") {
      entries = await getRecentRoasts(limit);
    } else {
      entries = await getLeaderboard(limit);
    }

    return NextResponse.json({
      entries,
      isMock: false,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}



