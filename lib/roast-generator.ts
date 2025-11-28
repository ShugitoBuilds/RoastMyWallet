import { getTokenBalances, analyzeTokens } from "./tokens";
import { EMPTY_WALLET_ROASTS, TOKEN_WALLET_ROASTS } from "./free-roasts";

interface RoastOptions {
  address: string;
  type: "free" | "premium" | "friend";
}

const roastCache = new Map<string, { roast: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedRoast(key: string): string | null {
  const cached = roastCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.roast;
  }
  return null;
}

function setCachedRoast(key: string, roast: string): void {
  roastCache.set(key, { roast, timestamp: Date.now() });
}

// Helper function to simulate AI generation delay (1-3 seconds)
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getEmptyWalletPrompt(type: "free" | "premium" | "friend"): string {
  const basePrompt = `You are a ruthless crypto wallet roaster. This wallet is COMPLETELY EMPTY - no tokens, no ETH, nothing. Generate a savage, funny roast about having an empty wallet. Be creative, use crypto slang, and make it entertaining.

Generate a roast that:`;

  if (type === "free") {
    return `${basePrompt}
- Mocks them for being "too scared to deploy"
- Jokes about them watching from the sidelines
- Questions if they even know how to use a wallet
- Is funny and shareable
- Keep it brief (100-150 words)`;
  } else if (type === "premium") {
    return `${basePrompt}
- Is EXTREMELY savage about their empty wallet
- Mocks their "paper hands" that never even bought
- Jokes about them being "exit liquidity in waiting"
- Questions their entire existence in crypto
- Is brutally honest and hilarious
- Make it detailed (150-200 words)`;
  } else {
    return `${basePrompt}
- Roasts this friend for having nothing
- Mocks them for pretending to be in crypto
- Jokes about them being a "crypto tourist"
- Is funny enough to share with friends
- Keep it entertaining (100-150 words)`;
  }
}

function getPromptTemplate(type: "free" | "premium" | "friend", tokenData: string, isEmpty: boolean): string {
  if (isEmpty) {
    return getEmptyWalletPrompt(type);
  }

  const basePrompt = `You are a ruthless crypto wallet roaster. Analyze this wallet's token holdings on Base blockchain and create a savage, funny roast. Be creative, use crypto slang, and make it entertaining.

Wallet Token Holdings:
${tokenData}

Generate a roast that:`;

  if (type === "free") {
    return `${basePrompt}
- Is moderately savage but not too harsh
- Points out obvious issues (dead coins, meme coins, etc.)
- Is funny and shareable
- Keep it brief (100-150 words)`;
  } else if (type === "premium") {
    return `${basePrompt}
- Is EXTREMELY savage and ruthlessly honest - hold nothing back
- Analyzes EACH token individually, explaining why each holding is a bad decision
- Roasts their overall portfolio strategy and risk management
- Uses advanced crypto terminology (alpha, beta, TVL, impermanent loss, etc.)
- Questions their entire existence in crypto and financial decision-making
- Includes specific price action jokes ("bought the top", "exit liquidity", etc.)
- References current crypto culture and memes
- Makes predictions about their financial future (all negative and hilarious)
- Is SO detailed and comprehensive that it hurts to read
- Length: 250-350 words - make every word count
- Structure it with paragraphs for readability
- End with a devastating final blow/prediction`;
  } else {
    return `${basePrompt}
- Roasts this friend's wallet mercilessly
- Compares their holdings to yours (if applicable)
- Is funny enough to share with friends
- Points out their worst token choices
- Keep it entertaining (100-150 words)`;
  }
}

