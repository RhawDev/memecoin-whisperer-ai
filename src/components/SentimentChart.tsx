
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SentimentAnalyzer from './SentimentAnalyzer';
import SolanaTokenDetails from './SolanaTokenDetails';

const SentimentChart: React.FC = () => {
  const [apiError, setApiError] = useState<string | null>(null);

  // Function to reset error state and retry operations
  const handleRetry = () => {
    setApiError(null);
    // This will trigger child components to re-fetch data when they detect the error is cleared
    window.dispatchEvent(new CustomEvent('retry-api-request'));
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold gradient-text-yellow-red mb-2">Market Intelligence</h2>
        <p className="text-gray-400">
          Track market sentiment and analyze individual tokens to identify trends and opportunities.
        </p>
      </div>
      
      {apiError && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Connection Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{apiError}</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-fit flex items-center gap-2 mt-2 hover:bg-red-900/20"
              onClick={handleRetry}
            >
              <RefreshCw className="h-4 w-4" /> Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="sentiment">
        <TabsList className="mb-4">
          <TabsTrigger value="sentiment">Market Sentiment</TabsTrigger>
          <TabsTrigger value="token-details">Token Inspector</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sentiment">
          <SentimentAnalyzer onError={(error) => setApiError(error)} />
        </TabsContent>
        
        <TabsContent value="token-details">
          <SolanaTokenDetails onError={(error) => setApiError(error)} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SentimentChart;
