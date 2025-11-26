"use client";

import { useState, useEffect } from "react";

const LOADING_MESSAGES = [
  "Analyzing your bad decisions...",
  "Looking for rug pulls in your history...",
  "Calculating time until you're broke...",
  "Finding your worst bags...",
  "Preparing maximum savagery...",
  "Counting your paper hands moments...",
  "Measuring your diamond hand delusions...",
  "Evaluating your FOMO purchases...",
  "Scanning for shitcoins...",
  "Detecting copium levels...",
  "Assessing your degen score...",
  "Reviewing your exit liquidity status...",
];

export function LoadingRoast() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Rotate messages every 2 seconds
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="space-y-6 py-8">
      {/* Animated flame */}
      <div className="flex justify-center">
        <div className="relative">
          <svg
            className="w-16 h-16 animate-pulse"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C12 2 8 6 8 10C8 12 9 14 12 14C15 14 16 12 16 10C16 6 12 2 12 2Z"
              fill="url(#loading-flame-1)"
            />
            <path
              d="M12 8C12 8 10 10 10 12C10 13.5 11 15 12 15C13 15 14 13.5 14 12C14 10 12 8 12 8Z"
              fill="url(#loading-flame-2)"
            />
            <path
              d="M8 10C8 6 12 2 12 2C6 4 4 8 4 12C4 16 7 20 12 22C17 20 20 16 20 12C20 8 18 4 12 2C12 2 16 6 16 10C16 12 15 14 12 14C9 14 8 12 8 10Z"
              fill="url(#loading-flame-3)"
            />
            <defs>
              <linearGradient
                id="loading-flame-1"
                x1="12"
                y1="2"
                x2="12"
                y2="14"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F97316" />
                <stop offset="1" stopColor="#DC2626" />
              </linearGradient>
              <linearGradient
                id="loading-flame-2"
                x1="12"
                y1="8"
                x2="12"
                y2="15"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FCD34D" />
                <stop offset="1" stopColor="#F97316" />
              </linearGradient>
              <linearGradient
                id="loading-flame-3"
                x1="12"
                y1="2"
                x2="12"
                y2="22"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F97316" />
                <stop offset="0.5" stopColor="#DC2626" />
                <stop offset="1" stopColor="#991B1B" />
              </linearGradient>
            </defs>
          </svg>
          {/* Glow effect */}
          <div className="absolute inset-0 blur-xl bg-flame-500/30 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Loading message */}
      <div className="text-center space-y-2">
        <p className="text-lg font-display font-semibold text-charcoal-100 animate-pulse">
          {LOADING_MESSAGES[messageIndex]}
        </p>
        <p className="text-sm text-charcoal-500">This might take a few seconds</p>
      </div>

      {/* Progress bar */}
      <div className="max-w-xs mx-auto">
        <div className="h-2 bg-charcoal-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-flame-500 via-ember-500 to-flame-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${Math.min(progress, 95)}%` }}
          />
        </div>
      </div>

      {/* Decorative dots */}
      <div className="flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-flame-500"
            style={{
              animation: `pulse 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}



