import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import WalletPortfolio from './metadata';
import { Button } from './ui/button';

// RPC endpoints for different networks
const RPC_ENDPOINTS = {
  mainnet: 'https://solana-mainnet.g.alchemy.com/v2/L_rlJ0gqzjP92QrIXlQz9u2v-dO-ryNN',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
  // Add your custom endpoints here
};

const WalletDashboard = () => {
  const { connected } = useWallet();
  const [selectedNetwork, setSelectedNetwork] = useState<keyof typeof RPC_ENDPOINTS>('mainnet');
  const [customRpc, setCustomRpc] = useState('');
  const [showCustomRpc, setShowCustomRpc] = useState(false);

  // Get the current RPC endpoint
  const currentRpc = showCustomRpc ? customRpc : RPC_ENDPOINTS[selectedNetwork];

  return (
    <div className="max-w-4xl mt-14 mx-auto p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold">Solana Wallet Dashboard</h1>
        
        <div className="flex flex-wrap items-center gap-4 ">
          {!showCustomRpc ? (
            <select
              className="p-2 border rounded bg-transparent"
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value as keyof typeof RPC_ENDPOINTS)}
            >
              <option value="mainnet">Mainnet</option>
              <option value="devnet">Devnet</option>
              <option value="testnet">Testnet</option>
              <option value="custom">Custom RPC...</option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                className="p-2 border rounded bg-transparent"
                placeholder="Enter custom RPC URL"
                value={customRpc}
                onChange={(e) => setCustomRpc(e.target.value)}
              />
              <Button 
                onClick={() => setShowCustomRpc(false)}
                className="px-2 py-1 bg-secondary rounded"
              >
                ↩
              </Button>
            </div>
          )}
          
          <WalletMultiButton />
        </div>
      </div>
      
      {connected ? (
        <WalletPortfolio rpcEndpoint={currentRpc} />
      ) : (
        <div className="text-center p-12 border rounded-lg bg-transparent">
          <h2 className="text-xl font-semibold mb-4">Welcome to the Solana Wallet Dashboard</h2>
          <p className="mb-6 text-primary">Connect your wallet to view your token balances and portfolio.</p>
          <WalletMultiButton />
        </div>
      )}
      
      {connected && (
        <div className="mt-6 text-sm text-primary text-center">
          <p>Connected to: {showCustomRpc ? 'Custom RPC' : selectedNetwork} ({currentRpc})</p>
          <button 
            onClick={() => setShowCustomRpc(!showCustomRpc)} 
            className="text-primary hover:underline mt-1"
          >
            {showCustomRpc ? "Use standard RPC endpoint" : "Use custom RPC endpoint"}
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletDashboard;