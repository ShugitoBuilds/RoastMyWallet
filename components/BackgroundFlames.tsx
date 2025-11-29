"use client";

import { useEffect, useState } from "react";

function FlameParticle({ delay, duration, left }: { delay: number; duration: number; left: number }) {
    return (
        <div
            className="absolute bottom-0 animate-fire-flicker pointer-events-none"
            style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
            }}
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-flame-500/20"
            >
                <path
                    d="M12 2C12 2 8 6 8 10C8 12 9 14 12 14C15 14 16 12 16 10C16 6 12 2 12 2Z"
                    fill="currentColor"
                />
                <path
                    d="M12 8C12 8 10 10 10 12C10 13.5 11 15 12 15C13 15 14 13.5 14 12C14 10 12 8 12 8Z"
                    fill="currentColor"
                    fillOpacity="0.5"
                />
            </svg>
        </div>
    );
}

export function BackgroundFlames() {
    const [particles, setParticles] = useState<{ id: number; delay: number; duration: number; left: number }[]>([]);

    useEffect(() => {
        // Generate random particles on client side to avoid hydration mismatch
        const newParticles = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            delay: Math.random() * 5,
            duration: 2 + Math.random() * 3, // 2-5s duration
            left: Math.random() * 100,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p) => (
                <FlameParticle key={p.id} {...p} />
            ))}
        </div>
    );
}
