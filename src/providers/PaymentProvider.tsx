import { createContext, useContext, ReactNode, useCallback } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { createJupiterApiClient, SwapMode } from "@jup-ag/api";

// Initialize Jupiter API client
const jupiterApi = createJupiterApiClient();

// USDC mint address (using mainnet address for reference)
const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qZ7x9mSLRF2tdTkVo4YafQwXb");

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
  processPayment: (amount: number, tokenMint?: string) => Promise<string>;
  connectWallet: () => void;
  connected: boolean;
}

const MerchantContext = createContext<MerchantConfig | null>(null);

// Custom hook to access merchant configuration
export const useMerchantConfig = () => {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error("useMerchantConfig must be used within a PaymentProvider");
  }
  return context;
};

// Internal provider component that has access to wallet context
const InternalProvider = ({ children, merchantWallet, network, endpoint }: { 
  children: ReactNode, 
  merchantWallet: string, 
  network: WalletAdapterNetwork,
  endpoint: string 
}) => {
  const { publicKey, signTransaction, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const connectWallet = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  // Process payment with automatic token swap to USDC
  const processPayment = useCallback(async (amount: number, tokenMint?: string): Promise<string> => {
    if (!connected || !publicKey) {
      throw new Error("Wallet not connected");
    }

    if (!signTransaction) {
      throw new Error("Wallet does not support signing transactions");
    }

    const connection = new Connection(endpoint, "confirmed");
    const merchantPublicKey = new PublicKey(merchantWallet);
    
    try {
      // If tokenMint is provided and it's not USDC, use Jupiter for swapping
      if (tokenMint && tokenMint !== USDC_MINT.toString()) {
        const inputMint = new PublicKey(tokenMint);
        
        // Get best swap route
        const route = await jupiterApi.quoteGet({
          inputMint: inputMint.toString(),
          outputMint: USDC_MINT.toString(),
          amount: amount * 10 ** 9, // Convert to lamports
          slippageBps: 50, // 0.5% slippage
          swapMode: SwapMode.ExactIn,
        });
        
        // Create swap transaction
        const swapResponse = await jupiterApi.swapPost({
          swapRequest: {
            quoteResponse: route,
            userPublicKey: publicKey.toString(),
          }
        });
        
        // Decode and sign the transaction
        const swapTx = Transaction.from(Buffer.from(swapResponse.swapTransaction, "base64"));
        swapTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        swapTx.feePayer = publicKey;
        
        const signedTransaction = await signTransaction(swapTx);
        const txid = await connection.sendRawTransaction(signedTransaction.serialize());
        console.log("Swap transaction sent:", txid);
        return txid;
      } else {
        // Default SOL payment (original flow)
        const { SystemProgram } = await import("@solana/web3.js");
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: merchantPublicKey,
            lamports: amount * 10 ** 9, // Convert SOL to lamports
          })
        );

        transaction.feePayer = publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signedTransaction = await signTransaction(transaction);
        const txid = await connection.sendRawTransaction(signedTransaction.serialize());
        console.log("Direct transaction sent:", txid);
        return txid;
      }
    } catch (error) {
      console.error("Payment failed:", error);
      throw new Error("Payment processing failed.");
    }
  }, [connected, publicKey, signTransaction, endpoint, merchantWallet]);

  const merchantConfig: MerchantConfig = {
    merchantWallet,
    rpcEndpoint: endpoint,
    network,
    processPayment,
    connectWallet,
    connected
  };

  return <MerchantContext.Provider value={merchantConfig}>{children}</MerchantContext.Provider>;
};

// Main Payment Provider
export function PaymentProvider({
  children,
  merchantWallet,
  network = WalletAdapterNetwork.Devnet,
  rpcEndpoint,
}: PaymentProviderProps) {
  const endpoint = rpcEndpoint || clusterApiUrl(network);
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <InternalProvider 
            merchantWallet={merchantWallet}
            network={network}
            endpoint={endpoint}
          >
            {children}
          </InternalProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}