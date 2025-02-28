"use server";

import { createContext, useContext, ReactNode } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';



interface PaymentProviderProps {
  children: ReactNode;
  merchantWallet: string;
  network?: WalletAdapterNetwork;
  rpcEndpoint?: string;
}

// Context for merchant configuration
interface MerchantConfig {
  merchantWallet: string;
  rpcEndpoint: string;
  network: WalletAdapterNetwork;
}

const MerchantContext = createContext<MerchantConfig>({
  merchantWallet: '',
  rpcEndpoint: '',
  network: WalletAdapterNetwork.Mainnet,
});

export const useMerchantConfig = () => useContext(MerchantContext);

export function PaymentProvider({
  children,
  merchantWallet,
  network = WalletAdapterNetwork.Mainnet,
  rpcEndpoint,
}: PaymentProviderProps) {
  // You can set custom RPC endpoint or use default from Solana
  const endpoint = rpcEndpoint || clusterApiUrl(network);
  
  // Configure the wallet adapters
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];
  
  const merchantConfig: MerchantConfig = {
    merchantWallet,
    rpcEndpoint: endpoint,
    network,
  };
  
  return (
    <MerchantContext.Provider value={merchantConfig}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </MerchantContext.Provider>
  );
}