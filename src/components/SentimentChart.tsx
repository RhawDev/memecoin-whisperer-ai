
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SentimentAnalyzer from './SentimentAnalyzer';
import SolanaTokenDetails from './SolanaTokenDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SentimentChart: React.FC = () => {
  return (
    <div className="space-y-6">
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
