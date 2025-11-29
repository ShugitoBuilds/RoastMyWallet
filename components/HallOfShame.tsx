"use client";

import { useState, useEffect } from "react";

interface LeaderboardEntry {
  id: string;
  wallet_address: string;
  grade: string;
  grade_color: string;
  score: number;
  top_bagholder: string;
  created_at: string;
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 00-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 00-.552.698 5 5 0 004.503 5.152 6 6 0 002.946 1.822A6.451 6.451 0 017.768 13H7.5A1.5 1.5 0 006 14.5V17h-.75C4.56 17 4 17.56 4 18.25v.5c0 .69.56 1.25 1.25 1.25h9.5c.69 0 1.25-.56 1.25-1.25v-.5c0-.69-.56-1.25-1.25-1.25H14v-2.5a1.5 1.5 0 00-1.5-1.5h-.268a6.453 6.453 0 01-.684-2.202 6 6 0 002.946-1.822 5 5 0 004.503-5.152.75.75 0 00-.552-.698A31.804 31.804 0 0016 2.562v-.387a.75.75 0 00-.629-.74A33.227 33.227 0 0010 1zM2.525 4.422C3.012 4.3 3.504 4.19 4 4.09V5c0 .74.134 1.448.38 2.103a3.503 3.503 0 01-1.855-2.68zm14.95 0a3.503 3.503 0 01-1.854 2.68C15.866 6.449 16 5.74 16 5v-.91c.496.1.988.21 1.475.332z" clipRule="evenodd" />
    </svg>
  );
}

function SkullIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 2a8 8 0 00-8 8c0 2.972 1.63 5.567 4.042 6.936a.75.75 0 00.366.096h7.184a.75.75 0 00.366-.096A8.001 8.001 0 0010 2zM7.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM10 14a4 4 0 01-4-4h1a3 3 0 006 0h1a4 4 0 01-4 4z" clipRule="evenodd" />
    </svg>
  );
}

export function HallOfShame() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch("/api/leaderboard?type=worst&limit=5");
        const data = await response.json();
        setEntries(data.entries || []);
        setIsMock(data.isMock || false);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-charcoal-800 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-charcoal-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="animated-border-container rounded-2xl" style={{ "--border-color": "#fbbf24" } as React.CSSProperties}>
      <div className="animated-border-content card p-6 space-y-4 shadow-[0_0_30px_-5px_rgba(251,191,36,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-ember-500/20">
              <SkullIcon className="w-5 h-5 text-ember-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-amber-400 animate-pulse">
                Hall of Shame
              </h3>
              <p className="text-xs text-charcoal-500">Worst portfolios today</p>
            </div>
          </div>
          {isMock && (
            <span className="text-xs text-charcoal-600 bg-charcoal-800 px-2 py-1 rounded">
              Demo Data
            </span>
          )}
        </div>

        {/* Leaderboard entries */}
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-charcoal-800/30 border border-charcoal-800/50 hover:border-charcoal-700/50 transition-colors"
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8">
                {index === 0 ? (
                  <TrophyIcon className="w-6 h-6 text-amber-400" />
                ) : (
                  <span className="text-lg font-display font-bold text-charcoal-500">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Grade */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-bold"
                style={{
                  borderColor: entry.grade_color,
                  color: entry.grade_color,
                  backgroundColor: `${entry.grade_color}20`,
                }}
              >
                {entry.grade}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-charcoal-300 truncate">
                  {entry.wallet_address}
                </p>
                <p className="text-xs text-charcoal-500">
                  Top bag: <span className="text-ember-400">${entry.top_bagholder}</span>
                </p>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="text-xs text-charcoal-500">Score</p>
                <p className="text-sm font-semibold text-charcoal-300">{entry.score}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-charcoal-800">
          <p className="text-xs text-charcoal-600 text-center">
            Submit your roast to compete for the worst portfolio
          </p>
        </div>
      </div>
    </div>
  );
}



