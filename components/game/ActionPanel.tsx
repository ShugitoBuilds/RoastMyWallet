"use client";

import { useState } from "react";
import { GameProfile } from "@/lib/game-db";

interface ActionPanelProps {
    profile: GameProfile;
    onActionComplete: () => void;
}

export function ActionPanel({ profile, onActionComplete }: ActionPanelProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleAction = async (action: 'stoke' | 'cope') => {
        setLoading(action);
        setMessage(null);

        try {
            const res = await fetch('/api/game/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    actor: profile.wallet_address
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Action failed');
            }

            setMessage({ text: data.message, type: 'success' });
            onActionComplete();
        } catch (err: any) {
            setMessage({ text: err.message, type: 'error' });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="bg-charcoal-800/50 rounded-xl p-6 border border-charcoal-700">
            <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                <span>🔥</span> Actions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* STOKE */}
                <button
                    onClick={() => handleAction('stoke')}
                    disabled={!!loading || profile.matches_balance < 1}
                    className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-orange-500 to-red-600 p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-lg font-bold text-white">Stoke Fire</span>
                            <span className="bg-black/30 px-2 py-1 rounded text-xs text-white font-mono">1 Match</span>
                        </div>
                        <p className="text-orange-100 text-sm">Boost your score by +10 points. Climb the trash heap.</p>
                    </div>
                </button>

                {/* COPE */}
                <button
                    onClick={() => handleAction('cope')}
                    disabled={!!loading || profile.matches_balance < 5}
                    className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-lg font-bold text-white">Cope Shield</span>
                            <span className="bg-black/30 px-2 py-1 rounded text-xs text-white font-mono">5 Matches</span>
                        </div>
                        <p className="text-blue-100 text-sm">Protect yourself from shade for 1 hour. Block the haters.</p>
                    </div>
                </button>
            </div>

            {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm text-center ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}
