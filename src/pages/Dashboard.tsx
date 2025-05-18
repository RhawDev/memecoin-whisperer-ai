
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import WalletAnalyzer from '@/components/WalletAnalyzer';
import MarketMovers from '@/components/MarketMovers';
import TrendingTokens from '@/components/TrendingTokens';
import SentimentChart from '@/components/SentimentChart';
import LaunchMetrics from '@/components/LaunchMetrics';
import ChatInterface from '@/components/ChatInterface';
import TwitterTracking from '@/components/TwitterTracking';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('wallet');

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 mt-4 gradient-text">Dashboard</h1>
          
          <Tabs defaultValue="wallet" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2">
              <TabsTrigger value="wallet" className="text-sm">Wallet Analysis</TabsTrigger>
              <TabsTrigger value="movers" className="text-sm">Market Movers</TabsTrigger>
              <TabsTrigger value="tokens" className="text-sm">Trending Tokens</TabsTrigger>
              <TabsTrigger value="sentiment" className="text-sm">Market Sentiment</TabsTrigger>
              <TabsTrigger value="launches" className="text-sm">Launch Metrics</TabsTrigger>
              <TabsTrigger value="twitter" className="text-sm">Twitter News</TabsTrigger>
            </TabsList>
            
            <TabsContent value="wallet" className="space-y-6">
              <WalletAnalyzer />
              <ChatInterface />
            </TabsContent>
            
            <TabsContent value="movers" className="space-y-6">
              <MarketMovers />
            </TabsContent>
            
            <TabsContent value="tokens" className="space-y-6">
              <TrendingTokens />
            </TabsContent>
            
            <TabsContent value="sentiment" className="space-y-6">
              <SentimentChart />
            </TabsContent>
            
            <TabsContent value="launches" className="space-y-6">
              <LaunchMetrics />
            </TabsContent>
            
            <TabsContent value="twitter" className="space-y-6">
              <TwitterTracking />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
