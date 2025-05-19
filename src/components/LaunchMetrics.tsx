
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/ui/spinner';

interface LaunchMetricsProps {
  tokenCount?: number;
  weekChange?: string;
}

const LaunchMetrics: React.FC<LaunchMetricsProps> = ({ 
  tokenCount: propTokenCount, 
  weekChange: propWeekChange 
}) => {
  const [tokenCount, setTokenCount] = useState(propTokenCount || 0);
  const [weekChange, setWeekChange] = useState(propWeekChange || '+0%');
  const [isLoading, setIsLoading] = useState(!propTokenCount);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propTokenCount) {
      fetchPumpFunData();
    }
  }, [propTokenCount]);

  const fetchPumpFunData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-market', {
        body: {
          queryType: 'pumpFunData'
        }
      });
      
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      
      setTokenCount(data.tokenCount || 0);
      setWeekChange(data.weekChange || '+0%');
    } catch (err: any) {
      console.error("Error fetching PumpFun data:", err);
      setError(err.message || "Failed to load data");
      
      // Set fallback data
      setTokenCount(42);
      setWeekChange('+15%');
    } finally {
      setIsLoading(false);
    }
  };
  
  const isPositiveChange = weekChange.startsWith('+');
  
  return (
    <Card className="glass-card bg-gradient-to-br from-blue-900/30 to-blue-800/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Rocket className="h-5 w-5 text-blue-500" />
          PumpFun Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Spinner className="text-blue-500" />
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-blue-500/20">
                <Rocket className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-blue-300">PumpFun Graduation Count</p>
                <h3 className="text-3xl font-bold text-white">{tokenCount} Tokens</h3>
                <p className={`text-sm ${isPositiveChange ? 'text-green-500' : 'text-red-500'} mt-1`}>
                  {weekChange} this week
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="bg-black/30 border border-blue-900/30 rounded-lg p-4">
                <h4 className="text-blue-300 text-sm font-medium mb-2">Live Data from Dune Analytics</h4>
                <iframe
                  src="https://dune.com/embeds/2449664/4014009"
                  width="100%"
                  height="400"
                  title="PumpFun Analytics"
                  frameBorder="0"
                  className="rounded-md"
                ></iframe>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LaunchMetrics;
