
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket } from 'lucide-react';

interface LaunchMetricsProps {
  tokenCount: number;
  weekChange: string;
}

const LaunchMetrics: React.FC<LaunchMetricsProps> = ({ tokenCount, weekChange }) => {
  const isPositiveChange = weekChange.startsWith('+');
  
  return (
    <Card className="glass-card bg-gradient-to-br from-blue-900/30 to-blue-800/20">
      <CardContent className="p-6">
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
      </CardContent>
    </Card>
  );
};

export default LaunchMetrics;
