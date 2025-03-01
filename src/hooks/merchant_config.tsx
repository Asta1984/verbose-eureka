import { useState, useEffect } from "react";
import { useMerchantConfig } from "../providers/PaymentProvider";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, Loader2 } from "lucide-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

interface TokenAccount {
  mint: string;
  tokenName?: string;
  symbol?: string;
  amount: number;
  decimals: number;
}

interface PaymentButtonProps {
  cartTotal?: number;
}

// Token metadata with proper indexing type
const TOKEN_METADATA: Record<string, { name: string; symbol: string; decimals: number }> = {
  "EPjFWdd5AufqSSqeM2qZ7x9mSLRF2tdTkVo4YafQwXb": { name: "USD Coin", symbol: "USDC", decimals: 6 },
  "So11111111111111111111111111111111111111112": { name: "Wrapped SOL", symbol: "wSOL", decimals: 9 },
  // Add more commonly used tokens as needed
};

const PaymentButton = ({ cartTotal = 0 }: PaymentButtonProps) => {
  const { processPayment, connectWallet, connected } = useMerchantConfig();
  const wallet = useWallet();
  const { connection } = useConnection();
  
  const [processing, setProcessing] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [selectedToken, setSelectedToken] = useState("native");
  const [walletTokens, setWalletTokens] = useState<TokenAccount[]>([]);

  // Fetch tokens owned by the connected wallet
  useEffect(() => {
    async function fetchWalletTokens() {
      if (!connected || !wallet.publicKey) return;
      
      setLoadingTokens(true);
      try {
        // Always include native SOL
        const solBalance = await connection.getBalance(wallet.publicKey);
        const tokens: TokenAccount[] = [{
          mint: "native",
          tokenName: "Solana",
          symbol: "SOL",
          amount: solBalance / 1e9, // Convert lamports to SOL
          decimals: 9
        }];

        // Get all SPL tokens in the wallet
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          wallet.publicKey,
          { programId: TOKEN_PROGRAM_ID }
        );

        // Process each token account
        tokenAccounts.value.forEach((tokenAccount) => {
          const accountData = tokenAccount.account.data.parsed.info;
          const mintAddress = accountData.mint;
          const amount = accountData.tokenAmount.uiAmount;
          
          // Only include tokens with a non-zero balance
          if (amount > 0) {
            // Get known metadata or use default values
            const metadata = mintAddress in TOKEN_METADATA 
              ? TOKEN_METADATA[mintAddress] 
              : { 
                  name: `Token (${mintAddress.slice(0, 4)}...)`, 
                  symbol: "???", 
                  decimals: accountData.tokenAmount.decimals 
                };
            
            tokens.push({
              mint: mintAddress,
              tokenName: metadata.name,
              symbol: metadata.symbol,
              amount: amount,
              decimals: metadata.decimals
            });
          }
        });

        setWalletTokens(tokens);
        
        // If we have tokens and none selected yet, select the first one
        if (tokens.length > 0 && selectedToken === "native") {
          setSelectedToken(tokens[0].mint);
        }
      } catch (error) {
        console.error("Error fetching wallet tokens:", error);
      } finally {
        setLoadingTokens(false);
      }
    }

    fetchWalletTokens();
  }, [connection, wallet.publicKey, connected]);

  const handlePayment = async () => {
    if (!connected) {
      connectWallet();
      return;
    }

    setProcessing(true);
    try {
      // Use the cart total passed as prop instead of hardcoded value
      const amount = cartTotal;
      const tokenMint = selectedToken !== "native" ? selectedToken : undefined;
      
      const txid = await processPayment(amount, tokenMint);
      alert(`Payment successful! Transaction ID: ${txid}`);
    } catch (error) {
      console.error(error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Format token display with balance
  const formatTokenOption = (token: TokenAccount) => {
    return `${token.symbol} - ${token.amount.toFixed(4)} ${token.symbol}`;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Payment Token</label>
        {!connected ? (
          <div className="text-sm text-zinc-500 dark:text-zinc-400 p-2 border rounded border-zinc-200 dark:border-zinc-700">
            Connect wallet to see available tokens
          </div>
        ) : loadingTokens ? (
          <div className="flex items-center justify-center p-2 border rounded border-zinc-200 dark:border-zinc-700">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span className="text-sm">Loading tokens...</span>
          </div>
        ) : walletTokens.length === 0 ? (
          <div className="text-sm text-zinc-500 dark:text-zinc-400 p-2 border rounded border-zinc-200 dark:border-zinc-700">
            No tokens found in wallet
          </div>
        ) : (
          <select 
            className="w-full p-2 border rounded bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
          >
            {walletTokens.map(token => (
              <option key={token.mint} value={token.mint}>
                {formatTokenOption(token)}
              </option>
            ))}
          </select>
        )}
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Merchant will receive USDC regardless of payment token
        </p>
      </div>
      
      <Button 
        className="w-full gap-2" 
        onClick={handlePayment}
        disabled={processing || (connected && loadingTokens)}
      >
        {!connected ? (
          <>
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </>
        ) : processing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : loadingTokens ? (
          "Loading Tokens..."
        ) : (
          <>
            Pay {cartTotal.toFixed(2)} {walletTokens.find(t => t.mint === selectedToken)?.symbol || "Token"}
            <CreditCard className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default PaymentButton;