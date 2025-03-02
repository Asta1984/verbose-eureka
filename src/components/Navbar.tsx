import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { 
      to: "/dashboard", 
      label: "Dashboard",
      isActive: location.pathname === "/dashboard"
    }
  ];
  
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

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
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
        isSticky || mobileMenuOpen
          ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl sm:text-2xl font-bold flex items-center gap-2 group"
          aria-label="Home"
        >
          <img 
            src="https://pub-d02e3aa7d09f4d5d9261e5d7e4bae228.r2.dev/logo.svg" 
            alt="Logo" 
            className='h-6 w-6 sm:h-8 sm:w-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300'
          />
          <span className="font-OnlinePrivileges text-foreground group-hover:text-cyan-500 transition-colors duration-300">
            DPay
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-semibold transition-all duration-300 ${
                item.isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-cyan-500 hover:scale-105'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Wallet Connection */}
        <div className="hidden md:block">
          <WalletMultiButton 
            className="!bg-primary hover:!bg-primary/90 text-white rounded-md"
          >
            {publicKey 
              ? `${publicKey.toBase58().slice(0, 5)}` 
              : 'Connect Wallet'}
          </WalletMultiButton>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden gap-2">
          <WalletMultiButton 
            className="!bg-primary hover:!bg-primary/90 text-white !rounded-md !py-1 !px-2 !text-xs scale-90"
          >
            {publicKey 
              ? `${publicKey.toBase58().slice(0, 4)}` 
              : 'Connect'}
          </WalletMultiButton>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground p-1 rounded-md hover:bg-background"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial="closed"
          animate={mobileMenuOpen ? "open" : "closed"}
          variants={mobileMenuVariants}
          className="md:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
        >
          <div className="px-4 pt-2 pb-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block py-2 text-base font-medium ${
                  item.isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-cyan-500'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}