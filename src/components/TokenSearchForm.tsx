
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

interface TokenSearchFormProps {
  tokenAddress: string;
  setTokenAddress: (address: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  isLoading: boolean;
}

interface ExampleToken {
  name: string;
  address: string;
}

const TokenSearchForm: React.FC<TokenSearchFormProps> = ({
  tokenAddress,
  setTokenAddress,
  handleSearch,
  isLoading
}) => {
  // Example tokens for quick access
  const exampleTokens: ExampleToken[] = [
    { name: 'SOL', address: 'So11111111111111111111111111111111111111112' },
    { name: 'BONK', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
    { name: 'WIF', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
  ];

  return (
    <>
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
    </>
  );
};

export default TokenSearchForm;
