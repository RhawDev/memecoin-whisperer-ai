
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
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")?.trim();
    
    if (!OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API key");
    }

    const { messages, type = "meme-advisor" } = await req.json();

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request format. 'messages' must be an array." }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Configure OpenAI
    const openaiConfig = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    
    const openai = new OpenAIApi(openaiConfig);
    
    // Choose the system prompt based on the requested chat type
    let systemPrompt = "";
    
    if (type === "meme-advisor") {
      systemPrompt = `You are Memesense AI, a specialized assistant for Solana memecoin investors and traders. 
You have deep knowledge of:
- Solana memecoins and tokens
- Trading strategies for volatile assets
- On-chain analytics
- Market sentiment analysis
- Risk management techniques
- Current trends in the Solana ecosystem

Provide insightful, concise responses that help users understand the memecoin market and make better trading decisions. 
When appropriate, suggest risk management strategies and remind users about the high-risk nature of memecoins.
If asked about specific tokens, provide analysis but avoid making specific price predictions or financial advice.`;
    } else if (type === "wallet-advisor") {
      systemPrompt = `You are Memesense AI's Wallet Advisor, a specialized assistant for analyzing Solana wallet trading patterns.
You help users understand their trading behaviors, identify strengths and weaknesses, and suggest improvements.
Your analysis should focus on:
- Trading frequency patterns
- Asset diversification
- Entry and exit timing
- Risk management
- Profit-taking strategies
- Common behavioral biases

Provide personalized, actionable advice based on the user's questions and trading history.
Avoid making specific financial predictions or giving financial advice that could be construed as promises.`;
    } else {
      systemPrompt = "You are a helpful AI assistant specializing in Solana cryptocurrency and memecoins.";
    }
    
    // Create the completion request
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 800,
    });
    
    const responseMessage = completion.data.choices[0].message;
    
    return new Response(
      JSON.stringify(responseMessage),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("Error in AI chat:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred while processing your request" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
