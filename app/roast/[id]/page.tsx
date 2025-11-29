import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoastById } from "@/lib/supabase";
import { getOneLiner } from "@/lib/share";
import { RoastPageClient } from "./RoastPageClient";

// Use VERCEL_URL if available (preview/production), otherwise fallback to configured URL or localhost
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://roastmybasewallet.vercel.app");

interface PageProps {
    params: Promise<{ id: string }>;
}

// Generate dynamic metadata for OG tags
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const roast = await getRoastById(id);

    if (!roast) {
        return {
            title: "Roast Not Found | Roast My Wallet",
            description: "This roast doesn't exist. Get your own wallet roasted!",
            description,
            type: "website",
            url: `${BASE_URL}/roast/${id}`,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: "Roast My Wallet",
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
    const { id } = await params;
    const roast = await getRoastById(id);

    if (!roast) {
        notFound();
    }

    return <RoastPageClient roast={roast} />;
}
