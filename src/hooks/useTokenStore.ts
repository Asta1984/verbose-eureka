import { create } from "zustand";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

interface TokenInfo {
  mint: string;
  amount: number;
  decimals: number;
  uiAmount: number;
  symbol?: string;
  name?: string;
  logo?: string;
}

interface TokenStore {
  tokens: TokenInfo[];
  tokenMap: Record<string, any>;
  fetchTokenList: () => Promise<void>;
  fetchWalletTokens: (publicKey: PublicKey) => Promise<void>;
}

const RPC_ENDPOINT = "https://solana-mainnet.g.alchemy.com/v2/L_rlJ0gqzjP92QrIXlQz9u2v-dO-ryNN"; // Use your Solana RPC

export const useTokenStore = create<TokenStore>((set, get) => ({
  tokens: [],
  tokenMap: {},

  // Fetch token metadata list (Solana Token List)
  fetchTokenList: async () => {
    try {
      const response = await fetch(
        "https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json"
      );
      const data = await response.json();
      const tokenMapData: Record<string, any> = {};

      data.tokens.forEach((token: any) => {
        tokenMapData[token.address] = {
          symbol: token.symbol,
          name: token.name,
          logoURI: token.logoURI,
        };
      });

      set({ tokenMap: tokenMapData });
    } catch (err) {
      console.error("Error fetching token list:", err);
    }
  },

  // Fetch wallet token balances
  fetchWalletTokens: async (publicKey: PublicKey) => {
    const { tokenMap } = get();
    if (!publicKey) return;

    try {
      const connection = new Connection(RPC_ENDPOINT, "confirmed");
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

      const tokenList: TokenInfo[] = tokenAccounts.value
        .map((account) => {
          const parsedInfo = account.account.data.parsed.info;
          const mintAddress = parsedInfo.mint;
          const tokenAmount = parsedInfo.tokenAmount;

          if (tokenAmount.uiAmount === 0) return null;

          const metadata = tokenMap[mintAddress] || {
            symbol: "Unknown",
            name: `Token: ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
            logoURI: "",
          };

          return {
            mint: mintAddress,
            amount: Number(tokenAmount.amount),
            decimals: tokenAmount.decimals,
            uiAmount: tokenAmount.uiAmount,
            symbol: metadata.symbol,
            name: metadata.name,
            logo: metadata.logoURI,
          };
        })
        .filter(Boolean) as TokenInfo[];

      set({ tokens: tokenList });
    } catch (err) {
      console.error("Error fetching wallet data:", err);
    }
  },
}));
