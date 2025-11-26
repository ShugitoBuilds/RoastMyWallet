import { TokenInfo, analyzeTokens } from "./tokens";

export interface ScorecardData {
  id: string;
  walletAddress: string;
  grade: string;
  gradeColor: string;
  score: number;
  topBagholder: string;
  timeUntilBroke: string;
  roastText: string;
  roastType: "free" | "premium" | "friend";
  tokenCount: number;
  hasMemeCoins: boolean;
  hasDeadCoins: boolean;
  createdAt: Date;
}

// Grade thresholds (lower score = worse grade)
const GRADE_THRESHOLDS = [
  { min: 90, grade: "A+", color: "#22c55e" },
  { min: 80, grade: "A", color: "#22c55e" },
  { min: 70, grade: "B", color: "#84cc16" },
  { min: 60, grade: "C", color: "#eab308" },
  { min: 50, grade: "D", color: "#f97316" },
  { min: 40, grade: "D-", color: "#ef4444" },
  { min: 30, grade: "F", color: "#dc2626" },
  { min: 0, grade: "F-", color: "#991b1b" },
];

// Humorous "time until broke" calculations
const TIME_UNTIL_BROKE = [
  "Already there, chief",
  "3 more rug pulls",
  "Next market dip",
  "2 weeks (always 2 weeks)",
  "One bad trade away",
  "When ETH hits $10k (so never)",
  "After your next FOMO buy",
  "Approximately 69 days",
  "Soon™",
  "Yesterday, technically",
];

// Calculate portfolio score (0-100)
export function calculatePortfolioScore(tokens: TokenInfo[]): number {
  if (tokens.length === 0) return 0;

  let score = 50; // Base score

  const analysis = analyzeTokens(tokens);

  // Positive factors
  if (tokens.some((t) => t.symbol === "ETH")) score += 15;
  if (tokens.some((t) => t.symbol === "USDC" || t.symbol === "DAI")) score += 10;
  if (tokens.length >= 3 && tokens.length <= 10) score += 10; // Diversification

  // Negative factors
  if (analysis.hasMemeCoins) score -= 20;
  if (analysis.hasDeadCoins) score -= 15;
  if (tokens.length > 20) score -= 10; // Over-diversified
  if (tokens.length === 1) score -= 10; // Under-diversified

  // Check for "bagholder" patterns
  const smallBalances = tokens.filter(
    (t) => parseFloat(t.balance) < 0.001 && t.symbol !== "ETH"
  );
  if (smallBalances.length > 3) score -= 15;

  // Clamp score
  return Math.max(0, Math.min(100, score));
}

// Get grade from score
export function getGradeFromScore(score: number): { grade: string; color: string } {
  for (const threshold of GRADE_THRESHOLDS) {
    if (score >= threshold.min) {
      return { grade: threshold.grade, color: threshold.color };
    }
  }
  return { grade: "F-", color: "#991b1b" };
}

// Find the worst token (top bagholder asset)
export function findTopBagholder(tokens: TokenInfo[]): string {
  if (tokens.length === 0) return "Your empty hopes";

  // Prioritize meme coins and small balances
  const memePatterns = /PEPE|DOGE|SHIB|FLOKI|BONK|WIF|MEME|INU|ELON|MOON|SAFE/i;
  
  const memeCoin = tokens.find((t) => memePatterns.test(t.symbol));
  if (memeCoin) return memeCoin.symbol;

  // Find smallest balance (excluding ETH)
  const nonEthTokens = tokens.filter((t) => t.symbol !== "ETH");
  if (nonEthTokens.length > 0) {
    const smallest = nonEthTokens.reduce((min, t) =>
      parseFloat(t.balance) < parseFloat(min.balance) ? t : min
    );
    return smallest.symbol;
  }

  // If only ETH, return a humorous message about being an "ETH maxi"
  const ethToken = tokens.find((t) => t.symbol === "ETH");
  if (ethToken) {
    const balance = parseFloat(ethToken.balance);
    if (balance < 0.01) return "Dust-tier ETH";
    if (balance < 0.1) return "Baby ETH bag";
    return "ETH (the only asset)";
  }

  return tokens[0]?.symbol || "Hopium";
}

// Get humorous time until broke
export function getTimeUntilBroke(score: number): string {
  if (score < 20) return TIME_UNTIL_BROKE[0];
  if (score < 30) return TIME_UNTIL_BROKE[Math.floor(Math.random() * 3)];
  if (score < 50) return TIME_UNTIL_BROKE[Math.floor(Math.random() * 5) + 2];
  return TIME_UNTIL_BROKE[Math.floor(Math.random() * TIME_UNTIL_BROKE.length)];
}

// Generate a unique ID for the scorecard
export function generateScorecardId(): string {
  return `roast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Create a complete scorecard
export function createScorecard(
  walletAddress: string,
  tokens: TokenInfo[],
  roastText: string,
  roastType: "free" | "premium" | "friend"
): ScorecardData {
  const analysis = analyzeTokens(tokens);
  const score = calculatePortfolioScore(tokens);
  const { grade, color } = getGradeFromScore(score);

  return {
    id: generateScorecardId(),
    walletAddress,
    grade,
    gradeColor: color,
    score,
    topBagholder: findTopBagholder(tokens),
    timeUntilBroke: getTimeUntilBroke(score),
    roastText,
    roastType,
    tokenCount: tokens.length,
    hasMemeCoins: analysis.hasMemeCoins,
    hasDeadCoins: analysis.hasDeadCoins,
    createdAt: new Date(),
  };
}

// Truncate wallet address for display
export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}


