import { InteractiveCheckout } from "@/components/ui/interactive-checkout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { WalletConnectionProvider } from "@/providers/WalletConnectionProvider";

// Sample products data with prices in SOL
const products = [
  {
    id: "1",
    name: "Air Max 90",
    price: 0.0001, 
    category: "Running",
    image: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/shoes-d2GWFGnVlkkUneRD3x2xDbUVHO1qMp",
    color: "Blue",
  },
  {
    id: "2",
    name: "Asics Gel-4B+",
    price: 1,
    category: "Performance",
    image: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/shoes-d2GWFGnVlkkUneRD3x2xDbUVHO1qMp",
    color: "Red",
  },
  {
    id: "3",
    name: "Reebok Classic",
    price: 0.0003, 
    category: "Sneaker",
    image: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/shoes-d2GWFGnVlkkUneRD3x2xDbUVHO1qMp",
    color: "Green",
  },
];

export default function Hero() {
  // Merchant wallet address - will receive USDC
  

  return (
        <WalletConnectionProvider>
          <div className="max-w-4xl mx-auto mt-28">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-OnlinePrivileges tracking-tight">D-Pay Store</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Pay with any token - Merchant receives USDC
            </p>
          </header>
          
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Payments are processed through Jupiter Swap API. Merchants always receive USDC regardless of the token used for payment.
            </AlertDescription>
          </Alert>
          
          <InteractiveCheckout products={products} />
        </div>
        </WalletConnectionProvider>
      
  );
}