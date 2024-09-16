import React, { useState } from 'react';
import { Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TokenTransfer } from './TokenTransfer';

export function CreateAccount() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [space, setSpace] = useState(0);
    const [lamports, setLamports] = useState(0);

    const handleCreateAccount = async () => {
        if (!publicKey) {
            console.log("Please connect your wallet!");
            return;
        }

        const newAccount = Keypair.generate();

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: publicKey,
                newAccountPubkey: newAccount.publicKey,
                lamports,
                space,
                programId: SystemProgram.programId,
            })
        );

        transaction.feePayer = publicKey;
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;

        transaction.sign(newAccount);

        try {
            const signature = await sendTransaction(transaction, connection, { signers: [newAccount] });
            console.log(`Transaction Signature: ${signature}`);
            console.log(`New Account Public Key: ${newAccount.publicKey.toString()}`);
        } catch (error) {
            console.error("Error creating account:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-teal-400 via-green-500 to-blue-500 p-8 rounded-lg">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full transform transition-transform duration-300 hover:scale-105 bg-gradient-to-r from-yellow-400">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create New Account</h2>
                <div className="space-y-4">
                    <input
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                        placeholder="Space (Bytes)"
                        value={space}
                        onChange={(e) => setSpace(Number(e.target.value))}
                    />
                    <input
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                        placeholder="Lamports (Balance)"
                        value={lamports}
                        onChange={(e) => setLamports(Number(e.target.value))}
                    />
                    <button
                        onClick={handleCreateAccount}
                        className={`w-full py-3 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ${
                            !publicKey ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                        }`}
                        disabled={!publicKey}
                    >
                        Create Account
                    </button>
                </div>
            </div>

            <div className="mt-8 w-full max-w-md">
                <TokenTransfer />
            </div>
        </div>
    );
}
