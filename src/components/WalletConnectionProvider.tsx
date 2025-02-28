import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,

} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletConnectionProviderProps {
  children: React.ReactNode;
}

export const WalletConnectionProvider: React.FC<WalletConnectionProviderProps> = ({ children }) => {
  // Choose your network: 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;
  
  // You can replace clusterApiUrl with your own RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Configure supported wallets
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider  wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};