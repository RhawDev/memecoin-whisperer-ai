
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SentimentAnalyzer from './SentimentAnalyzer';

const SentimentChart: React.FC = () => {
  return (
    <div className="space-y-6">
      <SentimentAnalyzer />
    </div>
  );
};

export default SentimentChart;
