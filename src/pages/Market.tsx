
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarketInsights from '@/components/MarketInsights';

const Market = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Market Insights</h1>
          <MarketInsights />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Market;
