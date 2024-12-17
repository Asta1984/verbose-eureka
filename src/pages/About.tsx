import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TokenPresaleModal } from '@/components/TokenPresaleModal'


export const About = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)


  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="h-screen overflow-hidden ">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      />
      <div className="container mx-auto h-full flex items-center relative">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold text-white mb-6"
          >
            Revolutionizing DePIN Networks
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Join the future of decentralized physical infrastructure networks with our groundbreaking protocol
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <button onClick={openModal} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold hover:from-purple-700 hover:to-pink-700 transition-colors">
              Join Presale
            </button>
            <button className="px-8 py-3 border border-purple-500 rounded-full text-white font-bold hover:bg-purple-500/20 transition-colors">
              Claim Airdrop
            </button>
          </motion.div>
        </div>
      </div>
      <TokenPresaleModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};