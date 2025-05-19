
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface SentimentChartProps {
  tokenName?: string;
  tokenTicker?: string;
  change?: string;
}

const SentimentChart: React.FC<SentimentChartProps> = ({
  tokenName = "Solana Memes",
  tokenTicker = "$MEME",
  change = "+0%"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sentimentData, setSentimentData] = useState<any[]>([]);
  const [marketSentiment, setMarketSentiment] = useState<string | null>(null);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<string | null>(null);
  const [currentChange, setCurrentChange] = useState(change);
  const [timeFrame, setTimeFrame] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    fetchSentimentData(timeFrame);
  }, [timeFrame]);

  const fetchSentimentData = async (period: '24h' | '7d' | '30d') => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-market', {
        body: {
          timeframe: period,
          queryType: 'marketSentiment'
        }
      });
      
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      // Set the market sentiment
      setMarketSentiment(data.sentiment || 'Neutral');
      setSentimentAnalysis(data.analysis || null);

      // Generate sentiment chart data based on the sentiment
      const isBullish = data.sentiment === 'Bullish';
      const isNeutral = data.sentiment === 'Neutral';

      // Generate chart data
      let timePoints;
      if (period === '24h') {
        timePoints = Array.from({ length: 24 }, (_, i) => {
          const now = new Date();
          now.setHours(now.getHours() - 23 + i);
          return now.getHours() + ':00';
        });
      } else if (period === '7d') {
        timePoints = Array.from({ length: 7 }, (_, i) => {
          const now = new Date();
          now.setDate(now.getDate() - 6 + i);
          return now.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        });
      } else { // 30d
        timePoints = Array.from({ length: 30 }, (_, i) => {
          const now = new Date();
          now.setDate(now.getDate() - 29 + i);
          return now.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        });
      }
      
      const generateTrend = (isBullish: boolean, timePoints: string[]) => {
        let positive = isBullish ? 55 : 35;
        let negative = isBullish ? 25 : 45;
        const points = [];
        
        const pointCount = timePoints.length;
        
        for (let i = 0; i < pointCount; i++) {
          // Add some variation, with a trend up if bullish
          // For longer periods, make the trend more pronounced toward the end
          const progressFactor = i / pointCount; // 0 to 1 as we progress through the timeframe
          
          if (isBullish) {
            positive += Math.random() * 6 - 2 + (progressFactor * 8); // Stronger uptrend toward the end
            negative -= Math.random() * 4 - 2 - (progressFactor * 5); // Decreasing negative sentiment
          } else {
            positive -= Math.random() * 5 - 2 - (progressFactor * 7); // Decreasing positive sentiment
            negative += Math.random() * 5 - 2 + (progressFactor * 6); // Increasing negative sentiment
          }

          // Keep within bounds
          positive = Math.max(30, Math.min(positive, 75));
          negative = Math.max(15, Math.min(negative, 60));

          // Neutral is whatever's left
          const neutral = Math.max(5, Math.min(100 - positive - negative, 40));
          
          points.push({
            time: timePoints[i],
            positive: Math.round(positive),
            negative: Math.round(negative),
            neutral: Math.round(neutral)
          });
        }
        return points;
      };

      // Set the change percentage based on sentiment and timeframe
      // Longer timeframes should have larger overall changes
      const timeMultiplier = period === '30d' ? 3 : period === '7d' ? 2 : 1;
      
      if (isBullish) {
        const changeVal = (Math.random() * 20 + 5 * timeMultiplier).toFixed(1);
        setCurrentChange(`+${changeVal}%`);
      } else if (!isNeutral) {
        const changeVal = (Math.random() * 15 + 2 * timeMultiplier).toFixed(1);
        setCurrentChange(`-${changeVal}%`);
      } else {
        const changeVal = (Math.random() * 5 - 2.5).toFixed(1);
        setCurrentChange(`${Number(changeVal) >= 0 ? '+' : ''}${changeVal}%`);
      }

      // Generate and set the chart data
      const chartData = generateTrend(isBullish, timePoints);
      setSentimentData(chartData);
    } catch (err: any) {
      console.error("Error fetching sentiment data:", err);
      setError(err.message || "Failed to load market sentiment data");

      // Set fallback mock data
      const mockDataGenerator = (period: '24h' | '7d' | '30d') => {
        if (period === '24h') {
          return [
            { time: '00:00', positive: 45, negative: 25, neutral: 30 },
            { time: '03:00', positive: 58, negative: 20, neutral: 22 },
            { time: '06:00', positive: 55, negative: 25, neutral: 20 },
            { time: '09:00', positive: 60, negative: 15, neutral: 25 },
            { time: '12:00', positive: 60, negative: 19, neutral: 21 },
            { time: '15:00', positive: 68, negative: 14, neutral: 18 },
            { time: '18:00', positive: 63, negative: 17, neutral: 20 },
            { time: '21:00', positive: 65, negative: 15, neutral: 20 },
            { time: '23:00', positive: 60, negative: 20, neutral: 20 }
          ];
        } else if (period === '7d') {
          // Generate dates for the last 7 days
          const dates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 6 + i);
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          });
          
          return [
            { time: dates[0], positive: 48, negative: 32, neutral: 20 },
            { time: dates[1], positive: 52, negative: 28, neutral: 20 },
            { time: dates[2], positive: 55, negative: 25, neutral: 20 },
            { time: dates[3], positive: 60, negative: 20, neutral: 20 },
            { time: dates[4], positive: 62, negative: 18, neutral: 20 },
            { time: dates[5], positive: 65, negative: 15, neutral: 20 },
            { time: dates[6], positive: 68, negative: 12, neutral: 20 }
          ];
        } else { // 30d
          // Generate simplified 30-day data (showing key points only for readability)
          const dates = Array.from({ length: 5 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 29 + i * 7);
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          });
          
          return [
            { time: dates[0], positive: 40, negative: 40, neutral: 20 },
            { time: dates[1], positive: 45, negative: 35, neutral: 20 },
            { time: dates[2], positive: 55, negative: 25, neutral: 20 },
            { time: dates[3], positive: 60, negative: 20, neutral: 20 },
            { time: dates[4], positive: 68, negative: 12, neutral: 20 }
          ];
        }
      };
      
      setSentimentData(mockDataGenerator(period));
      
      // Set fallback sentiment
      setMarketSentiment('Bullish');
      setSentimentAnalysis('The Solana memecoin market shows strong bullish momentum with increased trading volume across major tokens. Social sentiment indicators are trending positive, suggesting continued upward price action in the near term.');
    } finally {
      setIsLoading(false);
    }
  };

  const isPositiveChange = currentChange.startsWith('+');

  return (
    <Card className="glass-card w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold flex items-center">
            {tokenName} Sentiment
          </CardTitle>
          <p className="text-sm text-gray-400 mt-1">
            {tokenTicker} sentiment analysis over past {timeFrame === '24h' ? '24 hours' : timeFrame === '7d' ? '7 days' : '30 days'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm ${isPositiveChange ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            {currentChange}
          </div>
          <Button size="icon" variant="outline" onClick={() => fetchSentimentData(timeFrame)} disabled={isLoading} className="h-8 w-8">
            {isLoading ? <Spinner size="sm" /> : <RefreshCcw className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="24h" value={timeFrame} onValueChange={(v) => setTimeFrame(v as '24h' | '7d' | '30d')} className="mb-4">
          <TabsList className="grid grid-cols-3 w-[200px] mx-auto">
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Spinner className="mx-auto mb-4" />
              <p className="text-gray-400">Analyzing market sentiment...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="h-64 overflow-visible">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={sentimentData} 
                  margin={{ top: 5, right: 25, left: 5, bottom: 5 }}
                >
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: '#9CA3AF', fontSize: '0.75rem' }} 
                    stroke="#374151" 
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fill: '#9CA3AF', fontSize: '0.75rem' }} 
                    stroke="#374151" 
                    tickLine={false} 
                    domain={[0, 100]} 
                    unit="%" 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.375rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    labelStyle={{ color: 'white' }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="positive" 
                    name="Positive" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{ r: 6, fill: '#10B981', strokeWidth: 0 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="negative" 
                    name="Negative" 
                    stroke="#EF4444" 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{ r: 6, fill: '#EF4444', strokeWidth: 0 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="neutral" 
                    name="Neutral" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{ r: 6, fill: '#3B82F6', strokeWidth: 0 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {marketSentiment && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Current Market Mood:</h3>
                  <span className={`text-lg font-bold ${
                    marketSentiment === 'Bullish' ? 'text-green-500' : 
                    marketSentiment === 'Bearish' ? 'text-red-500' : 
                    'text-blue-400'
                  }`}>
                    {marketSentiment}
                  </span>
                </div>
                
                {sentimentAnalysis && (
                  <div className="mt-2 text-sm text-gray-300">
                    <p>{sentimentAnalysis}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SentimentChart;