async function callAI(prompt: string): Promise<string> {
  const aiService = process.env.AI_SERVICE || "openai";
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    throw new Error("AI_API_KEY not configured");
  }

  if (aiService === "openai") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a hilarious crypto wallet roaster. Be savage, funny, and use crypto slang.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.9,
        max_tokens: 600, // Increased for longer premium roasts
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } else if (aiService === "anthropic") {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text.trim();
  } else if (aiService === "gemini") {
    const model = "gemini-3-pro-preview";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[Gemini API] Status: ${response.status}, Body: ${errorBody}`);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  } else {
    throw new Error(`Unsupported AI service: ${aiService}`);
  }
}

// Fallback roasts for when AI fails
const FALLBACK_ROASTS = {
  empty: [
    "Your wallet is emptier than a ghost town during a bull run. Did you lose your seed phrase or are you just allergic to making money?",
    "Congrats on having the cleanest wallet on Base - zero tokens, zero problems, zero chance of making it. You're basically a crypto tourist with no luggage.",
    "Your wallet balance reads like my dating life - absolutely nothing there. At least commit to losing money like the rest of us!",
  ],
  normal: [
    "Your wallet is a museum of poor decisions. Every token tells a story of FOMO, regret, and questionable life choices.",
    "Looking at your portfolio is like watching a slow-motion car crash - you know it's bad but you can't look away.",
    "Your token selection strategy appears to be 'buy high, hold forever, cry daily.' Bold move, cotton.",
  ],
};

export async function generateRoast({ address, type }: RoastOptions): Promise<string> {
  const cacheKey = `${address}-${type}`;
  const cached = getCachedRoast(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Fetch token balances (needed for scorecard generation)
    const tokens = await getTokenBalances(address as `0x${string}`);
    const isEmpty = tokens.length === 0;

    // For free roasts, use pre-compiled list (no API call)
    if (type === "free") {
      // Simulate AI generation delay (1-3 seconds)
      const delayMs = 1000 + Math.random() * 2000; // Random delay between 1-3 seconds
      await delay(delayMs);

      // Select random roast from appropriate list
      const roasts = isEmpty ? EMPTY_WALLET_ROASTS : TOKEN_WALLET_ROASTS;
      const roast = roasts[Math.floor(Math.random() * roasts.length)];

      // Cache the result
      setCachedRoast(cacheKey, roast);

      return roast;
    }

    // For premium and friend roasts, use AI API
    const analysis = analyzeTokens(tokens);

    // Format token data for prompt
    const tokenData = !isEmpty
      ? tokens
        .map(
          (t) =>
            `- ${t.symbol} (${t.name}): ${parseFloat(t.balance).toFixed(6)}`
        )
        .join("\n")
      : "EMPTY WALLET - No tokens found";

    const additionalContext = isEmpty ? "" : `
Analysis:
- Total tokens: ${analysis.totalTokens}
- Has dead coins: ${analysis.hasDeadCoins ? "Yes" : "No"}
- Has meme coins: ${analysis.hasMemeCoins ? "Yes" : "No"}
- Token summary: ${analysis.tokenSummary}
`;

    const prompt = getPromptTemplate(type, tokenData + additionalContext, isEmpty);

    // Generate roast using AI
    const roast = await callAI(prompt);

    // Cache the result
    setCachedRoast(cacheKey, roast);

    return roast;
  } catch (error) {
    console.error("Error generating roast:", error);

    // Return a random fallback roast (only for premium/friend, free roasts won't fail)
    const fallbacks = FALLBACK_ROASTS.normal;
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

// Generate a mini roast (1 sentence) for Frame teaser
export async function generateMiniRoast(address: string): Promise<string> {
  try {
    const tokens = await getTokenBalances(address as `0x${string}`);
    const isEmpty = tokens.length === 0;

    if (isEmpty) {
      const emptyRoasts = [
        "Your wallet is so empty, tumbleweeds pay rent.",
        "Zero tokens? Bold strategy. Let's see if it pays off.",
        "Empty wallet energy detected. Touch grass or touch crypto?",
      ];
      return emptyRoasts[Math.floor(Math.random() * emptyRoasts.length)];
    }

    const prompt = `Generate ONE savage, funny sentence roasting a crypto wallet that holds: ${tokens.map(t => t.symbol).join(", ")}. Use crypto slang. Max 15 words.`;

    const roast = await callAI(prompt);
    return roast.split(".")[0] + "."; // Ensure just one sentence
  } catch (error) {
    return "Your portfolio choices are... interesting. Get the full roast to see how bad.";
  }
}


