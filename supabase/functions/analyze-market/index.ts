
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

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
    const body = await req.json();
    const { timeframe, tokenTicker, queryType } = body;
    
    console.log("Analyzing market with parameters:", { timeframe, tokenTicker, queryType });

    // For market sentiment analysis
    if (queryType === 'marketSentiment') {
      try {
        const sentiment = await analyzeMemeMarketSentiment(timeframe);
        return new Response(
          JSON.stringify(sentiment),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error("Error analyzing market sentiment:", error);
        return new Response(
          JSON.stringify({ error: 'Failed to analyze market sentiment' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // For market movers data
    else if (queryType === 'marketMovers') {
      try {
        const marketMoversData = await getMarketMoversData(timeframe);
        return new Response(
          JSON.stringify({ marketMovers: marketMoversData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error("Error fetching market movers:", error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch market movers data' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // For trending tokens data
    else if (queryType === 'trendingTokens') {
      try {
        const trendingTokensData = await getTrendingTokensData();
        return new Response(
          JSON.stringify({ trendingTokens: trendingTokensData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error("Error fetching trending tokens:", error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch trending tokens data' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // For token launches data (PumpFun)
    else if (queryType === 'pumpFunData') {
      try {
        const pumpFunData = await getPumpFunData();
        return new Response(
          JSON.stringify(pumpFunData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error("Error fetching PumpFun data:", error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch PumpFun data' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // General market analysis (fallback)
    else {
      const generalAnalysis = await getGeneralMarketAnalysis();
      return new Response(
        JSON.stringify(generalAnalysis),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to process the request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function analyzeMemeMarketSentiment(timeframe: string) {
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")?.trim();
  
  if (!OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API key");
  }

  try {
    // Fetch some market data to inform the AI analysis
    // This could be from CoinGecko, Solscan, or other sources
    const solanaResponse = await fetch("https://api.coingecko.com/api/v3/coins/solana?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false")
      .then(res => res.json())
      .catch(() => null);
    
    const openaiConfig = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    
    const openai = new OpenAIApi(openaiConfig);
    
    console.log("Calling OpenAI API with system prompt: You are a sophisticated AI analyst specializing in Solana memecoins and DeFi. Analyze the current memecoin market sentiment and provide a detailed analysis with key metrics and observations. Determine if the market is bullish or bearish and explain your reasoning.");
    
    // Generate market sentiment analysis with OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a sophisticated AI analyst specializing in Solana memecoins and DeFi. Analyze the current memecoin market sentiment and provide a detailed analysis with key metrics and observations. Determine if the market is bullish or bearish and explain your reasoning."
        },
        {
          role: "user",
          content: `Analyze the current Solana memecoin market sentiment over the past ${timeframe}. ${solanaResponse ? `Current Solana price: $${solanaResponse.market_data?.current_price?.usd || 'unknown'}, 24h change: ${solanaResponse.market_data?.price_change_percentage_24h || 'unknown'}%` : ''}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    console.log("Successfully received response from OpenAI API");
    
    const analysis = completion.data.choices[0].message?.content?.trim() || "No analysis generated";
    
    // Determine sentiment from analysis
    let sentiment = "Neutral";
    if (analysis.toLowerCase().includes("bullish") || analysis.toLowerCase().includes("positive")) {
      sentiment = "Bullish";
    } else if (analysis.toLowerCase().includes("bearish") || analysis.toLowerCase().includes("negative")) {
      sentiment = "Bearish";
    }
    
    console.log("Analysis completed successfully");
    
    return {
      timeframe,
      sentiment,
      analysis
    };
  } catch (error) {
    console.error("Error in OpenAI integration:", error);
    throw error;
  }
}

async function getMarketMoversData(timeframe: string) {
  // In a real implementation, this would fetch data from Solscan or another API
  // For now, we'll generate realistic-looking data
  
  const generateAddress = () => {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let address = '';
    for (let i = 0; i < 44; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Abbreviate for display
    return `${address.substring(0, 4)}...${address.substring(40)}`;
  };
  
  const getRandomPerformance = (min: number, max: number) => {
    const perf = (Math.random() * (max - min) + min).toFixed(1);
    return `+${perf}%`;
  };
  
  const getNegativePerformance = (min: number, max: number) => {
    const perf = (Math.random() * (max - min) + min).toFixed(1);
    return `-${perf}%`;
  };
  
  const wallets = [];
  
  // Create 5-10 wallets with realistic data
  const numWallets = Math.floor(Math.random() * 6) + 5;
  
  for (let i = 0; i < numWallets; i++) {
    // Higher ranks have better performance
    const rankFactor = 1 - (i / numWallets);
    
    // Most wallets perform well, but some might be negative
    const isPositive = Math.random() > 0.2;
    
    const perf24h = isPositive 
      ? getRandomPerformance(5 + (30 * rankFactor), 10 + (50 * rankFactor))
      : getNegativePerformance(2, 10);
      
    const perf7d = isPositive
      ? getRandomPerformance(20 + (100 * rankFactor), 40 + (150 * rankFactor))
      : getNegativePerformance(5, 20);
      
    const perf30d = isPositive
      ? getRandomPerformance(40 + (200 * rankFactor), 100 + (300 * rankFactor))
      : getNegativePerformance(10, 40);
    
    const volume = (100000 + Math.random() * 500000 * (1 - (i / numWallets))).toFixed(0);
    const trades = Math.floor(20 + Math.random() * 100 * (1 - (i / numWallets)));
    const profitable = `${Math.floor(60 + Math.random() * 30)}%`;
    
    wallets.push({
      address: generateAddress(),
      performance24h: perf24h,
      performance7d: perf7d,
      performance30d: perf30d,
      volume: `${Number(volume).toLocaleString()} SOL`,
      trades,
      profitable
    });
  }
  
  return wallets;
}

async function getTrendingTokensData() {
  // In a real implementation, this would fetch data from CoinGecko, Twitter API, etc.
  // For now, we'll return more realistic mock data
  
  const trendingTokens = [
    {
      name: 'Dogwifhat',
      ticker: '$WIF',
      sentimentScore: Math.floor(60 + Math.random() * 25),
      changePercentage: `+${(Math.random() * 20).toFixed(1)}%`,
      socialMentions: Math.floor(8000 + Math.random() * 6000),
      mentionChange: `+${(Math.random() * 30).toFixed(1)}%`,
      price: `$${(Math.random() * 0.5).toFixed(4)}`,
      marketCap: `$${(Math.random() * 500 + 200).toFixed(1)}M`
    },
    {
      name: 'Bonk',
      ticker: '$BONK',
      sentimentScore: Math.floor(60 + Math.random() * 25),
      changePercentage: Math.random() > 0.5 ? `+${(Math.random() * 15).toFixed(1)}%` : `-${(Math.random() * 8).toFixed(1)}%`,
      socialMentions: Math.floor(5000 + Math.random() * 5000),
      mentionChange: Math.random() > 0.7 ? `+${(Math.random() * 20).toFixed(1)}%` : `-${(Math.random() * 10).toFixed(1)}%`,
      price: `$${(Math.random() * 0.00001).toFixed(7)}`,
      marketCap: `$${(Math.random() * 300 + 100).toFixed(1)}M`
    },
    {
      name: 'Popcat',
      ticker: '$POPCAT',
      sentimentScore: Math.floor(60 + Math.random() * 25),
      changePercentage: `+${(Math.random() * 35).toFixed(1)}%`,
      socialMentions: Math.floor(4000 + Math.random() * 3000),
      mentionChange: `+${(Math.random() * 50).toFixed(1)}%`,
      price: `$${(Math.random() * 0.001).toFixed(5)}`,
      marketCap: `$${(Math.random() * 80 + 20).toFixed(1)}M`
    },
    {
      name: 'Book of Meme',
      ticker: '$BOME',
      sentimentScore: Math.floor(40 + Math.random() * 20),
      changePercentage: Math.random() > 0.5 ? `+${(Math.random() * 12).toFixed(1)}%` : `-${(Math.random() * 9).toFixed(1)}%`,
      socialMentions: Math.floor(2000 + Math.random() * 3000),
      mentionChange: Math.random() > 0.4 ? `+${(Math.random() * 15).toFixed(1)}%` : `-${(Math.random() * 12).toFixed(1)}%`,
      price: `$${(Math.random() * 0.01).toFixed(4)}`,
      marketCap: `$${(Math.random() * 50 + 10).toFixed(1)}M`
    },
    {
      name: 'Mog Coin',
      ticker: '$MOG',
      sentimentScore: Math.floor(50 + Math.random() * 20),
      changePercentage: `+${(Math.random() * 25).toFixed(1)}%`,
      socialMentions: Math.floor(3000 + Math.random() * 2000),
      mentionChange: `+${(Math.random() * 20).toFixed(1)}%`,
      price: `$${(Math.random() * 0.001).toFixed(5)}`,
      marketCap: `$${(Math.random() * 70 + 30).toFixed(1)}M`
    }
  ];
  
  // Sort by social mentions
  return trendingTokens.sort((a, b) => b.socialMentions - a.socialMentions);
}

async function getPumpFunData() {
  // In a real implementation, this would fetch from the Dune Analytics API
  // For now, we'll generate realistic data
  
  const timeRanges = ['1h', '4h', '12h', '24h', '7d', '30d'];
  const currentDate = new Date();
  
  // Generate reasonable token count progression
  const baseTokenCount = 4;
  let cumulativeTokens = baseTokenCount;
  
  const chartData = timeRanges.map(range => {
    let name = range;
    
    // Adjust for longer time ranges
    if (range === '7d') {
      cumulativeTokens = Math.floor(cumulativeTokens * 2.5);
    } else if (range === '30d') {
      cumulativeTokens = Math.floor(cumulativeTokens * 1.8);
    } else {
      // For shorter ranges, add a reasonable increment
      cumulativeTokens += Math.floor(Math.random() * 8) + 4;
    }
    
    return { name, tokens: cumulativeTokens };
  });
  
  // Calculate week-over-week change
  const previousWeek = Math.floor(chartData.find(item => item.name === '7d')?.tokens || 0 * 0.7);
  const currentWeek = chartData.find(item => item.name === '7d')?.tokens || 0;
  const weeklyChange = ((currentWeek - previousWeek) / previousWeek * 100).toFixed(1);
  
  return {
    tokenCount: chartData.find(item => item.name === '7d')?.tokens || 65,
    weekChange: `+${weeklyChange}%`,
    chartData: chartData
  };
}

async function getGeneralMarketAnalysis() {
  // Fetch general Solana info
  const solanaResponse = await fetch("https://api.coingecko.com/api/v3/coins/solana?localization=false&tickers=false&market_data=true")
    .then(res => res.json())
    .catch(() => null);
    
  const solPrice = solanaResponse?.market_data?.current_price?.usd || 'unknown';
  const sol24hChange = solanaResponse?.market_data?.price_change_percentage_24h || 'unknown';
  
  // Get trending tokens
  const trendingTokens = await getTrendingTokensData();
  
  // Get market sentiment
  const sentiment = await analyzeMemeMarketSentiment('24h');
  
  return {
    solanaPrice: solPrice,
    solana24hChange: sol24hChange,
    marketSentiment: sentiment,
    trending: trendingTokens.slice(0, 3)
  };
}
