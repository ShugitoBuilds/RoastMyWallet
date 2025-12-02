"use client";

import { useState } from "react";
import { GameProfile } from "@/lib/game-db";

interface LeaderboardProps {
    currentUser: GameProfile;
    players: GameProfile[];
    onActionComplete: () => void;
}

export function Leaderboard({ currentUser, players, onActionComplete }: LeaderboardProps) {
    const [attacking, setAttacking] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleShade = async (targetWallet: string) => {
        if (currentUser.matches_balance < 1) return;

        setAttacking(targetWallet);
        setMessage(null);

        try {
            const res = await fetch('/api/game/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'shade',
                    actor: currentUser.wallet_address,
                    target: targetWallet
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Attack failed');
            }

            setMessage({ text: data.message, type: data.success ? 'success' : 'error' }); // Success false means blocked
            onActionComplete();
        } catch (err: any) {
            setMessage({ text: err.message, type: 'error' });
        } finally {
            setAttacking(null);
        }
    };

    return (
        <div className="bg-charcoal-800/50 rounded-xl border border-charcoal-700 overflow-hidden">
            <div className="p-4 border-b border-charcoal-700 bg-charcoal-900/50 flex justify-between items-center">
                <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <span>👑</span> Dumpster Kings
                </h3>
                <span className="text-xs text-charcoal-400 uppercase tracking-wider font-semibold">
                    {currentUser.league} League
                </span>
            </div>

            {message && (
                <div className={`p-3 text-sm text-center ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {message.text}
                </div>
            )}

            <div className="divide-y divide-charcoal-700/50">
                {players.map((player, index) => {
                    const isMe = player.wallet_address === currentUser.wallet_address;
                    const isShielded = player.shield_active_until && new Date(player.shield_active_until) > new Date();

                    return (
                        <div
                            key={player.wallet_address}
                            className={`p-4 flex items-center justify-between transition-colors ${isMe ? 'bg-yellow-500/10' : 'hover:bg-charcoal-700/30'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono ${index < 3 ? 'bg-yellow-500 text-black' : 'bg-charcoal-700 text-charcoal-300'}`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-mono text-sm ${isMe ? 'text-yellow-400 font-bold' : 'text-charcoal-200'}`}>
                                            {player.wallet_address.slice(0, 6)}...{player.wallet_address.slice(-4)}
                                            {isMe && " (You)"}
                                        </span>
                                        {isShielded && <span title="Shielded">🛡️</span>}
                                    </div>
                                    <div className="text-xs text-charcoal-400">
                                        Score: <span className="text-white font-mono">{player.current_score}</span>
                                    </div>
                                </div>
                            </div>

                            {!isMe && (
                                <button
                                    onClick={() => handleShade(player.wallet_address)}
                                    disabled={!!attacking || currentUser.matches_balance < 1}
                                    className="px-3 py-1.5 rounded bg-charcoal-700 hover:bg-red-500/20 hover:text-red-400 text-charcoal-300 text-xs font-bold transition-all border border-charcoal-600 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                    {attacking === player.wallet_address ? '...' : '🧯 Shade'}
                                </button>
                            )}
                        </div>
                    );
                })}

                {players.length === 0 && (
                    <div className="p-8 text-center text-charcoal-500">
                        No trash in this dumpster yet.
                    </div>
                )}
            </div>
        </div>
    );
}
