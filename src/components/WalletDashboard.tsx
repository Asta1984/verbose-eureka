import { useState } from 'react';
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

  // Handle network selection
  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as keyof typeof RPC_ENDPOINTS | 'custom';
    if (value === 'custom') {
      setShowCustomRpc(true);
    } else {
      setSelectedNetwork(value as keyof typeof RPC_ENDPOINTS);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6 mt-6 sm:mt-14">
      <div className="flex flex-col items-center justify-between mb-4 sm:mb-8 gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center w-full">Solana Wallet Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-3 sm:gap-4">
          {!showCustomRpc ? (
            <select
              className="p-2 border rounded bg-transparent w-full sm:w-auto text-sm"
              value={selectedNetwork}
              onChange={handleNetworkChange}
            >
              <option value="mainnet">Mainnet</option>
              <option value="devnet">Devnet</option>
              <option value="testnet">Testnet</option>
              <option value="custom">Custom RPC...</option>
            </select>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                className="p-2 border rounded bg-transparent flex-grow text-sm"
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
          
          <div className="w-full sm:w-auto flex justify-center">
            <WalletMultiButton />
          </div>
        </div>
      </div>
      
      {connected ? (
        <WalletPortfolio rpcEndpoint={currentRpc} />
      ) : (
        <div className="text-center p-4 sm:p-12 border rounded-lg bg-transparent">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Welcome to the Solana Wallet Dashboard</h2>
          <p className="mb-4 sm:mb-6 text-primary text-sm sm:text-base">Connect your wallet to view your token balances and portfolio.</p>
          <WalletMultiButton />
        </div>
      )}
      
      {connected && (
        <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-primary text-center">
          <p className="break-words">Connected to: {showCustomRpc ? 'Custom RPC' : selectedNetwork} ({currentRpc})</p>
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