


import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export function SendTokens() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  async function sendTokens() {
    if (!to || !amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid recipient address and amount.");
      return;
    }

    const transaction = new Transaction();
    transaction.add(SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: new PublicKey(to),
      lamports: amount * LAMPORTS_PER_SOL,
    }));

    try {
      await wallet.sendTransaction(transaction, connection);
      alert(`Sent ${amount} SOL to ${to}`);
      setTo('');
      setAmount('');
    } catch (error) {
      alert("Failed to send tokens: " + error.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-gradient-to-r from-blue-300 to-green-500 p-8 rounded-3xl shadow-xl border border-gray-200 hover:scale-105">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Tokens</h2>
      <input
        id="to"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        type="text"
        placeholder="Recipient Address"
        className="block w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        id="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        placeholder="Amount in SOL"
        className="block w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={sendTokens}
        className="w-full bg-teal-500 text-white py-3 rounded-lg shadow-md hover:bg-teal-600 transition duration-200"
      >
        Send Tokens
      </button>
    </div>
  );
}
