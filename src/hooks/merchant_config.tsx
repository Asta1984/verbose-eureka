import { useMerchantConfig } from "../providers/PaymentProvider"; // Import your provider
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";


const PaymentButton = () => {
  const { processPayment } = useMerchantConfig();

  const handlePayment = async () => {
    try {
      const txid = await processPayment(0.1); // Send 0.1 SOL
      alert(`Payment successful! Transaction ID: ${txid}`);
    } catch (error) {
      console.error(error);
      alert("Payment failed.");
    }
  };

  return <Button className="w-full gap-2" onClick={handlePayment}>Pay 
  <CreditCard className="w-4 h-4"  />
  </Button>;
};

export default PaymentButton;
