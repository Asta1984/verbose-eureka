import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from "@/components/lib/utils";
import { COMMON_TOKENS, TokenInfo } from '../hooks/payment';

interface TokenDropdownProps {
  selectedToken: TokenInfo;
  onSelectToken: (token: TokenInfo) => void;
}

export function TokenDropdown({ selectedToken, onSelectToken }: TokenDropdownProps) {
  const [open, setOpen] = React.useState(false);
  
  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between w-full",
          "px-3 py-2 text-sm rounded-md",
          "bg-white dark:bg-zinc-800",
          "border border-zinc-200 dark:border-zinc-700",
          "hover:bg-zinc-50 dark:hover:bg-zinc-700/70",
          "transition-colors duration-200"
        )}
      >
        <div className="flex items-center gap-2">
          <img 
            src={selectedToken.logo || '/api/placeholder/24/24'} 
            alt={selectedToken.symbol}
            className="w-6 h-6 rounded-full"
          />
          <span>{selectedToken.name} ({selectedToken.symbol})</span>
        </div>
        <ChevronDown className="w-4 h-4 text-zinc-500" />
      </button>
      
      {open && (
        <div
          className={cn(
            "absolute z-10 w-full mt-1",
            "bg-white dark:bg-zinc-800",
            "border border-zinc-200 dark:border-zinc-700",
            "rounded-md shadow-lg",
            "max-h-60 overflow-auto"
          )}
        >
          {COMMON_TOKENS.map((token) => (
            <button
              key={token.mint}
              onClick={() => {
                onSelectToken(token);
                setOpen(false);
              }}
              className={cn(
                "flex items-center justify-between w-full",
                "px-3 py-2 text-sm",
                "hover:bg-zinc-50 dark:hover:bg-zinc-700/70",
                "transition-colors duration-200"
              )}
            >
              <div className="flex items-center gap-2">
                <img 
                  src={token.logo || '/api/placeholder/24/24'} 
                  alt={token.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span>{token.name} ({token.symbol})</span>
              </div>
              {selectedToken.mint === token.mint && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}