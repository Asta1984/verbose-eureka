import React from 'react';

const Tokenomics: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Tokenomics</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Token Distribution</h2>
        <ul className="space-y-2">
          <li>Public Sale: 40%</li>
          <li>Team and Advisors: 20% (vested over 2 years)</li>
          <li>Ecosystem Development: 15%</li>
          <li>Marketing and Partnerships: 10%</li>
          <li>Reserve: 10%</li>
          <li>Airdrops and Community Rewards: 5%</li>
        </ul>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Token Utility</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Governance voting rights</li>
          <li>Staking rewards</li>
          <li>Platform fee discounts</li>
          <li>Access to exclusive features and services</li>
        </ul>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Token Metrics</h2>
        <ul className="space-y-2">
          <li>Total Supply: 1,000,000,000 tokens</li>
          <li>Initial Circulating Supply: 400,000,000 tokens</li>
          <li>Token Type: ERC-20</li>
          <li>Initial Token Price: $0.10 USD</li>
        </ul>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Vesting Schedule</h2>
        <p className="mb-4">To ensure long-term alignment of interests:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Team and Advisor tokens: 24-month linear vesting with a 6-month cliff</li>
          <li>Ecosystem Development tokens: 36-month linear vesting</li>
          <li>Marketing and Partnership tokens: 12-month linear vesting</li>
        </ul>
      </div>
    </div>
  );
};

export default Tokenomics;

