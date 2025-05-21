
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment variables
const TWITTER_BEARER_TOKEN = Deno.env.get("TWITTER_BEARER_TOKEN")?.trim();
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")?.trim();
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")?.trim();

interface TweetData {
  id: string;
  text: string;
  created_at: string;
  username?: string;
  likes?: number;
  retweets?: number;
  url?: string;
}

interface TwitterApiRequest {
  action: string;
  query?: string;
  count?: number;
  maxId?: string; 
  usernames?: string[];
}

// Initialize Supabase Client
const supabaseClient = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '');

async function fetchTwitterData(
  endpoint: string,
  params: Record<string, string> = {},
  method: string = "GET",
  body: any = null
): Promise<any> {
  if (!TWITTER_BEARER_TOKEN) {
    throw new Error("Twitter Bearer Token not configured");
  }
  
  // Construct URL with params
  const url = new URL(`https://api.twitter.com/2/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  console.log(`Fetching Twitter API: ${method} ${url.toString()}`);
  
  const options: RequestInit = {
    method,
    headers: {
      "Authorization": `Bearer ${TWITTER_BEARER_TOKEN}`,
      "Content-Type": "application/json",
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url.toString(), options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Twitter API error (${response.status}): ${errorText}`);
      throw new Error(`Twitter API returned status ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Twitter API request failed:", error);
    throw error;
  }
}

async function searchRecentTweets(query: string, count: number = 10, maxId?: string): Promise<TweetData[]> {
  // Twitter API v2 recent search endpoint
  const params: Record<string, string> = {
    "query": query,
    "max_results": count.toString(),
    "tweet.fields": "created_at,public_metrics",
    "expansions": "author_id",
    "user.fields": "username",
  };
  
  if (maxId) {
    params.until_id = maxId;
  }
  
  const data = await fetchTwitterData("tweets/search/recent", params);
  
  if (!data.data || !Array.isArray(data.data)) {
    throw new Error("Invalid response from Twitter API");
  }
  
  // Create a map of user IDs to usernames
  const userMap = new Map();
  if (data.includes?.users) {
    data.includes.users.forEach((user: any) => {
      userMap.set(user.id, user.username);
    });
  }
  
  // Format the tweets with necessary data
  return data.data.map((tweet: any) => {
    const username = userMap.get(tweet.author_id);
    
    return {
      id: tweet.id,
      text: tweet.text,
      created_at: tweet.created_at,
      username,
      likes: tweet.public_metrics?.like_count || 0,
      retweets: tweet.public_metrics?.retweet_count || 0,
      url: username ? `https://twitter.com/${username}/status/${tweet.id}` : undefined
    };
  });
}

async function getUserTweets(username: string, count: number = 10): Promise<TweetData[]> {
  // First get user ID by username
  const userResponse = await fetchTwitterData(`users/by/username/${username}`, {
    "user.fields": "description" // minimal fields needed
  });
  
  if (!userResponse.data?.id) {
    throw new Error(`User ${username} not found`);
  }
  
  const userId = userResponse.data.id;
  
  // Then get tweets by user ID
  const params: Record<string, string> = {
    "max_results": count.toString(),
    "tweet.fields": "created_at,public_metrics",
    "exclude": "retweets,replies"
  };
  
  const data = await fetchTwitterData(`users/${userId}/tweets`, params);
  
  if (!data.data || !Array.isArray(data.data)) {
    throw new Error("Invalid response from Twitter API");
  }
  
  // Format the tweets
  return data.data.map((tweet: any) => ({
    id: tweet.id,
    text: tweet.text,
    created_at: tweet.created_at,
    username,
    likes: tweet.public_metrics?.like_count || 0,
    retweets: tweet.public_metrics?.retweet_count || 0,
    url: `https://twitter.com/${username}/status/${tweet.id}`
  }));
}

async function getMultipleUsersTweets(usernames: string[], count: number = 5): Promise<TweetData[]> {
  try {
    // Get tweets for each user
    const tweetsPromises = usernames.map(username => getUserTweets(username, count));
    const tweetArrays = await Promise.allSettled(tweetsPromises);
    
    // Combine and filter successful results
    const allTweets: TweetData[] = [];
    
    tweetArrays.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allTweets.push(...result.value);
      } else {
        console.error(`Failed to fetch tweets for ${usernames[index]}:`, result.reason);
      }
    });
    
    // Sort by date (newest first)
    return allTweets.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, count * 2); // Return a reasonable number of combined tweets
  } catch (error) {
    console.error("Error fetching multiple users tweets:", error);
    throw error;
  }
}

