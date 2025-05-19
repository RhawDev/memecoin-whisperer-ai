
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizontal, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I\'m Memesense AI, your personal assistant for analyzing Solana memecoin trends and wallet performance. How can I help you today?',
        timestamp: new Date()
      }
    ]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare messages for the API call
      const apiMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));
      
      console.log("Sending message to AI Chat:", input);
      
      // Call OpenAI via our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          messages: apiMessages,
          type: 'meme-advisor'
        }
      });
      
      if (error) {
        console.error("Error from AI chat function:", error);
        throw new Error(error.message);
      }
      
      if (!data || !data.content) {
        console.error("Invalid response from AI:", data);
        throw new Error('Invalid response from AI');
      }
      
      console.log("Received AI response:", data.content.substring(0, 50) + "...");
      
      // Add AI response to chat
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (err: any) {
      console.error("Error in AI chat:", err);
      toast.error('Failed to get a response from the AI. Please try again.');
      
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          Memesense AI Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[500px]">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar className={`h-8 w-8 ${
                    message.role === 'user' 
                      ? 'bg-indigo-700' 
                      : 'bg-gradient-to-br from-purple-500 to-indigo-500'
                  }`}>
                    <div className="flex h-full items-center justify-center text-xs font-medium">
                      {message.role === 'user' ? 'You' : 'AI'}
                    </div>
                  </Avatar>
                  
                  <div 
                    className={`rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-800/50 border border-white/10'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-indigo-500">
                    <div className="flex h-full items-center justify-center text-xs font-medium">
                      AI
                    </div>
                  </Avatar>
                  
                  <div className="rounded-lg p-3 bg-gray-800/50 border border-white/10">
                    <Spinner size="sm" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <form 
          onSubmit={handleSubmit} 
          className="border-t border-white/10 p-4 flex gap-2"
        >
          <Input 
            placeholder="Ask about market trends, token analysis, or wallet strategies..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="bg-white/5 border-white/10"
          />
          <Button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? <Spinner size="sm" /> : <SendHorizontal className="h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
