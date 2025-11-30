"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { Connector } from "wagmi";

function WalletIcon({ id, className }: { id: string; className?: string }) {
    // Simple mapping for common wallet icons
    if (id.toLowerCase().includes("metamask")) {
        return (
            <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.4 3.8L25.6 12.8L28.7 19.8L31.2 11.2L27.4 3.8Z" fill="#E17726" stroke="#E17726" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.6 3.8L8.4 12.8L5.3 19.8L0.8 11.2L4.6 3.8Z" fill="#E27625" stroke="#E27625" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23.9 22.8L27.6 28.6L30.3 23.3L28.7 19.8L23.9 22.8Z" fill="#E27625" stroke="#E27625" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.1 22.8L4.4 28.6L1.7 23.3L3.3 19.8L8.1 22.8Z" fill="#E27625" stroke="#E27625" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.6 15.3L8.4 12.8L4.6 3.8L12.4 9.6L10.6 15.3Z" fill="#E27625" stroke="#E27625" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21.4 15.3L23.6 12.8L27.4 3.8L19.6 9.6L21.4 15.3Z" fill="#E27625" stroke="#E27625" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.4 9.6L4.6 3.8L10.4 1.8L16 6.3L21.6 1.8L27.4 3.8L19.6 9.6L16 12.2L12.4 9.6Z" fill="#D5BFB2" stroke="#D5BFB2" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.4 9.6L16 12.2L19.6 9.6L21.4 15.3L16 18.4L10.6 15.3L12.4 9.6Z" fill="#233447" stroke="#233447" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.6 15.3L16 18.4L13.3 23.9L8.1 22.8L5.3 19.8L8.4 12.8L10.6 15.3Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21.4 15.3L16 18.4L18.7 23.9L23.9 22.8L26.7 19.8L23.6 12.8L21.4 15.3Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.7 23.9L16 28.2L13.3 23.9L16 18.4L18.7 23.9Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    if (id.toLowerCase().includes("coinbase")) {
        return (
            <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#0052FF" />
                <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24C20.4183 24 24 20.4183 24 16C24 11.5817 20.4183 8 16 8ZM16 20C13.7909 20 12 18.2091 12 16C12 13.7909 13.7909 12 16 12C18.2091 12 20 13.7909 20 16C20 18.2091 18.2091 20 16 20Z" fill="white" />
            </svg>
        );
    }
    // Default wallet icon
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="currentColor" />
        </svg>
    );
}

export function WalletModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { connectors, connect, isPending, error } = useConnect();
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close modal when connected
    useEffect(() => {
        if (isConnected) {
            setIsOpen(false);
        }
    }, [isConnected]);

    // Filter unique connectors and prioritize specific ones
    const uniqueConnectors = connectors.filter((connector, index, self) =>
        index === self.findIndex((c) => c.id === connector.id)
    );

    const handleConnect = (connector: Connector) => {
        connect({ connector });
    };

    if (isConnected) {
        return (
            <div className="flex items-center justify-between p-4 bg-charcoal-800/50 rounded-xl border border-charcoal-700/30 w-full">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-charcoal-400 text-sm font-medium">Connected</span>
                    <code className="text-charcoal-300 text-sm font-mono">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                    </code>
                </div>
                <button
                    onClick={() => disconnect()}
                    className="text-ember-400 hover:text-ember-300 text-sm font-medium transition-colors"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="!bg-gradient-to-r !from-flame-500 !via-ember-500 !to-flame-600 
                   !text-white !font-display !font-semibold !px-8 !py-4 !rounded-xl
                   !border-0 !shadow-glow hover:!shadow-glow-lg
                   !transition-all !duration-300 hover:!scale-[1.02] active:!scale-[0.98]"
            >
                Connect Wallet
            </button>

            {isOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-charcoal-950/80 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-sm bg-charcoal-900 border border-charcoal-800 rounded-2xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="text-center space-y-2">
                            <h3 className="font-display text-2xl font-bold text-charcoal-100">
                                Connect Wallet
                            </h3>
                            <p className="text-charcoal-400 text-sm">
                                Choose your preferred wallet to get roasted
                            </p>
                        </div>

                        <div className="space-y-3">
                            {uniqueConnectors.map((connector) => (
                                <button
                                    key={connector.uid}
                                    onClick={() => handleConnect(connector)}
                                    disabled={isPending}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-charcoal-800/50 border border-charcoal-700/50 
                             hover:bg-charcoal-800 hover:border-flame-500/30 transition-all duration-200 group"
                                >
                                    <WalletIcon id={connector.id} className="w-8 h-8 text-charcoal-300 group-hover:text-flame-400 transition-colors shrink-0" />
                                    <span className="font-display font-medium text-charcoal-200 group-hover:text-white transition-colors">
                                        {connector.name}
                                    </span>
                                    {isPending && (
                                        <div className="ml-auto animate-spin h-4 w-4 border-2 border-flame-500 border-t-transparent rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {error && (
                            <p className="text-center text-sm text-red-400 bg-red-500/10 p-2 rounded-lg">
                                {error.message.includes("User rejected") ? "Connection rejected" : "Failed to connect"}
                            </p>
                        )}

                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full py-2 text-charcoal-500 hover:text-charcoal-300 text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
