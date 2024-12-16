import React from 'react';

const Whitepaper: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Whitepaper</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Executive Summary</h2>
        <p className="mb-4">Our whitepaper outlines the technical specifications, tokenomics, and roadmap of our revolutionary token project.</p>
        <a 
          href="/path-to-whitepaper.pdf" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Download Full Whitepaper
        </a>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Key Sections</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Problem Statement and Market Analysis</li>
          <li>Token Architecture and Technical Specifications</li>
          <li>Use Cases and Potential Applications</li>
          <li>Tokenomics and Distribution Model</li>
          <li>Roadmap and Milestones</li>
          <li>Team and Advisors</li>
          <li>Legal and Regulatory Considerations</li>
        </ul>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Abstract</h2>
        <p className="mb-4">Our token leverages cutting-edge blockchain technology to address key challenges in the DeFi space, offering a scalable, secure, and user-friendly solution for decentralized finance applications.</p>
        <p>By combining innovative smart contract functionality with a robust economic model, we aim to create a token that not only serves as a store of value but also as a utility token powering a wide range of decentralized applications.</p>
      </div>
    </div>
  );
};

export default Whitepaper;

