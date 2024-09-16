import React, { useState } from 'react';
import { Keypair, Transaction, PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
    TOKEN_PROGRAM_ID,
    setAuthority,
    AuthorityType 
} from '@solana/spl-token';

export function ChangeOwner() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [tokenAddress, setTokenAddress] = useState('');
    const [newOwner, setNewOwner] = useState('');

    const handleChangeOwner = async () => {
        if (!publicKey) {
            console.log("Please connect your wallet!");
            return;
        }

        const tokenPublicKey = new PublicKey(tokenAddress);
        const newOwnerPublicKey = new PublicKey(newOwner);

        const transaction = new Transaction().add(
            setAuthority(
                tokenPublicKey,        
                publicKey,             
                newOwnerPublicKey,     
                AuthorityType.AccountOwner,
                publicKey,             
                []
            )
        );

        transaction.feePayer = publicKey;
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;

        try {
            const signature = await sendTransaction(transaction, connection);
            console.log(`Transaction Signature: ${signature}`);
        } catch (error) {
            console.error("Error changing owner:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8 hover:scale-105 rounded-lg">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full transform transition-transform duration-300  hover:scale-105">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Change Token Account Owner</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        placeholder="Token Account Address"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                    />
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        placeholder="New Owner Public Key"
                        value={newOwner}
                        onChange={(e) => setNewOwner(e.target.value)}
                    />
                    <button
                        onClick={handleChangeOwner}
                        className={`w-full py-3 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ${
                            !publicKey ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        disabled={!publicKey}
                    >
                        Change Owner
                    </button>
                </div>
            </div>
        </div>
    );
}
