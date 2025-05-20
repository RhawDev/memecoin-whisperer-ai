
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// List of API keys to check
const requiredApiKeys = [
  { name: "OPENAI_API_KEY", description: "OpenAI API Key" },
  { name: "TWITTER_CONSUMER_KEY", description: "Twitter API Key" },
  { name: "TWITTER_CONSUMER_SECRET", description: "Twitter API Secret" },
  { name: "TWITTER_ACCESS_TOKEN", description: "Twitter Access Token" },
  { name: "TWITTER_ACCESS_TOKEN_SECRET", description: "Twitter Access Token Secret" },
  { name: "BIRDEYE_API_KEY", description: "Birdeye API Key" }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const missingKeys: string[] = [];
    const configuredKeys: string[] = [];
    
    // Check each required key
    for (const key of requiredApiKeys) {
      const value = Deno.env.get(key.name);
      
      if (!value) {
        missingKeys.push(key.description);
      } else {
        configuredKeys.push(key.description);
      }
    }
    
    return new Response(
      JSON.stringify({
        missingKeys,
        configuredKeys,
        allConfigured: missingKeys.length === 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error("Error checking API keys:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
