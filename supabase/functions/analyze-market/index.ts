
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { timeframe, tokenTicker, queryType } = await req.json();
    
    console.log("Analyzing market with parameters:", { timeframe, tokenTicker, queryType });
    
    // Handle different query types
    switch (queryType) {
      case 'marketMovers': {
        const marketMovers = await fetchMarketMovers(timeframe || '24h');
        return new Response(
          JSON.stringify({ marketMovers }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'trendingTokens': {
        const trendingTokens = await fetchTrendingTokens();
        return new Response(
          JSON.stringify({ trendingTokens }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'marketSentiment': {
        const { sentiment, analysis } = await analyzeMemeMarketSentiment(timeframe || '24h');
        return new Response(
          JSON.stringify({ sentiment, analysis }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'pumpFunData': {
        const pumpFunData = await fetchPumpFunData();
        return new Response(
          JSON.stringify({ pumpFunData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      default:
        return new Response(
          JSON.stringify({ error: `Unknown query type: ${queryType}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error: any) {
    console.error("Error analyzing market:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred analyzing the market data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Function to fetch market movers based on timeframe
async function fetchMarketMovers(timeframe: string): Promise<any[]> {
  try {
    // For now, using mocked data but structured with real Solana addresses
    // Ideally we would fetch from a real API
    const mockedMovers = [
      { 
        address: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH', 
        performance24h: '+42.8%', 
        performance7d: '+156.3%', 
        performance30d: '+287.5%', 
        volume: '458,932 SOL', 
        trades: 87,
        profitable: '78%'
      },
      { 
        address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', 
        performance24h: '+36.2%', 
        performance7d: '+89.7%', 
        performance30d: '+142.3%', 
        volume: '356,721 SOL', 
        trades: 65,
        profitable: '82%'
      },
      { 
        address: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs', 
        performance24h: '+28.5%', 
        performance7d: '+76.4%', 
        performance30d: '+118.9%', 
        volume: '289,453 SOL', 
        trades: 53,
        profitable: '75%'
      },
      { 
        address: '5wTjKzJyEJiRK9ZV6aF6hyy4yPxq3HrPbpV6sYcCWHwZ', 
        performance24h: '+22.3%', 
        performance7d: '+64.1%', 
        performance30d: '+98.5%', 
        volume: '215,872 SOL', 
        trades: 42,
        profitable: '71%'
      },
      { 
        address: '2JCxZv6LaFjPqCKzVpKp5iUbYaLaHpDLbXCmaZpNQPH4', 
        performance24h: '+18.7%', 
        performance7d: '+53.8%', 
        performance30d: '+82.4%', 
        volume: '189,635 SOL', 
        trades: 38,
        profitable: '68%'
      },
    ];
    
    return mockedMovers;
  } catch (error) {
    console.error("Error fetching market movers:", error);
    throw new Error("Failed to fetch market movers data");
  }
}

// Function to fetch trending tokens
async function fetchTrendingTokens(): Promise<any[]> {
  try {
    // This would ideally fetch from a real API
    // Using real token addresses for Solana memecoins
    return [
      {
        name: 'Dogecoin',
        ticker: '$DOGE',
        address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', // Dogecoin token address on Solana
        sentimentScore: 65,
        changePercentage: '+5%',
        socialMentions: 12500,
        mentionChange: '+12%',
        price: '0.124 USD',
        marketCap: '16.8B USD'
      },
      {
        name: 'Bonk',
        ticker: '$BONK',
        address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK token address on Solana
        sentimentScore: 58,
        changePercentage: '+15%',
        socialMentions: 9800,
        mentionChange: '+23%',
        price: '0.00002814 USD',
        marketCap: '1.67B USD'
      },
      {
        name: 'WIF',
        ticker: '$WIF',
        address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', // WIF token address
        sentimentScore: 78,
        changePercentage: '+8%',
        socialMentions: 14200,
        mentionChange: '+18%',
        price: '0.867 USD',
        marketCap: '867M USD'
      },
      {
        name: 'POPCAT',
        ticker: '$POPCAT',
        address: 'E8JQstQisHQKVJPaCJy9LY7ZKVeTJx8xLELvMZHDKBvL', // POPCAT token address
        sentimentScore: 53,
        changePercentage: '+32%',
        socialMentions: 5600,
        mentionChange: '+54%',
        price: '0.00023 USD',
        marketCap: '23.4M USD'
      }
    ];
  } catch (error) {
    console.error("Error fetching trending tokens:", error);
    throw new Error("Failed to fetch trending tokens data");
  }
}

// Function to analyze memecoin market sentiment
async function analyzeMemeMarketSentiment(timeframe: string): Promise<{ sentiment: string, analysis: string }> {
  try {
    // Generate a deterministic sentiment for consistency
    const date = new Date();
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Change sentiment approximately every 2-3 days for more realism
    const sentimentCycle = Math.floor(dayOfYear / 2.5) % 3;
    
    let sentiment = "Neutral";
    let analysis = "";
    
    if (sentimentCycle === 0) {
      sentiment = "Bullish";
      analysis = "The Solana memecoin market is showing strong bullish signals with increased trading volume and positive social sentiment. Recent token launches have seen higher initial liquidity and longer holding periods. Key indicators suggest new capital entering the ecosystem, especially in established projects like BONK and emerging ones like POPCAT. Risk appetite appears to be increasing, but traders should maintain disciplined position sizing.";
    } else if (sentimentCycle === 1) {
      sentiment = "Bearish";
      analysis = "Market sentiment has shifted bearish in the short term. On-chain metrics show increased selling pressure and shorter holding times. Social engagement has decreased by 15% compared to last week, suggesting a temporary cooling of interest. New token launches have seen lower initial liquidity, and wash trading appears more prevalent. Consider reducing exposure and waiting for clearer reversal signals before re-entering positions.";
    } else {
      sentiment = "Neutral";
      analysis = "The memecoin market is consolidating after recent volatility. Trading volume has stabilized, with balanced buy and sell pressure. New projects are launching at a steady pace but with more moderate price action than previous cycles. Social engagement metrics indicate sustained interest without excessive FOMO. This neutral phase often precedes directional moves, making it an important time to research quality projects while avoiding impulse trades.";
    }
    
    return { sentiment, analysis };
  } catch (error) {
    console.error("Error analyzing market sentiment:", error);
    throw new Error("Failed to analyze market sentiment");
  }
}

// Function to fetch PumpFun data
async function fetchPumpFunData(): Promise<any> {
  try {
    // Mock data that would ideally come from Dune Analytics
    return {
      tokenLaunches: {
        today: 24,
        yesterday: 31,
        thisWeek: 163,
        lastWeek: 187,
        thisMonth: 642
      },
      successRate: {
        today: "38%",
        thisWeek: "32%",
        thisMonth: "28%"
      },
      avgInitialLiquidity: {
        today: "12.4 SOL",
        thisWeek: "10.8 SOL",
        thisMonth: "9.2 SOL"
      },
      timeToLaunchDistribution: [
        { time: "< 1 hour", percentage: 23 },
        { time: "1-3 hours", percentage: 38 },
        { time: "3-6 hours", percentage: 21 },
        { time: "6-12 hours", percentage: 12 },
        { time: "> 12 hours", percentage: 6 }
      ]
    };
  } catch (error) {
    console.error("Error fetching PumpFun data:", error);
    throw new Error("Failed to fetch PumpFun data");
  }
}
