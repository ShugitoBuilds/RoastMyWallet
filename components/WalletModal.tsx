"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { Connector } from "wagmi";

function WalletIcon({ id, className }: { id: string; className?: string }) {
    // Simple mapping for common wallet icons
    if (id.toLowerCase().includes("metamask")) {
        return (
            <div className={`relative ${className}`}>
                <Image
                    src="/icon-metamask.png"
                    alt="MetaMask"
                    fill
                    className="object-contain"
                />
            </div>
        );
    }
    if (id.toLowerCase().includes("coinbase")) {
        return (
            <div className={`relative ${className}`}>
                <Image
                    src="/icon-coinbase.png"
                    alt="Coinbase Wallet"
                    fill
                    className="object-contain"
                />
            </div>
        );
    }
    if (id.toLowerCase().includes("walletconnect")) {
        return (
            <div className={`relative ${className}`}>
                <Image
                    src="/icon-walletconnect.png"
                    alt="WalletConnect"
                    fill
                    className="object-contain"
                />
            </div>
        );
    }
    if (id.toLowerCase().includes("base")) {
        return (
            <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#0052FF" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11.2 11.2C11.2 8.54903 13.349 6.4 16 6.4C18.651 6.4 20.8 8.54903 20.8 11.2C20.8 13.851 18.651 16 16 16C13.349 16 11.2 13.851 11.2 11.2ZM24 20C24 22.2091 22.2091 24 20 24H12C9.79086 24 8 22.2091 8 20C8 17.7909 9.79086 16 12 16H20C22.2091 16 24 17.7909 24 20Z" fill="white" />
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

    const getConnectorName = (connector: Connector) => {
        if (connector.id === 'injected') return 'Browser Wallet';
        if (connector.name === 'Injected') return 'Browser Wallet';
        return connector.name;
    };

    // Create display list with Base Wallet added
    const displayConnectors = [...uniqueConnectors];
    const coinbaseConnector = connectors.find(c => c.id === 'coinbaseWalletSDK');

    // Add Base Wallet option if Coinbase connector exists
    if (coinbaseConnector) {
        // Check if Base Wallet is already in the list (unlikely with unique filter but safe to check)
        const hasBase = displayConnectors.some(c => c.id === 'base-wallet');
        if (!hasBase) {
            // Insert Base Wallet after Coinbase Wallet or at the end
            const cbIndex = displayConnectors.findIndex(c => c.id === 'coinbaseWalletSDK');
            const baseOption = { ...coinbaseConnector, id: 'base-wallet', name: 'Base Wallet', uid: 'base-wallet-uid' };

            if (cbIndex !== -1) {
                displayConnectors.splice(cbIndex + 1, 0, baseOption);
            } else {
                displayConnectors.push(baseOption);
            }
        }
    }

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
                            {displayConnectors.map((connector) => (
                                <button
                                    key={connector.uid || connector.id}
                                    onClick={() => handleConnect(connector.id === 'base-wallet' ? coinbaseConnector! : connector)}
                                    disabled={isPending}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-charcoal-800/50 border border-charcoal-700/50 
                             hover:bg-charcoal-800 hover:border-flame-500/30 transition-all duration-200 group"
                                >
                                    <WalletIcon id={connector.id} className="w-8 h-8 text-charcoal-300 group-hover:text-flame-400 transition-colors shrink-0" />
                                    <span className="font-display font-medium text-charcoal-200 group-hover:text-white transition-colors">
                                        {getConnectorName(connector)}
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
