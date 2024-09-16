import { useState } from 'react';
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  MINT_SIZE, 
  TOKEN_2022_PROGRAM_ID, 
  createMintToInstruction, 
  createAssociatedTokenAccountInstruction, 
  getMintLen, 
  createInitializeMetadataPointerInstruction, 
  createInitializeMintInstruction, 
  TYPE_SIZE, 
  LENGTH_SIZE, 
  ExtensionType, 
  getAssociatedTokenAddressSync 
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';

export function TokenLaunch() {
  const { connection } = useConnection();
  const wallet = useWallet();

  
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [uri, setUri] = useState('');
  const [initialSupply, setInitialSupply] = useState(0);

  async function createToken() {
    const mintKeypair = Keypair.generate();
    
    
    const metadata = {
      mint: mintKeypair.publicKey,
      name: name, 
      symbol: symbol, 
      uri: uri, 
      additionalMetadata: []
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMetadataPointerInstruction(
        mintKeypair.publicKey, 
        wallet.publicKey, 
        mintKeypair.publicKey, 
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMintInstruction(mintKeypair.publicKey, 9, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: mintKeypair.publicKey,
        metadata: mintKeypair.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        mintAuthority: wallet.publicKey,
        updateAuthority: wallet.publicKey,
      })
    );
    
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.partialSign(mintKeypair);
    
    await wallet.sendTransaction(transaction, connection);

    const associatedToken = getAssociatedTokenAddressSync(mintKeypair.publicKey, wallet.publicKey, false, TOKEN_2022_PROGRAM_ID);

    const transaction2 = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey, 
        associatedToken, 
        wallet.publicKey, 
        mintKeypair.publicKey, 
        TOKEN_2022_PROGRAM_ID
      )
    );

    await wallet.sendTransaction(transaction2, connection);

    const transaction3 = new Transaction().add(
      createMintToInstruction(
        mintKeypair.publicKey, 
        associatedToken, 
        wallet.publicKey, 
        initialSupply * 1e9, 
        [], 
        TOKEN_2022_PROGRAM_ID
      )
    );

    await wallet.sendTransaction(transaction3, connection);
    
    console.log('Token created successfully');
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-violet-500 to-yellow-500 p-8 rounded-lg shadow-lg max-w-md mx-auto mt-8 hover:scale-105">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full bg-gradient-to-r from-purple-400 via-indigo-500 to-green-300">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Solana Token Launchpad</h1>
        <div className="space-y-4">
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Symbol" 
            value={symbol} 
            onChange={(e) => setSymbol(e.target.value)}
          />
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Image URL" 
            value={uri} 
            onChange={(e) => setUri(e.target.value)}
          />
          <input 
            type="number" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Initial Supply" 
            value={initialSupply} 
            onChange={(e) => setInitialSupply(Number(e.target.value))}
          />
        </div>
        <button 
          onClick={createToken} 
          className="mt-6 w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg"
        >
          Create Token
        </button>
      </div>
    </div>
  );
}
