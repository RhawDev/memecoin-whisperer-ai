
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, TrendingUp, ChevronDown, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LaunchMetrics: React.FC = () => {
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Function to generate iframe URL with anonymized auth
  const getEmbedUrl = (queryId: string) => {
    // Using publicly accessible and anonymized embeds from Dune
    switch(queryId) {
      case 'overview':
        return 'https://dune.com/embeds/3144926/5292559';
      case 'detailed':
        return 'https://dune.com/embeds/3144960/5292619';
      case 'recent':
        return 'https://dune.com/embeds/3144928/5292563';
      case 'market':
        return 'https://dune.com/embeds/3142988/5289271';
      default:
        return 'https://dune.com/embeds/3144926/5292559';
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setEmbedLoaded(false);
    setEmbedError(false);
  };

  const handleIframeError = () => {
    setEmbedError(true);
    setEmbedLoaded(true);
  };

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
          <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Stats</TabsTrigger>
              <TabsTrigger value="recent">Recent Launches</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <div className="relative h-[400px] rounded-md overflow-hidden border border-white/10 bg-black/50 mb-4">
                {!embedLoaded && !embedError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading Dune Analytics data...</p>
                    </div>
                  </div>
                )}
                
                {embedError ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-4">
                      <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Unable to load Dune Analytics data</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        This may be due to access restrictions or temporary unavailability of Dune Analytics services.
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => {
                            setEmbedError(false);
                            setEmbedLoaded(false);
                          }}
                        >
                          Try Again
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => window.open('https://dune.com/jhackworth/pumpfun', '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                          View on Dune
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe 
                    src={getEmbedUrl('overview')}
                    width="100%" 
                    height="400" 
                    className={`rounded-md ${embedLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setEmbedLoaded(true)}
                    onError={handleIframeError}
                    title="PumpFun Overview"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                )}
              </div>
              <div className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
                <span>Data powered by Dune Analytics</span>
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs text-indigo-400 hover:text-indigo-300 p-0 h-auto"
                  onClick={() => window.open('https://dune.com/jhackworth/pumpfun', '_blank')}
                >
                  View Dashboard <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="detailed" className="mt-4 space-y-6">
              <div className="relative h-[400px] rounded-md overflow-hidden border border-white/10 bg-black/50 mb-4">
                {!embedLoaded && !embedError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading Dune Analytics data...</p>
                    </div>
                  </div>
                )}
                
                {embedError ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-4">
                      <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Unable to load Dune Analytics data</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        This may be due to access restrictions or temporary unavailability of Dune Analytics services.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('https://dune.com/jhackworth/pumpfun', '_blank')}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View on Dune
                      </Button>
                    </div>
                  </div>
                ) : (
                  <iframe 
                    src={getEmbedUrl('detailed')}
                    width="100%" 
                    height="400" 
                    className={`rounded-md ${embedLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setEmbedLoaded(true)}
                    onError={handleIframeError}
                    title="PumpFun Detailed Stats"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                )}
              </div>
              <div className="text-xs text-gray-500 text-center">
                Data powered by Dune Analytics
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="mt-4 space-y-6">
              <div className="relative h-[400px] rounded-md overflow-hidden border border-white/10 bg-black/50 mb-4">
                {!embedLoaded && !embedError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading Dune Analytics data...</p>
                    </div>
                  </div>
                )}
                
                {embedError ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-4">
                      <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Unable to load Dune Analytics data</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        This may be due to access restrictions or temporary unavailability of Dune Analytics services.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('https://dune.com/jhackworth/pumpfun', '_blank')}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View on Dune
                      </Button>
                    </div>
                  </div>
                ) : (
                  <iframe 
                    src={getEmbedUrl('recent')}
                    width="100%" 
                    height="400" 
                    className={`rounded-md ${embedLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setEmbedLoaded(true)}
                    onError={handleIframeError}
                    title="PumpFun Recent Launches"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                )}
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
            {!embedLoaded && !embedError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading Dune Analytics data...</p>
                </div>
              </div>
            )}
            
            {embedError ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-4">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Unable to load Dune Analytics data</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    This may be due to access restrictions or temporary unavailability of Dune Analytics services.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://dune.com/jhackworth/pumpfun', '_blank')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View on Dune
                  </Button>
                </div>
              </div>
            ) : (
              <iframe 
                src={getEmbedUrl('market')}
                width="100%" 
                height="400" 
                className={`rounded-md ${embedLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setEmbedLoaded(true)}
                onError={handleIframeError}
                title="Market Performance"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            )}
          </div>
          <div className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
            <span>Data powered by Dune Analytics</span>
            <Button
              variant="link"
              size="sm"
              className="text-xs text-indigo-400 hover:text-indigo-300 p-0 h-auto"
              onClick={() => window.open('https://dune.com/jhackworth/pumpfun', '_blank')}
            >
              View Complete Dashboard <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaunchMetrics;
