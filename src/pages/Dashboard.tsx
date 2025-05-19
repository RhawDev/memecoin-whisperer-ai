import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import WalletAnalyzer from '@/components/WalletAnalyzer';
import MarketMovers from '@/components/MarketMovers';
import TrendingTokens from '@/components/TrendingTokens';
import SentimentChart from '@/components/SentimentChart';
import LaunchMetrics from '@/components/LaunchMetrics';
import ChatInterface from '@/components/ChatInterface';
import TwitterTracking from '@/components/TwitterTracking';
import { motion } from 'framer-motion';
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("wallet");
  const [isLoading, setIsLoading] = useState(true);

  // This will handle the initial animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Variants for animating components
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  if (isLoading) {
    return <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl font-bold mb-6 gradient-text animate-pulse">
            Memesense
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{
            animationDelay: '0ms'
          }} />
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{
            animationDelay: '100ms'
          }} />
            <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{
            animationDelay: '200ms'
          }} />
          </div>
        </div>
      </div>;
  }
  return <motion.div className="bg-black text-white min-h-screen" initial="hidden" animate="visible" variants={containerVariants}>
      <Navbar />
      <main className="pt-24 pb-16 px-[221px]">
        <div className="container mx-auto px-4">
          <motion.h1 className="text-3xl font-bold mb-8 mt-4 gradient-text" variants={itemVariants}>
            Dashboard
          </motion.h1>
          
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="wallet" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2">
                <TabsTrigger value="wallet" className="text-sm">Wallet Analysis</TabsTrigger>
                <TabsTrigger value="movers" className="text-sm">Market Movers</TabsTrigger>
                <TabsTrigger value="tokens" className="text-sm">Trending Tokens</TabsTrigger>
                <TabsTrigger value="sentiment" className="text-sm">Market Sentiment</TabsTrigger>
                <TabsTrigger value="launches" className="text-sm">Launch Metrics</TabsTrigger>
                <TabsTrigger value="twitter" className="text-sm">Twitter News</TabsTrigger>
              </TabsList>
              
              <TabsContent value="wallet" className="space-y-6">
                <motion.div initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.3
              }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <WalletAnalyzer />
                  </div>
                  <div>
                    <ChatInterface />
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="movers" className="space-y-6">
                <motion.div initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.3
              }}>
                  <MarketMovers />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="tokens" className="space-y-6">
                <motion.div initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.3
              }}>
                  <TrendingTokens />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="sentiment" className="space-y-6">
                <motion.div initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.3
              }}>
                  <SentimentChart />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="launches" className="space-y-6">
                <motion.div initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.3
              }}>
                  <LaunchMetrics />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="twitter" className="space-y-6">
                <motion.div initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.3
              }}>
                  <TwitterTracking />
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </motion.div>;
};
export default Dashboard;