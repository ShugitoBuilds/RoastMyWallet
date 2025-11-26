import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoastByAddress, RoastRecord } from "@/lib/supabase";
import { RoastPageClient } from "./RoastPageClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://roastmywallet.xyz";

interface PageProps {
  params: Promise<{ address: string }>;
}

// Generate dynamic metadata for OG tags
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { address } = await params;
  const roast = await getRoastByAddress(address);

  if (!roast) {
    return {
      title: "Roast Not Found | Roast My Wallet",
      description: "This roast doesn't exist. Get your own wallet roasted!",
    };
  }

  const title = `Roast My Wallet - Grade: ${roast.grade}`;
  const description = `${roast.roast_text.slice(0, 150)}...`;
  
  // Generate OG image URL with scorecard data
  const ogImageParams = new URLSearchParams({
    grade: roast.grade,
    gradeColor: roast.grade_color,
    wallet: `${roast.wallet_address.slice(0, 6)}...${roast.wallet_address.slice(-4)}`,
    bagholder: roast.top_bagholder,
    timeBroke: roast.time_until_broke,
    tokenCount: roast.token_count.toString(),
    roastType: roast.roast_type,
  });
  
  const ogImageUrl = `${BASE_URL}/api/scorecard/${roast.id}?${ogImageParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${BASE_URL}/roast/${address}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Roast Certificate - Grade ${roast.grade}`,
        },
      ],
      siteName: "Roast My Wallet",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    // Farcaster Frame meta tags
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": ogImageUrl,
      "fc:frame:image:aspect_ratio": "1.91:1",
      "fc:frame:button:1": "Get Roasted",
      "fc:frame:button:1:action": "link",
      "fc:frame:button:1:target": BASE_URL,
    },
  };
}

export default async function RoastPage({ params }: PageProps) {
  const { address } = await params;
  const roast = await getRoastByAddress(address);

  if (!roast) {
    notFound();
  }

  return <RoastPageClient roast={roast} />;
}


