
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Mock data for sentiment analysis over time
const sentimentData = [
  { time: '23:00', positive: 50, negative: 20, neutral: 25 },
  { time: '00:00', positive: 45, negative: 25, neutral: 30 },
  { time: '01:00', positive: 40, negative: 22, neutral: 38 },
  { time: '02:00', positive: 60, negative: 18, neutral: 22 },
  { time: '03:00', positive: 58, negative: 20, neutral: 22 },
  { time: '04:00', positive: 70, negative: 15, neutral: 15 },
  { time: '05:00', positive: 65, negative: 18, neutral: 17 },
  { time: '06:00', positive: 45, negative: 25, neutral: 30 },
  { time: '07:00', positive: 40, negative: 30, neutral: 30 },
  { time: '08:00', positive: 45, negative: 28, neutral: 27 },
  { time: '09:00', positive: 55, negative: 25, neutral: 20 },
  { time: '10:00', positive: 60, negative: 20, neutral: 20 },
  { time: '11:00', positive: 58, negative: 22, neutral: 20 },
  { time: '12:00', positive: 65, negative: 18, neutral: 17 },
  { time: '13:00', positive: 60, negative: 20, neutral: 20 },
  { time: '14:00', positive: 55, negative: 25, neutral: 20 },
  { time: '15:00', positive: 50, negative: 28, neutral: 22 },
  { time: '16:00', positive: 55, negative: 25, neutral: 20 },
  { time: '17:00', positive: 65, negative: 18, neutral: 17 },
  { time: '18:00', positive: 60, negative: 20, neutral: 20 },
  { time: '19:00', positive: 70, negative: 15, neutral: 15 },
  { time: '20:00', positive: 68, negative: 17, neutral: 15 },
  { time: '21:00', positive: 65, negative: 18, neutral: 17 },
  { time: '22:00', positive: 60, negative: 20, neutral: 20 }
];

interface SentimentChartProps {
  tokenName: string;
  tokenTicker: string;
  change: string;
}

const SentimentChart: React.FC<SentimentChartProps> = ({ tokenName, tokenTicker, change }) => {
  const isPositiveChange = change.startsWith('+');
  
  return (
    <Card className="glass-card w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold flex items-center">
            {tokenName} Sentiment
          </CardTitle>
          <p className="text-sm text-gray-400 mt-1">
            {tokenTicker} sentiment analysis over past 24 hours
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${isPositiveChange ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
          {change}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-64">
          <ChartContainer
            config={{
              positive: { color: '#10B981', label: 'Positive' },
              negative: { color: '#EF4444', label: 'Negative' },
              neutral: { color: '#3B82F6', label: 'Neutral' }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
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
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelKey="time"
                      formatter={(value, name) => [`${value}%`, name]}
                    />
                  }
                />
                <Line 
                  type="monotone" 
                  dataKey="positive" 
                  name="positive"
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, style: { fill: '#10B981', opacity: 0.8 } }}
                />
                <Line 
                  type="monotone" 
                  dataKey="negative" 
                  name="negative"
                  stroke="#EF4444" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, style: { fill: '#EF4444', opacity: 0.8 } }}
                />
                <Line 
                  type="monotone" 
                  dataKey="neutral" 
                  name="neutral"
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, style: { fill: '#3B82F6', opacity: 0.8 } }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentChart;
