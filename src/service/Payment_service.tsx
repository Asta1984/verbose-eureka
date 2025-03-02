import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { TokenDropdown } from "../components/QueryDropdown";
import { useTokenStore } from "../hooks/useTokenStore";
import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { createJupiterApiClient, QuoteResponse, SwapMode } from "@jup-ag/api";
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from "@solana/spl-token";

// USDC mint address (mainnet)
const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

// Initialize Jupiter API client
const jupiterApi = createJupiterApiClient();

interface PaymentPageProps {
  totalPrice: number; // Price in USDC
  merchantWallet?: string; // Optional merchant wallet override
}

export default function PaymentPage({
  totalPrice,
  merchantWallet = "EWf8BvieKPWmW2CLpKGNxpUinDDDvZWcTgCfESZ4Kc1C",
}: PaymentPageProps) {
  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { tokens, fetchWalletTokens } = useTokenStore();

  const [selectedTokenMint, setSelectedTokenMint] = useState<string | null>(null);
  const [equivalentAmount, setEquivalentAmount] = useState<number | null>(null);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Find selected token details from token store
  const selectedToken = tokens.find((token) => token.mint === selectedTokenMint);

  // Fetch wallet tokens when connected
  useEffect(() => {
    if (publicKey && connected) {
      fetchWalletTokens(publicKey);
    }
  }, [publicKey, connected, fetchWalletTokens]);

  // Get quote for token swap to exact USDC amount
  const getQuote = useCallback(
    async (tokenMint: string, _decimals: number): Promise<QuoteResponse | null> => {
      if (!tokenMint || tokenMint === USDC_MINT.toString()) return null;

      try {
        // Amount in USDC we want to receive (with 6 decimals)
        const usdcAmount = Math.floor(totalPrice * 10 ** 6);

        // Get quote from Jupiter API
        const quoteResponse = await jupiterApi.quoteGet({
          inputMint: tokenMint,
          outputMint: USDC_MINT.toString(),
          amount: usdcAmount,
          slippageBps: 50, // 0.5% slippage
          swapMode: SwapMode.ExactOut, // We want exactly this amount of USDC
        });

        return quoteResponse;
      } catch (error) {
        console.error(`Error getting quote for ${tokenMint}:`, error);
        setErrorMessage(`Error getting quote: ${error instanceof Error ? error.message : String(error)}`);
        return null;
      }
    },
    [totalPrice]
  );

  // Calculate token amounts when selection changes
  useEffect(() => {
    const updateQuote = async () => {
      if (!selectedTokenMint || !connected) return;

      const tokenInfo = tokens.find((t) => t.mint === selectedTokenMint);
      if (!tokenInfo) return;

      try {
        if (selectedTokenMint === USDC_MINT.toString()) {
          // If USDC is selected, amount is 1:1
          setEquivalentAmount(totalPrice);
          setQuote(null);
        } else {
          const tokenQuote = await getQuote(selectedTokenMint, tokenInfo.decimals);
          if (tokenQuote) {
            setQuote(tokenQuote);

            // Calculate equivalent amount in selected token
            const tokenAmount = Number(tokenQuote.inAmount) / 10 ** tokenInfo.decimals;
            setEquivalentAmount(tokenAmount);
          }
        }
      } catch (error) {
        console.error("Error updating quote:", error);
        setErrorMessage(`Error updating quote: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    updateQuote();
  }, [selectedTokenMint, connected, tokens, getQuote, totalPrice]);

  const handleTokenSelect = (tokenMint: string) => {
    setSelectedTokenMint(tokenMint);
    setErrorMessage(null);
  };

  // Ensure associated token account exists
  const ensureAssociatedTokenAccount = useCallback(
    async (mint: PublicKey, owner: PublicKey, payer: PublicKey) => {
      try {
        const associatedTokenAddress = await getAssociatedTokenAddress(mint, owner);
        const accountInfo = await connection.getAccountInfo(associatedTokenAddress);

        if (!accountInfo) {
          const transaction = new Transaction().add(
            createAssociatedTokenAccountInstruction(payer, associatedTokenAddress, owner, mint)
          );
          transaction.feePayer = payer;
          transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

          // Check if signTransaction is available
          if (!signTransaction) {
            throw new Error("Wallet does not support signing transactions");
          }

          const signedTransaction = await signTransaction(transaction);
          const txid = await connection.sendRawTransaction(signedTransaction.serialize());
          await connection.confirmTransaction(txid, "confirmed");
          console.log("Associated token account created:", associatedTokenAddress.toString());
        }
        return associatedTokenAddress;
      } catch (error) {
        console.error("Error ensuring associated token account:", error);
        setErrorMessage(`Error ensuring ATA: ${error instanceof Error ? error.message : String(error)}`);
        return null;
      }
    },
    [connection, signTransaction]
  );

  // Process payment
  const handlePayment = async () => {
    if (!publicKey || !signTransaction || !selectedTokenMint || equivalentAmount === null) {
      console.error("Missing required data for payment");
      setErrorMessage("Missing required data for payment.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const merchantPublicKey = new PublicKey(merchantWallet);

      if (selectedTokenMint === USDC_MINT.toString()) {
        // Direct USDC transfer
        const userTokenAccount = await ensureAssociatedTokenAccount(USDC_MINT, publicKey, publicKey);
        const merchantTokenAccount = await ensureAssociatedTokenAccount(USDC_MINT, merchantPublicKey, publicKey);

        if (!userTokenAccount || !merchantTokenAccount) return;

        const transaction = new Transaction().add(
          createTransferInstruction(
            userTokenAccount,
            merchantTokenAccount,
            publicKey,
            Math.floor(totalPrice * 10 ** 6), // USDC has 6 decimals
            []
          )
        );

        transaction.feePayer = publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signedTransaction = await signTransaction(transaction);
        const txid = await connection.sendRawTransaction(signedTransaction.serialize());
        await connection.confirmTransaction(txid, "confirmed");
        console.log("Direct USDC transaction sent:", txid);
        alert(`Transaction Successful: ${txid}`);
      } else if (quote) {
        // Token swap using Jupiter
        const merchantUsdcAccount = await ensureAssociatedTokenAccount(USDC_MINT, merchantPublicKey, publicKey);
        if (!merchantUsdcAccount) return;

        const swapResponse = await jupiterApi.swapPost({
          swapRequest: {
            quoteResponse: quote,
            userPublicKey: publicKey.toString(),
            destinationTokenAccount: merchantUsdcAccount.toString(),
          },
        });

        // Decode the transaction
        const swapTx = VersionedTransaction.deserialize(Buffer.from(swapResponse.swapTransaction, "base64"));
        // Sign and send transaction
        const signedTransaction = await signTransaction(swapTx);
        const txid = await connection.sendRawTransaction(signedTransaction.serialize());
        await connection.confirmTransaction(txid, "confirmed");
        console.log("Swap transaction sent:", txid);
        alert(`Transaction Successful: ${txid}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage(`Payment processing failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    setLoading(false);
  };

  // Check if user has sufficient balance for payment
  const hasSufficientBalance = useCallback(() => {
    if (!selectedToken || equivalentAmount === null) return false;

    return selectedToken.uiAmount >= equivalentAmount;
  }, [selectedToken, equivalentAmount]);

  return (
    <div className="p-4 bg-transparent rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Select a Token to Pay</h1>

      <TokenDropdown onTokenSelect={handleTokenSelect} />

      {selectedToken && (
        <div className="flex items-center gap-2 mt-4">
          {selectedToken.logo ? (
            <img src={selectedToken.logo} alt={selectedToken.symbol || "Token"} className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 bg-transparent rounded-full" />
          )}
          <p className="text-lg font-semibold">
            {selectedToken.symbol || "Unknown"} ({selectedToken.name || "Unknown Token"})
          </p>
          <p className="text-sm text-primary ml-auto">
            Balance: {selectedToken.uiAmount.toFixed(4)}
          </p>
        </div>
      )}

      {equivalentAmount !== null && selectedToken && (
        <div className="mt-2 p-3 bg-transparent border rounded-md">
          <p className="font-medium">Payment Summary:</p>
          <p>Amount: {equivalentAmount.toFixed(4)} {selectedToken.symbol || "tokens"}</p>
          <p>Value: {totalPrice.toFixed(2)} USDC</p>
          {selectedTokenMint !== USDC_MINT.toString() && (
            <p className="text-sm text-primary">
              (1 {selectedToken.symbol || "token"} ≈ {(totalPrice / equivalentAmount).toFixed(4)} USDC)
            </p>
          )}

          {!hasSufficientBalance() && (
            <p className="text-red-500 text-sm mt-1">
              Insufficient balance. You need {equivalentAmount.toFixed(4)} {selectedToken.symbol || "tokens"}
            </p>
          )}
        </div>
      )}

      <Button
        className="w-full gap-2 mt-4"
        onClick={handlePayment}
        disabled={!connected || loading || !selectedToken || equivalentAmount === null || !hasSufficientBalance()}
      >
        {loading
          ? "Processing..."
          : `Pay ${equivalentAmount?.toFixed(4) || ''} ${selectedToken?.symbol || ''}`}
        <CreditCard className="w-4 h-4" />
      </Button>

      {!connected && (
        <p className="text-center text-sm text-gray-500 mt-2">
          Connect your wallet to make a payment
        </p>
      )}

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
    </div>
  );
}