"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { base } from "viem/chains";
import { NetworkGuard } from "./NetworkGuard";

// USDC contract address on Base
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;
const PAYMENT_AMOUNT = parseUnits("1", 6); // 1 USDC (6 decimals)

// Icon components
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

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

interface PaymentButtonProps {
  type: "premium" | "friend";
  address: string;
  onSuccess: (roast: string) => void;
}

export function PaymentButton({ type, address, onSuccess }: PaymentButtonProps) {
  const { isConnected } = useAccount();
  const [targetAddress, setTargetAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePayment = async () => {
    if (!isConnected) return;

    const paymentAddress = process.env.NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS;
    if (!paymentAddress) {
      alert("Payment wallet not configured");
      return;
    }

    setIsProcessing(true);

    try {
      writeContract({
        address: USDC_ADDRESS,
        abi: [
          {
            name: "transfer",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
              { name: "to", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [{ name: "", type: "bool" }],
          },
        ],
        functionName: "transfer",
        args: [paymentAddress as `0x${string}`, PAYMENT_AMOUNT],
        chainId: base.id,
      });
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
    }
  };

  const generateRoast = useCallback(async () => {
    try {
      const roastAddress = type === "friend" && targetAddress ? targetAddress : address;
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: roastAddress,
          type: type === "premium" ? "premium" : "friend"
        }),
      });
      const data = await response.json();
      onSuccess(data.roast);
    } catch (error) {
      console.error("Error generating roast:", error);
    }
  }, [type, targetAddress, address, onSuccess]);

  // Generate roast when transaction succeeds
  useEffect(() => {
    if (isSuccess && isProcessing) {
      setIsProcessing(false);
      generateRoast();
    }
  }, [isSuccess, isProcessing, generateRoast]);

  const isLoading = isPending || isConfirming || isProcessing;

  const config = type === "premium"
    ? {
      label: "Premium Roast",
      description: "Extra savage, deeply personal",
      icon: RoaringFireIcon,
      gradient: "from-amber-500 via-flame-500 to-amber-600",
      hoverGradient: "hover:from-amber-400 hover:via-flame-400 hover:to-amber-500",
      border: "border-amber-500/20",
      bg: "bg-charcoal-800/30",
    }
    : {
      label: "Roast a Friend",
      description: "Enter their wallet, share the pain",
      icon: SocialFireIcon,
      gradient: "from-flame-500 via-ember-500 to-flame-600",
      hoverGradient: "hover:from-flame-400 hover:via-ember-400 hover:to-flame-500",
      border: "border-flame-500/20",
      bg: "bg-charcoal-800/30",
    };

  const Icon = config.icon;

  return (
    <NetworkGuard>
      <div className="animated-border-container rounded-xl">
        <div className={`animated-border-content p-4 rounded-xl border ${config.border} ${config.bg} space-y-3 transition-all duration-300 hover:border-opacity-40`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-charcoal-100">{config.label}</h3>
                <p className="text-xs text-charcoal-500">{config.description}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-display font-bold text-charcoal-200">$1</span>
              <span className="text-charcoal-500 text-sm ml-1">USDC</span>
            </div>
          </div>

          {/* Friend address input */}
          {type === "friend" && (
            <input
              type="text"
              placeholder="0x... friend's wallet address"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              className="input-field text-sm font-mono"
            />
          )}

          {/* Action button */}
          <button
            onClick={handlePayment}
            disabled={isLoading || (type === "friend" && !targetAddress)}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display font-semibold text-white 
            bg-gradient-to-r ${config.gradient} ${config.hoverGradient}
            transition-all duration-300 hover:shadow-glow hover:scale-[1.01] active:scale-[0.99]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none`}
          >
            {isLoading ? (
              <>
                <SpinnerIcon className="w-5 h-5" />
                <span>Processing...</span>
              </>
            ) : (
              <span className={type === "premium" || (type === "friend" && targetAddress) ? "animate-pulse" : ""}>
                {type === "premium" ? "Get Savage Roast" : "Roast Them"}
              </span>
            )}
          </button>


        </div>
      </div>
    </NetworkGuard>
  );
}
