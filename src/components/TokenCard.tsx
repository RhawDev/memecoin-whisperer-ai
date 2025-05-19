
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface TokenCardProps {
  name: string;
  ticker: string;
  sentimentScore: number;
  changePercentage: string;
  socialMentions: number;
  mentionChange: string;
  price?: string;
  marketCap?: string;
}

const TokenCard: React.FC<TokenCardProps> = ({ 
  name, 
  ticker, 
  sentimentScore, 
  changePercentage,
  socialMentions,
  mentionChange,
  price,
  marketCap
}) => {
  const isPositiveChange = changePercentage.startsWith('+');
  const isPositiveMention = mentionChange.startsWith('+');
  
  const getSentimentColor = (score: number) => {
    if (score > 65) return 'bg-green-500';
    if (score > 40) return 'bg-blue-500';
    return 'bg-red-500';
  };

  const handleViewOnBirdeye = () => {
    // Extract token symbol without $ sign
    const symbol = ticker.startsWith('$') ? ticker.substring(1) : ticker;
    window.open(`https://birdeye.so/token/${symbol}?chain=solana`, '_blank');
  };
  
  return (
    <Card className="glass-card h-full hover:border-white/20 transition-colors">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold">{name}</h3>
          <span className="text-gray-400">{ticker}</span>
        </div>
        
        {(price || marketCap) && (
          <div className="mt-2 space-y-1">
            {price && <p className="text-sm text-gray-300">Price: {price}</p>}
            {marketCap && <p className="text-sm text-gray-300">Market Cap: {marketCap}</p>}
          </div>
        )}
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-400 text-sm">Sentiment Score</span>
            <span className="font-bold">{sentimentScore}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className={`h-full rounded-full ${getSentimentColor(sentimentScore)}`}
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
            
            <Button 
              variant="outline"
              size="sm"
              onClick={handleViewOnBirdeye}
              className="w-full mt-4 flex items-center justify-center gap-1"
            >
              View on Birdeye
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenCard;
