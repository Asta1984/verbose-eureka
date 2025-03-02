import React, { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useId } from "react";
import { useTokenStore } from "@/hooks/useTokenStore";

const Square = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <span className={`flex size-5 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground ${className}`} aria-hidden="true">
    {children}
  </span>
);

function TokenDropdown({ onTokenSelect }: { onTokenSelect?: (tokenMint: string) => void }) {
  const { publicKey, connected } = useWallet();
  const id = useId();
  const { tokens, fetchTokenList, fetchWalletTokens } = useTokenStore();

  // Fetch token metadata on mount
  useEffect(() => {
    fetchTokenList();
  }, []);

  // Fetch wallet tokens when connected
  useEffect(() => {
    if (connected && publicKey) {
      fetchWalletTokens(publicKey);
    }
  }, [publicKey, connected]);

  return (
    <div className="space-y-2 min-w-[300px]">
      <Label htmlFor={id}>Pay with your desired token</Label>
      <Select onValueChange={onTokenSelect}>
        <SelectTrigger id={id} className="ps-2 flex items-center gap-2">
          <SelectValue placeholder={tokens.length === 0 ? "Loading tokens..." : "Select a token"} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel className="ps-2">Select Token</SelectLabel>
            {tokens.length > 0 ? (
              tokens.map((token) => (
                <SelectItem key={token.mint} value={token.mint}>
                 <Square className="bg-indigo-400/20 text-indigo-500">
                 {token.logo ? <img src={token.logo} alt={token.symbol} className="w-4 h-4 rounded-full" /> : "?"}
                 </Square>
                  <span className="truncate">
                    {token.symbol || "Unknown"}
                  </span>
                </SelectItem>
              ))
            ) : (
              <p className="p-2 text-center text-muted-foreground">No tokens available</p>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export { TokenDropdown };
