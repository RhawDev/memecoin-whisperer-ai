
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from "@/components/ui/spinner";

type WalletProfile = {
  tradingStyle: string;
  personality: string;
  emoji: string;
  strengths: string[];
  weaknesses: string[];
  tips: string[];
  stats: {
    averageHoldTime: string;
    winRate: string;
    tradingVolume: string;
    riskUsage: string;
  };
};

const WalletAnalyzer = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [profile, setProfile] = useState<WalletProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Calling analyze-wallet function with address:", walletAddress);
      
      // Call our Supabase Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('analyze-wallet', {
        body: { walletAddress }
      });
      
      console.log("Function response:", data, "Error:", functionError);
      
      if (functionError) {
        throw new Error(functionError.message || 'Error analyzing wallet');
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      if (!data || !data.profile) {
        throw new Error('Invalid response from wallet analyzer');
      }
      
      setProfile(data.profile);
      setIsAnalyzed(true);
      toast.success(`Successfully analyzed wallet ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`);
      
    } catch (err: any) {
      console.error("Wallet analysis error:", err);
      setError(err.message || "Unable to analyze wallet");
      toast.error(err.message || "Unable to analyze wallet");
      setIsAnalyzed(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Wallet Analyzer</h1>
        <p className="text-gray-400">
          Enter your Solana wallet address to get a detailed analysis of your trading behavior and personalized tips.
        </p>
      </div>
      
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Enter Solana wallet address (e.g. 8xFE...a92F)"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
          <Button 
            onClick={handleAnalyze}
            disabled={isLoading || !walletAddress}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Spinner size="sm" className="mr-2" />
                <span>Analyzing...</span>
              </div>
            ) : (
              "Analyze Wallet"
            )}
          </Button>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-md">
            <p className="text-red-300">{error}</p>
            <p className="mt-2 text-sm text-gray-300">
              Try with a different wallet address or check that the address is correct.
            </p>
          </div>
        )}
      </div>
      
      {isLoading && (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mb-4 animate-pulse flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">Analyzing Wallet</h3>
          <p className="text-gray-400">
            Our AI is processing your trading history and identifying patterns...
          </p>
          <div className="flex justify-center mt-4 space-x-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse delay-200"></div>
          </div>
        </div>
      )}
      
      {isAnalyzed && profile && (
        <Tabs defaultValue="overview">
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Trading Stats</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="gradient-text text-2xl">Trading Profile</span>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-2xl">
                        {profile.emoji}
                      </div>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Based on your transaction history and trading patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold gradient-text mb-2">{profile.personality}</h3>
                      <p className="text-gray-300">{profile.tradingStyle}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">STRENGTHS</h4>
                        <ul className="space-y-2">
                          {profile.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">+</span>
                              <span className="text-gray-300">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">WEAKNESSES</h4>
                        <ul className="space-y-2">
                          {profile.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-red-500 mr-2">-</span>
                              <span className="text-gray-300">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="gradient-text-green-cyan">Stats Overview</CardTitle>
                    <CardDescription className="text-gray-400">
                      Performance metrics from your trading history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-gray-400">Hold Time</span>
                        <span className="text-white font-medium">{profile.stats.averageHoldTime}</span>
                      </li>
                      <li className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-gray-400">Win Rate</span>
                        <span className="text-white font-medium">{profile.stats.winRate}</span>
                      </li>
                      <li className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-gray-400">30d Volume</span>
                        <span className="text-white font-medium">{profile.stats.tradingVolume}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-400">Risk Level</span>
                        <span className="text-white font-medium">{profile.stats.riskUsage}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="gradient-text-pink-orange">Detailed Trading Statistics</CardTitle>
                <CardDescription className="text-gray-400">
                  In-depth analysis of your trading performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-gray-400">
                    Detailed statistics will appear here in the full implementation.
                    This would include charts and metrics about trading history.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="gradient-text-yellow-red">AI Recommendations</CardTitle>
                <CardDescription className="text-gray-400">
                  Personalized tips to improve your trading results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {profile.tips.map((tip, index) => (
                    <li key={index} className="bg-white/5 p-4 rounded-lg">
                      <div className="flex">
                        <div className="mr-4 mt-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center">
                            <span>{index + 1}</span>
                          </div>
                        </div>
                        <p className="text-gray-300">{tip}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default WalletAnalyzer;
