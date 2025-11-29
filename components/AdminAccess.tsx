"use client";

import { useState, useEffect } from "react";

interface AdminAccessProps {
    onAccessGranted: () => void;
}

export function AdminAccess({ onAccessGranted }: AdminAccessProps) {
    const [clickCount, setClickCount] = useState(0);

    const handleClick = () => {
        const code = prompt("Enter Admin Code:");
        if (code === process.env.NEXT_PUBLIC_ADMIN_CODE) {
            onAccessGranted();
            alert("Admin access granted!");
        } else if (code) {
            alert("Invalid code.");
        }
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-4 right-4 w-4 h-4 bg-charcoal-800 hover:bg-charcoal-700 rounded-full opacity-20 hover:opacity-50 transition-all duration-300 z-50 cursor-default"
            aria-label="Admin Access"
            title=""
        />
    );
}
