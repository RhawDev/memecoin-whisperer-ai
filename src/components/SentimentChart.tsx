
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SentimentAnalyzer from './SentimentAnalyzer';
import SolanaTokenDetails from './SolanaTokenDetails';

const SentimentChart: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold gradient-text-yellow-red mb-2">Market Intelligence</h2>
        <p className="text-gray-400">
          Track market sentiment and analyze individual tokens to identify trends and opportunities.
        </p>
      </div>
      
      <Tabs defaultValue="sentiment">
        <TabsList className="mb-4">
          <TabsTrigger value="sentiment">Market Sentiment</TabsTrigger>
          <TabsTrigger value="token-details">Token Inspector</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sentiment">
          <SentimentAnalyzer />
        </TabsContent>
        
        <TabsContent value="token-details">
          <SolanaTokenDetails />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SentimentChart;
