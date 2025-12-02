import { ScorecardData, truncateAddress } from "./scorecard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://roastmywallet.xyz";

// Generate the roast page URL for sharing
export function getRoastPageUrl(scorecard: ScorecardData): string {
  return `${BASE_URL}/roast/${scorecard.walletAddress}`;
}

// Generate the scorecard image URL
export function getScorecardImageUrl(scorecard: ScorecardData): string {
  const params = new URLSearchParams({
    grade: scorecard.grade,
    gradeColor: scorecard.gradeColor,
    wallet: truncateAddress(scorecard.walletAddress),
    bagholder: scorecard.topBagholder,
    timeBroke: scorecard.timeUntilBroke,
    tokenCount: scorecard.tokenCount.toString(),
    roastType: scorecard.roastType,
  });

  return `${BASE_URL}/api/scorecard/${scorecard.id}?${params.toString()}`;
}

// Generate Warpcast share URL with dynamic roast page
export function getWarpcastShareUrl(scorecard: ScorecardData): string {
  const text = `I just got roasted by @roastmywallet 🔥

Think you can do worse? Get roasted:`;

  // Use the dynamic roast page URL for embedding
  const roastPageUrl = getRoastPageUrl(scorecard);

  // Static image URL
  const imageUrl = `${BASE_URL}/wallet-roast-share.jpg`;

  // Warpcast compose URL with text and embeds
  const params = new URLSearchParams();
  params.append("text", text);
  params.append("embeds[]", roastPageUrl);
  params.append("embeds[]", imageUrl);

  return `https://warpcast.com/~/compose?${params.toString()}`;
}

// Generate Twitter/X share URL with dynamic roast page
export function getTwitterShareUrl(scorecard: ScorecardData): string {
  const roastPageUrl = getRoastPageUrl(scorecard);

  const text = `I just got my crypto portfolio roasted 🔥

Get roasted at`;

  const params = new URLSearchParams({
    text: text,
    url: roastPageUrl,
  });

  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

// Copy roast text to clipboard
export function copyRoastToClipboard(scorecard: ScorecardData): string {
  return `🔥 ROAST MY WALLET - Certificate of Portfolio Failure 🔥

Wallet: ${truncateAddress(scorecard.walletAddress)}
Grade: ${scorecard.grade}
Top Bagholder: $${scorecard.topBagholder}
Time Until Broke: ${scorecard.timeUntilBroke}

${scorecard.roastText}

Get roasted at ${BASE_URL}`;
}

// Generate a simple share object for Web Share API
export function getWebShareData(scorecard: ScorecardData): ShareData {
  return {
    title: `Roast My Wallet - Grade: ${scorecard.grade}`,
    text: `I got a ${scorecard.grade} on my crypto portfolio! ${scorecard.timeUntilBroke} until I'm broke. Get roasted:`,
    url: `${BASE_URL}?ref=share`,
  };
}

// Extract a punchy one-liner from the roast text
export function getOneLiner(text: string): string {
  if (!text) return "My portfolio just got absolutely destroyed.";

  // Try to get the first punchy sentence
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
  const firstSentence = sentences[0]?.trim();

  // If first sentence is short enough, use it. Otherwise use a generic hook.
  if (firstSentence && firstSentence.length < 100) {
    return `"${firstSentence}..."`;
  }
  return "My portfolio just got absolutely destroyed.";
}


