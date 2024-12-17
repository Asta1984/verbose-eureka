import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, BookOpen } from 'lucide-react';

const fontStyles = {
  heading: "font-Type_writer text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight",
  sectionTitle: "font-Type_writer text-xl sm:text-2xl md:text-3xl font-semibold",
  body: "font-Type_writer text-sm sm:text-base leading-relaxed"
};

const Whitepaper: React.FC = () => {
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
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-3 rounded-full bg-purple-500/20 mb-4"
          >
            <BookOpen className="w-8 h-8 text-purple-400" />
          </motion.div>
          <h1 className={`${fontStyles.heading} text-white`}>
            Whitepaper
          </h1>
        </div>

        {/* Executive Summary */}
        <motion.div 
          {...containerAnimation}
          className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 sm:p-8 mb-8"
        >
          <h2 className={`${fontStyles.sectionTitle} text-white mb-6 flex items-center gap-2`}>
            <FileText className="w-6 h-6 text-purple-400" />
            Executive Summary
          </h2>
          <p className={`${fontStyles.body} text-gray-300 mb-8`}>
            Our whitepaper outlines the technical specifications, tokenomics, and roadmap of our revolutionary token project.
          </p>
          <a 
            href="/path-to-whitepaper.pdf" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`${fontStyles.body} inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-colors transform hover:scale-105 duration-200 ease-in-out`}
          >
            <Download className="w-5 h-5" />
            Download Full Whitepaper
          </a>
        </motion.div>

        {/* Key Sections */}
        <motion.div 
          {...containerAnimation}
          className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 sm:p-8 mb-8"
        >
          <h2 className={`${fontStyles.sectionTitle} text-white mb-6`}>Key Sections</h2>
          <ul className={`${fontStyles.body} text-gray-300 space-y-3`}>
            {[
              "Problem Statement and Market Analysis",
              "Token Architecture and Technical Specifications",
              "Use Cases and Potential Applications",
              "Tokenomics and Distribution Model",
              "Roadmap and Milestones",
              "Team and Advisors",
              "Legal and Regulatory Considerations"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Abstract */}
        <motion.div 
          {...containerAnimation}
          className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 sm:p-8"
        >
          <h2 className={`${fontStyles.sectionTitle} text-white mb-6`}>Abstract</h2>
          <div className={`${fontStyles.body} text-gray-300 space-y-4`}>
            <p>
              Our token leverages cutting-edge blockchain technology to address key challenges in the DeFi space, offering a scalable, secure, and user-friendly solution for decentralized finance applications.
            </p>
            <p>
              By combining innovative smart contract functionality with a robust economic model, we aim to create a token that not only serves as a store of value but also as a utility token powering a wide range of decentralized applications.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Whitepaper;