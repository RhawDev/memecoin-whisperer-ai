
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTokenMetadata, getTokenPrice, getTokenHolders } from '@/integrations/solscan/client';
import { toast } from '@/hooks/use-toast';
import TokenSearchForm from './TokenSearchForm';
import TokenOverview from './TokenOverview';
import TokenHolders from './TokenHolders';
import ErrorDisplay from './ErrorDisplay';
import LoadingState from './LoadingState';

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

  return (
    <Card className="glass-card w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Solana Token Inspector</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TokenSearchForm 
          tokenAddress={tokenAddress} 
          setTokenAddress={setTokenAddress} 
          handleSearch={handleSearch}
          isLoading={isLoading}
        />

        <ErrorDisplay error={error || ''} />

        {isLoading && <LoadingState />}

        {tokenMetadata && (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 border border-white/10 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="holders">Top Holders</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <TokenOverview 
                tokenMetadata={tokenMetadata}
                tokenPrice={tokenPrice}
                tokenAddress={tokenAddress}
              />
            </TabsContent>

            <TabsContent value="holders">
              <TokenHolders tokenHolders={tokenHolders} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default SolanaTokenDetails;
