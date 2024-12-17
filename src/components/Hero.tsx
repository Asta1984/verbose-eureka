import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Coins, Network, MessageCircleQuestion, Gift, Cpu } from 'lucide-react';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import "@/styles/animations.css";


// Hero Section
export const Hero2 = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-b from-purple-900 to-black">
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
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold hover:from-purple-700 hover:to-pink-700 transition-colors">
              Join Presale
            </button>
            <button className="px-8 py-3 border border-purple-500 rounded-full text-white font-bold hover:bg-purple-500/20 transition-colors">
              Claim Airdrop
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// About Section with Parallax Cards
export const About = () => {
  return (
    <>
    <div className="bg-gradient-to-b from-lime-400 to-slate-400">
    <div className="container mx-auto px-4 py-20">
      <h1 className="mb-12 text-center text-3xl text-black font-Enterpriser">Our Partners</h1>
      <InfiniteScroll />
    </div>
  </div>
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">About DePin Protocol</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Decentralized Infrastructure",
              icon: <Network className="w-8 h-8 text-purple-400" />,
              description: "Building the backbone of Web3 physical infrastructure"
            },
            {
              title: "Network Effects",
              icon: <Cpu className="w-8 h-8 text-purple-400" />,
              description: "Leveraging collective power through distributed networks"
            },
            {
              title: "Token Rewards",
              icon: <Coins className="w-8 h-8 text-purple-400" />,
              description: "Earn rewards for contributing to the network"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-6 rounded-xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/20"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

// Tokenomics Section
export const Tokenomics = () => {
  const tokenDistribution = [
    { label: 'Presale', value: 30 },
    { label: 'Liquidity', value: 20 },
    { label: 'Team', value: 15 },
    { label: 'Marketing', value: 15 },
    { label: 'Development', value: 20 }
  ];

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Tokenomics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Token Distribution</h3>
            {tokenDistribution.map((item, index) => (
              <motion.div
                key={index}
                initial={{ width: 0 }}
                whileInView={{ width: `${item.value}%` }}
                className="mb-4"
              >
                <div className="flex justify-between text-white mb-2">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-purple-900/20 border border-purple-500/20">
              <h4 className="text-xl font-bold text-white mb-4">Presale Details</h4>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center">
                  <ArrowUpRight className="w-5 h-5 mr-2 text-purple-400" />
                  Soft Cap: 1000 ETH
                </li>
                <li className="flex items-center">
                  <ArrowUpRight className="w-5 h-5 mr-2 text-purple-400" />
                  Hard Cap: 2000 ETH
                </li>
                <li className="flex items-center">
                  <ArrowUpRight className="w-5 h-5 mr-2 text-purple-400" />
                  Min Contribution: 0.1 ETH
                </li>
                <li className="flex items-center">
                  <ArrowUpRight className="w-5 h-5 mr-2 text-purple-400" />
                  Max Contribution: 5 ETH
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Airdrop Section
export const Airdrop = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-black to-purple-900">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="inline-block p-3 rounded-full bg-purple-500/20 mb-4"
          >
            <Gift className="w-8 h-8 text-purple-400" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">Exclusive Airdrop</h2>
          <p className="text-gray-300">Complete tasks to earn tokens and special NFT rewards</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "Follow on Twitter",
            "Join Telegram Group",
            "Share Announcement",
            "Complete KYC",
            "Stake Tokens",
            "Refer Friends"
          ].map((task, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-purple-500/20 hover:border-purple-500/50 transition-colors cursor-pointer"
            >
              <h3 className="text-xl font-bold text-white mb-2">{task}</h3>
              <p className="text-gray-400">Earn 100 DEPIN tokens</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// FAQ Section with proper TypeScript typing
export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is DePin Protocol?",
      answer: "DePin Protocol is a revolutionary platform that connects decentralized physical infrastructure networks with blockchain technology..."
    },
    {
      question: "How can I participate in the presale?",
      answer: "You can participate in the presale by connecting your Web3 wallet and contributing ETH within the specified limits..."
    },
    {
      question: "What are the token utilities?",
      answer: "The DEPIN token serves multiple purposes including governance, staking rewards, network access, and ecosystem incentives..."
    }
  ];

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="inline-block p-3 rounded-full bg-purple-500/20 mb-4"
          >
            <MessageCircleQuestion className="w-8 h-8 text-purple-400" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white">Frequently Asked Questions</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-purple-500/20 rounded-lg overflow-hidden"
            >
              <button
                className="w-full p-6 text-left bg-purple-900/20 hover:bg-purple-900/30 transition-colors flex justify-between items-center"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <span className="text-white font-bold">{faq.question}</span>
                <ArrowUpRight
                  className={`w-5 h-5 text-purple-400 transform transition-transform ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeIndex === index && (
                <div className="p-6 bg-purple-900/10">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
