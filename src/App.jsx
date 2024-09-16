import './App.css';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useMemo } from 'react';
import { Airdrop } from './components/Airdrop';
import { ShowBalance } from './components/Showbalance'
import { SignMessage } from './components/SignMessage';
import { SendTokens } from './components/SendTokens';
import { TokenLaunch } from './components/TokenLaunchpad';
import { CreateAccount } from './components/create';
import { ChangeOwner } from './components/Changeowner';

function App() {
    const network = WalletAdapterNetwork.Devnet;
    const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

    return (
        <div className='relative min-h-screen bg-gray-100'>
            <ConnectionProvider endpoint={'https://solana-devnet.g.alchemy.com/v2/DEhoo-faZJyJO03UWMXSsKycjKrK_w9G'}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>

                        <div className='absolute top-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between items-center'>
                            <WalletMultiButton className='btn border-t-gray-100 btn-primary' />
                            <WalletDisconnectButton className='btn border-t-gray-100 btn-danger' />
                        </div>


                        <div className='pt-20 pb-12 px-4 flex flex-col items-center gap-8'>
                            <div className='bg-white rounded-lg shadow-lg p-8 border border-gray-200 w-full max-w-md'>
                                <ShowBalance />
                                <Airdrop />
                                <SignMessage />
                                <SendTokens />

                            </div>
                            <div className='bg-white rounded-lg shadow-lg p-8 border border-gray-200 w-full max-w-md'>
                            <TokenLaunch /> 
                            </div>
                            <div className='bg-white rounded-lg shadow-lg p-8 border border-gray-200 w-full max-w-md'>
                            <CreateAccount />
                            <div className='p-2'></div>
                            <ChangeOwner />
                            </div>
                        </div>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </div>
    );
}

export default App;
