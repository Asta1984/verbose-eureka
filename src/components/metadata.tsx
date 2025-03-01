import React, { useState, useEffect } from 'react';
import { Connection} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';


interface TokenInfo {
  mint: string;
  amount: number;
  decimals: number;
  uiAmount: number;
  symbol?: string;
  name?: string;
  logo?: string;
}

interface TokenMetadataResponse {
  symbol?: string;
  name?: string;
  logoURI?: string;
  extensions?: {
    coingeckoId?: string;
  };
}

interface WalletPortfolioProps {
  rpcEndpoint: string;
}

const WalletPortfolio: React.FC<WalletPortfolioProps> = ({ rpcEndpoint }) => {
  const { publicKey, connected } = useWallet();
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [tokenMap, setTokenMap] = useState<Record<string, TokenMetadataResponse>>({});

  // Fetch token metadata from Solana token list
  useEffect(() => {
    const fetchTokenList = async () => {
      try {
        // Using the Solana token list
        const response = await fetch('https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json');
        const data = await response.json();
        
        const tokenMapData: Record<string, TokenMetadataResponse> = {};
        
        // Create a map of token mint addresses to their metadata
        data.tokens.forEach((token: any) => {
          tokenMapData[token.address] = {
            symbol: token.symbol,
            name: token.name,
            logoURI: token.logoURI,
            extensions: token.extensions
          };
        });
        
        setTokenMap(tokenMapData);
      } catch (err) {
        console.error('Error fetching token list:', err);
        // Continue without token metadata if we can't fetch it
      }
    };
    
    fetchTokenList();
  }, []);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!connected || !publicKey) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const connection = new Connection(rpcEndpoint, 'confirmed');
        
        // 1. Fetch native SOL balance
        const solBalance = await connection.getBalance(publicKey);
        setSolBalance(solBalance / 1e9); // Convert lamports to SOL
        
        // 2. Fetch all token accounts owned by this wallet
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: TOKEN_PROGRAM_ID }
        );
        
        console.log(`Found ${tokenAccounts.value.length} token accounts`);
        
        // Process token accounts
        const tokenList: TokenInfo[] = tokenAccounts.value
          .map(account => {
            const parsedInfo = account.account.data.parsed.info;
            const mintAddress = parsedInfo.mint;
            const tokenAmount = parsedInfo.tokenAmount;
            
            // Skip tokens with zero balance
            if (tokenAmount.uiAmount === 0) return null;
            
            // Get token metadata if available
            const metadata = tokenMap[mintAddress] || {
              symbol: "Unknown",
              name: `Token: ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
              logoURI: ""
            };
            
            return {
              mint: mintAddress,
              amount: Number(tokenAmount.amount),
              decimals: tokenAmount.decimals,
              uiAmount: tokenAmount.uiAmount,
              symbol: metadata.symbol,
              name: metadata.name,
              logo: metadata.logoURI
            };
          })
          .filter(Boolean) as TokenInfo[];
        
        // Sort by UI amount (could be changed to sort by value if price data is available)
        tokenList.sort((a, b) => b.uiAmount - a.uiAmount);
        
        setTokens(tokenList);
      } catch (err: any) {
        console.error('Error fetching wallet data:', err);
        setError(err.message || 'An error occurred fetching wallet data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWalletData();
  }, [publicKey, connected, rpcEndpoint, tokenMap]);

  if (!connected) {
    return (
      <div className="p-6 text-center border rounded-lg">
        <p className="text-lg">Connect your wallet to view your portfolio</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center border rounded-lg">
        <p>Loading wallet data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center border rounded-lg bg-red-50">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Your Wallet Portfolio</h2>
      
      <div className="mb-6 p-4 bg-transparent rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary">Wallet Address</p>
            <p className="font-mono">{publicKey?.toBase58()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-primary">SOL Balance</p>
            <p className="font-bold text-xl">{solBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} SOL</p>
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-3">Token Balances ({tokens.length})</h3>
      
      {tokens.length === 0 ? (
        <p className="text-center py-4 text-primary">No tokens found in this wallet</p>
      ) : (
        <div className="space-y-3">
          {tokens.map((token) => (
            <div key={token.mint} className="p-3 border rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {token.logo ? (
                  <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full" onError={(e) => (e.currentTarget.src = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png')} />
                ) : (
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-xs">{token.symbol?.charAt(0) || '?'}</span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{token.symbol || 'Unknown Token'}</p>
                  <p className="text-xs text-primary">{token.name || token.mint.slice(0, 8) + '...'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{token.uiAmount.toLocaleString(undefined, { minimumFractionDigits: token.decimals > 6 ? 2 : token.decimals, maximumFractionDigits: 6 })}</p>
                <p className="text-xs text-primary">
                  <a 
                    href={`https://explorer.solana.com/address/${token.mint}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    View on Explorer
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletPortfolio;