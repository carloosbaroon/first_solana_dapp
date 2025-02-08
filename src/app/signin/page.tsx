"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import bs58 from "bs58";

export default function SigninPage() {
    const { publicKey, signMessage } = useWallet();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSignIn = async () => {
        if (!publicKey || !signMessage) {
            console.error("Wallet not connected or signMessage not available");
            return;
        }

        const nonce = "random-nonce";
        const statement = "Sign in to Solana dapp. Nonce:";
        const challenge = `${statement} ${nonce}`;
        const messageBytes = new TextEncoder().encode(challenge);

        try {
            const signature = await signMessage(messageBytes);
            const encodedSignature = bs58.encode(signature);
            console.log("Public Key:", publicKey.toBase58());
            console.log("Signature:", encodedSignature);

            setIsSignedIn(true);
            alert("Sign-in successful!");

            router.push("/address");
        } catch (error) {
            console.error("Error signing message:", error);
            alert("Sign-in failed. Please try again.");
        }
    };

    // Only render the component on the client
    if (!isClient) {
        return null; // Prevent rendering on the server
    }

    return (
        <main className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
                <div className="border hover:border-slate-900 rounded">
                    <WalletMultiButton />
                </div>
                <button
                    onClick={handleSignIn}
                    className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition">
                    {isSignedIn ? "Signed In!" : "Sign In"}
                </button>
            </div>
        </main>
    );
};
