"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export default function Address() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState<number>(0);

    // code for the `getAirdropOnClick` function here

    useEffect(() => {
        if (publicKey) {
            (async function getBalanceEvery10Seconds() {
                const newBalance = await connection.getBalance(publicKey);
                setBalance(newBalance / LAMPORTS_PER_SOL);
                setTimeout(getBalanceEvery10Seconds, 10000);
            })();
        }
    }, [publicKey, connection, balance]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
            {publicKey ? (
                <div className="flex flex-col gap-4">
                    <h1>Your Public key is: {publicKey?.toString()}</h1>
                    <h2>Your Balance is: {balance} SOL</h2>
                </div>
            ) : (
                <h1>Wallet is not connected</h1>
            )}
        </main>
    );
}