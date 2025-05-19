
import React, { useState, useEffect } from 'react';
import TokenCard from './TokenCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCcw, AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

type TrendingToken = {
  name: string;
  ticker: string;
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
      
      // Fallback to mock data
      setTrendingTokens([
        {
          name: 'Dogecoin',
          ticker: '$DOGE',
          sentimentScore: 65,
          changePercentage: '+5%',
          socialMentions: 12500,
          mentionChange: '+12%'
        },
        {
          name: 'Shiba Inu',
          ticker: '$SHIB',
          sentimentScore: 42,
          changePercentage: '-8%',
          socialMentions: 9800,
          mentionChange: '-3%'
        },
        {
          name: 'Pepe',
          ticker: '$PEPE',
          sentimentScore: 78,
          changePercentage: '+15%',
          socialMentions: 14200,
          mentionChange: '+28%'
        },
        {
          name: 'Floki',
          ticker: '$FLOKI',
          sentimentScore: 53,
          changePercentage: '+2%',
          socialMentions: 5600,
          mentionChange: '+4%'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
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
          <TokenCard
            key={index}
            name={token.name}
            ticker={token.ticker}
            sentimentScore={token.sentimentScore}
            changePercentage={token.changePercentage}
            socialMentions={token.socialMentions}
            mentionChange={token.mentionChange}
          />
        ))}
      </div>

      <div className="text-xs text-gray-500 text-center pt-2">
        Data aggregated from Twitter, Telegram and Discord mentions
      </div>
    </div>
  );
};

export default TrendingTokens;
