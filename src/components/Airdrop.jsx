import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useState } from "react";

export function Airdrop() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState('');

  async function requestAirdrop() {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      await connection.requestAirdrop(wallet.publicKey, amount * LAMPORTS_PER_SOL);
      alert("Airdropped " + amount + " SOL to " + wallet.publicKey.toBase58());
    } catch (error) {
      alert("Failed to request airdrop: " + error.message);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-gradient-to-br from-blue-100 to-blue-50 p-8 rounded-3xl shadow-xl border border-gray-300 transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-900 text-center">Request Airdrop</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount in SOL"
        className="block w-full p-4 mb-6 border border-gray-300 rounded-lg shadow-inner text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
      />
      <button
        onClick={requestAirdrop}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out"
      >
        Request Airdrop
      </button>
    </div>
  );
}
