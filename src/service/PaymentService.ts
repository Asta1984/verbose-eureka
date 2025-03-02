import {
    Connection,
    PublicKey,
    Transaction,
  } from "@solana/web3.js";
  
  import {
    createJupiterApiClient,
    QuoteResponse,
    SwapMode,
    SwapPostRequest,
  } from "@jup-ag/api";
  
  import {
    getAssociatedTokenAddress,
    createTransferInstruction,
    TOKEN_PROGRAM_ID,
  } from "@solana/spl-token";
  
  import dotenv from "dotenv";
  dotenv.config();
  
  const NETWORK = "https://solana-mainnet.g.alchemy.com/v2/L_rlJ0gqzjP92QrIXlQz9u2v-dO-ryNN";
  const connection = new Connection(NETWORK, "confirmed");
  
  // Merchant Wallet (Receiving USDC)
  const MERCHANT_WALLET = new PublicKey("EWf8BvieKPWmW2CLpKGNxpUinDDDvZWcTgCfESZ4Kc1C");
  const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qZ7x9mSLRF2tdTkVo4YafQwXb");
  
  const jupiterApi = createJupiterApiClient();
  
  /**
   * Get best swap route (Token → USDC)
   */
  async function getBestSwapRoute(inputMint: PublicKey, amount: number) {
    const response: QuoteResponse = await jupiterApi.quoteGet({
      inputMint: inputMint.toBase58(),
      outputMint: USDC_MINT.toBase58(),
      amount,
      slippageBps: 50, // 0.5% slippage
      swapMode: SwapMode.ExactIn,
    });
  
    return response;
  }
  
  /**
   * Process Payment (User → Swap → Merchant)
   */
  export async function processPayment(userPublicKey: PublicKey, tokenMint: PublicKey, amount: number) {
    console.log("🔄 Processing non-custodial payment...");
  
    // Step 1: Find the User's Associated Token Account
    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      userPublicKey
    );
  
    // Step 2: Create Transfer Instruction (User → Jupiter Swap)
    const transferInstruction = createTransferInstruction(
      userTokenAccount,
      MERCHANT_WALLET, // Jupiter Swap handles conversion
      userPublicKey,
      amount,
      [],
      TOKEN_PROGRAM_ID
    );
  
    // Step 3: Get Jupiter Swap Route
    const route = await getBestSwapRoute(tokenMint, amount);
  
    // Step 4: Create Swap Transaction
    const swapRequest: SwapPostRequest = { swapRequest: { 
      userPublicKey: userPublicKey.toBase58(),
      quoteResponse: route,
    }};
  
    const swapResponse = await jupiterApi.swapPost(swapRequest);
  
    // Decode transaction & add transfer instruction
    const tx = Transaction.from(Buffer.from(swapResponse.swapTransaction, "base64"));
    tx.add(transferInstruction);
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = userPublicKey; // User pays transaction fees
  
    console.log("🔹 Swap transaction created. User needs to sign.");
  
    return {
      transaction: tx, // Send this to frontend for signing
    };
  }
  