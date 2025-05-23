
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";
import { TwitterApi } from "https://esm.sh/twitter-api-v2@1.15.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const TWITTER_CONSUMER_KEY = Deno.env.get("TWITTER_CONSUMER_KEY");
const TWITTER_CONSUMER_SECRET = Deno.env.get("TWITTER_CONSUMER_SECRET");
const TWITTER_ACCESS_TOKEN = Deno.env.get("TWITTER_ACCESS_TOKEN");
const TWITTER_ACCESS_TOKEN_SECRET = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET");
const BIRDEYE_API_KEY = Deno.env.get("BIRDEYE_API_KEY") || "Test";

// Define today's date for context
const today = new Date();
const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

// Cache for API responses to minimize repeated calls
const apiCache = new Map();
const CACHE_TTL = 300000; // 5 minutes in milliseconds

interface Message {
  role: string;
  content: string;
}

async function fetchSolanaTokenData() {
  const cacheKey = 'solana_token_data';
  
  // Check if we have cached data that's not expired
  if (apiCache.has(cacheKey)) {
    const cachedData = apiCache.get(cacheKey);
    if (cachedData.timestamp > Date.now() - CACHE_TTL) {
      console.log("Using cached Solana token data");
      return cachedData.data;
    }
  }
  
  try {
    console.log("Fetching fresh Solana token data from Birdeye API");
    const response = await fetch('https://public-api.birdeye.so/public/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=50&chain=solana', {
      headers: {
        'X-API-KEY': BIRDEYE_API_KEY,
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Birdeye API returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Fetched ${data?.data?.length || 0} tokens from Birdeye`);
    
    // Cache the response
    apiCache.set(cacheKey, {
      timestamp: Date.now(),
      data: data
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching Solana token data:", error);
    
    // Return some basic fallback data if API fails
    return {
      data: [
        { symbol: "SOL", name: "Solana", price: 160, priceChange24h: 2.5 },
        { symbol: "BONK", name: "Bonk", price: 0.00002814, priceChange24h: 15 },
        { symbol: "WIF", name: "Dogwifhat", price: 0.867, priceChange24h: 8 },
        { symbol: "JTO", name: "Jito", price: 3.25, priceChange24h: -1.2 }
      ]
    };
  }
}

async function fetchMarketSentiment() {
  const cacheKey = 'market_sentiment';
  
  if (apiCache.has(cacheKey)) {
    const cachedData = apiCache.get(cacheKey);
    if (cachedData.timestamp > Date.now() - CACHE_TTL) {
      return cachedData.data;
    }
  }
  
  try {
    // For the purpose of this example, we'll simulate market sentiment data
    // In production, this would call a real API endpoint
    const sentiment = Math.random() > 0.4 ? "bullish" : "bearish";
    const sentimentScore = sentiment === "bullish" ? 60 + Math.floor(Math.random() * 30) : 30 + Math.floor(Math.random() * 20);
    
    const data = {
      overall: sentiment,
      score: sentimentScore,
      tokensBullish: Math.floor(20 + Math.random() * 30),
      tokensBearish: Math.floor(10 + Math.random() * 20),
      topGainer: {
        symbol: "WIF",
        change: "+" + (Math.floor(Math.random() * 30) + 10) + "%"
      },
      topLoser: {
        symbol: "SAND",
        change: "-" + (Math.floor(Math.random() * 20) + 5) + "%"
      },
      volume24h: "$" + (Math.floor(Math.random() * 50) + 100) + "M"
    };
    
    apiCache.set(cacheKey, {
      timestamp: Date.now(),
      data: data
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching market sentiment:", error);
    return {
      overall: "neutral",
      score: 50,
      tokensBullish: 25,
      tokensBearish: 25,
      topGainer: { symbol: "WIF", change: "+15%" },
      topLoser: { symbol: "SAND", change: "-10%" },
      volume24h: "$120M"
    };
  }
}

async function fetchHotTokens() {
  const cacheKey = 'hot_tokens';
  
  if (apiCache.has(cacheKey)) {
    const cachedData = apiCache.get(cacheKey);
    if (cachedData.timestamp > Date.now() - CACHE_TTL) {
      return cachedData.data;
    }
  }

  try {
    // Try to fetch data from pump.fun API
    const response = await fetch('https://api.pump.fun/tokens/trending?limit=50');
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Fetched ${data?.tokens?.length || 0} trending tokens from pump.fun`);
    
    // Cache the response
    apiCache.set(cacheKey, {
      timestamp: Date.now(),
      data: data
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching hot tokens:", error);
    
    // Return fallback data
    return {
      tokens: [
        { symbol: "WIF", name: "Dogwifhat", price: 0.867, change24h: 8.2, marketCap: "1.2B" },
        { symbol: "BONK", name: "Bonk", price: 0.00002814, change24h: 15.4, marketCap: "920M" },
        { symbol: "BOOK", name: "Bookmap", price: 1.24, change24h: 35.6, marketCap: "86M" },
        { symbol: "POPCAT", name: "Popcat", price: 0.00000921, change24h: 12.3, marketCap: "45M" }
      ]
    };
  }
}

async function fetchTwitterTrends() {
  const cacheKey = 'twitter_trends';
  
  if (apiCache.has(cacheKey)) {
    const cachedData = apiCache.get(cacheKey);
    if (cachedData.timestamp > Date.now() - CACHE_TTL) {
      console.log("Using cached Twitter trends");
      return cachedData.data;
    }
  }
  
  try {
    console.log("Checking Twitter API credentials");
    
    if (!TWITTER_CONSUMER_KEY || !TWITTER_CONSUMER_SECRET || 
        !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_TOKEN_SECRET) {
      console.log("Twitter API credentials not configured");
      throw new Error("Twitter API credentials not configured");
    }
    
    // Initialize Twitter client
    const twitterClient = new TwitterApi({
      appKey: TWITTER_CONSUMER_KEY,
      appSecret: TWITTER_CONSUMER_SECRET,
      accessToken: TWITTER_ACCESS_TOKEN,
      accessSecret: TWITTER_ACCESS_TOKEN_SECRET,
    });
    
    console.log("Twitter client initialized, fetching trends");
    
    // Get recent tweets with crypto hashtags
    const cryptoSearchTerms = "$SOL OR $WIF OR $JTO OR $BONK OR $BTC OR #Solana OR #BTC OR #Bitcoin OR memecoin OR #crypto";
    const tweets = await twitterClient.v2.search(cryptoSearchTerms, {
      "tweet.fields": ["created_at", "public_metrics", "author_id"],
      "user.fields": ["username", "name"],
      "expansions": ["author_id"],
      "max_results": 10,
    });

    console.log(`Fetched ${tweets.data.data?.length || 0} tweets`);
    
    const processedTweets = tweets.data.data.map(tweet => {
      const author = tweets.data.includes?.users?.find(u => u.id === tweet.author_id);
      return {
        id: tweet.id,
        username: author?.username || "unknown",
        name: author?.name,
        text: tweet.text,
        created_at: tweet.created_at,
        likes: tweet.public_metrics?.like_count,
        retweets: tweet.public_metrics?.retweet_count,
        url: `https://twitter.com/${author?.username || "unknown"}/status/${tweet.id}`
      };
    });
    
    const data = {
      tweets: processedTweets,
      fetched_at: new Date().toISOString()
    };
    
    // Cache the response
    apiCache.set(cacheKey, {
      timestamp: Date.now(),
      data: data
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching Twitter trends:", error);
    return { 
      tweets: [], 
      error: "Twitter API error: " + (error instanceof Error ? error.message : String(error))
    };
  }
}

async function generateAIResponse(messages: Message[], type: string) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  
  // Fetch market data for context
  let marketData;
  let marketSentiment;
  let hotTokens;
  let twitterTrends;
  
  try {
    console.log("Fetching market context data for AI response");
    [marketData, marketSentiment, hotTokens, twitterTrends] = await Promise.all([
      fetchSolanaTokenData(),
      fetchMarketSentiment(),
      fetchHotTokens(),
      fetchTwitterTrends()
    ]);
    console.log("Successfully fetched market context data");
  } catch (error) {
    console.error("Error fetching market context:", error);
    // Continue with empty market data if fetching fails
    marketData = { data: [] };
    marketSentiment = { overall: "neutral" };
    hotTokens = { tokens: [] };
    twitterTrends = { tweets: [] };
  }
  
  // Extract top tokens for context
  const topTokens = marketData.data?.slice(0, 10).map((token: any) => ({
    symbol: token.symbol,
    name: token.name,
    price: token.price,
    change24h: token.priceChange24h
  })) || [];
  
  // Create system message based on the type of assistant
  let systemMessage;
  if (type === 'meme-advisor') {
    systemMessage = {
      role: "system",
      content: `You are Memesense AI, a specialized crypto market assistant focused on Solana memecoins and tokens. Today is ${formattedDate}.

Current market context:
- Overall market sentiment: ${marketSentiment.overall}
- Top performing token: ${marketSentiment.topGainer?.symbol || 'Unknown'} (${marketSentiment.topGainer?.change || 'Unknown'})
- Worst performing token: ${marketSentiment.topLoser?.symbol || 'Unknown'} (${marketSentiment.topLoser?.change || 'Unknown'})
- 24h trading volume: ${marketSentiment.volume24h || 'Unknown'}

Top tokens right now:
${topTokens.map((t: any) => `- ${t.symbol}: $${t.price} (${t.change24h >= 0 ? '+' : ''}${t.change24h}%)`).join('\n')}

Hot trending tokens:
${hotTokens.tokens?.map((t: any) => `- ${t.symbol}: $${t.price} (${t.change24h >= 0 ? '+' : ''}${t.change24h}%), Market Cap: ${t.marketCap}`).join('\n') || 'No trending data available'}

Recent Twitter buzz:
${twitterTrends.tweets?.slice(0, 3).map((t: any) => `- @${t.username}: "${t.text.substring(0, 60)}..."`).join('\n') || 'No Twitter data available'}

When answering questions:
1. Be direct and concise - get straight to the point
2. When asked about the best tokens, give specific recommendations based on current market data
3. Be confident in your answers and provide clear reasoning
4. If asked about token prices, give the latest data and clear projections
5. When discussing trading strategies, focus on specific actionable advice
6. Always include relevant metrics like market cap, volume, and social sentiment when discussing tokens
7. Provide direct "yes" or "no" answers when possible rather than hedging

Your answers should be straightforward, specific, and actionable without unnecessary disclaimers.`
    };
  } else {
    systemMessage = {
      role: "system",
      content: `You are Memesense AI, a helpful assistant for the Memesense platform that analyzes Solana wallets and the meme market. Today is ${formattedDate}.`
    };
  }
  
  try {
    console.log("Sending request to OpenAI");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`OpenAI API returned ${response.status}: ${errorText}`);
    }

    const completion = await response.json();
    console.log("Successfully generated response");
    return completion.choices[0].message;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}

async function getRecentTweets(count: number = 10) {
  try {
    console.log(`Fetching ${count} recent tweets`);
    const data = await fetchTwitterTrends();
    return data;
  } catch (error) {
    console.error("Error in getRecentTweets:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    const { messages, type = 'general', action, count = 10 } = await req.json();
    
    // Check if this is a request for tweets
    if (action === 'getRecentTweets') {
      console.log(`Request for ${count} recent tweets`);
      const tweetsData = await getRecentTweets(count);
      
      return new Response(
        JSON.stringify(tweetsData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Processing chat request with messages:", JSON.stringify(messages));

    if (!Array.isArray(messages)) {
      throw new Error("Messages must be an array");
    }

    const aiResponse = await generateAIResponse(messages, type);
    console.log("Successfully generated response");

    return new Response(
      JSON.stringify(aiResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
