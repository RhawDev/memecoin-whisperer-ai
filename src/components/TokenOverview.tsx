
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TokenOverviewProps {
  tokenMetadata: {
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
  tokenPrice: {
    price: number;
    priceChange: number;
    marketCap: number;
    volume: number;
    [key: string]: any;
  } | null;
  tokenAddress: string;
}

const TokenOverview: React.FC<TokenOverviewProps> = ({
  tokenMetadata,
  tokenPrice,
  tokenAddress
}) => {
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
  );
};

export default TokenOverview;
