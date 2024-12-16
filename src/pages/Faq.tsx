'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"

const faqs = [
  {
    question: 'What is your SaaS platform?',
    answer: 'Our SaaS platform is a comprehensive solution designed to streamline your workflow, enhance collaboration, and boost productivity across your organization.',
  },
  {
    question: 'How does pricing work?',
    answer: 'We offer flexible pricing plans tailored to businesses of all sizes. Our plans are based on the number of users and features required. Contact us for a custom quote.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, we offer a 14-day free trial for all new customers. This allows you to explore our platform and experience its benefits firsthand before committing.',
  },
  {
    question: 'How secure is your platform?',
    answer: 'Security is our top priority. We use industry-standard encryption, regular security audits, and comply with data protection regulations to ensure your data is safe and secure.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-20 px-6">
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

