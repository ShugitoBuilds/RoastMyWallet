"use client";

import Link from "next/link";
import { RoastRecord } from "@/lib/supabase";
import { useState } from "react";

interface RoastPageClientProps {
    roast: RoastRecord;
}

// Icon components
function FlameIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
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

export function RoastPageClient({ roast }: RoastPageClientProps) {
    const [copied, setCopied] = useState(false);
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    const handleCopy = async () => {
        const text = `🔥 ROAST MY WALLET - Certificate of Portfolio Failure 🔥

Wallet: ${roast.wallet_address.slice(0, 6)}...${roast.wallet_address.slice(-4)}
Grade: ${roast.grade}
Top Bagholder: $${roast.top_bagholder}
Time Until Broke: ${roast.time_until_broke}

${roast.roast_text}

Get roasted at ${baseUrl}`;

        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getOneLiner = (text: string) => {
        // Try to get the first punchy sentence
        const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
        const firstSentence = sentences[0]?.trim();

        // If first sentence is short enough, use it. Otherwise use a generic hook.
        if (firstSentence && firstSentence.length < 100) {
            return `"${firstSentence}..."`;
        }
        return "My portfolio just got absolutely destroyed.";
    };

    const handleShareWarpcast = () => {
        const oneLiner = getOneLiner(roast.roast_text);
        const text = `${oneLiner}\n\nGrade: ${roast.grade}\nTop Bagholder: $${roast.top_bagholder}\nTime Until Broke: ${roast.time_until_broke}\n\nThink you can do worse?`;

        const shareUrl = `${baseUrl}/roast/${roast.id}`;
        const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(shareUrl)}`;
        window.open(url, "_blank");
    };

    const handleShareTwitter = () => {
        const oneLiner = getOneLiner(roast.roast_text);
        const text = `${oneLiner}\n\nGrade: ${roast.grade}\nTop Bagholder: $${roast.top_bagholder}\nTime Until Broke: ${roast.time_until_broke}\n\nGet roasted at`;

        const shareUrl = `${baseUrl}/roast/${roast.id}`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, "_blank");
    };

    const getGradeConfig = () => {
        switch (roast.roast_type) {
            case "premium":
                return {
                    label: "Premium Roast",
                    gradient: "from-amber-500 to-flame-500",
                    border: "border-amber-500/30",
                    bg: "bg-amber-500/10",
                };
            case "friend":
                return {
                    label: "Friend Roast",
                    gradient: "from-flame-500 to-ember-500",
                    border: "border-flame-500/30",
                    bg: "bg-flame-500/10",
                };
            default:
                return {
                    label: "Free Roast",
                    gradient: "from-ember-500 to-flame-500",
                    border: "border-ember-500/30",
                    bg: "bg-ember-500/10",
                };
        }
    };

    const config = getGradeConfig();

    return (
        <main className="min-h-screen flex flex-col pb-24">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-flame-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-ember-500/10 rounded-full blur-3xl" />
            </div>

            {/* Main content */}
            <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-xl space-y-8">
                    {/* Header */}
                    <header className="text-center space-y-4 animate-in">
                        <Link href="/" className="inline-flex items-center justify-center gap-3 mb-2 hover:opacity-80 transition-opacity">
                            <FlameIcon className="w-10 h-10 text-flame-500" />
                            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                                <span className="text-gradient glow-text">Roast</span>
                                <span className="text-charcoal-100"> My Wallet</span>
                            </h1>
                        </Link>
                        <p className="text-charcoal-400 text-sm">
                            Certificate of Portfolio Failure
                        </p>
                    </header>

                    {/* Roast Card */}
                    <div className="card p-8 space-y-6 animate-in" style={{ animationDelay: "0.1s" }}>
                        {/* Type badge */}
                        <div className="flex items-center justify-between">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.border} border`}>
                                <FlameIcon className={`w-4 h-4 text-flame-500`} />
                                <span className={`text-sm font-display font-semibold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                                    {config.label}
                                </span>
                            </div>
                            <span className="text-charcoal-500 text-xs">
                                {new Date(roast.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Scorecard */}
                        <div className={`p-6 rounded-xl bg-charcoal-800/30 border ${config.border}`}>
                            <div className="text-center mb-4">
                                <code className="text-xs text-charcoal-500">
                                    {roast.wallet_address.slice(0, 6)}...{roast.wallet_address.slice(-4)}
                                </code>
                            </div>

                            {/* Grade Circle */}
                            <div className="flex justify-center mb-6">
                                <div
                                    className="w-24 h-24 rounded-full flex items-center justify-center border-4"
                                    style={{
                                        borderColor: roast.grade_color,
                                        backgroundColor: `${roast.grade_color}20`,
                                    }}
                                >
                                    <span
                                        className="text-4xl font-display font-bold"
                                        style={{ color: roast.grade_color }}
                                    >
                                        {roast.grade}
                                    </span>
                                </div>
                            </div>

                            {/* Stats - Tokens Only */}
                            <div className="mt-6 flex justify-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-charcoal-900/50 border border-charcoal-800">
                                    <span className="text-sm text-charcoal-400">Tokens</span>
                                    <span className="text-sm font-semibold text-charcoal-200">{roast.token_count}</span>
                                </div>
                            </div>
                        </div>

                        {/* Roast text */}
                        <div className={`relative p-6 rounded-xl ${config.bg} border ${config.border} overflow-hidden`}>
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`} />
                            <p className="text-charcoal-200 leading-relaxed whitespace-pre-wrap font-body">
                                {roast.roast_text}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
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

                            <button
                                onClick={handleShareWarpcast}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all duration-300"
                            >
                                <WarpcastIcon className="w-5 h-5" />
                                <span>Warpcast</span>
                            </button>

                            <button
                                onClick={handleShareTwitter}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display font-semibold text-white bg-charcoal-700 hover:bg-charcoal-600 transition-all duration-300"
                            >
                                <TwitterIcon className="w-5 h-5" />
                                <span>X</span>
                            </button>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center animate-in" style={{ animationDelay: "0.2s" }}>
                        <Link
                            href="/"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <FlameIcon className="w-5 h-5" />
                            <span>Get Your Own Roast</span>
                        </Link>
                    </div>

                    {/* Footer */}
                    <footer className="text-center text-charcoal-600 text-xs animate-in space-y-2" style={{ animationDelay: "0.3s" }}>
                        <p>Built on Base. Powered by AI.</p>
                        <p>Not financial advice. For entertainment only. You are responsible for your own keys.</p>
                    </footer>
                </div>
            </div>
        </main>
    );
}
