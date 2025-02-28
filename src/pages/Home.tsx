"use client";

import { ThemeProvider } from "../components/ui/theme-provider";
import { InteractiveCheckout } from "@/components/ui/interactive-checkout";
import { PaymentProvider } from "@/providers/PaymentProvider";

// Sample products data
const products = [
  {
    id: "1",
    name: "Product One",
    price: 1,
    category: "Category A",
    image: "/api/placeholder/80/80",
    color: "Blue",
  },
  {
    id: "2",
    name: "Product Two",
    price: 2,
    category: "Category B",
    image: "/api/placeholder/80/80",
    color: "Red",
  },
  {
    id: "3",
    name: "Product Three",
    price: 3,
    category: "Category C",
    image: "/api/placeholder/80/80",
    color: "Green",
  },
  // Add more products as needed
];

export default function Hero() {
  // Replace with your actual merchant wallet address
  const MERCHANT_WALLET = "Your_Merchant_Wallet_Address";
  
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
            
            <InteractiveCheckout products={products} merchantWallet={MERCHANT_WALLET} />
          </div>
      </PaymentProvider>
    </ThemeProvider>

  );
}