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
const USDC_MINT = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");

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
    // If using native SOL or if tokenMint is provided and it's not USDC, use Jupiter for swapping
    if (tokenMint === "native" || (tokenMint && tokenMint !== USDC_MINT.toString())) {
      // For native SOL, use the wrapped SOL mint address
      const inputMint = tokenMint === "native" 
        ? new PublicKey("So11111111111111111111111111111111111111112") // Wrapped SOL
        : new PublicKey(tokenMint);
      
      // Convert amount based on decimals (assuming 9 for SOL and variable for tokens)
      const inputAmountLamports = tokenMint === "native" 
        ? amount * 10 ** 9 // SOL has 9 decimals
        : Math.floor(amount * 10 ** 9); // Use 9 as default, can be adjusted if needed
      
      // Get best swap route
      const route = await jupiterApi.quoteGet({
        inputMint: inputMint.toString(),
        outputMint: USDC_MINT.toString(),
        amount: inputAmountLamports,
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
      
      // Decode the transaction
      const swapTx = Transaction.from(Buffer.from(swapResponse.swapTransaction, "base64"));
      
      // After swap is complete, we need to transfer the USDC to the merchant
      // Import necessary SPL Token functions
      const { getAssociatedTokenAddress, createTransferInstruction } = await import("@solana/spl-token");
      
      // Get the user's USDC associated token account
      const userUsdcAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        publicKey
      );
      
      // Get the merchant's USDC associated token account
      const merchantUsdcAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        merchantPublicKey
      );
      
      // Add a transfer instruction to send the swapped USDC to the merchant
      // We're transferring the expected output amount from the quote
      const outputAmount = route.outAmount;
      
      swapTx.add(
        createTransferInstruction(
          userUsdcAccount,
          merchantUsdcAccount,
          publicKey,
          parseInt(outputAmount), // Use the exact output amount from the quote
          []
        )
      );
      
      swapTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      swapTx.feePayer = publicKey;
      
      const signedTransaction = await signTransaction(swapTx);
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log("Swap and transfer transaction sent:", txid);
      return txid;
    } else {
      // Direct USDC transfer (if they're paying with USDC)
      // Import necessary SPL Token functions
      const { getAssociatedTokenAddress, createTransferInstruction } = await import("@solana/spl-token");
      
      // Get the user's USDC associated token account
      const userTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        publicKey
      );
      
      // Get the merchant's USDC associated token account
      const merchantTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        merchantPublicKey
      );
      
      // Create a transfer instruction
      const transaction = new Transaction().add(
        createTransferInstruction(
          userTokenAccount, 
          merchantTokenAccount,
          publicKey,
          amount * 10 ** 6, // USDC has 6 decimals
          []
        )
      );

      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signedTransaction = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log("Direct USDC transaction sent:", txid);
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