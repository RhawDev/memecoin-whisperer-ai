
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

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
    const { walletAddress } = await req.json();
    
    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: 'Wallet address is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch basic wallet data from Solscan
    const solscanResponse = await fetch(`https://public-api.solscan.io/account/${walletAddress}`, {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!solscanResponse.ok) {
      throw new Error(`Solscan API error: ${solscanResponse.status}`);
    }

    const walletData = await solscanResponse.json();
    
    // Fetch transaction history
    const txHistoryResponse = await fetch(
      `https://public-api.solscan.io/account/transactions?account=${walletAddress}&limit=50`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!txHistoryResponse.ok) {
      throw new Error(`Solscan transactions API error: ${txHistoryResponse.status}`);
    }

    const txHistory = await txHistoryResponse.json();
    
    // Fetch token holdings
    const tokenHoldingsResponse = await fetch(
      `https://public-api.solscan.io/account/tokens?account=${walletAddress}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!tokenHoldingsResponse.ok) {
      throw new Error(`Solscan tokens API error: ${tokenHoldingsResponse.status}`);
    }

    const tokenHoldings = await tokenHoldingsResponse.json();
    
    // Process the data to extract useful metrics
    const processTxHistory = (txs: any[]) => {
      if (!Array.isArray(txs)) {
        return {
          totalTxCount: 0,
          buyCount: 0,
          sellCount: 0,
          averageHoldTime: "0 days",
          winRate: "0%",
          volume: "0 SOL"
        };
      }
      
      // Simple approximation: assume swaps with incoming tokens are buys
      const buyCount = txs.filter(tx => 
        tx.tokenTransfers && tx.tokenTransfers.length > 0 && 
        tx.tokenTransfers.some((transfer: any) => transfer.receiver === walletAddress)
      ).length;
      
      // Assume swaps with outgoing tokens are sells
      const sellCount = txs.filter(tx => 
        tx.tokenTransfers && tx.tokenTransfers.length > 0 && 
        tx.tokenTransfers.some((transfer: any) => transfer.sender === walletAddress)
      ).length;
      
      // Estimate volume (this is simplified)
      let totalVolume = txs.reduce((sum: number, tx: any) => {
        if (tx.fee) {
          return sum + (tx.fee / 1000000000); // Convert lamports to SOL
        }
        return sum;
      }, 0);
      
      // Rough estimation of hold time based on buy and sell timestamps
      let averageHoldTime = "3.2 days"; // Default placeholder
      
      // Win rate estimation (simplified)
      const totalTrades = buyCount + sellCount;
      const estimatedWinRate = totalTrades > 0 ? Math.floor(Math.random() * 30) + 50 : 0; // Placeholder
      
      return {
        totalTxCount: txs.length,
        buyCount,
        sellCount,
        averageHoldTime,
        winRate: `${estimatedWinRate}%`,
        volume: `${totalVolume.toFixed(2)} SOL`
      };
    };
    
    const metrics = processTxHistory(txHistory);
    
    // Determine trading style and personality based on metrics
    let tradingStyle = "Strategic Opportunist";
    let personality = "The Strategist";
    let emoji = "🧠";
    
    if (metrics.buyCount > metrics.sellCount * 2) {
      tradingStyle = "Hoarding Collector";
      personality = "The Diamond Hand";
      emoji = "💎";
    } else if (metrics.sellCount > metrics.buyCount * 2) {
      tradingStyle = "Quick Flipper";
      personality = "The Surfer";
      emoji = "🏄";
    } else if (metrics.totalTxCount > 100) {
      tradingStyle = "Active Trader";
      personality = "The Day Trader";
      emoji = "📊";
    }
    
    const result = {
      walletOverview: walletData,
      tokenHoldings,
      metrics,
      profile: {
        tradingStyle,
        personality,
        emoji,
        strengths: [
          "Calculated decision making",
          "Strong risk management",
          "Patient entry timing"
        ],
        weaknesses: [
          "Occasional hesitation",
          "Missing some explosive opportunities",
          "Too conservative on position sizing"
        ],
        tips: [
          "Consider slightly increasing position size on high-conviction plays",
          "Set more aggressive take-profit targets for part of your position",
          "Implement trailing stops to maximize gains on trending tokens"
        ],
        stats: {
          averageHoldTime: metrics.averageHoldTime,
          winRate: metrics.winRate,
          tradingVolume: metrics.volume,
          riskUsage: "Conservative"
        }
      }
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred processing the wallet data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
