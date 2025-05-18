
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

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

const TwitterTracking = () => {
  const [handles, setHandles] = useState<TwitterHandle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});

  const form = useForm<z.infer<typeof tweetSchema>>({
    resolver: zodResolver(tweetSchema),
    defaultValues: {
      handle: '',
    },
  });

  useEffect(() => {
    fetchHandles();
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
      toast.error('Failed to load your tracked Twitter handles');
    }
  };

  const onSubmit = async (values: z.infer<typeof tweetSchema>) => {
    try {
      setIsLoading(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error('You must be logged in to track Twitter handles');
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
          toast.error('You are already tracking this Twitter handle');
        } else {
          throw error;
        }
        return;
      }

      toast.success(`Now tracking ${values.handle}`);
      form.reset();
      fetchHandles();
    } catch (error: any) {
      console.error('Error adding Twitter handle:', error);
      toast.error('Failed to add Twitter handle');
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
      toast.success(`Stopped tracking ${handle}`);
    } catch (error: any) {
      console.error('Error removing Twitter handle:', error);
      toast.error('Failed to remove Twitter handle');
    } finally {
      setIsDeleting(prev => ({ ...prev, [id]: false }));
    }
  };

  // Mock data for recent tweets
  const recentTweets = [
    {
      handle: '@elonmusk',
      content: 'Dogecoin to the moon! 🚀 #cryptocurrency #memecoin',
      timestamp: '2 hours ago'
    },
    {
      handle: '@VitalikButerin',
      content: 'Excited about the latest ETH developments. Great things coming...',
      timestamp: '5 hours ago'
    },
    {
      handle: '@CryptoNews',
      content: 'Breaking: Major adoption news for $SOL as payment processor announces integration.',
      timestamp: '1 day ago'
    }
  ];

  return (
    <div className="space-y-6">
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
                    <span className="text-indigo-400">{handle.twitter_handle}</span>
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
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recent Crypto Tweets</CardTitle>
          <CardDescription>
            Latest updates from influential crypto figures and news sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTweets.map((tweet, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-md">
                <div className="flex justify-between">
                  <span className="font-medium text-indigo-400">{tweet.handle}</span>
                  <span className="text-xs text-gray-400">{tweet.timestamp}</span>
                </div>
                <p className="mt-2 text-sm text-gray-300">{tweet.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwitterTracking;
