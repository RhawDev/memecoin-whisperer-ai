
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type DailyTradeStat = {
  date: string;
  trades: number;
  volume: string | number;
  profitLoss: string | number;
  tokens: number;
};

type TokenHolding = {
  symbol: string;
  name?: string;
  amount: string | number;
  usdValue?: string | number;
};

type TransactionData = {
  type: string;
  token: string;
  amount: string | number;
  timestamp: string;
  status: string;
  fee?: string;
};

type DetailedStatsProps = {
  dailyTradeStats?: DailyTradeStat[];
  tokenHoldings?: TokenHolding[];
  recentTransactions?: TransactionData[];
  riskMetrics?: {
    riskScore: number;
    diversificationLevel: string;
    largestPosition: string;
    volatilityExposure: string;
  };
  tradingBehavior?: {
    buyFrequency: string;
    avgTransactionSize: string;
    preferredTokenTypes: string;
    timeOfDayPattern: string;
  };
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

const WalletDetailedStats: React.FC<DetailedStatsProps> = ({
  dailyTradeStats = [],
  tokenHoldings = [],
  recentTransactions = [],
  riskMetrics,
  tradingBehavior
}) => {
  
  // Prepare data for charts
  const formattedTradeStats = dailyTradeStats.map(stat => ({
    ...stat,
    volume: typeof stat.volume === 'string' ? parseFloat(stat.volume) : stat.volume,
    profitLoss: typeof stat.profitLoss === 'string' ? parseFloat(stat.profitLoss) : stat.profitLoss
  }));
  
  // Calculate portfolio distribution data for pie chart
  const portfolioData = tokenHoldings.map(token => ({
    name: token.symbol,
    value: typeof token.usdValue === 'string' ? parseFloat(token.usdValue) : Number(token.usdValue) || 0
  })).sort((a, b) => b.value - a.value);
  
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {dailyTradeStats.length > 0 && (
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="gradient-text-green-cyan">Trading Activity</CardTitle>
            <CardDescription className="text-gray-400">
              Daily trading volume and transaction counts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formattedTradeStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#999' }} 
                    tickFormatter={formatDate}
                  />
                  <YAxis yAxisId="left" orientation="left" tick={{ fill: '#999' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#999' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#999' }}
                  />
                  <Bar yAxisId="left" dataKey="volume" name="Volume (SOL)" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="trades" name="Trades" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
      
      {portfolioData.length > 0 && (
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="gradient-text-pink-orange">Portfolio Distribution</CardTitle>
            <CardDescription className="text-gray-400">
              Current allocation across different tokens
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Value']}
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <ul className="space-y-2">
                {portfolioData.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="text-white">{item.name}</span>
                    </div>
                    <span className="text-gray-300">${typeof item.value === 'number' ? item.value.toFixed(2) : item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
      
      {riskMetrics && (
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="gradient-text-yellow-red">Risk Analysis</CardTitle>
            <CardDescription className="text-gray-400">
              Metrics related to your trading risk profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Risk Score</div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        riskMetrics.riskScore < 30 ? 'bg-green-500' :
                        riskMetrics.riskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${riskMetrics.riskScore}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">{riskMetrics.riskScore}/100</span>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Diversification</div>
                <div className="text-lg font-medium">{riskMetrics.diversificationLevel}</div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Largest Position</div>
                <div className="text-lg font-medium">{riskMetrics.largestPosition}</div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Volatility Exposure</div>
                <div className="text-lg font-medium">{riskMetrics.volatilityExposure}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {tradingBehavior && (
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="gradient-text-blue-purple">Trading Behavior</CardTitle>
            <CardDescription className="text-gray-400">
              Patterns observed in your trading activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Buy Frequency</div>
                <div className="text-lg font-medium">{tradingBehavior.buyFrequency}</div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Avg Transaction Size</div>
                <div className="text-lg font-medium">{tradingBehavior.avgTransactionSize}</div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Preferred Token Types</div>
                <div className="text-lg font-medium">{tradingBehavior.preferredTokenTypes}</div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Activity Pattern</div>
                <div className="text-lg font-medium">{tradingBehavior.timeOfDayPattern}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {recentTransactions.length > 0 && (
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="gradient-text-green-blue">Recent Transactions</CardTitle>
            <CardDescription className="text-gray-400">
              Latest transactions from this wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Token</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-right">Time</th>
                    <th className="px-4 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx, index) => {
                    const txDate = new Date(tx.timestamp);
                    const formattedDate = txDate.toLocaleDateString();
                    const formattedTime = txDate.toLocaleTimeString();
                    
                    return (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            tx.type === 'Receive' ? 'bg-green-500/20 text-green-300' :
                            tx.type === 'Send' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-white">{tx.token}</td>
                        <td className="px-4 py-3 text-right">{tx.amount}</td>
                        <td className="px-4 py-3 text-right text-gray-400">
                          <div>{formattedDate}</div>
                          <div className="text-xs">{formattedTime}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            tx.status === 'Success' ? 'bg-green-500' :
                            tx.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WalletDetailedStats;
