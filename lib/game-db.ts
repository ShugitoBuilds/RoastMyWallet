import { supabase } from "./supabase";

export interface GameProfile {
    wallet_address: string;
    matches_balance: number;
    last_daily_claim: string;
    league: 'shrimp' | 'dolphin' | 'whale';
    current_score: number;
    shield_active_until: string | null;
}

export interface JackpotData {
    league: string;
    amount: number;
}

// Get or Create Profile
export async function getOrCreateProfile(walletAddress: string): Promise<GameProfile | null> {
    if (!supabase) return null;

    // Try to get existing
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("wallet_address", walletAddress)
        .single();

    if (data) return data;

    if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error);
        return null;
    }

    // Create new if not found
    const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({ wallet_address: walletAddress })
        .select()
        .single();

    if (createError) {
        console.error("Error creating profile:", createError);
        return null;
    }

    return newProfile;
}

// Get Jackpot for a league
export async function getJackpot(league: string): Promise<number> {
    if (!supabase) return 0;

    const { data, error } = await supabase
        .from("jackpot")
        .select("amount")
        .eq("league", league)
        .single();

    if (error) {
        console.error("Error fetching jackpot:", error);
        return 0;
    }

    return data?.amount || 0;
}

// Get Leaderboard
export async function getGameLeaderboard(league: string, limit: number = 50): Promise<GameProfile[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("league", league)
        .order("current_score", { ascending: false }) // Higher score = King of Dumpster
        .limit(limit);

    if (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }

    return data || [];
}

// ACTION: Stoke (Boost Self)
// Cost: 1 Match -> +10 Score
export async function performStoke(walletAddress: string): Promise<{ success: boolean; message: string; newScore?: number; newBalance?: number }> {
    if (!supabase) return { success: false, message: "Database not connected" };

    // 1. Get Profile
    const profile = await getOrCreateProfile(walletAddress);
    if (!profile) return { success: false, message: "Profile not found" };

    // 2. Check Balance
    if (profile.matches_balance < 1) {
        return { success: false, message: "Not enough matches" };
    }

    // 3. Update Profile (Atomic-ish via single update)
    const newScore = (profile.current_score || 0) + 10;
    const newBalance = profile.matches_balance - 1;

    const { error: updateError } = await supabase
        .from("profiles")
        .update({ current_score: newScore, matches_balance: newBalance })
        .eq("wallet_address", walletAddress);

    if (updateError) {
        console.error("Error performing stoke:", updateError);
        return { success: false, message: "Failed to update profile" };
    }

    // 4. Log Action
    await supabase.from("game_actions").insert({
        actor_wallet: walletAddress,
        action_type: "stoke",
        cost: 1
    });

    // 5. Fund Jackpot (50% of cost -> 0.5 matches? No, matches are credits. 
    // Real money funds jackpot when matches are bought. 
    // For now, burning matches just removes them from circulation.)

    return { success: true, message: "Stoked! +10 Score", newScore, newBalance };
}

// ACTION: Shade (Attack Rival)
// Cost: 1 Match -> -10 Score to Target
export async function performShade(attackerWallet: string, targetWallet: string): Promise<{ success: boolean; message: string }> {
    if (!supabase) return { success: false, message: "Database not connected" };

    // 1. Get Attacker Profile
    const attacker = await getOrCreateProfile(attackerWallet);
    if (!attacker) return { success: false, message: "Attacker profile not found" };

    if (attacker.matches_balance < 1) {
        return { success: false, message: "Not enough matches" };
    }

    // 2. Get Target Profile
    const target = await getOrCreateProfile(targetWallet);
    if (!target) return { success: false, message: "Target profile not found" };

    // 3. Check Shield
    if (target.shield_active_until && new Date(target.shield_active_until) > new Date()) {
        // Shield is active!
        // Deduct match from attacker anyway (wasted attempt)
        await supabase
            .from("profiles")
            .update({ matches_balance: attacker.matches_balance - 1 })
            .eq("wallet_address", attackerWallet);

        await supabase.from("game_actions").insert({
            actor_wallet: attackerWallet,
            target_wallet: targetWallet,
            action_type: "shade",
            cost: 1
        });

        return { success: false, message: "Attack Blocked! Target has a shield." };
    }

    // 4. Execute Attack
    const newTargetScore = Math.max(0, (target.current_score || 0) - 10);

    // Update Target
    const { error: targetError } = await supabase
        .from("profiles")
        .update({ current_score: newTargetScore })
        .eq("wallet_address", targetWallet);

    if (targetError) return { success: false, message: "Failed to update target" };

    // Update Attacker (Deduct Match)
    await supabase
        .from("profiles")
        .update({ matches_balance: attacker.matches_balance - 1 })
        .eq("wallet_address", attackerWallet);

    // Log Action
    await supabase.from("game_actions").insert({
        actor_wallet: attackerWallet,
        target_wallet: targetWallet,
        action_type: "shade",
        cost: 1
    });

    return { success: true, message: "Shade Thrown! Target lost 10 points." };
}

// ACTION: Cope (Shield Self)
// Cost: 5 Matches -> 1 Hour Shield
export async function performCope(walletAddress: string): Promise<{ success: boolean; message: string }> {
    if (!supabase) return { success: false, message: "Database not connected" };

    const COST = 5;
    const DURATION_HOURS = 1;

    // 1. Get Profile
    const profile = await getOrCreateProfile(walletAddress);
    if (!profile) return { success: false, message: "Profile not found" };

    // 2. Check Balance
    if (profile.matches_balance < COST) {
        return { success: false, message: "Not enough matches" };
    }

    // 3. Calculate Shield Time
    const now = new Date();
    const shieldEnd = new Date(now.getTime() + DURATION_HOURS * 60 * 60 * 1000);

    // 4. Update Profile
    const { error } = await supabase
        .from("profiles")
        .update({
            matches_balance: profile.matches_balance - COST,
            shield_active_until: shieldEnd.toISOString()
        })
        .eq("wallet_address", walletAddress);

    if (error) return { success: false, message: "Failed to activate shield" };

    // 5. Log Action
    await supabase.from("game_actions").insert({
        actor_wallet: walletAddress,
        action_type: "cope",
        cost: COST
    });

    return { success: true, message: "Cope Shield Activated! Safe for 1 hour." };
}
