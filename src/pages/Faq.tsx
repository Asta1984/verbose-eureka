import { useState, useEffect } from 'react';
import { motion} from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"

// Font styling utility
const fontStyles = {
  heading: "font-[OnlinePrivileges] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight",
  faqQuestion: "font-[Type_writer] text-lg sm:text-xl font-semibold",
  faqAnswer: "font-[OnlinePrivileges] text-base sm:text-lg"
};

const faqs = [
  {
    question: "What is the total supply of tokens?",
    answer: "The total supply of our token is 1 billion (1,000,000,000)."
  },
  {
    question: "When is the token presale?",
    answer: "The token presale is scheduled to begin on July 1st, 2023, and will last for 30 days."
  },
  {
    question: "How can I participate in the presale?",
    answer: "To participate in the presale, you need to join our whitelist by providing your email on the home page. We'll send you detailed instructions closer to the presale date."
  },
  {
    question: "What blockchain is the token built on?",
    answer: "Our token is built on the Ethereum blockchain as an ERC-20 token."
  },
  {
    question: "Is there a vesting period for presale participants?",
    answer: "Yes, tokens purchased during the presale will have a 6-month vesting period with monthly unlocks."
  },
  {
    question: "What are the use cases for the token?",
    answer: "Our token can be used for governance voting, staking rewards, platform fee discounts, and accessing exclusive features within our ecosystem."
  },
  {
    question: "How can I store the tokens safely?",
    answer: "You can store our tokens in any ERC-20 compatible wallet. We recommend using hardware wallets for maximum security."
  },
]

export default function FAQ() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="faq" 
      className="min-h-screen relative overflow-hidden bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Animated Background Gradient */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          transform: `translateY(${scrollY * 0.3}px)`
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl mx-auto"
      >
        <h2 className={`${fontStyles.heading} text-center mb-12 text-white`}>
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className={`${fontStyles.faqQuestion}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className={`${fontStyles.faqAnswer}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  )
}