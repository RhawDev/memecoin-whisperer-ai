
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      isBot: true,
      content: "Hello! I'm MEMESENSE AI. Ask me about memecoin market sentiment or specific tokens.",
      timestamp: "Just now"
    }
  ]);
  
  const [input, setInput] = useState('');
  
  const handleSend = () => {
    if (input.trim() === '') return;
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      isBot: false,
      content: input,
      timestamp: "Just now"
    }]);
    
    // Clear input
    setInput('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        isBot: true,
        content: "I'm currently tracking the memecoin market. Based on my data, the market sentiment is currently bullish with strong performances from $PEPE (+15%) and $DOGE (+5%) in the last 24 hours.",
        timestamp: "Just now"
      }]);
    }, 1000);
  };
  
  return (
    <Card className="glass-card flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          MEMESENSE AI Chat
        </CardTitle>
        <div className="text-xs text-blue-400">Market Sentiment</div>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-4 pt-0">
        <ScrollArea className="flex-grow pr-4 mb-4">
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
          </div>
        </ScrollArea>
        <div className="flex gap-2 mt-auto">
          <Input
            placeholder="Ask about market sentiment..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-gray-900 border-gray-700"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
