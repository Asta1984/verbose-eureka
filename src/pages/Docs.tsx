import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Font styling utility
const fontStyles = {
  heading: "font-Type_writer text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight",
  subheading: "font-Type_writer text-lg sm:text-xl md:text-2xl font-medium",
  sectionTitle: "font-Type_writer text-xl sm:text-2xl md:text-3xl font-semibold",
  link: "font-Type_writer text-base sm:text-lg font-medium"
};

const Docs: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const documentSections = [
    {
      title: "Getting Started",
      links: [
        "Quick Start Guide",
        "Token Standards and Specifications",
        "Wallet Integration"
      ]
    },
    {
      title: "Smart Contract",
      links: [
        "Contract Address",
        "ABI (Application Binary Interface)",
        "Solidity Source Code"
      ]
    },
    {
      title: "API Reference",
      links: [
        "RESTful API Endpoints",
        "WebSocket API",
        "SDK Documentation"
      ]
    },
    {
      title: "Tutorials",
      links: [
        "How to Stake Tokens",
        "Participating in Governance",
        "Building DApps with Our Token"
      ]
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden relative bg-gray-900 text-white">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          transform: `translateY(${scrollY * 0.3}px)`
        }}
      />

      <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8 py-12 mt-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${fontStyles.heading} text-center mb-12 text-white`}
        >
          Documentation
        </motion.h1>

        <div className="space-y-8">
          {documentSections.map((section, index) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <h2 className={`${fontStyles.sectionTitle} mb-4 text-purple-300`}>
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <motion.li 
                    key={link}
                    whileHover={{ scale: 1.03, translateX: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a 
                      href="#" 
                      className={`
                        ${fontStyles.link} 
                        text-blue-300 hover:text-blue-200 
                        transition-colors duration-200 
                        inline-block
                      `}
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Docs;