import { PublicKey } from "@solana/web3.js";

const JUPITER_API_URL = "https://quote-api.jup.ag/v6"; // Jupiter API endpoint

/**
 * Fetches the exchange rate of a token against USDC.
 * @param tokenMint The mint address of the token.
 * @returns The price of 1 token in USDC.
 */
export async function getTokenPrice(tokenMint: string): Promise<number | null> {
  try {
    const response = await fetch(`${JUPITER_API_URL}/price?ids=${tokenMint}&vsToken=USDC`);
    const data = await response.json();
    
    return data.data[tokenMint]?.price || null;
  } catch (error) {
    console.error("Error fetching token price:", error);
    return null;
  }
}

/**
 * Swaps a token for USDC and sends it to the merchant.
 * @param wallet The connected wallet (PublicKey).
 * @param inputMint The token to swap (mint address).
 * @param amount The amount of tokens to swap (in smallest units).
 * @param merchantWallet The merchant's USDC wallet address.
 * @returns The transaction signature if successful.
 */
export async function swapTokenForUSDC(
  wallet: PublicKey,
  inputMint: string,
  amount: number,
  merchantWallet: string
): Promise<string | null> {
  try {
    // Get a quote for the swap
    const quoteResponse = await fetch(
      `${JUPITER_API_URL}/quote?inputMint=${inputMint}&outputMint=USDC&amount=${amount}&slippage=1`
    );
    const quote = await quoteResponse.json();

    if (!quote) {
      throw new Error("Failed to get swap quote");
    }

    // Submit the swap transaction
    const swapResponse = await fetch(`${JUPITER_API_URL}/swap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userPublicKey: wallet.toBase58(),
        quoteResponse: quote,
        destinationWallet: merchantWallet,
      }),
    });

    const swapData = await swapResponse.json();
    return swapData.transactionSignature || null;
  } catch (error) {
    console.error("Swap failed:", error);
    return null;
  }
}
