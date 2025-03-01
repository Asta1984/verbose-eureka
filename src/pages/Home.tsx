"use client";

import { ThemeProvider } from "../components/ui/theme-provider";
import { InteractiveCheckout } from "@/components/ui/interactive-checkout";
import { PaymentProvider } from "@/providers/PaymentProvider";

// Sample products data
const products = [
  {
    id: "1",
    name: "Air Max 90",
    price: 1,
    category: "Running",
    image: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/shoes-d2GWFGnVlkkUneRD3x2xDbUVHO1qMp",
    color: "Blue",
  },
  {
    id: "2",
    name: "Asics Gel-4B+",
    price: 2,
    category: "Performance",
    image: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/shoes-d2GWFGnVlkkUneRD3x2xDbUVHO1qMp",
    color: "Red",
  },
  {
    id: "3",
    name: "Reebok Classic",
    price: 3,
    category: "Sneaker",
    image: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/shoes-d2GWFGnVlkkUneRD3x2xDbUVHO1qMp",
    color: "Green",
  },
  // Add more products as needed
];

export default function Hero() {
  // Replace with your actual merchant wallet address
  const MERCHANT_WALLET = "EWf8BvieKPWmW2CLpKGNxpUinDDDvZWcTgCfESZ4Kc1C";
  
  return (
    <ThemeProvider>
      <PaymentProvider merchantWallet={MERCHANT_WALLET}>
          <div className="max-w-4xl mx-auto mt-28">
            <header className="mb-8 text-center">
              <h1 className="text-3xl font-OnlinePrivileges tracking-tight">D-Pay Store</h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Pay with any token - Merchant receives USDC
              </p>
            </header>
            
            <InteractiveCheckout products={products}/>
          </div>
      </PaymentProvider>
    </ThemeProvider>


  );
}