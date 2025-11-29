"use client";

import { WalletConnect } from "@/components/WalletConnect";
import { RoastDisplay } from "@/components/RoastDisplay";
import { PaymentButton } from "@/components/PaymentButton";
import { LoadingRoast } from "@/components/LoadingRoast";
import { HallOfShame } from "@/components/HallOfShame";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { ScorecardData } from "@/lib/scorecard";

// Flame icon component
function FlameIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C12 2 8 6 8 10C8 12 9 14 12 14C15 14 16 12 16 10C16 6 12 2 12 2Z"
        fill="url(#flame-gradient-1)"
      />
      <path
        d="M12 8C12 8 10 10 10 12C10 13.5 11 15 12 15C13 15 14 13.5 14 12C14 10 12 8 12 8Z"
        fill="url(#flame-gradient-2)"
      />
      <path
        d="M8 10C8 6 12 2 12 2C6 4 4 8 4 12C4 16 7 20 12 22C17 20 20 16 20 12C20 8 18 4 12 2C12 2 16 6 16 10C16 12 15 14 12 14C9 14 8 12 8 10Z"
        fill="url(#flame-gradient-3)"
      />
      <defs>
        <linearGradient id="flame-gradient-1" x1="12" y1="2" x2="12" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="flame-gradient-2" x1="12" y1="8" x2="12" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCD34D" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
        <linearGradient id="flame-gradient-3" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" />
          <stop offset="0.5" stopColor="#DC2626" />
          <stop offset="1" stopColor="#991B1B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

import { AdminAccess } from "@/components/AdminAccess";

export default function Home() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [roast, setRoast] = useState<string | null>(null);
  const [scorecard, setScorecard] = useState<ScorecardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roastType, setRoastType] = useState<"free" | "premium" | "friend">("free");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleFreeRoast = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, type: "free" }),
      });
      const data = await response.json();
      setRoast(data.roast);
      setRoastType("free");
      // Set scorecard if available
      if (data.scorecard) {
        setScorecard(data.scorecard);
      }
    } catch (error) {
      console.error("Error generating roast:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Test premium roast (for debugging - no payment required)
  const handleTestPremium = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, type: "premium" }),
      });
      const data = await response.json();
      setRoast(data.roast);
      setRoastType("premium");
      if (data.scorecard) {
        setScorecard(data.scorecard);
      }
    } catch (error) {
      console.error("Error generating roast:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRoast(null);
    setScorecard(null);
  };

  return (
    <main className="min-h-screen flex flex-col pb-24">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-flame-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-ember-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl space-y-10">

          {/* Header */}
          <header className="text-center space-y-4 animate-in">
            <div className="inline-flex items-center justify-center gap-3 mb-2">
              <FlameIcon className="w-12 h-12 animate-pulse-slow" />
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight">
              <span className="text-gradient glow-text">Roast</span>
              <span className="text-charcoal-100"> My </span>
              <span style={{ color: '#1652F0' }}>Base</span>
              <span className="text-charcoal-100"> Wallet</span>
            </h1>
            <p className="text-charcoal-400 text-lg max-w-md mx-auto leading-relaxed">
              Connect your wallet. Get ruthlessly roasted by AI based on your Base token holdings.
            </p>
          </header>

          {/* Main card */}
          <div className="card p-8 space-y-6 animate-in" style={{ animationDelay: "0.1s" }}>
            {!isConnected ? (
              <div className="flex flex-col items-center space-y-6 py-4">
                <div className="text-center space-y-2">
                  <h2 className="font-display text-xl font-semibold text-charcoal-100">
                    Ready to get roasted?
                  </h2>
                  <p className="text-charcoal-500 text-sm">
                    Connect your wallet to begin
                  </p>
                </div>
                <WalletConnect />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Connected wallet display */}
                <div className="flex items-center justify-between p-4 bg-charcoal-800/50 rounded-xl border border-charcoal-700/30">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-charcoal-400 text-sm font-medium">Connected</span>
                    <code className="text-charcoal-300 text-sm font-mono">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </code>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="text-ember-400 hover:text-ember-300 text-sm font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                </div>

                {isLoading ? (
                  <LoadingRoast />
                ) : !roast ? (
                  <div className="space-y-6">
                    {/* Free roast button */}
                    <button
                      onClick={handleFreeRoast}
                      disabled={isLoading}
                      className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FlameIcon className="w-5 h-5" />
                      <span>Get Free Roast</span>
                    </button>

                    {/* Test Premium button (Admin Only) */}
                    {isAdmin && (
                      <button
                        onClick={handleTestPremium}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>🧪 Test Premium Roast</span>
                      </button>
                    )}

                    {/* Premium section */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-charcoal-800" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-4 bg-charcoal-900 text-charcoal-500 text-sm font-medium">
                          Premium Roasts
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <PaymentButton
                        type="premium"
                        address={address || ""}
                        onSuccess={(roastText) => {
                          setRoast(roastText);
                          setRoastType("premium");
                        }}
                      />
                      <PaymentButton
                        type="friend"
                        address={address || ""}
                        onSuccess={(roastText) => {
                          setRoast(roastText);
                          setRoastType("friend");
                        }}
                      />
                    </div>

                    <p className="text-center text-charcoal-600 text-xs">
                      You will only be charged $1 USDC for any transaction
                    </p>
                  </div>
                ) : (
                  <RoastDisplay
                    roast={roast}
                    type={roastType}
                    scorecard={scorecard || undefined}
                    onReset={handleReset}
                  />
                )}
              </div>
            )}
          </div>

          {/* Hall of Shame */}
          <div className="animate-in" style={{ animationDelay: "0.2s" }}>
            <HallOfShame />
          </div>

          {/* Footer */}
          <footer className="text-center text-charcoal-600 text-xs animate-in space-y-2" style={{ animationDelay: "0.3s" }}>
            <p className="text-sm">Built on Base. Powered by AI.</p>
            <p>Not financial advice. For entertainment only. You are responsible for your own keys.</p>
          </footer>
        </div>
      </div>

      <AdminAccess onAccessGranted={() => setIsAdmin(true)} />
    </main>
  );
}

