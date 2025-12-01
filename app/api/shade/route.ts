import { NextRequest, NextResponse } from "next/server";
import { performAttack, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { attacker, victim } = body;

        if (!attacker || !victim) {
            return NextResponse.json(
                { error: "Attacker and victim addresses are required" },
                { status: 400 }
            );
        }

        if (attacker.toLowerCase() === victim.toLowerCase()) {
            return NextResponse.json(
                { error: "You cannot throw shade at yourself!" },
                { status: 400 }
            );
        }

        if (!isSupabaseConfigured()) {
            return NextResponse.json(
                { error: "Game database not configured" },
                { status: 503 }
            );
        }

        // Perform the attack
        // Cost is hardcoded to 0.50 for now as per plan
        const result = await performAttack(attacker, victim, 0.50);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || "Attack failed" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            stolen: result.stolen,
            message: `Successfully stole ${result.stolen} points!`
        });

    } catch (error) {
        console.error("Error in shade API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
