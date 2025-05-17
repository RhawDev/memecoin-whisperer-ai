
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TokenCardProps {
  name: string;
  ticker: string;
  sentimentScore: number;
  changePercentage: string;
  socialMentions: number;
  mentionChange: string;
}

const TokenCard: React.FC<TokenCardProps> = ({ 
  name, 
  ticker, 
  sentimentScore, 
  changePercentage,
  socialMentions,
  mentionChange
}) => {
  const isPositiveChange = changePercentage.startsWith('+');
  const isPositiveMention = mentionChange.startsWith('+');
  
  return (
    <Card className="glass-card h-full">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold">{name}</h3>
          <span className="text-gray-400">{ticker}</span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-400 text-sm">Sentiment Score</span>
            <span className="font-bold">{sentimentScore}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className={`h-full rounded-full ${
                sentimentScore > 65 
                  ? 'bg-green-500' 
                  : sentimentScore > 40 
                    ? 'bg-blue-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${sentimentScore}%` }}
            ></div>
          </div>
          <div className={`text-sm ${isPositiveChange ? 'text-green-500' : 'text-red-500'} mb-4`}>
            {changePercentage} in 24h
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Social Mentions</span>
              <span className={`text-sm ${isPositiveMention ? 'text-green-500' : 'text-red-500'}`}>
                {mentionChange}
              </span>
            </div>
            <div className="text-2xl font-bold mt-1">{socialMentions.toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenCard;
