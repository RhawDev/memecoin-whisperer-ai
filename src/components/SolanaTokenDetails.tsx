
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getTokenMetadata, getTokenPrice, getTokenHolders } from '@/integrations/solscan/client';
import { toast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

type TokenMetadata = {
  symbol: string;
  name: string;
  decimals: number;
  icon: string;
  website: string;
  twitter: string;
  tag: string[];
  totalSupply: string;
  [key: string]: any;
};

type TokenPrice = {
  price: number;
  priceChange: number;
  marketCap: number;
  volume: number;
  [key: string]: any;
};

type TokenHolder = {
  address: string;
  amount: string;
  percentage: number;
  rank: number;
  [key: string]: any;
};

const SolanaTokenDetails: React.FC = () => {
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(null);
  const [tokenPrice, setTokenPrice] = useState<TokenPrice | null>(null);
  const [tokenHolders, setTokenHolders] = useState<TokenHolder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenAddress) {
      toast.warning('Please enter a token address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTokenMetadata(null);
    setTokenPrice(null);
    setTokenHolders([]);

    try {
      // Fetch token metadata
      const metadata = await getTokenMetadata(tokenAddress);
      setTokenMetadata(metadata);

      // Fetch token price
      try {
        const price = await getTokenPrice(tokenAddress);
        setTokenPrice(price);
      } catch (priceError) {
        console.error('Error fetching price:', priceError);
        // Continue without price data
      }

      // Fetch token holders
      try {
        const holders = await getTokenHolders(tokenAddress, 10);
        setTokenHolders(holders);
      } catch (holdersError) {
        console.error('Error fetching holders:', holdersError);
        // Continue without holders data
      }

      toast.success('Token details fetched successfully');
    } catch (err: any) {
      console.error('Error fetching token details:', err);
      setError(err.message || 'Failed to fetch token details');
      toast.error('Failed to fetch token details');
    } finally {
      setIsLoading(false);
    }
  };

  // Example tokens for quick access
  const exampleTokens = [
    { name: 'SOL', address: 'So11111111111111111111111111111111111111112' },
    { name: 'BONK', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
    { name: 'WIF', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
  ];

  const formatNumber = (num: number, decimals: number = 2): string => {
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(decimals)}B`;
    } else if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(decimals)}M`;
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(decimals)}K`;
    } else {
      return num.toFixed(decimals);
    }
  };

  return (
    <Card className="glass-card w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Solana Token Inspector</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Enter token address (e.g., DezXAZ8z7...)"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="bg-white/5 border-white/10 text-white flex-1"
          />
          <Button 
            type="submit"
            disabled={isLoading || !tokenAddress}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Spinner size="sm" className="mr-2" />
                <span>Loading...</span>
              </div>
            ) : (
              "Search Token"
            )}
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-400">Example tokens:</span>
          {exampleTokens.map((token) => (
            <Button 
              key={token.address} 
              variant="outline" 
              size="sm" 
              onClick={() => setTokenAddress(token.address)}
              className="text-xs text-gray-300 border-gray-700 hover:bg-gray-800"
            >
              {token.name}
            </Button>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-md flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Spinner className="mx-auto mb-4" />
              <p className="text-gray-400">Fetching token details...</p>
            </div>
          </div>
        )}

        {tokenMetadata && (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 border border-white/10 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="holders">Top Holders</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <h3 className="text-lg font-medium mb-4">Token Information</h3>
                  <div className="bg-white/5 rounded-lg p-4 space-y-4">
                    <div className="flex items-center">
                      {tokenMetadata.icon ? (
                        <img 
                          src={tokenMetadata.icon} 
                          alt={tokenMetadata.name} 
                          className="w-10 h-10 rounded-full mr-3"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 mr-3 flex items-center justify-center">
                          {tokenMetadata.symbol?.[0] || '?'}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold">{tokenMetadata.name}</h3>
                          <Badge variant="outline">{tokenMetadata.symbol}</Badge>
                        </div>
                        <a 
                          href={`https://solscan.io/token/${tokenAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-400 hover:underline"
                        >
                          View on Solscan
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Decimals</p>
                        <p>{tokenMetadata.decimals}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Supply</p>
                        <p>{tokenMetadata.totalSupply ? Number(tokenMetadata.totalSupply).toLocaleString() : 'Unknown'}</p>
                      </div>
                    </div>

                    {tokenMetadata.tag && tokenMetadata.tag.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm">Tags</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {tokenMetadata.tag.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {(tokenMetadata.website || tokenMetadata.twitter) && (
                      <div>
                        <p className="text-gray-400 text-sm">Links</p>
                        <div className="flex flex-wrap gap-4 mt-1">
                          {tokenMetadata.website && (
                            <a 
                              href={tokenMetadata.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:underline text-sm"
                            >
                              Website
                            </a>
                          )}
                          {tokenMetadata.twitter && (
                            <a 
                              href={`https://twitter.com/${tokenMetadata.twitter.replace('@', '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:underline text-sm"
                            >
                              Twitter
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:w-1/2">
                  <h3 className="text-lg font-medium mb-4">Price & Market Data</h3>
                  {tokenPrice ? (
                    <div className="bg-white/5 rounded-lg p-4 space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm">Current Price</p>
                        <p className="text-2xl font-bold">${tokenPrice.price.toFixed(6)}</p>
                        <p className={`text-sm ${tokenPrice.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {tokenPrice.priceChange >= 0 ? '+' : ''}{tokenPrice.priceChange.toFixed(2)}%
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Market Cap</p>
                          <p>${formatNumber(tokenPrice.marketCap || 0)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">24h Volume</p>
                          <p>${formatNumber(tokenPrice.volume || 0)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 rounded-lg p-4 h-full flex items-center justify-center">
                      <p className="text-gray-400">Price data not available</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="holders">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Top Token Holders</CardTitle>
                </CardHeader>
                <CardContent>
                  {tokenHolders.length > 0 ? (
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tokenHolders.map((holder, index) => (
                            <TableRow key={index} className="border-b border-white/10">
                              <TableCell>{holder.rank}</TableCell>
                              <TableCell>
                                <a 
                                  href={`https://solscan.io/account/${holder.address}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-400 hover:underline"
                                >
                                  {holder.address.substring(0, 4)}...{holder.address.substring(holder.address.length - 4)}
                                </a>
                              </TableCell>
                              <TableCell className="text-right">{Number(holder.amount).toLocaleString()}</TableCell>
                              <TableCell className="text-right">{holder.percentage.toFixed(2)}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-400">No holder data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default SolanaTokenDetails;
