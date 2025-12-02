"use client";

import { WalletModal } from "@/components/WalletModal";
import { RoastDisplay } from "@/components/RoastDisplay";
import { PaymentButton } from "@/components/PaymentButton";
import { LoadingRoast } from "@/components/LoadingRoast";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { ScorecardData } from "@/lib/scorecard";

// Small Flame (for Free Roast)
function SmallFlameIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C12 2 8 6 8 10C8 12 9 14 12 14C15 14 16 12 16 10C16 6 12 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Roaring Fire (for Premium Roast)
function RoaringFireIcon({ className }: { className?: string }) {
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
      <path
        d="M19 12C19 12 17 14 17 16C17 17.5 18 19 19 19C20 19 21 17.5 21 16C21 14 19 12 19 12Z"
        fill="url(#flame-gradient-1)"
      />
      <path
        d="M5 12C5 12 7 14 7 16C7 17.5 6 19 5 19C4 19 3 17.5 3 16C3 14 5 12 5 12Z"
        fill="url(#flame-gradient-1)"
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

// Social Fire (for Friend Roast)
function SocialFireIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 12C16 12 14 14 14 16C14 17.5 15 19 16 19C17 19 18 17.5 18 16C18 14 16 12 16 12Z"
        fill="url(#flame-gradient-1)"
      />
      <path
        d="M8 12C8 12 10 14 10 16C10 17.5 9 19 8 19C7 19 6 17.5 6 16C6 14 8 12 8 12Z"
        fill="url(#flame-gradient-1)"
      />
      <path
        d="M12 2C12 2 8 6 8 10C8 12 9 14 12 14C15 14 16 12 16 10C16 6 12 2 12 2Z"
        fill="url(#flame-gradient-3)"
      />
      <defs>
        <linearGradient id="flame-gradient-1" x1="12" y1="2" x2="12" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#DC2626" />
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
import { BackgroundFlames } from "@/components/BackgroundFlames";
import { CampfireHeader } from "@/components/CampfireHeader";
import { LiveLeaderboard } from "@/components/LiveLeaderboard";


export default function Home() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [roast, setRoast] = useState<string | null>(null);
  const [scorecard, setScorecard] = useState<ScorecardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roastType, setRoastType] = useState<"free" | "premium" | "friend">("free");
  const [isAdmin, setIsAdmin] = useState(false);
  const [testFriendAddress, setTestFriendAddress] = useState("");

  const handleFreeRoast = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, roasterAddress: address, type: "free", submitToLeaderboard: true }),
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
        body: JSON.stringify({ address, roasterAddress: address, type: "premium", submitToLeaderboard: true }),
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

  // Test friend roast (for debugging - no payment required)
  const handleTestFriend = async () => {
    if (!testFriendAddress) {
      alert("Please enter a friend's wallet address");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: testFriendAddress, roasterAddress: address, type: "friend" }),
      });
      const data = await response.json();
      setRoast(data.roast);
      setRoastType("friend");
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-flame-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-ember-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <BackgroundFlames />
      </div>

      {/* Top Navigation Bar */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-4">
        {/* Logo (Top Left) */}
        <div className="flex-shrink-0">
          <img
            src="/logo.jpg"
            alt="Wallet Roast Logo"
            className="h-28 w-auto rounded-lg shadow-lg border border-charcoal-700/50"
          />
        </div>

        {/* Wallet Connection (Top Right) */}
        <div className="flex-shrink-0">
          {!isConnected ? (
            <div className="flex items-center gap-4 bg-charcoal-800/80 backdrop-blur-sm p-3 rounded-xl border border-charcoal-700/50 shadow-xl">
              <div className="text-right hidden sm:block">
                <h2 className="font-display text-sm font-semibold text-charcoal-100">
                  Ready to get roasted?
                </h2>
                <p className="text-charcoal-500 text-xs">
                  Connect your wallet to begin
                </p>
              </div>
              <WalletModal />
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-charcoal-800/80 backdrop-blur-sm p-3 rounded-xl border border-charcoal-700/50 shadow-xl">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex flex-col items-end">
                <span className="text-charcoal-400 text-xs font-medium">Connected</span>
                <code className="text-charcoal-200 text-sm font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </code>
              </div>
              <button
                onClick={() => disconnect()}
                className="ml-2 text-ember-400 hover:text-ember-300 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col items-center justify-start px-6 py-8">
        <div className="w-full max-w-xl space-y-10">

          {/* Header */}
          <CampfireHeader />

          {/* Main card (Only show when connected) */}
          {isConnected && (
            <div className="animated-border-container rounded-2xl">
              <div className="animated-border-content card p-8 space-y-6 animate-in" style={{ animationDelay: "0.1s" }}>
                <div className="space-y-6">
                  {isLoading ? (
                    <LoadingRoast />
                  ) : !roast ? (
                    <div className="space-y-6">
                      {/* Free roast button */}
                      <button
                        onClick={handleFreeRoast}
                        disabled={isLoading}
                        className="btn-secondary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        <SmallFlameIcon className="w-5 h-5 text-flame-500 group-hover:scale-110 transition-transform" />
                        <span>Get Free Roast</span>
                      </button>

                      {/* Test Premium button (Admin Only) */}
                      {isAdmin && (
                        <div className="space-y-3 p-4 bg-charcoal-800/30 rounded-xl border border-charcoal-700/30">
                          <p className="text-xs font-mono text-charcoal-500 uppercase tracking-wider text-center">Admin Controls</p>

                          <button
                            onClick={handleTestPremium}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span>🧪 Test Premium Roast</span>
                          </button>

                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="0x... friend's address"
                              value={testFriendAddress}
                              onChange={(e) => setTestFriendAddress(e.target.value)}
                              className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-charcoal-200 placeholder:text-charcoal-600 focus:outline-none focus:border-flame-500/50 transition-colors font-mono"
                            />
                            <button
                              onClick={handleTestFriend}
                              disabled={isLoading || !testFriendAddress}
                              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display font-semibold text-flame-400 bg-flame-500/10 border border-flame-500/30 hover:bg-flame-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span>🧪 Test Friend Roast</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Premium section */}
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
              </div>
            </div>
          )}

          {/* Dumpster King Image */}
          <div className="w-full flex justify-center animate-in" style={{ animationDelay: "0.2s" }}>
            <img
              src="/dumpster-king.jpg"
              alt="King of the Dumpster"
              className="w-full max-w-md rounded-2xl shadow-2xl border-2 border-charcoal-700/50 hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          {/* Live Leaderboard */}
          <LiveLeaderboard />

          {/* Footer */}
          <footer className="text-center text-charcoal-600 text-xs animate-in space-y-2" style={{ animationDelay: "0.3s" }}>
            <p>© 2025 Wallet Roast. All rights reserved. | <a href="/terms" className="hover:text-charcoal-400 underline transition-colors">Terms of Service</a></p>
          </footer>
        </div>
      </div>
      <AdminAccess onAccessGranted={() => setIsAdmin(true)} />
    </main>
  );
}

