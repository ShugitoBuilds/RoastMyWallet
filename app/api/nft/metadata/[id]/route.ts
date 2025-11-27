import { NextRequest, NextResponse } from "next/server";
import { getRoastById } from "@/lib/supabase";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Fetch roast data from Supabase
        const roast = await getRoastById(id);

        if (!roast) {
            return NextResponse.json(
                { error: "Roast not found" },
                { status: 404 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://roastmybasewallet.vercel.app";

        // Generate image URL with all scorecard data
        const imageUrl = `${baseUrl}/api/scorecard/${id}?grade=${roast.grade}&gradeColor=${encodeURIComponent(roast.grade_color)}&wallet=${roast.wallet_address.slice(0, 6)}...${roast.wallet_address.slice(-4)}&bagholder=${roast.top_bagholder}&timeBroke=${encodeURIComponent(roast.time_until_broke)}&tokenCount=${roast.token_count}&roastType=${roast.roast_type}`;

        // Return NFT metadata in standard format
        const metadata = {
            name: `Roast Certificate #${id.substring(0, 8)}`,
            description: `A permanent record of portfolio shame. Grade: ${roast.grade}. "${roast.roast_text.substring(0, 100)}..."`,
            image: imageUrl,
            external_url: baseUrl,
            attributes: [
                {
                    trait_type: "Grade",
                    value: roast.grade,
                },
                {
                    trait_type: "Score",
                    value: roast.score,
                },
                {
                    trait_type: "Top Bagholder",
                    value: roast.top_bagholder,
                },
                {
                    trait_type: "Time Until Broke",
                    value: roast.time_until_broke,
                },
                {
                    trait_type: "Token Count",
                    value: roast.token_count,
                },
                {
                    trait_type: "Roast Type",
                    value: roast.roast_type,
                },
                {
                    trait_type: "Has Meme Coins",
                    value: roast.has_meme_coins ? "Yes" : "No",
                },
                {
                    trait_type: "Has Dead Coins",
                    value: roast.has_dead_coins ? "Yes" : "No",
                },
            ],
        };

        return NextResponse.json(metadata);
    } catch (error) {
        console.error("Error generating NFT metadata:", error);
        return NextResponse.json(
            { error: "Failed to generate metadata" },
            { status: 500 }
        );
    }
}
