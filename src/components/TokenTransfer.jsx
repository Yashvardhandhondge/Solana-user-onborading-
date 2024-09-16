import React, { useState } from 'react';
import { Transaction, PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
    TOKEN_PROGRAM_ID,
    createTransferInstruction,
} from '@solana/spl-token';

export function TokenTransfer() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [sourceTokenAddress, setSourceTokenAddress] = useState('');
    const [destinationTokenAddress, setDestinationTokenAddress] = useState('');
    const [amount, setAmount] = useState(0);

    const handleTransfer = async () => {
        if (!publicKey) {
            console.log("Please connect your wallet!");
            return;
        }

        const sourcePublicKey = new PublicKey(sourceTokenAddress);
        const destinationPublicKey = new PublicKey(destinationTokenAddress);

        const transaction = new Transaction().add(
            createTransferInstruction(
                sourcePublicKey,
                destinationPublicKey,
                publicKey,
                amount * 1e9,
                [],
                TOKEN_PROGRAM_ID
            )
        );

        transaction.feePayer = publicKey;
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;

        try {
            const signature = await sendTransaction(transaction, connection);
            console.log(`Transaction Signature: ${signature}`);
        } catch (error) {
            console.error("Error transferring tokens:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8 rounded-lg">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full transform bg-gradient-to-r from- via-orange-400 transition-transform duration-300 hover:scale-105">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Transfer Tokens</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Source Token Account Address"
                        value={sourceTokenAddress}
                        onChange={(e) => setSourceTokenAddress(e.target.value)}
                    />
                    <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Destination Token Account Address"
                        value={destinationTokenAddress}
                        onChange={(e) => setDestinationTokenAddress(e.target.value)}
                    />
                    <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Amount (in tokens)"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <button
                        onClick={handleTransfer}
                        className={`w-full py-3 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ${
                            !publicKey ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                        disabled={!publicKey}
                    >
                        Transfer Tokens
                    </button>
                </div>
            </div>
        </div>
    );
}
