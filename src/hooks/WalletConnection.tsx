import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';


export const WalletConnection: React.FC = () => {
  const { publicKey } = useWallet();

  return (
    <div className="flex items-center">
      <WalletMultiButton 
        className="!bg-primary hover:!bg-primary/90 text-white rounded-md"
      >
        {publicKey 
          ? `${publicKey.toBase58().slice(0, 4)}...` 
          : 'Connect Wallet'}
      </WalletMultiButton>
    </div>
  );
};