"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAccount } from "wagmi";

interface Player {
    wallet_address: string;
    current_season_points: number;
    total_roasts: number;
}

export function LiveLeaderboard() {
    const { address, isConnected } = useAccount();
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [attacking, setAttacking] = useState<string | null>(null);

    const fetchLeaderboard = async () => {
        if (!supabase) return;

        const { data, error } = await supabase
            .from("players")
            .select("wallet_address, current_season_points, total_roasts")
            .order("current_season_points", { ascending: false })
            .limit(50);

        if (error) {
            console.error("Error fetching leaderboard:", error);
        } else {
            setPlayers(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLeaderboard();

        if (!supabase) return;

        // Realtime subscription
        const channel = supabase
            .channel("leaderboard_updates")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "players" },
                () => {
                    fetchLeaderboard(); // Refresh on any change
                }
            )
            .subscribe();

        return () => {
            if (supabase) supabase.removeChannel(channel);
        };
    }, []);

    const handleThrowShade = async (victimAddress: string) => {
        if (!isConnected || !address) return;

        setAttacking(victimAddress);

        try {
            const response = await fetch("/api/shade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    attacker: address,
                    victim: victimAddress
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`😈 Success! You stole ${data.stolen} points from them!`);
                fetchLeaderboard(); // Immediate refresh
            } else {
                alert(`❌ Failed: ${data.error}`);
            }
        } catch (error) {
            console.error("Error throwing shade:", error);
            alert("Something went wrong throwing shade.");
        } finally {
            setAttacking(null);
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-2xl mx-auto p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-flame-500 border-t-transparent rounded-full mx-auto" />
                <p className="mt-4 text-charcoal-500 text-sm">Loading leaderboard...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
                <h3 className="font-display text-xl font-bold text-charcoal-200">
                    🔥 Dumpster Kings 🔥
                </h3>
                <p className="text-charcoal-500 text-sm">
                    Top 50 worst wallets. Throw shade to steal their points!
                </p>
            </div>

            <div className="bg-charcoal-900/50 border border-charcoal-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-charcoal-800/50 text-charcoal-400 font-medium uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Rank</th>
                                <th className="px-6 py-4">Wallet</th>
                                <th className="px-6 py-4 text-right">Points</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal-800/50">
                            {players.map((player, index) => {
                                const isMe = address && player.wallet_address.toLowerCase() === address.toLowerCase();
                                const rank = index + 1;

                                return (
                                    <tr
                                        key={player.wallet_address}
                                        className={`group transition-colors hover:bg-charcoal-800/30 ${isMe ? "bg-flame-500/5 hover:bg-flame-500/10" : ""}`}
                                    >
                                        <td className="px-6 py-4 font-mono text-charcoal-500">
                                            {rank === 1 ? "👑" : `#${rank}`}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-charcoal-300">
                                            {isMe ? (
                                                <span className="text-flame-400 font-bold">YOU</span>
                                            ) : (
                                                `${player.wallet_address.slice(0, 6)}...${player.wallet_address.slice(-4)}`
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right font-display font-bold text-emerald-400">
                                            {player.current_season_points.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {!isMe && isConnected && (
                                                <button
                                                    onClick={() => handleThrowShade(player.wallet_address)}
                                                    disabled={!!attacking}
                                                    className="text-xs font-bold text-charcoal-500 hover:text-flame-400 transition-colors disabled:opacity-50"
                                                    title="Throw Shade (-$0.50, Steal 5%)"
                                                >
                                                    {attacking === player.wallet_address ? "⚔️..." : "⚔️ SHADE"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {players.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-charcoal-500 italic">
                                        No players yet. Be the first to get roasted!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
