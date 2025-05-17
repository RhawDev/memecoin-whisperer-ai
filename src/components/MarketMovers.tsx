
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, Users } from 'lucide-react';

// Mock data for market movers - would be replaced with actual Solscan data
const marketMoversData = [
  { 
    id: 1, 
    address: '3FZb...r7Yh', 
    performance24h: '+42.8%', 
    performance7d: '+156.3%', 
    performance30d: '+287.5%', 
    volume: '458,932 SOL', 
    trades: 87,
    profitable: '78%'
  },
  { 
    id: 2, 
    address: 'Hj7G...9dT4', 
    performance24h: '+36.2%', 
    performance7d: '+89.7%', 
    performance30d: '+142.3%', 
    volume: '356,721 SOL', 
    trades: 65,
    profitable: '82%'
  },
  { 
    id: 3, 
    address: '8mN4...k3Fs', 
    performance24h: '+28.5%', 
    performance7d: '+76.4%', 
    performance30d: '+118.9%', 
    volume: '289,453 SOL', 
    trades: 53,
    profitable: '75%'
  },
  { 
    id: 4, 
    address: '2xR9...p7Tb', 
    performance24h: '+22.1%', 
    performance7d: '+65.8%', 
    performance30d: '+94.2%', 
    volume: '215,687 SOL', 
    trades: 42,
    profitable: '71%'
  },
  { 
    id: 5, 
    address: '5cT7...z9Wq', 
    performance24h: '+18.6%', 
    performance7d: '+53.2%', 
    performance30d: '+82.7%', 
    volume: '187,349 SOL', 
    trades: 36,
    profitable: '69%'
  }
];

type TimeRange = '24h' | '7d' | '30d';

const MarketMovers: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');

  const getPerformanceByRange = (wallet: any, range: TimeRange) => {
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
              {marketMoversData.map((wallet, index) => (
                <TableRow key={wallet.id} className="border-b border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium text-white">{index + 1}</TableCell>
                  <TableCell className="font-mono">{wallet.address}</TableCell>
                  <TableCell className="text-right text-green-500 font-medium">
                    {getPerformanceByRange(wallet, timeRange)}
                  </TableCell>
                  <TableCell className="text-right">{wallet.volume}</TableCell>
                  <TableCell className="text-right">{wallet.trades}</TableCell>
                  <TableCell className="text-right">{wallet.profitable}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="hover:bg-white/10">
                      Mirror
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <div className="mt-4 text-xs text-gray-400 flex items-center justify-between">
          <span>Data powered by Solscan.io</span>
          <Button variant="link" size="sm" className="text-indigo-400 p-0">
            View Full Leaderboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketMovers;
