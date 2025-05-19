
import React, { useState, useEffect } from 'react';
import { RefreshCcw, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

type TrendingToken = {
  name: string;
  ticker: string;
  address: string;
  sentimentScore: number;
  changePercentage: string;
  socialMentions: number;
  mentionChange: string;
  price?: string;
  marketCap?: string;
};

const TrendingTokens: React.FC = () => {
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrendingTokens();
  }, []);

  const fetchTrendingTokens = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-market', {
        body: {
          queryType: 'trendingTokens'
        }
      });
      
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      
      if (data?.trendingTokens && Array.isArray(data.trendingTokens)) {
        setTrendingTokens(data.trendingTokens);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error("Error fetching trending tokens:", err);
      setError(err.message || "Failed to fetch trending tokens data");
      toast.error("Failed to load trending tokens");
      
      // Fallback to mock data with real token addresses
      setTrendingTokens([
        {
          name: 'Dogecoin',
          ticker: '$DOGE',
          address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
          sentimentScore: 65,
          changePercentage: '+5%',
          socialMentions: 12500,
          mentionChange: '+12%',
          price: '0.124 USD',
          marketCap: '16.8B USD'
        },
        {
          name: 'Bonk',
          ticker: '$BONK',
          address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
          sentimentScore: 58,
          changePercentage: '+15%',
          socialMentions: 9800,
          mentionChange: '+23%',
          price: '0.00002814 USD',
          marketCap: '1.67B USD'
        },
        {
          name: 'WIF',
          ticker: '$WIF',
          address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
          sentimentScore: 78,
          changePercentage: '+8%',
          socialMentions: 14200,
          mentionChange: '+18%',
          price: '0.867 USD',
          marketCap: '867M USD'
        },
        {
          name: 'POPCAT',
          ticker: '$POPCAT',
          address: 'E8JQstQisHQKVJPaCJy9LY7ZKVeTJx8xLELvMZHDKBvL',
          sentimentScore: 53,
          changePercentage: '+32%',
          socialMentions: 5600,
          mentionChange: '+54%',
          price: '0.00023 USD',
          marketCap: '23.4M USD'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const openOnBirdeye = (address: string) => {
    window.open(`https://birdeye.so/token/${address}?chain=solana`, '_blank');
  };

  const getSentimentColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-blue-500";
    if (score >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <p className="text-gray-400">Loading trending tokens...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center glass-card p-6">
        <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-xl font-medium mb-2">Data Fetch Error</h3>
        <p className="text-gray-400 max-w-md mx-auto">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchTrendingTokens}
          className="mt-4 hover:bg-white/5"
        >
          <RefreshCcw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold gradient-text">Trending by Social Volume</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchTrendingTokens}
          className="hover:bg-white/5"
        >
          <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {trendingTokens.map((token, index) => (
          <Card key={index} className="glass-card relative overflow-hidden border-white/10 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{token.name}</span>
                  <Badge variant="outline" className="text-xs font-mono">
                    {token.ticker}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => openOnBirdeye(token.address)}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View on Birdeye</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Sentiment</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={token.sentimentScore} 
                    max={100} 
                    className="w-24 h-2" 
                    indicatorClassName={getSentimentColor(token.sentimentScore)}
                  />
                  <span className="text-xs font-medium">{token.sentimentScore}%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Price Change</span>
                <span className={`text-sm font-medium ${
                  token.changePercentage.startsWith('+') 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {token.changePercentage}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Social Mentions</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm">{token.socialMentions.toLocaleString()}</span>
                  <span className={`text-xs ${
                    token.mentionChange.startsWith('+') 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {token.mentionChange}
                  </span>
                </div>
              </div>
              
              {token.price && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Price</span>
                  <span className="text-sm font-medium">{token.price}</span>
                </div>
              )}
              
              {token.marketCap && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Market Cap</span>
                  <span className="text-sm font-medium">{token.marketCap}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-xs text-gray-500 text-center pt-2">
        Data aggregated from Twitter, Telegram and Discord mentions
      </div>
    </div>
  );
};

export default TrendingTokens;
