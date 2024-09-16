import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useState } from 'react';

export function ShowBalance() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getBalance() {
    if (wallet.publicKey) {
      setLoading(true);
      try {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance((balance / LAMPORTS_PER_SOL).toFixed(4));
      } catch (error) {
        alert("Error fetching balance: " + error.message);
      }
      setLoading(false);
    }
  }

  React.useEffect(() => {
    getBalance();
  }, [wallet.publicKey, connection]);

  return (
    <div className="max-w-sm mx-auto mt-8 bg-gradient-to-r from-green-100 to-teal-50 p-8 rounded-3xl shadow-xl border border-gray-200 transition-transform duration-300 hover:scale-105">
      <p className="text-gray-800 text-xl font-bold mb-4">Your SOL Balance</p>
      <div className="text-4xl font-extrabold text-teal-700">
        {loading ? "Loading..." : `${balance} SOL`}
      </div>
    </div>
  );
}
