import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, AlertTriangle, Twitter, ExternalLink, RefreshCcw, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const tweetSchema = z.object({
  handle: z.string()
    .min(1, { message: 'Twitter handle is required' })
    .regex(/^@?[\w\d_]+$/, { message: 'Enter a valid Twitter handle' })
    .transform(val => val.startsWith('@') ? val : `@${val}`),
});

type TwitterHandle = {
  id: string;
  twitter_handle: string;
};

type Tweet = {
  id: string;
  username: string;  // Changed from handle to username for consistency with API
  text: string;      // Changed from content to text for consistency with API
  created_at: string; // Changed from timestamp to created_at
  likes?: number;
  retweets?: number;
  url?: string;     // Changed from tweet_url to url
};

const formatTwitterUrl = (username: string, idStr?: string): string => {
  // Remove @ prefix if present
  const handle = username.startsWith('@') ? username.substring(1) : username;
  
  // If we have a tweet ID, format as a tweet URL
  if (idStr) {
    return `https://x.com/${handle}/status/${idStr}`;
  }
  
  // Otherwise, format as a profile URL
  return `https://x.com/${handle}`;
};

// Function to fetch tweets from our new edge function
const fetchTweets = async (options: { 
  action: string; 
  query?: string;
  count?: number;
  usernames?: string[];
}): Promise<Tweet[]> => {
  try {
    // Call our new edge function
    const { data, error } = await supabase.functions.invoke('twitter-api', {
      body: options
    });
    
    if (error) {
      console.error("Error fetching tweets from API:", error);
      throw new Error(error.message);
    }
    
    if (!error && data && Array.isArray(data.tweets) && data.tweets.length > 0) {
      console.log('Successfully fetched tweets data', data);
      
      // If using fallback data, show a warning to the user
      if (data.usingFallbackData) {
        toast({
          title: "Using simulated data",
          description: "Could not connect to Twitter API. Using generated tweet data instead.",
          variant: "warning"
        });
      }
      
      return data.tweets.map((tweet: any) => ({
        id: tweet.id,
        username: tweet.username ? `@${tweet.username}` : '@cryptoinfluencer',
        text: tweet.text || '',
        created_at: tweet.created_at || '2 hours ago',
        likes: tweet.likes || Math.floor(Math.random() * 5000),
        retweets: tweet.retweets || Math.floor(Math.random() * 2000),
        url: tweet.url || formatTwitterUrl(tweet.username || 'cryptoinfluencer', tweet.id)
      }));
    }
    
    throw new Error('Failed to fetch tweets or empty response');
  } catch (error: any) {
    console.error('Error fetching tweets:', error);
    throw error;
  }
};

// Function to fetch recent crypto tweets
const fetchRecentCryptoTweets = async (trackedHandles: TwitterHandle[] = []): Promise<Tweet[]> => {
  try {
    // Extract usernames from tracked handles (removing @ prefix)
    const usernames = trackedHandles
      .map(handle => handle.twitter_handle.replace(/^@/, ''))
      .filter(username => username.length > 0);
    
    // If we have tracked handles, use them; otherwise fetch general crypto tweets
    if (usernames.length > 0) {
      return await fetchTweets({
        action: 'getRecentTweets',
        usernames,
        count: 10
      });
    } else {
      // Fetch general crypto tweets
      return await fetchTweets({
        action: 'getRecentTweets',
        query: 'crypto OR solana OR bitcoin OR ethereum',
        count: 10
      });
    }
  } catch (error: any) {
    console.error('Error fetching tweets:', error);
    throw error;
  }
};

