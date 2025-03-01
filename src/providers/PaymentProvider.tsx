import { createContext, useContext, ReactNode, useCallback } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";

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
  processPayment: (amount: number) => Promise<string>;
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

// **💰 Payment Provider**
export function PaymentProvider({
  children,
  merchantWallet,
  network = WalletAdapterNetwork.Devnet,
  rpcEndpoint,
}: PaymentProviderProps) {
  const endpoint = rpcEndpoint || clusterApiUrl(network);

  // **Available Wallets**
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

  // **Transaction Handler**
  const processPayment = useCallback(async (amount: number): Promise<string> => {
    const { publicKey, signTransaction, connected } = useWallet(); // Destructure useWallet properly

    if (!connected || !publicKey) {
      throw new Error("Wallet not connected");
    }

    if (!signTransaction) {
      throw new Error("Wallet does not support signing transactions");
    }

    const connection = new Connection(endpoint, "confirmed");
    const merchantPublicKey = new PublicKey(merchantWallet);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: merchantPublicKey,
        lamports: amount * 10 ** 9, // Convert SOL to lamports
      })
    );

    transaction.feePayer = publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    try {
      const signedTransaction = await signTransaction(transaction); // Ensure signTransaction is available
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log("Transaction sent:", txid);
      return txid;
    } catch (error) {
      console.error("Payment failed:", error);
      throw new Error("Payment processing failed.");
    }
}, [merchantWallet, endpoint]);


  const merchantConfig: MerchantConfig = {
    merchantWallet,
    rpcEndpoint: endpoint,
    network,
    processPayment,
  };

  return (
    <MerchantContext.Provider value={merchantConfig}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </MerchantContext.Provider>
  );
}
