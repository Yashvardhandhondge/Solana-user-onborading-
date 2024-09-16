import { ed25519 } from "@noble/curves/ed25519";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from 'bs58';
import React from "react";

export function SignMessage() {
    const { publicKey, signMessage } = useWallet(); // Changed from `SignMessage` to `signMessage`

    async function onclick() {
        if (!publicKey) {
            alert("Wallet not connected");
            return;
        }
        if (!signMessage) {
            alert("Wallet does not support this message");
            return;
        }

        const message = document.getElementById("message").value;
        if (!message) {
            alert("Message cannot be empty");
            return;
        }

        const encodedMessage = new TextEncoder().encode(message);

        try {
            const signature = await signMessage(encodedMessage);

            const publicKeyBytes = publicKey.toBytes();
            const isValid = await ed25519.verify(signature, encodedMessage, publicKeyBytes);

            if (!isValid) {
                alert("Message signature invalid");
                return;
            }

            alert(`Success: Message signature: ${bs58.encode(signature)}`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    return (
        <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8 rounded-lg shadow-lg max-w-md mx-auto mt-8 hover:scale-105">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign a Message</h2>
            <input type="text"
                   id="message"
                   placeholder="Enter your message"
                   className="block w-full p-4 mb-6 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button
                onClick={onclick}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 transform hover:scale-105"
            >Sign Message</button>
        </div>
    );
}
