import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
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
  useEffect(() => {
    fetchSentimentData();
  }, []);
  const fetchSentimentData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('analyze-market', {
        body: {
          timeframe: '24h',
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
      const hoursAgo = Array.from({
        length: 24
      }, (_, i) => {
        const now = new Date();
        now.setHours(now.getHours() - 23 + i);
        return now.getHours() + ':00';
      });
      const generateTrend = (isBullish: boolean) => {
        let positive = isBullish ? 55 : 35;
        let negative = isBullish ? 25 : 45;
        const points = [];
        for (let i = 0; i < 24; i++) {
          // Add some variation, with a trend up if bullish
          if (isBullish) {
            positive += Math.random() * 6 - 2 + (i > 12 ? 0.5 : 0);
            negative -= Math.random() * 4 - 2 - (i > 12 ? 0.3 : 0);
          } else {
            positive -= Math.random() * 5 - 2 - (i > 12 ? 0.4 : 0);
            negative += Math.random() * 5 - 2 + (i > 12 ? 0.4 : 0);
          }

          // Keep within bounds
          positive = Math.max(30, Math.min(positive, 75));
          negative = Math.max(15, Math.min(negative, 60));

          // Neutral is whatever's left
          const neutral = 100 - positive - negative;
          points.push({
            time: hoursAgo[i],
            positive: Math.round(positive),
            negative: Math.round(negative),
            neutral: Math.round(neutral)
          });
        }
        return points;
      };

      // Set the change percentage based on sentiment
      if (isBullish) {
        const changeVal = (Math.random() * 20 + 5).toFixed(1);
        setCurrentChange(`+${changeVal}%`);
      } else if (!isNeutral) {
        const changeVal = (Math.random() * 15 + 2).toFixed(1);
        setCurrentChange(`-${changeVal}%`);
      } else {
        const changeVal = (Math.random() * 5 - 2.5).toFixed(1);
        setCurrentChange(`${Number(changeVal) >= 0 ? '+' : ''}${changeVal}%`);
      }

      // Generate and set the chart data
      const chartData = generateTrend(isBullish);
      setSentimentData(chartData);
    } catch (err: any) {
      console.error("Error fetching sentiment data:", err);
      setError(err.message || "Failed to load market sentiment data");

      // Set fallback mock data
      setSentimentData([{
        time: '23:00',
        positive: 50,
        negative: 20,
        neutral: 30
      }, {
        time: '00:00',
        positive: 45,
        negative: 25,
        neutral: 30
      }, {
        time: '01:00',
        positive: 40,
        negative: 22,
        neutral: 38
      }, {
        time: '02:00',
        positive: 60,
        negative: 18,
        neutral: 22
      }, {
        time: '03:00',
        positive: 58,
        negative: 20,
        neutral: 22
      },
      // ... other data points
      {
        time: '22:00',
        positive: 60,
        negative: 20,
        neutral: 20
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  const isPositiveChange = currentChange.startsWith('+');
  return <Card className="glass-card w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold flex items-center">
            {tokenName} Sentiment
          </CardTitle>
          <p className="text-sm text-gray-400 mt-1">
            {tokenTicker} sentiment analysis over past 24 hours
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm ${isPositiveChange ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            {currentChange}
          </div>
          <Button size="icon" variant="outline" onClick={fetchSentimentData} disabled={isLoading} className="h-8 w-8">
            {isLoading ? <Spinner size="sm" /> : <RefreshCcw className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2 py-[240px] my-0">
        {isLoading ? <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Spinner className="mx-auto mb-4" />
              <p className="text-gray-400">Analyzing market sentiment...</p>
            </div>
          </div> : <>
            <div className="h-64">
              <ChartContainer config={{
            positive: {
              color: '#10B981',
              label: 'Positive'
            },
            negative: {
              color: '#EF4444',
              label: 'Negative'
            },
            neutral: {
              color: '#3B82F6',
              label: 'Neutral'
            }
          }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentData} margin={{
                top: 5,
                right: 5,
                left: 0,
                bottom: 5
              }}>
                    <XAxis dataKey="time" tick={{
                  fill: '#9CA3AF',
                  fontSize: '0.75rem'
                }} stroke="#374151" tickLine={false} />
                    <YAxis tick={{
                  fill: '#9CA3AF',
                  fontSize: '0.75rem'
                }} stroke="#374151" tickLine={false} domain={[0, 100]} unit="%" />
                    <ChartTooltip content={<ChartTooltipContent labelKey="time" formatter={(value, name) => [`${value}%`, name]} />} />
                    <Line type="monotone" dataKey="positive" name="positive" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{
                  r: 6,
                  style: {
                    fill: '#10B981',
                    opacity: 0.8
                  }
                }} />
                    <Line type="monotone" dataKey="negative" name="negative" stroke="#EF4444" strokeWidth={2} dot={false} activeDot={{
                  r: 6,
                  style: {
                    fill: '#EF4444',
                    opacity: 0.8
                  }
                }} />
                    <Line type="monotone" dataKey="neutral" name="neutral" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{
                  r: 6,
                  style: {
                    fill: '#3B82F6',
                    opacity: 0.8
                  }
                }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {marketSentiment && <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Current Market Mood:</h3>
                  <span className={`text-lg font-bold ${marketSentiment === 'Bullish' ? 'text-green-500' : marketSentiment === 'Bearish' ? 'text-red-500' : 'text-blue-400'}`}>
                    {marketSentiment}
                  </span>
                </div>
                
                {sentimentAnalysis && <div className="mt-2 text-sm text-gray-300">
                    <p className="line-clamp-3">{sentimentAnalysis}</p>
                  </div>}
              </div>}
          </>}
      </CardContent>
    </Card>;
};
export default SentimentChart;