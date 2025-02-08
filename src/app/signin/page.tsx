"use client";

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import bs58 from "bs58";

export default function SigninPage() {
    const { publicKey, signMessage } = useWallet();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const router = useRouter();

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

    return (
        <main className="flex items-center justify-center min-h-screen bg-black">
            <button
                onClick={handleSignIn}
                className="flex items-center justify-center bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50">
                {isSignedIn ? "Signed In!" : "Sign In"}
            </button>
        </main>
    );
};
