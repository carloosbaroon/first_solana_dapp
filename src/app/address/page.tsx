"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ModalSend from "../components/ModalSend";

export default function Address() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const router = useRouter();
    const [balance, setBalance] = useState<number>(0);
    const [showModal, setShowModal] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // Redirect to /signin if wallet is not connected
    useEffect(() => {
        if (!publicKey) {
            router.replace("/signin");
        } else {
            setIsChecking(false);
        }
    }, [publicKey, router]);

    useEffect(() => {
        if (publicKey) {
            (async function getBalanceEvery10Seconds() {
                const newBalance = await connection.getBalance(publicKey);
                setBalance(newBalance / LAMPORTS_PER_SOL);
                setTimeout(getBalanceEvery10Seconds, 10000);
            })();
        }
    }, [publicKey, connection]);

    if (isChecking) return <p>Loading...</p>;

    return (
        <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
            {publicKey ? (
                <div className="flex flex-col gap-4">
                    <h1>Your Public key is: {publicKey?.toString()}</h1>
                    <h2>Your Balance is: {balance} SOL</h2>
                    <button
                        className="btn btn-primary mt-4"
                        onClick={() => setShowModal(true)}>
                        Send SOL
                    </button>
                </div>
            ) : (
                <h1>Wallet is not connected</h1>
            )}

            {showModal && publicKey && (
                <ModalSend
                    show={showModal}
                    hide={() => setShowModal(false)}
                    address={publicKey}/>
            )}
        </main>
    );
}
