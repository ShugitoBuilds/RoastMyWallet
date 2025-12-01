"use client";

import { useEffect, useState } from "react";
import { getActiveSeason } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

function FireAnimation() {
    return (
        <div className="relative w-32 h-32 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-t from-flame-500 via-ember-500 to-transparent rounded-full blur-xl animate-pulse-slow opacity-50" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-6xl animate-bounce-slow">
                🔥
            </div>
        </div>
    );
}

export function CampfireHeader() {
    const [potSize, setPotSize] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [seasonName, setSeasonName] = useState<string>("Loading...");

    useEffect(() => {
        async function fetchSeasonData() {
            const season = await getActiveSeason();
            if (season) {
                setPotSize(Number(season.current_pot_size) || 0);
                setSeasonName(season.name);

                const end = new Date(season.end_time);
                setTimeLeft(formatDistanceToNow(end, { addSuffix: true }));
            } else {
                setSeasonName("No Active Season");
            }
        }

        fetchSeasonData();
        // Poll every minute for updates
        const interval = setInterval(fetchSeasonData, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-center space-y-6 py-8 animate-in fade-in duration-700">
            <FireAnimation />

            <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold text-charcoal-200 tracking-wide uppercase">
                    {seasonName}
                </h2>

                <div className="inline-flex items-center gap-4 bg-charcoal-800/50 px-6 py-3 rounded-2xl border border-charcoal-700/50 backdrop-blur-sm">
                    <div className="text-center">
                        <p className="text-xs text-charcoal-500 uppercase tracking-wider font-mono">Current Pot</p>
                        <p className="font-display text-3xl font-bold text-emerald-400">
                            ${potSize.toFixed(2)}
                        </p>
                    </div>

                    <div className="w-px h-10 bg-charcoal-700/50" />

                    <div className="text-center">
                        <p className="text-xs text-charcoal-500 uppercase tracking-wider font-mono">Ends In</p>
                        <p className="font-display text-xl font-bold text-flame-400">
                            {timeLeft.replace("in ", "")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
