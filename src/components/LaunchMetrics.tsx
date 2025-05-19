
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, TrendingUp, ChevronDown } from 'lucide-react';

const LaunchMetrics: React.FC = () => {
  const [embedLoaded, setEmbedLoaded] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Rocket className="h-5 w-5 text-indigo-500" />
            PumpFun Launch Metrics
          </CardTitle>
          <CardDescription>
            Real-time data on token launches and performance on PumpFun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <div className="relative h-[400px] rounded-md overflow-hidden border border-white/10 bg-black/50 mb-4">
                {!embedLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading Dune Analytics data...</p>
                    </div>
                  </div>
                )}
                <iframe 
                  src="https://dune.com/embeds/3357226/5623323" 
                  width="100%" 
                  height="400" 
                  className={`rounded-md ${embedLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setEmbedLoaded(true)}
                  title="PumpFun Overview"
                />
              </div>
              <div className="text-xs text-gray-500 text-center">
                Data powered by Dune Analytics
              </div>
            </TabsContent>
            
            <TabsContent value="detailed" className="mt-4 space-y-6">
              <div className="relative h-[400px] rounded-md overflow-hidden border border-white/10 bg-black/50 mb-4">
                {!embedLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading Dune Analytics data...</p>
                    </div>
                  </div>
                )}
                <iframe 
                  src="https://dune.com/embeds/3357226/5623344" 
                  width="100%" 
                  height="400" 
                  className={`rounded-md ${embedLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setEmbedLoaded(true)}
                  title="PumpFun Detailed Stats"
                />
              </div>
              <div className="text-xs text-gray-500 text-center">
                Data powered by Dune Analytics
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-pink-500" />
            Market Performance
          </CardTitle>
          <CardDescription>
            Success rates and liquidity metrics for recent launches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-[400px] rounded-md overflow-hidden border border-white/10 bg-black/50 mb-4">
            {!embedLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading Dune Analytics data...</p>
                </div>
              </div>
            )}
            <iframe 
              src="https://dune.com/embeds/3142988/5289271" 
              width="100%" 
              height="400" 
              className={`rounded-md ${embedLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setEmbedLoaded(true)}
              title="Market Performance"
            />
          </div>
          <div className="text-xs text-gray-500 text-center">
            Data powered by Dune Analytics
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaunchMetrics;
