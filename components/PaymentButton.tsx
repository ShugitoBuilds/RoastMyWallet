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
      icon: CrownIcon,
      gradient: "from-amber-500 via-flame-500 to-amber-600",
      hoverGradient: "hover:from-amber-400 hover:via-flame-400 hover:to-amber-500",
      border: "border-amber-500/20",
      bg: "bg-charcoal-800/30",
    }
    : {
      label: "Roast a Friend",
      description: "Enter their wallet, share the pain",
      icon: UsersIcon,
      gradient: "from-flame-500 via-ember-500 to-flame-600",
      hoverGradient: "hover:from-flame-400 hover:via-ember-400 hover:to-flame-500",
      border: "border-flame-500/20",
      bg: "bg-charcoal-800/30",
    };

  const Icon = config.icon;

  return (
    <NetworkGuard>
      <div className={`p-4 rounded-xl border ${config.border} ${config.bg} space-y-3 transition-all duration-300 hover:border-opacity-40`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient}`}>
              <Icon className="w-4 h-4 text-white" />
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
            <span>Pay & Roast</span>
          )}
        </button>

        {/* Clarification note */}
        <p className="text-xs text-charcoal-500 text-center leading-relaxed">
          💡 You will only be charged <span className="text-charcoal-400 font-semibold">$1 USDC</span> for this transaction
        </p>
      </div>
    </NetworkGuard>
  );
}
