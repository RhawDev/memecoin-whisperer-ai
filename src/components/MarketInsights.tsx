
import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const mockTokenDataMap = {
  '1h': [
    { name: '1H', tokens: 4 },
  ],
  '4h': [
    { name: '1H', tokens: 4 },
    { name: '4H', tokens: 12 },
  ],
  '12h': [
    { name: '1H', tokens: 4 },
    { name: '4H', tokens: 12 },
    { name: '12H', tokens: 18 },
  ],
  '24h': [
    { name: '1H', tokens: 4 },
    { name: '4H', tokens: 12 },
    { name: '12H', tokens: 18 },
    { name: '24H', tokens: 24 },
  ],
  '7d': [
    { name: '1H', tokens: 4 },
    { name: '4H', tokens: 12 },
    { name: '12H', tokens: 18 },
    { name: '24H', tokens: 24 },
    { name: '7D', tokens: 65 },
  ],
  '30d': [
    { name: '1H', tokens: 4 },
    { name: '4H', tokens: 12 },
    { name: '12H', tokens: 18 },
    { name: '24H', tokens: 24 },
    { name: '7D', tokens: 65 },
    { name: '30D', tokens: 120 },
  ],
};

const COLORS = ['#8B5CF6', '#EF4444'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-md p-3 rounded-md border border-white/10 text-sm">
        <p className="text-white">{`${label}: ${payload[0].value} tokens`}</p>
      </div>
    );
  }
  return null;
};

const PieCustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-md p-3 rounded-md border border-white/10 text-sm">
        <p className="text-white">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const trendingTokens = [
  { name: "$DEGEN", mentions: 4862, change: "+12.5%" },
  { name: "$BONK", mentions: 3241, change: "-2.3%" },
  { name: "$WIF", mentions: 2983, change: "+7.8%" },
  { name: "$MEME", mentions: 2571, change: "+22.4%" },
];

const timeRangeOptions = [
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '12h', label: '12 Hours' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
];

const MarketInsights = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const tokensRef = useRef<HTMLDivElement>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [chartData, setChartData] = useState(mockTokenDataMap['24h']);
  const [marketSentiment, setMarketSentiment] = useState<string | null>(null);
  const [sentimentData, setSentimentData] = useState([
    { name: 'Bullish', value: 65 },
    { name: 'Bearish', value: 35 },
  ]);
  const [marketAnalysis, setMarketAnalysis] = useState<string | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setChartData(mockTokenDataMap[timeRange as keyof typeof mockTokenDataMap] || mockTokenDataMap['24h']);
    // Fetch new market analysis when timeframe changes
    fetchMarketAnalysis(timeRange);
  }, [timeRange]);

  const fetchMarketAnalysis = async (timeframe: string) => {
    setIsLoadingAnalysis(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-market', {
        body: { 
          timeframe,
          queryType: 'marketSentiment'
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setMarketAnalysis(data.analysis);
      setMarketSentiment(data.sentiment);
      
      // Update sentiment pie chart
      if (data.sentiment === 'Bullish') {
        const bullishValue = Math.min(Math.floor(Math.random() * 30) + 55, 90); // 55-85%
        setSentimentData([
          { name: 'Bullish', value: bullishValue },
          { name: 'Bearish', value: 100 - bullishValue }
        ]);
      } else if (data.sentiment === 'Bearish') {
        const bearishValue = Math.min(Math.floor(Math.random() * 30) + 55, 90); // 55-85%
        setSentimentData([
          { name: 'Bullish', value: 100 - bearishValue },
          { name: 'Bearish', value: bearishValue }
        ]);
      } else {
        // Neutral
        setSentimentData([
          { name: 'Bullish', value: 50 },
          { name: 'Bearish', value: 50 }
        ]);
      }
      
    } catch (error) {
      console.error("Market analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to analyze market",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  useEffect(() => {
    // Fetch initial market analysis
    fetchMarketAnalysis(timeRange);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      }, 
      { threshold: 0.1 }
    );

    const elements = [sectionRef.current, chartRef.current, tokensRef.current];
    elements.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      elements.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section id="market-insights" className="py-24">
      <div className="container mx-auto px-4">
        <div ref={sectionRef} className="reveal text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text-green-cyan">
            Pump & Raydium Market Insights
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Real-time data on meme token launches and market sentiment to guide your trading decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div ref={chartRef} className="reveal lg:col-span-2 glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">New Token Launches</h3>
              <Select 
                value={timeRange} 
                onValueChange={value => setTimeRange(value)}
              >
                <SelectTrigger className="w-[180px] bg-black/50 border-gray-700">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-gray-700">
                  {timeRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="tokens" 
                    fill="url(#barGradient)" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {marketAnalysis && (
              <Card className="mt-6 bg-black/30 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center">
                    <span className="mr-2">🧠</span> AI Market Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingAnalysis ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full bg-gray-700" />
                      <Skeleton className="h-4 w-[90%] bg-gray-700" />
                      <Skeleton className="h-4 w-[80%] bg-gray-700" />
                    </div>
                  ) : (
                    <div className="text-gray-300 text-sm">
                      {marketAnalysis}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Current Market Mood</h3>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieCustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm mb-1">CURRENT MEME MARKET MOOD</p>
              <div className={`bg-gradient-to-r ${
                marketSentiment === 'Bullish' 
                  ? 'from-green-500 to-blue-500' 
                  : marketSentiment === 'Bearish'
                    ? 'from-red-500 to-orange-500'
                    : 'from-indigo-500 to-purple-500'
              } bg-clip-text text-transparent text-2xl font-bold`}>
                {isLoadingAnalysis ? (
                  <Skeleton className="h-8 w-24 bg-gray-700 mx-auto" />
                ) : (
                  marketSentiment || "Analyzing..."
                )}
              </div>
            </div>
            
            <Button 
              onClick={() => fetchMarketAnalysis(timeRange)}
              disabled={isLoadingAnalysis}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              {isLoadingAnalysis ? "Analyzing..." : "Refresh Analysis"}
            </Button>
          </div>
        </div>

        <div ref={tokensRef} className="reveal mt-8">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6 text-white">Trending Tokens by Tweet Volume</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-3 text-gray-400">Token</th>
                    <th className="pb-3 text-gray-400">Social Mentions</th>
                    <th className="pb-3 text-gray-400">24h Change</th>
                  </tr>
                </thead>
                <tbody>
                  {trendingTokens.map((token, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 font-medium text-white">{token.name}</td>
                      <td className="py-4 text-gray-300">{token.mentions.toLocaleString()}</td>
                      <td className={`py-4 ${token.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {token.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketInsights;
