"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { base } from "viem/chains";
import { ScorecardData } from "@/lib/scorecard";
import { NetworkGuard } from "./NetworkGuard";
import {
  ROAST_NFT_ADDRESS,
  USDC_ADDRESS,
  NFT_MINT_PRICE,
  ROAST_NFT_ABI,
  ERC20_APPROVE_ABI,
  generateTokenURI,
  isNFTMintingAvailable,
  getOpenSeaUrl,
} from "@/lib/nft";

interface MintButtonProps {
  scorecard: ScorecardData;
}

// Icon components
function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" />
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

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
  );
}

type MintStep = "idle" | "approving" | "approved" | "minting" | "minted" | "error";

export function MintButton({ scorecard }: MintButtonProps) {
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState<MintStep>("idle");
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check USDC allowance
  const { data: allowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_APPROVE_ABI,
    functionName: "allowance",
    args: address && ROAST_NFT_ADDRESS ? [address, ROAST_NFT_ADDRESS] : undefined,
    query: {
      enabled: !!address && !!ROAST_NFT_ADDRESS,
    },
  });

  // Approve USDC
  const { writeContract: approveUsdc, data: approveHash, isPending: isApproving } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Mint NFT
  const { writeContract: mintNft, data: mintHash, isPending: isMinting } = useWriteContract();
  const { isLoading: isMintConfirming, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
    hash: mintHash,
  });

  // Get total supply to determine the next token ID
  const { data: totalSupply, refetch: refetchTotalSupply } = useReadContract({
    address: ROAST_NFT_ADDRESS,
    abi: ROAST_NFT_ABI,
    functionName: "totalSupply",
    query: {
      enabled: !!ROAST_NFT_ADDRESS,
    },
  });

  // Check if NFT minting is available
  if (!isNFTMintingAvailable()) {
    return (
      <div className="p-4 rounded-xl bg-charcoal-800/30 border border-charcoal-700/30">
        <div className="flex items-center gap-3 text-charcoal-500">
          <SparklesIcon className="w-5 h-5" />
          <span className="text-sm">NFT minting coming soon</span>
        </div>
      </div>
    );
  }

  const needsApproval = !allowance || allowance < NFT_MINT_PRICE;

  const handleApprove = async () => {
    if (!ROAST_NFT_ADDRESS) return;
    
    setStep("approving");
    setError(null);

    try {
      approveUsdc({
        address: USDC_ADDRESS,
        abi: ERC20_APPROVE_ABI,
        functionName: "approve",
        args: [ROAST_NFT_ADDRESS, NFT_MINT_PRICE],
        chainId: base.id,
      });
    } catch (err) {
      setError("Failed to approve USDC");
      setStep("error");
    }
  };

  const handleMint = async () => {
    if (!address || !ROAST_NFT_ADDRESS) return;

    setStep("minting");
    setError(null);

    try {
      const tokenURI = generateTokenURI(scorecard);
      
      mintNft({
        address: ROAST_NFT_ADDRESS,
        abi: ROAST_NFT_ABI,
        functionName: "mint",
        args: [address, tokenURI],
        chainId: base.id,
      });
    } catch (err) {
      setError("Failed to mint NFT");
      setStep("error");
    }
  };

  // Handle approve success
  useEffect(() => {
    if (isApproveSuccess && step === "approving") {
      setStep("approved");
    }
  }, [isApproveSuccess, step]);
  // Handle mint success
  useEffect(() => {
    if (isMintSuccess && step === "minting") {
      setStep("minted");
      // Refetch total supply to get the new token ID
      refetchTotalSupply().then((result) => {
        if (result.data) {
          // Token ID is totalSupply - 1 (since it was just minted)
          setMintedTokenId(Number(result.data) - 1);
        }
      });
    }
  }, [isMintSuccess, step, refetchTotalSupply]);

  const isLoading = isApproving || isApproveConfirming || isMinting || isMintConfirming;

  return (
    <NetworkGuard>
      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-flame-500/10 border border-amber-500/20 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-flame-500">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-charcoal-100">Mint Your Roast</h3>
              <p className="text-xs text-charcoal-500">Immortalize your shame forever</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-display font-bold text-charcoal-200">$2</span>
            <span className="text-charcoal-500 text-sm ml-1">USDC</span>
          </div>
        </div>

        {/* Status */}
        {step === "minted" ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-3 mb-3">
              <CheckIcon className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-emerald-400">NFT Minted!</span>
            </div>
            <p className="text-sm text-charcoal-400 mb-3">
              Your roast is now permanently on the blockchain.
            </p>
            <a
              href={getOpenSeaUrl(mintedTokenId || 0)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              View on OpenSea
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <>
            {/* Progress steps */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                step === "idle" || step === "approving" || isApproveSuccess
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-charcoal-800 text-charcoal-500"
              }`}>
                <span className="w-4 h-4 rounded-full bg-current flex items-center justify-center text-charcoal-900 text-[10px]">1</span>
                Approve USDC
              </div>
              <div className="flex-1 h-px bg-charcoal-700" />
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                step === "approved" || step === "minting" || step === "minted"
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-charcoal-800 text-charcoal-500"
              }`}>
                <span className="w-4 h-4 rounded-full bg-current flex items-center justify-center text-charcoal-900 text-[10px]">2</span>
                Mint NFT
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-ember-400">{error}</p>
            )}

            {/* Action button */}
            {needsApproval && step !== "approved" ? (
              <button
                onClick={handleApprove}
                disabled={isLoading || !isConnected}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display font-semibold text-white 
                  bg-gradient-to-r from-amber-500 to-flame-500 hover:from-amber-400 hover:to-flame-400
                  transition-all duration-300 hover:shadow-glow hover:scale-[1.01] active:scale-[0.99]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isApproving || isApproveConfirming ? (
                  <>
                    <SpinnerIcon className="w-5 h-5" />
                    <span>Approving...</span>
                  </>
                ) : (
                  <span>Approve USDC</span>
                )}
              </button>
            ) : (
              <button
                onClick={handleMint}
                disabled={isLoading || !isConnected}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display font-semibold text-white 
                  bg-gradient-to-r from-amber-500 to-flame-500 hover:from-amber-400 hover:to-flame-400
                  transition-all duration-300 hover:shadow-glow hover:scale-[1.01] active:scale-[0.99]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isMinting || isMintConfirming ? (
                  <>
                    <SpinnerIcon className="w-5 h-5" />
                    <span>Minting...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Mint NFT</span>
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </NetworkGuard>
  );
}


