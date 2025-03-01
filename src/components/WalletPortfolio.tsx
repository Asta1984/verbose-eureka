import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCryptoPayment } from '../hooks/useCryptoPayment';

interface TokenInfo {
  mint: string;
  amount: number;
  decimals: number;
  uiAmount: number;
  symbol?: any;
  name?: string;
  logo?: any;
}

interface WalletPortfolioProps {
  rpcEndpoint: string;
}

const WalletPortfolio: React.FC<WalletPortfolioProps> = ({ rpcEndpoint }) => {
  const { publicKey, connected } = useWallet();
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWalletData = async () => {
      if (!connected || !publicKey) return;
      
      setLoading(true);
      setError(null);

      try {
        const connection = new Connection(rpcEndpoint, 'confirmed');

        const solBalance = await connection.getBalance(publicKey);
        setSolBalance(solBalance / 1e9);

        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID });

        const tokenList: TokenInfo[] = tokenAccounts.value.map(account => {
          const parsedInfo = account.account.data.parsed.info;
          const tokenAmount = parsedInfo.tokenAmount;

          if (tokenAmount.uiAmount === 0) return null;

          return {
            mint: parsedInfo.mint,
            amount: Number(tokenAmount.amount),
            decimals: tokenAmount.decimals,
            uiAmount: tokenAmount.uiAmount,
            symbol: parsedInfo.symbol || "Unknown",
            name: parsedInfo.name || `Token: ${parsedInfo.mint.slice(0, 4)}...`,
            logo: parsedInfo.logoURI || ""
          };
        }).filter(Boolean) as TokenInfo[];

        tokenList.sort((a, b) => b.uiAmount - a.uiAmount);
        setTokens(tokenList);
      } catch (err: any) {
        setError(err.message || 'An error occurred fetching wallet data.');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [publicKey, connected, rpcEndpoint]);

  

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Your Wallet Portfolio</h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Wallet Address</p>
            <p className="font-mono">{publicKey?.toBase58()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">SOL Balance</p>
            <p className="font-bold text-xl">{solBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} SOL</p>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">Token Balances ({tokens.length})</h3>

      {tokens.length === 0 ? (
        <p className="text-center py-4 text-gray-500">No tokens found in this wallet</p>
      ) : (
        <div className="space-y-3">
          {tokens.map((token) => (
            <div key={token.mint} className="p-3 border rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {token.logo ? (
                  <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">{token.symbol?.charAt(0) || '?'}</span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{token.symbol || 'Unknown Token'}</p>
                  <p className="text-xs text-gray-500">{token.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletPortfolio;
