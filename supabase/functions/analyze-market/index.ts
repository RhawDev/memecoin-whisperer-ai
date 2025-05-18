
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { timeframe, tokenTicker, queryType } = await req.json();
    
    if (!timeframe && !tokenTicker && !queryType) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get market data to provide context for AI analysis
    let marketData;
    let contextData = "";

    // If analyzing a specific token
    if (tokenTicker) {
      try {
        // Try to get market data for the token from Solscan
        const solscanTokenResponse = await fetch(
          `https://public-api.solscan.io/token/meta?tokenAddress=${tokenTicker}`,
          {
            headers: {
              'Accept': 'application/json',
            }
          }
        );
        
        if (solscanTokenResponse.ok) {
          const tokenData = await solscanTokenResponse.json();
          contextData += `Token Info: ${JSON.stringify(tokenData)}\n`;
        }
      } catch (error) {
        console.error("Error fetching token data:", error);
        // Continue even if this fails, we'll use AI without this context
      }
    }
    
    // For general market trends
    if (timeframe) {
      contextData += `Analyzing market trends over ${timeframe} timeframe.\n`;
    }
    
    let systemPrompt = "You are a sophisticated AI analyst specializing in Solana memecoins and DeFi. ";
    
    if (queryType === 'marketSentiment') {
      systemPrompt += "Analyze the current memecoin market sentiment and provide a detailed analysis with key metrics and observations. Determine if the market is bullish or bearish and explain your reasoning.";
    } else if (queryType === 'tokenAnalysis') {
      systemPrompt += `Analyze the memecoin ${tokenTicker} and provide insights on its performance, community sentiment, and potential outlook. Include specific metrics when possible.`;
    } else if (queryType === 'walletFeedback') {
      systemPrompt += "Provide personalized trading advice based on the wallet's trading history and pattern. Offer actionable insights to improve trading performance.";
    } else {
      systemPrompt += "Provide a general overview of the current Solana memecoin market conditions including trending tokens, sentiment, and key metrics.";
    }
    
    // Call OpenAI API
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `${contextData}\n\nProvide an analysis based on the available information.`
          }
        ],
        temperature: 0.7
      })
    });
    
    if (!openAIResponse.ok) {
      const openAIError = await openAIResponse.text();
      throw new Error(`OpenAI API error: ${openAIResponse.status} - ${openAIError}`);
    }
    
    const openAIResult = await openAIResponse.json();
    const analysisText = openAIResult.choices[0].message.content;
    
    // Determine bullish or bearish sentiment from the analysis
    const lowerCaseAnalysis = analysisText.toLowerCase();
    let marketSentiment = "Neutral";
    
    if (
      lowerCaseAnalysis.includes("bullish") || 
      lowerCaseAnalysis.includes("positive") || 
      lowerCaseAnalysis.includes("uptrend") ||
      lowerCaseAnalysis.includes("growth")
    ) {
      marketSentiment = "Bullish";
    } else if (
      lowerCaseAnalysis.includes("bearish") || 
      lowerCaseAnalysis.includes("negative") || 
      lowerCaseAnalysis.includes("downtrend") ||
      lowerCaseAnalysis.includes("decline")
    ) {
      marketSentiment = "Bearish";
    }
    
    return new Response(
      JSON.stringify({
        analysis: analysisText,
        sentiment: marketSentiment,
        timeframe: timeframe || "current"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred analyzing the market' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
