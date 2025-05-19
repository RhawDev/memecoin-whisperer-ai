
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, ExternalLink, AlertTriangle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type MarketMover = {
  address: string;
  performance24h: string;
  performance7d: string;
  performance30d: string;
  volume: string;
  trades: number;
  profitable: string;
};

type TimeRange = '24h' | '7d' | '30d';

const MarketMovers: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [marketMovers, setMarketMovers] = useState<MarketMover[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMarketMovers(timeRange);
  }, [timeRange]);

  const fetchMarketMovers = async (range: TimeRange) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-market', {
        body: {
          timeframe: range,
          queryType: 'marketMovers'
        }
      });
      
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      
      if (data?.marketMovers) {
        setMarketMovers(data.marketMovers);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error("Error fetching market movers:", err);
      setError(err.message || "Failed to fetch market data");
      toast.error("Failed to load market movers data");
      
      // Set fallback data with actual Solana addresses
      setMarketMovers([
        { 
          address: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH', 
          performance24h: '+42.8%', 
          performance7d: '+156.3%', 
          performance30d: '+287.5%', 
          volume: '458,932 SOL', 
          trades: 87,
          profitable: '78%'
        },
        { 
          address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', 
          performance24h: '+36.2%', 
          performance7d: '+89.7%', 
          performance30d: '+142.3%', 
          volume: '356,721 SOL', 
          trades: 65,
          profitable: '82%'
        },
        { 
          address: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs', 
          performance24h: '+28.5%', 
          performance7d: '+76.4%', 
          performance30d: '+118.9%', 
          volume: '289,453 SOL', 
          trades: 53,
          profitable: '75%'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPerformanceByRange = (wallet: MarketMover, range: TimeRange) => {
    switch(range) {
      case '24h':
        return wallet.performance24h;
      case '7d':
        return wallet.performance7d;
      case '30d':
        return wallet.performance30d;
      default:
        return wallet.performance24h;
    }
  };

  const openOnSolscan = (address: string) => {
    // Fix URL format to work with Solscan
    window.open(`https://solscan.io/account/${address}`, '_blank');
  };

  const getDisplayAddress = (address: string) => {
    if (address.length > 10) {
      return `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;
    }
    return address;
  };

  return (
    <Card className="glass-card w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-500" />
          Market Movers
        </CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === '24h' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setTimeRange('24h')}
            className={timeRange === '24h' ? 'bg-indigo-500 hover:bg-indigo-600' : 'hover:bg-white/5'}
          >
            24h
          </Button>
          <Button 
            variant={timeRange === '7d' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setTimeRange('7d')}
            className={timeRange === '7d' ? 'bg-indigo-500 hover:bg-indigo-600' : 'hover:bg-white/5'}
          >
            7d
          </Button>
          <Button 
            variant={timeRange === '30d' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setTimeRange('30d')}
            className={timeRange === '30d' ? 'bg-indigo-500 hover:bg-indigo-600' : 'hover:bg-white/5'}
          >
            30d
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Spinner className="mx-auto mb-4" />
              <p className="text-gray-400">Loading market data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Data Fetch Error</h3>
            <p className="text-gray-400 max-w-md mx-auto">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchMarketMovers(timeRange)}
              className="mt-4 hover:bg-white/5"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-72 rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Rank</TableHead>
                  <TableHead className="text-left">Address</TableHead>
                  <TableHead className="text-right">Performance</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead className="text-right">Trades</TableHead>
                  <TableHead className="text-right">Profitable</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketMovers.map((wallet, index) => (
                  <TableRow key={index} className="border-b border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{index + 1}</TableCell>
                    <TableCell className="font-mono">
                      <button 
                        onClick={() => openOnSolscan(wallet.address)}
                        className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center"
                      >
                        {getDisplayAddress(wallet.address)}
                        <ExternalLink className="h-3 w-3 ml-1 inline" />
                      </button>
                    </TableCell>
                    <TableCell className="text-right text-green-500 font-medium">
                      {getPerformanceByRange(wallet, timeRange)}
                    </TableCell>
                    <TableCell className="text-right">{wallet.volume}</TableCell>
                    <TableCell className="text-right">{wallet.trades}</TableCell>
                    <TableCell className="text-right">{wallet.profitable}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-white/10"
                        onClick={() => openOnSolscan(wallet.address)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
        <div className="mt-4 text-xs text-gray-400 flex items-center justify-between">
          <span>Data powered by Solscan.io</span>
          <Button 
            variant="link" 
            size="sm" 
            className="text-indigo-400 p-0" 
            onClick={() => window.open('https://solscan.io/top-accounts', '_blank')}
          >
            View Full Leaderboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketMovers;
