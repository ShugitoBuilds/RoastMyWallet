import { createClient } from "@supabase/supabase-js";
import { ScorecardData } from "./scorecard";

// Types for our database
export interface RoastRecord {
  id: string;
  wallet_address: string;
  grade: string;
  grade_color: string;
  score: number;
  top_bagholder: string;
  time_until_broke: string;
  roast_text: string;
  roast_type: "free" | "premium" | "friend";
  token_count: number;
  has_meme_coins: boolean;
  has_dead_coins: boolean;
  submitted_to_leaderboard: boolean;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  wallet_address: string;
  grade: string;
  grade_color: string;
  score: number;
  top_bagholder: string;
  created_at: string;
}

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client if credentials are available
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!supabase;
}

// Save a roast to the database
export async function saveRoast(scorecard: ScorecardData, submitToLeaderboard: boolean = false): Promise<RoastRecord | null> {
  if (!supabase) {
    console.warn("Supabase not configured, skipping save");
    return null;
  }

  const record: Omit<RoastRecord, "created_at"> = {
    id: scorecard.id,
    wallet_address: scorecard.walletAddress,
    grade: scorecard.grade,
    grade_color: scorecard.gradeColor,
    score: scorecard.score,
    top_bagholder: scorecard.topBagholder,
    time_until_broke: scorecard.timeUntilBroke,
    roast_text: scorecard.roastText,
    roast_type: scorecard.roastType,
    token_count: scorecard.tokenCount,
    has_meme_coins: scorecard.hasMemeCoins,
    has_dead_coins: scorecard.hasDeadCoins,
    submitted_to_leaderboard: submitToLeaderboard,
  };

  const { data, error } = await supabase
    .from("roasts")
    .insert(record)
    .select()
    .single();

  if (error) {
    console.error("Error saving roast:", error);
    return null;
  }

  return data;
}

// Get a roast by ID
export async function getRoastById(id: string): Promise<RoastRecord | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("roasts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching roast:", error);
    return null;
  }

  return data;
}

// Get the most recent roast by wallet address
export async function getRoastByAddress(address: string): Promise<RoastRecord | null> {
  if (!supabase) return null;

  // Normalize address to lowercase for comparison
  const normalizedAddress = address.toLowerCase();

  const { data, error } = await supabase
    .from("roasts")
    .select("*")
    .ilike("wallet_address", normalizedAddress)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching roast by address:", error);
    return null;
  }

  return data;
}

// Get leaderboard (worst portfolios)
export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("roasts")
    .select("id, wallet_address, grade, grade_color, score, top_bagholder, created_at")
    .eq("submitted_to_leaderboard", true)
    .order("score", { ascending: true }) // Lower score = worse portfolio
    .limit(limit);

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }

  return data || [];
}

// Get recent roasts
export async function getRecentRoasts(limit: number = 5): Promise<LeaderboardEntry[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("roasts")
    .select("id, wallet_address, grade, grade_color, score, top_bagholder, created_at")
    .eq("submitted_to_leaderboard", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent roasts:", error);
    return [];
  }

  return data || [];
}

// Update leaderboard submission status
export async function submitToLeaderboard(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase
    .from("roasts")
    .update({ submitted_to_leaderboard: true })
    .eq("id", id);

  if (error) {
    console.error("Error submitting to leaderboard:", error);
    return false;
  }

  return true;
}

// --- GAMIFICATION HELPERS ---

// Get active season
export async function getActiveSeason() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching active season:", error);
    return null;
  }
  return data;
}

// Get player data
export async function getPlayer(address: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("wallet_address", address)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignore not found error
    console.error("Error fetching player:", error);
  }
  return data;
}

// Update player points and stats
export async function updatePlayer(address: string, pointsToAdd: number) {
  if (!supabase) return null;

  // First try to get existing player
  const player = await getPlayer(address);

  if (player) {
    const { error } = await supabase
      .from("players")
      .update({
        current_season_points: (player.current_season_points || 0) + pointsToAdd,
        total_roasts: (player.total_roasts || 0) + 1,
        last_active_timestamp: new Date().toISOString()
      })
      .eq("wallet_address", address);

    if (error) console.error("Error updating player:", error);
  } else {
    // Create new player
    const { error } = await supabase
      .from("players")
      .insert({
        wallet_address: address,
        current_season_points: pointsToAdd,
        total_roasts: 1,
        last_active_timestamp: new Date().toISOString()
      });

    if (error) console.error("Error creating player:", error);
  }
}

// Log a roast event
export async function logRoastEvent(
  roaster: string,
  target: string,
  type: string,
  points: number
) {
  if (!supabase) return;

  const { error } = await supabase
    .from("roast_logs")
    .insert({
      roaster_address: roaster,
      target_address: target,
      roast_type: type,
      points_awarded: points
    });

  if (error) console.error("Error logging roast:", error);
}

