import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { Connection, PublicKey, TransactionSignature } from '@solana/web3.js';
import { JupiterSwapService } from '../service/JupiterSwap';

// Token definitions
export interface TokenInfo {
  symbol: string;
  name: string;
  mint: string;
  logo: string;
  decimals: number;
}

// Common Solana tokens
export const COMMON_TOKENS: TokenInfo[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    mint: 'So11111111111111111111111111111111111111112',
    logo: '/tokens/sol.png',
    decimals: 9
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    logo: '/tokens/usdc.png',
    decimals: 6
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    logo: '/tokens/bonk.png',
    decimals: 5
  },
  {
    symbol: 'JUP',
    name: 'Jupiter',
    mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    logo: '/tokens/jup.png',
    decimals: 6
  }
];

// Payment status
export enum PaymentStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error'
}

// Merchant configuration
interface MerchantConfig {
  walletAddress: string;
  rpcUrl: string;
}

const defaultMerchantConfig: MerchantConfig = {
  walletAddress: 'YOUR_MERCHANT_WALLET_ADDRESS', // Replace with actual merchant wallet
  rpcUrl: 'https://api.mainnet-beta.solana.com'
};

export function useCryptoPayment(merchantConfig = defaultMerchantConfig) {
  const { publicKey, signTransaction, connected } = useWallet();
  const [selectedToken, setSelectedToken] = useState<TokenInfo>(COMMON_TOKENS[0]);
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [expectedUsdcAmount, setExpectedUsdcAmount] = useState<string>('0');
  
  // Initialize Jupiter Swap Service
  const jupiterService = new JupiterSwapService(
    merchantConfig.rpcUrl,
    merchantConfig.walletAddress
  );
  
  // Process payment
  const processPayment = async (amount: number): Promise<boolean> => {
    if (!publicKey || !signTransaction || !connected) {
      console.error('Wallet not connected');
      return false;
    }
    
    try {
      setStatus(PaymentStatus.PROCESSING);
      
      // Convert amount to the correct number of decimals for the token
      const amountInSmallestUnit = amount * Math.pow(10, selectedToken.decimals);
      
      // Get transaction for swapping to USDC
      const { transaction, expectedUsdcAmount: usdcAmount } = await jupiterService.processPayment(
        publicKey.toString(),
        selectedToken.mint,
        Math.floor(amountInSmallestUnit)
      );
      
      // Set expected USDC amount
      setExpectedUsdcAmount(usdcAmount);
      
      // Sign transaction
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (
        await new Connection(merchantConfig.rpcUrl).getLatestBlockhash()
      ).blockhash;
      
      const signedTx = await signTransaction(transaction);
      
      // Send transaction
      const signature = await new Connection(merchantConfig.rpcUrl).sendRawTransaction(
        signedTx.serialize()
      );
      
      setTxSignature(signature);
      
      // Wait for confirmation
      const success = await jupiterService.confirmSettlement(signature);
      
      setStatus(success ? PaymentStatus.SUCCESS : PaymentStatus.ERROR);
      return success;
    } catch (error) {
      console.error('Payment processing error:', error);
      setStatus(PaymentStatus.ERROR);
      return false;
    }
  };
  
  return {
    selectedToken,
    setSelectedToken,
    status,
    processPayment,
    txSignature,
    expectedUsdcAmount,
    isWalletConnected: connected
  };
}