"use client";

import sdk from "@farcaster/miniapp-sdk";
import { useEffect } from "react";

export default function FarcasterProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const init = async () => {
            try {
                // Initialize the SDK
                await sdk.actions.ready();
            } catch (error) {
                console.error("Failed to initialize Farcaster SDK:", error);
            }
        };

        init();
    }, []);

    return <>{children}</>;
}
