import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"

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
  return (
    <section id="faq" className="py-20 px-6 ">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

