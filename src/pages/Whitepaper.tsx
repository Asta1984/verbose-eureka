'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    title: 'Seamless Integration',
    description: 'Easily connect with your favorite tools and platforms for a smooth workflow.',
    icon: '🔗',
  },
  {
    title: 'Advanced Analytics',
    description: 'Gain valuable insights with our powerful analytics and reporting features.',
    icon: '📊',
  },
  {
    title: 'Collaboration Tools',
    description: 'Work together in real-time with our suite of collaboration features.',
    icon: '👥',
  },
  {
    title: 'Automated Workflows',
    description: 'Save time and reduce errors with our intelligent automation capabilities.',
    icon: '⚙️',
  },
];

export default function Whitepaper() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="features" className="py-20 px-6" ref={ref}>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Our Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{
              duration: 0.5,
              delay: index * 0.2,
              type: 'spring',
              stiffness: 100,
            }}
          >
            <Card>
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
