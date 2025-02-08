"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useTransferSol } from "../hooks/useTransferSol";

interface ModalSendProps {
    show: boolean;
    hide: () => void;
    address: PublicKey;
}

export default function ModalSend({ show, hide, address }: ModalSendProps) {
    const wallet = useWallet();
    const { mutateAsync } = useTransferSol({ address });
    const [destination, setDestination] = useState("");
    const [amount, setAmount] = useState("1");

    if (!show) return null;
    if (!address || !wallet.sendTransaction) {
        return <div>Wallet not connected</div>;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div className="bg-black border border-white p-6 rounded shadow-lg w-80">
                <h2 className="text-xl font-bold text-white mb-4">Send SOL</h2>
                <input
                    type="text"
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="border p-2 w-full mb-2 text-black"/>
                <input
                    type="number"
                    step="any"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border p-2 w-full mb-4 text-black"/>
                <div className="flex justify-end">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 mr-2 rounded"
                        onClick={hide}>
                        Cancel
                    </button>
                    <button
                        disabled={!destination || !amount}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                        onClick={() => {
                            mutateAsync({
                                destination: new PublicKey(destination),
                                amount: parseFloat(amount),
                            })
                                .then(() => hide())
                                .catch((err) => console.error("Transaction failed:", err));
                        }}>
                        Send
                    </button>
                </div>
            </div>
        </div>

    );
}
