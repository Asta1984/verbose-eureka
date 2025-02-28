import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion} from "framer-motion";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';



export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const { publicKey } = useWallet();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  

  // Framer Motion animation variants
  const navVariants = {
    initial: { opacity: 0, y: -50 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -50,
      transition: { 
        duration: 0.2 
      }
    }
  };

  

  return (
    <motion.nav
      variants={navVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`fixed w-full z-50 transition-all duration-300 ${
        isSticky
          ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-bold flex items-center gap-2 group"
          aria-label="Home"
        >
          <img 
            src="https://pub-d02e3aa7d09f4d5d9261e5d7e4bae228.r2.dev/logo.svg" 
            alt="Logo" 
            className='h-8 w-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300'
          />
          <span className="font-OnlinePrivileges text-foreground group-hover:text-cyan-500 transition-colors duration-300">
            DPay</span>
        </Link>

        {/* Desktop Wallet Connection */}
        <div className="hidden md:block ">
          <WalletMultiButton 
            className="!bg-primary hover:!bg-primary/90 text-white rounded-md"
          >
            {publicKey 
              ? `${publicKey.toBase58().slice(0, 5)}` 
              : 'Connect Wallet'}
          </WalletMultiButton>
          
        </div>
      </div>
    </motion.nav>
  );
}