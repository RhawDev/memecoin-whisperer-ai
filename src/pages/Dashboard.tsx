
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WalletAnalyzer from '@/components/WalletAnalyzer';
import TrendingTokens from '@/components/TrendingTokens';
import MarketMovers from '@/components/MarketMovers';
import SentimentChart from '@/components/SentimentChart';
import LaunchMetrics from '@/components/LaunchMetrics';
import ChatInterface from '@/components/ChatInterface';

const Dashboard = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Memecoin Dashboard</h1>
          <p className="text-gray-400">Track memecoin market sentiment, analyze wallet behavior, and identify top traders.</p>
        </div>
        
        {/* Top Section: Wallet Analyzer */}
        <section className="mb-8">
          <WalletAnalyzer />
        </section>
        
        {/* Token Cards Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Trending Tokens</h2>
          <TrendingTokens />
        </section>
        
        {/* Market Movers Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Solscan.io Market Movers</h2>
          <MarketMovers />
        </section>
        
        {/* Charts and Widgets Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <SentimentChart 
              tokenName="Dogecoin" 
              tokenTicker="$DOGE"
              change="-12.5%"
            />
          </div>
          <div className="flex flex-col gap-8">
            <LaunchMetrics tokenCount={213} weekChange="+12%" />
            <ChatInterface />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
