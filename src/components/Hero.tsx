import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Coins, Network, MessageCircleQuestion, Gift, Cpu } from 'lucide-react';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import "@/styles/animations.css";

// Font styling utility class
const fontStyles = {
  heading: "font-Type_writer text-xl sm:text-2xl md:text-3xl font-bold tracking-tight",
  subheading: "font-Type_writer text-sm sm:text-lg md:text-xl font-semibold",
  title: "font-Type_writer text-s sm:text-lg md:text-xl font-medium",
  body: "font-Type_writer text-base sm:text-lg leading-relaxed",
  special: "font-Enterpriser text-3xl",
};

export const About = () => {
  return (
    <>
      <div className="bg-gradient-to-b from-lime-400 to-slate-400">
        <div className="container w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <h1 className={`mb-8 sm:mb-12 text-center text-black ${fontStyles.special}`}>
            Our Partners
          </h1>
          <InfiniteScroll />
        </div>
      </div>
      <div className="min-h-screen bg-black py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className={` font-OnlinePrivileges md:text-4xl text-white mb-8 sm:mb-12 text-center`}>
            About Protocol
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Decentralized Infrastructure",
                icon: <Network className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />,
                description: "Building the backbone of Web3 physical infrastructure"
              },
              {
                title: "Network Effects",
                icon: <Cpu className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />,
                description: "Leveraging collective power through distributed networks"
              },
              {
                title: "Token Rewards",
                icon: <Coins className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />,
                description: "Earn rewards for contributing to the network"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/20"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className={`${fontStyles.title} text-white mb-2`}>{item.title}</h3>
                <p className={`${fontStyles.body} text-gray-400`}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const Tokenomics = () => {
  const tokenDistribution = [
    { label: 'Presale', value: 30 },
    { label: 'Liquidity', value: 20 },
    { label: 'Team', value: 15 },
    { label: 'Marketing', value: 15 },
    { label: 'Development', value: 20 }
  ];

  return (
    <div className="min-h-screen bg-black py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className={`${fontStyles.heading} text-white mb-8 sm:mb-12 text-center`}>
          Tokenomics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-4 sm:space-y-6">
            <h3 className={`${fontStyles.subheading} text-white mb-4 sm:mb-6`}>
              Token Distribution
            </h3>
            {tokenDistribution.map((item, index) => (
              <motion.div
                key={index}
                initial={{ width: 0 }}
                whileInView={{ width: `${item.value}%` }}
                className="mb-4"
              >
                <div className={`flex justify-between text-white mb-2 ${fontStyles.body}`}>
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
          <div className="space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-6 rounded-xl bg-purple-900/20 border border-purple-500/20">
              <h4 className={`${fontStyles.title} text-white mb-4`}>Presale Details</h4>
              <ul className={`space-y-3 sm:space-y-4 text-gray-300 ${fontStyles.body}`}>
                {[
                  'Soft Cap: 1000 ETH',
                  'Hard Cap: 2000 ETH',
                  'Min Contribution: 0.1 ETH',
                  'Max Contribution: 5 ETH'
                ].map((detail, index) => (
                  <li key={index} className="flex items-center">
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Airdrop = () => {
  return (
    <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-purple-900">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="inline-block p-2 sm:p-3 rounded-full bg-purple-500/20 mb-4"
          >
            <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
          </motion.div>
          <h2 className={`${fontStyles.heading} text-white mb-3 sm:mb-4`}>
            Exclusive Airdrop
          </h2>
          <p className={`${fontStyles.body} text-gray-300`}>
            Complete tasks to earn tokens and special NFT rewards
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
              className="p-4 sm:p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-purple-500/20 hover:border-purple-500/50 transition-colors cursor-pointer"
            >
              <h3 className={`${fontStyles.title} text-white mb-2`}>{task}</h3>
              <p className={`${fontStyles.body} text-gray-400`}>Earn 100 DEPIN tokens</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
    <div className="min-h-screen bg-black py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="inline-block p-2 sm:p-3 rounded-full bg-purple-500/20 mb-4"
          >
            <MessageCircleQuestion className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
          </motion.div>
          <h2 className={`${fontStyles.heading} text-white`}>
            Frequently Asked Questions
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-purple-500/20 rounded-lg overflow-hidden"
            >
              <button
                className="w-full p-4 sm:p-6 text-left bg-purple-900/20 hover:bg-purple-900/30 transition-colors flex justify-between items-center"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <span className={`${fontStyles.title} text-white`}>{faq.question}</span>
                <ArrowUpRight
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-purple-400 transform transition-transform ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeIndex === index && (
                <div className="p-4 sm:p-6 bg-purple-900/10">
                  <p className={`${fontStyles.body} text-gray-300`}>{faq.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};