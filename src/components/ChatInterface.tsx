
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type Message = {
  id: number;
  isBot: boolean;
  content: string;
  timestamp: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      isBot: true,
      content: "Hello! I'm MEMESENSE AI. Ask me about memecoin market sentiment, specific tokens, or trading advice.",
      timestamp: "Just now"
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    
    // Format user input by adding $ symbol if it looks like a token name without it
    let processedInput = input;
    const potentialTokenMatch = input.match(/\b([A-Z]{3,})\b/g);
    if (potentialTokenMatch) {
      potentialTokenMatch.forEach(token => {
        // Don't add $ if it's a common English word
        const commonWords = ['THE', 'AND', 'FOR', 'WHAT', 'WHERE', 'WHEN', 'HOW', 'WHY'];
        if (!commonWords.includes(token)) {
          processedInput = processedInput.replace(new RegExp(`\\b${token}\\b`, 'g'), `$${token}`);
        }
      });
    }
    
    // Add user message
    const userMsg: Message = {
      id: Date.now(),
      isBot: false,
      content: processedInput,
      timestamp: "Just now"
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    // Determine query type based on message content
    let queryType = 'general';
    
    if (processedInput.includes('$')) {
      queryType = 'tokenAnalysis';
      // Extract token ticker
      const tickerMatch = processedInput.match(/\$([A-Z]+)/i);
      if (tickerMatch && tickerMatch[1]) {
        // Send token analysis request
        await getAIResponse(queryType, null, tickerMatch[1]);
        return;
      }
    }
    
    if (
      processedInput.toLowerCase().includes('market') || 
      processedInput.toLowerCase().includes('sentiment') ||
      processedInput.toLowerCase().includes('trend')
    ) {
      queryType = 'marketSentiment';
      await getAIResponse(queryType, '24h');
      return;
    }
    
    if (
      processedInput.toLowerCase().includes('trading') ||
      processedInput.toLowerCase().includes('wallet') ||
      processedInput.toLowerCase().includes('portfolio') ||
      processedInput.toLowerCase().includes('strategy')
    ) {
      queryType = 'walletFeedback';
      await getAIResponse(queryType);
      return;
    }
    
    // Default to general query
    await getAIResponse('general');
  };
  
  const getAIResponse = async (queryType: string, timeframe?: string | null, tokenTicker?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-market', {
        body: { 
          timeframe,
          tokenTicker,
          queryType
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Add AI response
      const aiMessage: Message = {
        id: Date.now() + 1,
        isBot: true,
        content: data.analysis,
        timestamp: "Just now"
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error("AI Chat error:", error);
      
      // Add error message from the AI
      const errorMsg: Message = {
        id: Date.now() + 1,
        isBot: true,
        content: `I'm sorry, I encountered an error while analyzing: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: "Just now"
      };
      
      setMessages(prev => [...prev, errorMsg]);
      
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to process your request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="glass-card flex flex-col h-[600px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          MEMESENSE AI Chat
        </CardTitle>
        <div className="text-xs text-blue-400">Market Analysis • Token Insights • Trading Tips</div>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-4 pt-0">
        <ScrollArea className="flex-grow pr-4 mb-4 h-[450px]">
          <div className="space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.isBot 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {message.isBot && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold bg-blue-500 text-white px-1.5 py-0.5 rounded">AI</span>
                      <span className="text-xs text-gray-400">{message.timestamp}</span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg p-4 bg-gray-800 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold bg-blue-500 text-white px-1.5 py-0.5 rounded">AI</span>
                    <span className="text-xs text-gray-400">Typing...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-300 animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2 mt-auto">
          <Input
            placeholder="Ask about tokens, market sentiment, or trading advice..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-gray-900 border-gray-700"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Spinner className="w-4 h-4" /> : 'Send'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
