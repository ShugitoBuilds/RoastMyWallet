import { NextRequest, NextResponse } from "next/server";
import { generateMiniRoast } from "@/lib/roast-generator";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Frame metadata for Farcaster
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get("state") || "initial";
  const miniRoast = searchParams.get("miniRoast") || "";
  const grade = searchParams.get("grade") || "";

  // Generate frame metadata based on state
  let imageUrl = `${baseUrl}/api/frame/image?state=${state}`;
  if (miniRoast) {
    imageUrl += `&miniRoast=${encodeURIComponent(miniRoast)}&grade=${grade}`;
  }
  
  let buttons: string[] = [];
  let postUrl = `${baseUrl}/api/frame`;

  if (state === "initial") {
    buttons = ["Get Mini Roast (Free)", "Full Savage Report"];
  } else if (state === "roasted") {
    buttons = ["Get Full Report", "Share on Warpcast", "Roast Again"];
  }

  // Build frame meta tags
  const frameMeta: Record<string, string> = {
    "fc:frame": "vNext",
    "fc:frame:image": imageUrl,
    "fc:frame:image:aspect_ratio": "1.91:1",
    "fc:frame:post_url": postUrl,
  };

  buttons.forEach((btn, i) => {
    frameMeta[`fc:frame:button:${i + 1}`] = btn;
    // Make "Full Savage Report" and "Get Full Report" link buttons
    if (btn.includes("Full") || btn.includes("Report")) {
      frameMeta[`fc:frame:button:${i + 1}:action`] = "link";
      frameMeta[`fc:frame:button:${i + 1}:target`] = baseUrl;
    } else if (btn.includes("Share")) {
      frameMeta[`fc:frame:button:${i + 1}:action`] = "link";
      const shareText = encodeURIComponent(`I just got roasted! Grade: ${grade}\n\n"${miniRoast}"\n\nGet roasted:`);
      frameMeta[`fc:frame:button:${i + 1}:target`] = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;
    }
  });

  const metaTags = Object.entries(frameMeta)
    .map(([key, value]) => `<meta property="${key}" content="${value}" />`)
    .join("\n  ");

  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head>
  <title>Roast My Wallet - Get Roasted by AI</title>
  <meta property="og:title" content="Roast My Wallet" />
  <meta property="og:description" content="Get your crypto portfolio ruthlessly roasted by AI. Built on Base." />
  <meta property="og:image" content="${imageUrl}" />
  ${metaTags}
</head>
<body>
  <h1>Roast My Wallet</h1>
  <p>Connect your wallet and get roasted by AI!</p>
  <a href="${baseUrl}">Get Roasted</a>
</body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData } = body;

    if (!untrustedData) {
      return NextResponse.json({ error: "Invalid frame data" }, { status: 400 });
    }

    const buttonIndex = untrustedData.buttonIndex;
    const fid = untrustedData.fid;
    const castId = untrustedData.castId;

    // For "Get Mini Roast" button
    if (buttonIndex === 1) {
      // Try to get user's connected wallet from Farcaster
      // For now, generate a generic mini roast
      let miniRoast = "Your portfolio choices are... interesting. Get the full roast to see how bad.";
      let grade = "?";

      try {
        // In a real implementation, we'd fetch the user's wallet from Farcaster
        // For demo, generate a random teaser
        const teasers = [
          { roast: "Your bags are heavier than your regrets.", grade: "D" },
          { roast: "HODL? More like HOPIUM.", grade: "F" },
          { roast: "Even rugs have better exits than your portfolio.", grade: "F-" },
          { roast: "Your portfolio is a masterclass in what NOT to do.", grade: "D-" },
          { roast: "Diamond hands? More like desperate hands.", grade: "C" },
        ];
        const random = teasers[Math.floor(Math.random() * teasers.length)];
        miniRoast = random.roast;
        grade = random.grade;
      } catch (error) {
        console.error("Error generating mini roast:", error);
      }

      // Redirect to frame with mini roast
      const redirectUrl = new URL("/api/frame", request.url);
      redirectUrl.searchParams.set("state", "roasted");
      redirectUrl.searchParams.set("miniRoast", miniRoast);
      redirectUrl.searchParams.set("grade", grade);

      return NextResponse.redirect(redirectUrl);
    }

    // For "Roast Again" button
    if (buttonIndex === 3) {
      return NextResponse.redirect(new URL("/api/frame?state=initial", request.url));
    }

    // Default: redirect to main app
    return NextResponse.redirect(new URL(baseUrl));
  } catch (error) {
    console.error("Error in frame POST:", error);
    return NextResponse.json({ error: "Frame error" }, { status: 500 });
  }
}

