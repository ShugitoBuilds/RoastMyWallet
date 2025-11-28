"use client";

import { useState, useEffect } from "react";
import { ScorecardData } from "@/lib/scorecard";
// import { MintButton } from "./MintButton"; // Disabled for MVP

interface RoastDisplayProps {
  roast: string;
  type: "free" | "premium" | "friend";
  scorecard?: ScorecardData;
  onReset?: () => void;
}

// Icon components
function FlameIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
    </svg>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 1l2.5 5 5.5.5-4 4 1 5.5L10 13.5 4.5 16l1-5.5-4-4L7 6l3-5z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function WarpcastIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.24 4.5H5.76A1.26 1.26 0 004.5 5.76v12.48a1.26 1.26 0 001.26 1.26h12.48a1.26 1.26 0 001.26-1.26V5.76a1.26 1.26 0 00-1.26-1.26zm-6.24 11.5a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
  );
}

export function RoastDisplay({ roast, type, scorecard, onReset }: RoastDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const getTypeConfig = () => {
    switch (type) {
      case "premium":
        return {
          label: "Premium Roast",
          icon: CrownIcon,
          gradient: "from-amber-500 to-flame-500",
          border: "border-amber-500/30",
          bg: "bg-amber-500/10",
        };
      case "friend":
        return {
          label: "Friend Roast",
          icon: UsersIcon,
          gradient: "from-flame-500 to-ember-500",
          border: "border-flame-500/30",
          bg: "bg-flame-500/10",
        };
      default:
        return {
          label: "Free Roast",
          icon: FlameIcon,
          gradient: "from-ember-500 to-flame-500",
          border: "border-ember-500/30",
          bg: "bg-ember-500/10",
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  const handleCopy = async () => {
    const text = scorecard
      ? `${config.label}\n\nGrade: ${scorecard.grade}\nTop Bagholder: $${scorecard.topBagholder}\nTime Until Broke: ${scorecard.timeUntilBroke}\n\n${roast}\n\nGet roasted at: ${window.location.origin}`
      : `${config.label}\n\n${roast}\n\nGet roasted at: ${window.location.origin}`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWarpcast = () => {
    const text = scorecard
      ? `I just got roasted by @roastmywallet\n\nGrade: ${scorecard.grade}\nTop Bagholder: $${scorecard.topBagholder}\nTime Until Broke: ${scorecard.timeUntilBroke}\n\nThink you can do worse?`
      : `I just got roasted! Think you can do worse?`;

    // Always use homepage URL
    const shareUrl = window.location.origin;

    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
    setShowShareMenu(false);
  };

  const handleShareTwitter = () => {
    // Always use homepage URL
    const shareUrl = window.location.origin;

    const text = scorecard
      ? `I just got my crypto portfolio roasted\n\nGrade: ${scorecard.grade}\nTop Bagholder: $${scorecard.topBagholder}\nTime Until Broke: ${scorecard.timeUntilBroke}\n\nGet roasted at`
      : `I just got my crypto portfolio roasted! Get roasted at`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
    setShowShareMenu(false);
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowShareMenu(false);
    if (showShareMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showShareMenu]);

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.border} border`}>
          <Icon className={`w-4 h-4 bg-gradient-to-r ${config.gradient} bg-clip-text text-flame-500`} />
          <span className={`text-sm font-display font-semibold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
            {config.label}
          </span>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-display font-semibold text-white bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 hover:border-charcoal-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>New Roast</span>
          </button>
        )}
      </div>

      {/* Scorecard Preview (if available) */}
      {scorecard && (
        <div className={`p-6 rounded-xl bg-charcoal-800/30 border ${config.border}`}>
          <div className="text-center mb-4">
            <p className="text-xs text-charcoal-500 uppercase tracking-wider mb-2">
              Certificate of Portfolio Failure
            </p>
          </div>

          {/* Grade Circle */}
          <div className="flex justify-center mb-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center border-4"
              style={{
                borderColor: scorecard.gradeColor,
                backgroundColor: `${scorecard.gradeColor}20`
              }}
            >
              <span
                className="text-4xl font-display font-bold"
                style={{ color: scorecard.gradeColor }}
              >
                {scorecard.grade}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-charcoal-900/50">
              <p className="text-xs text-charcoal-500 mb-1">Top Bagholder</p>
              <p className="text-sm font-semibold text-ember-400">${scorecard.topBagholder}</p>
            </div>
            <div className="p-3 rounded-lg bg-charcoal-900/50">
              <p className="text-xs text-charcoal-500 mb-1">Time Until Broke</p>
              <p className="text-sm font-semibold text-flame-400">{scorecard.timeUntilBroke}</p>
            </div>
            <div className="p-3 rounded-lg bg-charcoal-900/50">
              <p className="text-xs text-charcoal-500 mb-1">Tokens</p>
              <p className="text-sm font-semibold text-charcoal-300">{scorecard.tokenCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Detected Tokens (for debugging/transparency) */}
      {scorecard && scorecard.tokenCount > 0 && (
        <details className="p-4 rounded-xl bg-charcoal-800/20 border border-charcoal-700/30">
          <summary className="cursor-pointer select-none text-sm font-semibold text-charcoal-400 hover:text-charcoal-300 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Detected Tokens ({scorecard.tokenCount})
          </summary>
          <div className="mt-3 space-y-1 text-xs text-charcoal-500">
            {scorecard.tokenSummary?.split(', ').map((token: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                <span>{token}</span>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Roast content */}
      <div className={`relative p-6 rounded-xl ${config.bg} border ${config.border} overflow-hidden`}>
        {/* Decorative gradient */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`} />

        <p className="text-charcoal-200 leading-relaxed whitespace-pre-wrap font-body">
          {roast}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display font-semibold transition-all duration-300 ${copied
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-charcoal-800/50 text-charcoal-300 border border-charcoal-700/50 hover:bg-charcoal-800 hover:text-white"
            }`}
        >
          {copied ? (
            <>
              <CheckIcon className="w-5 h-5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-5 h-5" />
              <span>Copy</span>
            </>
          )}
        </button>

        {/* Share dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShareMenu(!showShareMenu);
            }}
            className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-display font-semibold transition-all duration-300 bg-gradient-to-r ${config.gradient} text-white hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]`}
          >
            <ShareIcon className="w-5 h-5" />
            <span>Share</span>
          </button>

          {/* Dropdown menu */}
          {showShareMenu && (
            <div className="absolute right-0 bottom-full mb-2 w-48 bg-charcoal-900 border border-charcoal-800 rounded-xl shadow-xl overflow-hidden z-10">
              <button
                onClick={handleShareWarpcast}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-charcoal-200 hover:bg-charcoal-800 transition-colors"
              >
                <WarpcastIcon className="w-5 h-5 text-purple-400" />
                <span>Share to Warpcast</span>
              </button>
              <button
                onClick={handleShareTwitter}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-charcoal-200 hover:bg-charcoal-800 transition-colors"
              >
                <TwitterIcon className="w-5 h-5" />
                <span>Share to X</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* NFT Minting - Disabled for MVP */}
      {/* {scorecard && (
        <MintButton scorecard={scorecard} />
      )} */}
    </div>
  );
}
