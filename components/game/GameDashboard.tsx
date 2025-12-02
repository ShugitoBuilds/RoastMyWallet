"use client";

import { useState, useEffect, useCallback } from "react";
import { GameProfile, JackpotData } from "@/lib/game-db";
import { ActionPanel } from "./ActionPanel";
import { Leaderboard } from "./Leaderboard";

interface GameDashboardProps {
    walletAddress: string;
}

export function GameDashboard({ walletAddress }: GameDashboardProps) {
    const [profile, setProfile] = useState<GameProfile | null>(null);
    const [jackpot, setJackpot] = useState<number>(0);
    const [leaderboard, setLeaderboard] = useState<GameProfile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchGameState = useCallback(async () => {
        try {
            const res = await fetch(`/api/game/state?address=${walletAddress}`);
            const data = await res.json();

            if (data.profile) {
                setProfile(data.profile);
                setJackpot(data.jackpot);
                setLeaderboard(data.leaderboard);
            }
        } catch (error) {
            console.error("Failed to fetch game state:", error);
        } finally {
            setLoading(false);
        }
    }, [walletAddress]);

    useEffect(() => {
        fetchGameState();
        // Poll every 10 seconds for live updates
        const interval = setInterval(fetchGameState, 10000);
        return () => clearInterval(interval);
    }, [fetchGameState]);

    if (loading) {
        return <div className="p-8 text-center text-charcoal-400 animate-pulse">Loading Game Data...</div>;
    }

    if (!profile) {
        return <div className="p-8 text-center text-red-400">Failed to load game profile.</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-charcoal-800/80 p-4 rounded-xl border border-charcoal-700 text-center">
                    <div className="text-xs text-charcoal-400 uppercase tracking-wider mb-1">My Score</div>
                    <div className="text-2xl font-mono font-bold text-white">{profile.current_score}</div>
                </div>
                <div className="bg-charcoal-800/80 p-4 rounded-xl border border-charcoal-700 text-center">
                    <div className="text-xs text-charcoal-400 uppercase tracking-wider mb-1">Matches</div>
                    <div className="text-2xl font-mono font-bold text-orange-400">🔥 {profile.matches_balance}</div>
                </div>
                <div className="bg-charcoal-800/80 p-4 rounded-xl border border-charcoal-700 text-center md:col-span-2 bg-gradient-to-r from-yellow-900/20 to-charcoal-800/80">
                    <div className="text-xs text-yellow-500/80 uppercase tracking-wider mb-1">
                        {profile.league} League Jackpot
                    </div>
                    <div className="text-2xl font-mono font-bold text-yellow-400">${jackpot.toFixed(2)}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <ActionPanel profile={profile} onActionComplete={fetchGameState} />

                    <div className="bg-charcoal-800/30 p-4 rounded-xl border border-charcoal-700/50 text-sm text-charcoal-400">
                        <h4 className="font-bold text-charcoal-300 mb-2">How to Play</h4>
                        <ul className="space-y-2 list-disc list-inside">
                            <li><strong className="text-orange-400">Stoke</strong> to boost your own score.</li>
                            <li><strong className="text-red-400">Shade</strong> to steal points from rivals.</li>
                            <li><strong className="text-blue-400">Cope</strong> to shield yourself from attacks.</li>
                            <li>Highest score wins the Jackpot!</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column: Leaderboard */}
                <div className="lg:col-span-2">
                    <Leaderboard
                        currentUser={profile}
                        players={leaderboard}
                        onActionComplete={fetchGameState}
                    />
                </div>
            </div>
        </div>
    );
}
