import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">About Our Project</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-4">We aim to revolutionize the decentralized finance space by providing a token that combines security, scalability, and real-world utility.</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">The Team</h2>
        <ul className="space-y-4">
          <li>
            <h3 className="text-xl font-semibold">John Doe - CEO</h3>
            <p>15+ years of experience in fintech and blockchain</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold">Jane Smith - CTO</h3>
            <p>Former lead developer at a major cryptocurrency exchange</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold">Mike Johnson - Head of Marketing</h3>
            <p>Experienced in launching successful ICOs and token sales</p>
          </li>
        </ul>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
        <p>We envision a future where our token plays a pivotal role in connecting traditional finance with the world of DeFi, creating new opportunities for individuals and businesses alike.</p>
      </div>
    </div>
  );
};

export default About;

