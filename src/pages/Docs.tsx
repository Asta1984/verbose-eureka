import React from 'react';

const Docs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Documentation</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><a href="#" className="text-blue-600 hover:underline">Quick Start Guide</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Token Standards and Specifications</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Wallet Integration</a></li>
        </ul>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Smart Contract</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><a href="#" className="text-blue-600 hover:underline">Contract Address</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">ABI (Application Binary Interface)</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Solidity Source Code</a></li>
        </ul>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><a href="#" className="text-blue-600 hover:underline">RESTful API Endpoints</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">WebSocket API</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">SDK Documentation</a></li>
        </ul>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Tutorials</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><a href="#" className="text-blue-600 hover:underline">How to Stake Tokens</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Participating in Governance</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Building DApps with Our Token</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Docs;

