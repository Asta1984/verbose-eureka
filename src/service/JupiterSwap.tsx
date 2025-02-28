// First, let's create a Jupiter swap service

import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Types for Jupiter API responses
interface RouteInfo {
  inAmount: string;
  outAmount: string;
  outAmountWithSlippage: string;
  priceImpactPct: number;
  marketInfos: any[];
  amount: string;
  slippageBps: number;
  otherAmountThreshold: string;
}

interface SwapResponse {
  swapTransaction: string;
}

export class JupiterSwapService {
  private connection: Connection;
  private merchantWallet: string;
  
  constructor(rpcUrl: string, merchantWallet: string) {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.merchantWallet = merchantWallet;
  }
  
  // Get the best route for swapping tokens
  async getRoute(inputMint: string, outputMint: string, amount: number): Promise<RouteInfo> {
    // Jupiter API endpoint for route
    const jupiterRouteApi = 'https://quote-api.jup.ag/v6/quote';
    
    // USDC mint address on Solana
    const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
    
    const params = new URLSearchParams({
      inputMint: inputMint,
      outputMint: outputMint || USDC_MINT, // Default to USDC
      amount: amount.toString(),
      slippageBps: '50', // 0.5% slippage
    });
    
    const response = await fetch(`${jupiterRouteApi}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get route: ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  // Get the swap transaction
  async getSwapTransaction(route: RouteInfo, userPublicKey: string): Promise<string> {
    const jupiterSwapApi = 'https://quote-api.jup.ag/v6/swap';
    
    const response = await fetch(jupiterSwapApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: route,
        userPublicKey: userPublicKey,
        wrapAndUnwrapSol: true,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get swap transaction: ${response.statusText}`);
    }
    
    const swapResponse: SwapResponse = await response.json();
    return swapResponse.swapTransaction;
  }
  
  // Process payment and swap to USDC
  async processPayment(
    payerPublicKey: string, 
    inputTokenMint: string, 
    paymentAmount: number
  ): Promise<{ 
    transaction: Transaction, 
    expectedUsdcAmount: string 
  }> {
    try {
      // USDC mint address
      const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
      
      // Get the best route for swapping to USDC
      const route = await this.getRoute(inputTokenMint, USDC_MINT, paymentAmount);
      
      // Get the swap transaction
      const swapTransactionBuf = await this.getSwapTransaction(route, payerPublicKey);
      
      // Deserialize the transaction
      const swapTransaction = Transaction.from(Buffer.from(swapTransactionBuf, 'base64'));
      
      // Add the merchant as recipient for the USDC
      const merchantPublicKey = new PublicKey(this.merchantWallet);
      
      // Return the transaction and expected USDC amount
      return {
        transaction: swapTransaction,
        expectedUsdcAmount: route.outAmountWithSlippage
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }
  
  // Settlement confirmation - this would be called after transaction is confirmed
  async confirmSettlement(signature: string): Promise<boolean> {
    try {
      // Wait for transaction confirmation
      await this.connection.confirmTransaction(signature, 'confirmed');
      
      // Get transaction details to verify settlement
      const transactionDetails = await this.connection.getTransaction(signature, {
        commitment: 'confirmed',
      });
      
      // Verify the transaction was successful
      if (transactionDetails && !transactionDetails.meta?.err) {
        // Payment successfully settled
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error confirming settlement:', error);
      return false;
    }
  }
}