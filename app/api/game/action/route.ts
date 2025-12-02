import { NextRequest, NextResponse } from "next/server";
import { performStoke, performShade, performCope } from "@/lib/game-db";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, actor, target } = body;

        if (!action || !actor) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let result;

        switch (action) {
            case "stoke":
                result = await performStoke(actor);
                break;

            case "shade":
                if (!target) {
                    return NextResponse.json({ error: "Target required for shade" }, { status: 400 });
                }
                result = await performShade(actor, target);
                break;

            case "cope":
                result = await performCope(actor);
                break;

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        if (!result.success) {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error("Error in game action API:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
