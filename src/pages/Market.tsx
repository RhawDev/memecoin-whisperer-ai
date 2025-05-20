
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SentimentAnalyzer from '@/components/SentimentAnalyzer';
import LaunchMetrics from '@/components/LaunchMetrics';
import TrendingTokens from '@/components/TrendingTokens';
import MarketMovers from '@/components/MarketMovers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Market = () => {
  const [activeTab, setActiveTab] = useState('sentiment');

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Market Insights</h1>
          
          <Tabs defaultValue="sentiment" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-white/5 border border-white/10 mb-6 w-full md:w-auto">
              <TabsTrigger value="sentiment">Market Sentiment</TabsTrigger>
              <TabsTrigger value="launches">Launch Metrics</TabsTrigger>
              <TabsTrigger value="trending">Trending Tokens</TabsTrigger>
              <TabsTrigger value="movers">Market Movers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sentiment" className="space-y-6">
              <SentimentAnalyzer />
            </TabsContent>
            
            <TabsContent value="launches" className="space-y-6">
              <LaunchMetrics />
            </TabsContent>
            
            <TabsContent value="trending" className="space-y-6">
              <TrendingTokens />
            </TabsContent>
            
            <TabsContent value="movers" className="space-y-6">
              <MarketMovers />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Market;