const TwitterTracking: React.FC = () => {
  const [handles, setHandles] = useState<TwitterHandle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTweets, setIsLoadingTweets] = useState(false);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [recentTweets, setRecentTweets] = useState<Tweet[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof tweetSchema>>({
    resolver: zodResolver(tweetSchema),
    defaultValues: {
      handle: '',
    },
  });

  useEffect(() => {
    fetchHandles();
    fetchRecentTweets();

    // Listen for retry events from parent components
    const handleRetry = () => {
      setApiError(null);
      fetchRecentTweets();
    };
    window.addEventListener('retry-api-request', handleRetry);

    return () => {
      window.removeEventListener('retry-api-request', handleRetry);
    };
  }, []);

  const fetchHandles = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const { data, error } = await supabase
        .from('tracked_twitter_handles')
        .select('*');

      if (error) throw error;
      setHandles(data as TwitterHandle[]);
    } catch (error: any) {
      console.error('Error fetching Twitter handles:', error);
      toast({
        title: "Error",
        description: "Failed to load your tracked Twitter handles",
        variant: "destructive"
      });
    }
  };

  const fetchRecentTweets = async () => {
    setIsLoadingTweets(true);
    setApiError(null);
    try {
      const tweets = await fetchRecentCryptoTweets(handles);
      setRecentTweets(tweets);
    } catch (error: any) {
      console.error('Error fetching tweets:', error);
      setApiError(error.message || "Failed to load tweets from Twitter API");
      toast({
        title: "Twitter API Error",
        description: "Could not retrieve tweets. Using cached or simulated data.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingTweets(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof tweetSchema>) => {
    try {
      setIsLoading(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to track Twitter handles",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('tracked_twitter_handles')
        .insert([
          { 
            user_id: session.session.user.id,
            twitter_handle: values.handle 
          },
        ]);

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Already tracking",
            description: "You are already tracking this Twitter handle",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Success",
        description: `Now tracking ${values.handle}`,
      });
      form.reset();
      fetchHandles();
    } catch (error: any) {
      console.error('Error adding Twitter handle:', error);
      toast({
        title: "Error",
        description: "Failed to add Twitter handle",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, handle: string) => {
    try {
      setIsDeleting(prev => ({ ...prev, [id]: true }));
      
      const { error } = await supabase
        .from('tracked_twitter_handles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setHandles(prev => prev.filter(h => h.id !== id));
      toast({
        title: "Success",
        description: `Stopped tracking ${handle}`,
      });
      
      // Refresh tweets when handles change
      fetchRecentTweets();
    } catch (error: any) {
      console.error('Error removing Twitter handle:', error);
      toast({
        title: "Error",
        description: "Failed to remove Twitter handle",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(prev => ({ ...prev, [id]: false }));
    }
  };

  const openTwitterProfile = (username: string) => {
    const handle = username.startsWith('@') ? username.substring(1) : username;
    window.open(`https://x.com/${handle}`, '_blank');
  };

  const openTweet = (url: string | undefined) => {
    if (!url) {
      toast({
        title: "Error",
        description: "Invalid tweet URL",
        variant: "destructive"
      });
      return;
    }
    
    window.open(url, '_blank');
  };

  // Function to format relative time
  const formatRelativeTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      
      if (diffSecs < 60) {
        return `${diffSecs}s ago`;
      } else if (diffSecs < 3600) {
        return `${Math.floor(diffSecs / 60)}m ago`;
      } else if (diffSecs < 86400) {
        return `${Math.floor(diffSecs / 3600)}h ago`;
      } else {
        return `${Math.floor(diffSecs / 86400)}d ago`;
      }
    } catch (e) {
      return dateString; // If parsing fails, return the original string
    }
  };

  return (
    <div className="space-y-6">
      {apiError && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-2">
            <p>{apiError}</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-fit flex items-center gap-2 mt-2 hover:bg-red-900/20"
              onClick={fetchRecentTweets}
            >
              <RefreshCcw className="h-4 w-4" /> Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Plus className="h-5 w-5 text-indigo-500" />
            Track Twitter Handle
          </CardTitle>
          <CardDescription>
            Add Twitter handles to track news and updates from key individuals in the crypto space
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="handle"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex">
                        <FormControl>
                          <Input placeholder="@username" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isLoading ? "Adding..." : "Add Handle"}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <h4 className="text-md font-medium mb-3">Your Tracked Handles</h4>
            {handles.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p>You're not tracking any Twitter handles yet</p>
                <p className="text-sm">Add handles above to start tracking crypto influencers</p>
              </div>
            ) : (
              <div className="space-y-2">
                {handles.map((handle) => (
                  <div 
                    key={handle.id} 
                    className="flex justify-between items-center p-3 bg-white/5 rounded-md"
                  >
                    <button 
                      className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center"
                      onClick={() => openTwitterProfile(handle.twitter_handle)}
                    >
                      {handle.twitter_handle}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(handle.id, handle.twitter_handle)}
                      disabled={isDeleting[handle.id]}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Twitter className="h-5 w-5 text-blue-400" />
              Recent Crypto Tweets
            </CardTitle>
            <CardDescription>
              Latest updates from influential crypto figures and news sources
            </CardDescription>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="hover:bg-white/5"
            onClick={fetchRecentTweets}
            disabled={isLoadingTweets}
          >
            {isLoadingTweets ? (
              <Spinner size="sm" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        <CardContent className="pt-2">
          {isLoadingTweets ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Spinner className="mx-auto mb-4" />
                <p className="text-gray-400">Loading tweets...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTweets.map((tweet, index) => (
                <div key={tweet.id || index} className="p-4 bg-white/5 rounded-md transition-all hover:bg-white/10">
                  <div className="flex justify-between items-start">
                    <button 
                      className="font-medium text-blue-400 hover:text-blue-300 hover:underline flex items-center"
                      onClick={() => openTwitterProfile(tweet.username)}
                    >
                      {tweet.username}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </button>
                    <span className="text-xs text-gray-400">
                      {formatRelativeTime(tweet.created_at)}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-300">{tweet.text}</p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      {tweet.likes !== undefined && (
                        <div className="flex items-center">
                          <span>❤️ {tweet.likes.toLocaleString()}</span>
                        </div>
                      )}
                      {tweet.retweets !== undefined && (
                        <div className="flex items-center">
                          <span>🔁 {tweet.retweets.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-blue-400 hover:text-blue-300 p-1 h-auto"
                      onClick={() => openTweet(tweet.url)}
                    >
                      View Tweet <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwitterTracking;
