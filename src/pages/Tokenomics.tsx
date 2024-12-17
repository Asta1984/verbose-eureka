import React from 'react';
import { motion } from 'framer-motion';

const fontStyles = {
  heading: "font-Type_writer text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight",
  sectionTitle: "font-Type_writer text-xl sm:text-2xl md:text-3xl font-semibold",
  body: "font-Type_writer text-sm sm:text-base leading-relaxed"
};

const Tokenomics: React.FC = () => {
  const containerAnimation = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-black py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={`${fontStyles.heading} text-white text-center mb-12 mt-10`}>
          Tokenomics
        </h1>

        <div className="space-y-8">
          {/* Token Distribution */}
          <motion.div 
            {...containerAnimation}
            className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 sm:p-8"
          >
            <h2 className={`${fontStyles.sectionTitle} text-white mb-6`}>Token Distribution</h2>
            <ul className={`${fontStyles.body} text-gray-300 space-y-3`}>
              {[
                "Public Sale: 40%",
                "Team and Advisors: 20% (vested over 2 years)",
                "Ecosystem Development: 15%",
                "Marketing and Partnerships: 10%",
                "Reserve: 10%",
                "Airdrops and Community Rewards: 5%"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Token Utility */}
          <motion.div 
            {...containerAnimation}
            className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 sm:p-8"
          >
            <h2 className={`${fontStyles.sectionTitle} text-white mb-6`}>Token Utility</h2>
            <ul className={`${fontStyles.body} text-gray-300 space-y-3`}>
              {[
                "Governance voting rights",
                "Staking rewards",
                "Platform fee discounts",
                "Access to exclusive features and services"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Token Metrics */}
          <motion.div 
            {...containerAnimation}
            className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 sm:p-8"
          >
            <h2 className={`${fontStyles.sectionTitle} text-white mb-6`}>Token Metrics</h2>
            <ul className={`${fontStyles.body} text-gray-300 space-y-3`}>
              {[
                "Total Supply: 1,000,000,000 tokens",
                "Initial Circulating Supply: 400,000,000 tokens",
                "Token Type: ERC-20",
                "Initial Token Price: $0.10 USD"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Vesting Schedule */}
          <motion.div 
            {...containerAnimation}
            className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 sm:p-8"
          >
            <h2 className={`${fontStyles.sectionTitle} text-white mb-6`}>Vesting Schedule</h2>
            <p className={`${fontStyles.body} text-gray-300 mb-4`}>
              To ensure long-term alignment of interests:
            </p>
            <ul className={`${fontStyles.body} text-gray-300 space-y-3`}>
              {[
                "Team and Advisor tokens: 24-month linear vesting with a 6-month cliff",
                "Ecosystem Development tokens: 36-month linear vesting",
                "Marketing and Partnership tokens: 12-month linear vesting"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Tokenomics;