// Check for spam (roasting same target within 24h)
export async function checkRoastCooldown(roaster: string, target: string): Promise<boolean> {
  if (!supabase) return false;

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("roast_logs")
    .select("id")
    .eq("roaster_address", roaster)
    .eq("target_address", target)
    .gt("created_at", twentyFourHoursAgo)
    .limit(1);

  if (error) {
    console.error("Error checking cooldown:", error);
    return false;
  }

  return data && data.length > 0;
}

// Increment season pot
export async function incrementPot(seasonId: string, amount: number) {
  if (!supabase) return;

  // Note: Supabase doesn't have a simple atomic increment without a function, 
  // so we'll fetch and update for now. In high scale, use an RPC.
  const { data: season } = await supabase
    .from("seasons")
    .select("current_pot_size")
    .eq("id", seasonId)
    .single();

  if (season) {
    const newPot = (Number(season.current_pot_size) || 0) + amount;
    await supabase
      .from("seasons")
      .update({ current_pot_size: newPot })
      .eq("id", seasonId);
  }
}

// Perform "Throw Shade" attack
export async function performAttack(attacker: string, victim: string, cost: number): Promise<{ success: boolean; stolen: number; error?: string }> {
  if (!supabase) return { success: false, stolen: 0, error: "Database not configured" };

  // 1. Get Victim Points
  const victimData = await getPlayer(victim);
  if (!victimData) return { success: false, stolen: 0, error: "Victim not found" };

  const victimPoints = victimData.current_season_points || 0;
  if (victimPoints <= 0) return { success: false, stolen: 0, error: "Victim has no points to steal" };

  // 2. Calculate Steal Amount (5% capped at 500)
  const stealAmount = Math.min(500, Math.floor(victimPoints * 0.05));
  if (stealAmount <= 0) return { success: false, stolen: 0, error: "Point value too low to steal" };

  // 3. Execute Updates (Sequential for now, RPC recommended for prod)

  // Deduct from Victim
  const { error: deductError } = await supabase
    .from("players")
    .update({ current_season_points: victimPoints - stealAmount })
    .eq("wallet_address", victim);

  if (deductError) return { success: false, stolen: 0, error: "Failed to deduct points" };

  // Add to Attacker
  const attackerData = await getPlayer(attacker);
  const attackerPoints = attackerData?.current_season_points || 0;

  await supabase
    .from("players")
    .update({ current_season_points: attackerPoints + stealAmount })
    .eq("wallet_address", attacker); // If attacker doesn't exist, this might fail if we don't upsert. 
  // Actually updatePlayer handles upsert, but here we are using raw update. 
  // Let's use updatePlayer helper logic or just upsert.
  // Better to use upsert here to be safe.

  if (!attackerData) {
    await supabase.from("players").insert({
      wallet_address: attacker,
      current_season_points: stealAmount,
      total_roasts: 0
    });
  } else {
    await supabase
      .from("players")
      .update({ current_season_points: attackerPoints + stealAmount })
      .eq("wallet_address", attacker);
  }

  // Log Attack
  await supabase
    .from("attacks")
    .insert({
      attacker_address: attacker,
      victim_address: victim,
      points_stolen: stealAmount,
      cost_amount: cost
    });

  return { success: true, stolen: stealAmount };
}

/*
SQL to create the roasts table in Supabase:

CREATE TABLE roasts (
  id TEXT PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  grade TEXT NOT NULL,
  grade_color TEXT NOT NULL,
  score INTEGER NOT NULL,
  top_bagholder TEXT NOT NULL,
  time_until_broke TEXT NOT NULL,
  roast_text TEXT NOT NULL,
  roast_type TEXT NOT NULL CHECK (roast_type IN ('free', 'premium', 'friend')),
  token_count INTEGER NOT NULL DEFAULT 0,
  has_meme_coins BOOLEAN NOT NULL DEFAULT false,
  has_dead_coins BOOLEAN NOT NULL DEFAULT false,
  submitted_to_leaderboard BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for leaderboard queries
CREATE INDEX idx_roasts_leaderboard ON roasts (submitted_to_leaderboard, score ASC);
CREATE INDEX idx_roasts_recent ON roasts (submitted_to_leaderboard, created_at DESC);

-- Enable Row Level Security
ALTER TABLE roasts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read roasts that are on the leaderboard
CREATE POLICY "Public roasts are viewable by everyone" ON roasts
  FOR SELECT USING (submitted_to_leaderboard = true);

-- Allow inserts from authenticated and anonymous users
CREATE POLICY "Anyone can insert roasts" ON roasts
  FOR INSERT WITH CHECK (true);
*/


