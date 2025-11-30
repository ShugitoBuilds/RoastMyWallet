"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { ReactNode, useState } from "react";

interface NetworkGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export function NetworkGuard({ children, fallback }: NetworkGuardProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const [error, setError] = useState<string | null>(null);

  // If not connected, just render children (wallet connect will handle that)
  if (!isConnected) {
    return <>{children}</>;
  }

  // Check if on supported network (Base or Mainnet)
  const isSupported = chainId === base.id || chainId === mainnet.id;

  const handleSwitchNetwork = async (targetChainId: number) => {
    setError(null);
    try {
      switchChain({ chainId: targetChainId });
    } catch (err) {
      console.error("Failed to switch network:", err);
      setError("Failed to switch network. Please try manually in your wallet.");
    }
  };

  // If on wrong network, show switch prompt
  if (!isSupported) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
        <div className="flex items-center gap-3">
          <AlertIcon className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-display font-semibold text-amber-400">Wrong Network</h3>
            <p className="text-xs text-charcoal-400">Please switch to Base or Ethereum to continue</p>
          </div>
        </div>

        {error && (
          <p className="text-sm text-ember-400">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => handleSwitchNetwork(base.id)}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-display font-semibold text-white text-sm
              bg-[#1652F0] hover:bg-[#1652F0]/90
              transition-all duration-300 hover:shadow-glow hover:scale-[1.01] active:scale-[0.99]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isPending ? <SpinnerIcon className="w-4 h-4" /> : <span>Switch to Base</span>}
          </button>
          <button
            onClick={() => handleSwitchNetwork(mainnet.id)}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-display font-semibold text-white text-sm
              bg-[#627EEA] hover:bg-[#627EEA]/90
              transition-all duration-300 hover:shadow-glow hover:scale-[1.01] active:scale-[0.99]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isPending ? <SpinnerIcon className="w-4 h-4" /> : <span>Switch to ETH</span>}
          </button>
        </div>
      </div>
    );
  }

  // On correct network, render children
  return <>{children}</>;
}

// Hook to check if user is on supported network
export function useIsSupportedNetwork(): boolean {
  const chainId = useChainId();
  return chainId === base.id || chainId === mainnet.id;
}

// Hook to get switch chain function
export function useSwitchNetwork() {
  const { switchChain, isPending, error } = useSwitchChain();

  const switchToBase = () => switchChain({ chainId: base.id });
  const switchToMainnet = () => switchChain({ chainId: mainnet.id });

  return { switchToBase, switchToMainnet, isPending, error };
}