// Generate realistic fallback data when API fails
function generateFallbackTweets(count: number = 10): TweetData[] {
  const now = new Date();
  
  // Define popular crypto influencers
  const influencers = [
    { username: 'elonmusk', name: 'Elon Musk' },
    { username: 'VitalikButerin', name: 'Vitalik Buterin' },
    { username: 'SBF_FTX', name: 'SBF' },
    { username: 'cz_binance', name: 'CZ Binance' },
    { username: 'solana', name: 'Solana' },
    { username: 'tarekroussian', name: 'Tarek' },
    { username: 'cryptopunksbot', name: 'Crypto Punks' },
    { username: 'punk6529', name: '6529' },
    { username: 'cobie', name: 'Cobie' }
  ];
  
  // Define realistic tweet content templates
  const tweetTemplates = [
    "The future of {coin} looks very promising with the recent developments in {tech}. #Crypto #Blockchain",
    "Just bought more {coin}! The technical indicators are showing a potential breakout soon. 📈",
    "Market is {sentiment} today. Keep an eye on {coin}, it's showing interesting movement.",
    "{coin} integration with {tech} could be a game changer for the ecosystem. Thoughts?",
    "The {coin} community is one of the strongest in crypto. Building through the bear market! 💪",
    "My analysis on {coin} price action: we might see resistance at {price}, but support is holding strong.",
    "New {tech} update coming to {coin} next month. This could significantly improve scalability.",
    "Comparing {coin} and {otherCoin}: which one has better tokenomics for the long term?",
    "Whale alert: Large {coin} transaction spotted on-chain. Something brewing? 👀",
    "{coin} volume is up {percent}% in the last 24h. The market is noticing something.",
    "Just read the {coin} whitepaper again. Still bullish on their approach to {tech}."
  ];
  
  // Popular coins and tech terms to populate templates
  const coins = ['SOL', 'ETH', 'BTC', 'BONK', 'WIF', 'JUP', 'RNDR', 'JTO', 'PYTH'];
  const tech = ['L2 scaling', 'ZK rollups', 'DePIN', 'RWA tokenization', 'DeFi', 'NFT marketplace', 'cross-chain bridge'];
  const sentiment = ['bullish', 'bearish', 'volatile', 'consolidating', 'uncertain'];
  const prices = ['$5k', '$45k', '$69k', '$420', '$1k', '$100k', '$30k'];
  const percentages = ['15', '30', '50', '75', '100', '200'];
  const otherCoins = ['LINK', 'XRP', 'ADA', 'AVAX', 'DOT'];
  
  // Generate random tweets
  const tweets: TweetData[] = [];
  
  for (let i = 0; i < count; i++) {
    const influencer = influencers[Math.floor(Math.random() * influencers.length)];
    const template = tweetTemplates[Math.floor(Math.random() * tweetTemplates.length)];
    const coin = coins[Math.floor(Math.random() * coins.length)];
    const otherCoin = otherCoins[Math.floor(Math.random() * otherCoins.length)];
    const techItem = tech[Math.floor(Math.random() * tech.length)];
    const marketSentiment = sentiment[Math.floor(Math.random() * sentiment.length)];
    const price = prices[Math.floor(Math.random() * prices.length)];
    const percent = percentages[Math.floor(Math.random() * percentages.length)];
    
    const tweetText = template
      .replace('{coin}', coin)
      .replace('{otherCoin}', otherCoin)
      .replace('{tech}', techItem)
      .replace('{sentiment}', marketSentiment)
      .replace('{price}', price)
      .replace('{percent}', percent);
    
    // Create a random date within last 24 hours
    const tweetDate = new Date(now);
    tweetDate.setMinutes(tweetDate.getMinutes() - Math.random() * 1440); // Random time in last 24h
    
    // Generate random engagement metrics
    const likes = Math.floor(Math.random() * 10000);
    const retweets = Math.floor(likes * (0.1 + Math.random() * 0.3)); // 10-40% of likes
    
    // Generate a random tweet ID that looks authentic
    const tweetId = Math.floor(1500000000000000000 + Math.random() * 100000000000).toString();
    
    tweets.push({
      id: tweetId,
      text: tweetText,
      created_at: tweetDate.toISOString(),
      username: influencer.username,
      likes,
      retweets,
      url: `https://twitter.com/${influencer.username}/status/${tweetId}`
    });
  }
  
  // Sort by date (newest first)
  return tweets.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Parse the request body
    const { action, query, count = 10, maxId, usernames } = await req.json() as TwitterApiRequest;
    console.log(`Twitter API request: ${action}`, { query, count, maxId, usernames });

    // Process based on the requested action
    let result: any;
    let usingFallbackData = false;
    const requestCount = Math.min(count, 25); // Limit to reasonable count

    try {
      switch (action) {
        case 'searchTweets':
          if (!query) {
            throw new Error("Query parameter is required for searching tweets");
          }
          result = await searchRecentTweets(query, requestCount, maxId);
          break;

        case 'getUserTweets':
          if (!query) {
            throw new Error("Twitter username is required");
          }
          result = await getUserTweets(query, requestCount);
          break;

        case 'getRecentTweets':
          // Try to fetch tweets from crypto influencers or use query if provided
          if (Array.isArray(usernames) && usernames.length > 0) {
            result = await getMultipleUsersTweets(usernames, Math.ceil(requestCount / usernames.length));
          } else if (query) {
            result = await searchRecentTweets(query, requestCount, maxId);
          } else {
            // Default crypto search if no specific users or query
            result = await searchRecentTweets("crypto OR solana OR bitcoin OR ethereum", requestCount, maxId);
          }
          break;

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (apiError) {
      console.warn("Twitter API error, using fallback data:", apiError);
      result = generateFallbackTweets(requestCount);
      usingFallbackData = true;
    }

    // Return the tweets with indication if fallback data was used
    return new Response(JSON.stringify({ 
      tweets: result,
      usingFallbackData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Error processing Twitter API request:", error);
    
    // Generate fallback data when other errors occur
    const fallbackTweets = generateFallbackTweets(10);
    
    return new Response(JSON.stringify({
      tweets: fallbackTweets,
      error: error.message || "Unknown error occurred",
      usingFallbackData: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 // Return 200 with error message and fallback data
    });
  }
});
