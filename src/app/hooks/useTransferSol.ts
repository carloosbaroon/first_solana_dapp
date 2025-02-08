"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    PublicKey,
    Transaction,
    SystemProgram,
    TransactionSignature,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface TransferSolInput {
    destination: PublicKey;
    amount: number;
}

export function useTransferSol({ address }: { address: PublicKey }) {
    const { connection } = useConnection();
    const wallet = useWallet();

    async function createTransaction({
                                         publicKey,
                                         destination,
                                         amount,
                                     }: {
        publicKey: PublicKey;
        destination: PublicKey;
        amount: number;
    }): Promise<{
        transaction: Transaction;
        latestBlockhash: { blockhash: string; lastValidBlockHeight: number };
    }> {
        const latestBlockhash = await connection.getLatestBlockhash("confirmed");
        const transaction = new Transaction({
            feePayer: publicKey,
            recentBlockhash: latestBlockhash.blockhash,
        });
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: destination,
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );
        return { transaction, latestBlockhash };
    }

    return useMutation<string, unknown, TransferSolInput>({
        mutationKey: ["transfer-sol", address.toString()],
        mutationFn: async (input: TransferSolInput) => {
            const { transaction, latestBlockhash } = await createTransaction({
                publicKey: address,
                destination: input.destination,
                amount: input.amount,
            });
            const signature: TransactionSignature = await wallet.sendTransaction(
                transaction,
                connection
            );
            await connection.confirmTransaction(
                { signature, ...latestBlockhash },
                "confirmed"
            );
            return signature;
        },
        onSuccess: (signature) => {
            toast.success(`Transaction successful: ${signature}`);
        },
        onError: (error) => {
            toast.error(`Transaction failed: ${error}`);
        },
    });
}
