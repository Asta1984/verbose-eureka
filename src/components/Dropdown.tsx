import { cn } from "@/components/lib/utils";
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
import { useId, useState, useMemo } from "react";

interface Token {
  mint: string;
  symbol: string;
  name: string;
  logo?: string;
  uiAmount?: number;
}

const Square = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <span
    data-square
    className={cn(
      "flex size-5 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground",
      className
    )}
    aria-hidden="true"
  >
    {children}
  </span>
);

interface DropdownProps {
  tokens: Token[];
  onSelect?: (value: string) => void;
}

export function Dropdown({ tokens, onSelect }: DropdownProps) {
  const id = useId();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Virtual rendering for large token lists
  const visibleTokens = useMemo(() => {
    if (!searchTerm) {
      // Only show first 50 tokens if no search term
      return tokens.slice(0, 50);
    }
    
    const searchLower = searchTerm.toLowerCase();
    return tokens.filter(token => 
      token.symbol.toLowerCase().includes(searchLower) || 
      token.name.toLowerCase().includes(searchLower)
    ).slice(0, 50); // Limit to 50 results for performance
  }, [tokens, searchTerm]);

  return (
    <div className="space-y-2 min-w-[300px]">
      <Label htmlFor={id}>Select a Token</Label>
      <Select onValueChange={onSelect}>
        <SelectTrigger
          id={id}
          className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_[data-square]]:shrink-0"
        >
          <SelectValue placeholder="Select a token" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
          <div className="px-2 pb-2">
            <input
              type="text"
              placeholder="Search tokens..."
              className="w-full p-2 border rounded"
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()} // Prevent closing the dropdown when clicking the search box
            />
          </div>
          <SelectGroup>
            <SelectLabel className="ps-2">Tokens</SelectLabel>
            {visibleTokens.length > 0 ? (
              visibleTokens.map((token) => (
                <SelectItem key={token.mint} value={token.mint}>
                  {token.logo ? (
                    <img 
                      src={token.logo} 
                      alt={token.symbol} 
                      className="w-5 h-5 rounded-full"
                      onError={(e) => {
                        // Replace broken image with fallback
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement?.prepend(
                          document.createTextNode(token.symbol.charAt(0))
                        );
                      }} 
                    />
                  ) : (
                    <Square className="bg-gray-400/20 text-gray-500">{token.symbol.charAt(0)}</Square>
                  )}
                  <span className="truncate">
                    {token.symbol} - {token.name}
                    {token.uiAmount !== undefined && ` (${token.uiAmount.toFixed(4)})`}
                  </span>
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-center text-gray-500">No tokens found</div>
            )}
            {tokens.length > 50 && visibleTokens.length >= 50 && !searchTerm && (
              <div className="p-2 text-center text-gray-500 text-sm">
                Showing first 50 tokens. Use search to find more.
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}