
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DemoPreview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      }, 
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    if (animationRef.current) {
      observer.observe(animationRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      if (animationRef.current) {
        observer.unobserve(animationRef.current);
      }
    };
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-transparent to-black/50">
      <div className="container mx-auto px-4">
        <div ref={sectionRef} className="reveal text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text-yellow-red">
            See Memetric.ai in Action
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience how our AI analyzes wallet behavior and provides actionable insights to improve your trading.
          </p>
        </div>
        
        <div ref={animationRef} className="reveal glass-card p-6 max-w-4xl mx-auto mb-12">
          <div className="rounded-lg overflow-hidden border border-white/10">
            <div className="bg-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm text-gray-300">Wallet Analysis Demo</span>
              </div>
              <div className="text-gray-400 text-xs">memetric.ai</div>
            </div>
            
            <div className="bg-black/80 p-4 md:p-8">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
                <div className="flex-1">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
                    <p className="text-gray-400 text-sm">Wallet Address</p>
                    <p className="text-gray-200 font-mono text-sm truncate">8xFE...a92F</p>
                  </div>
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                    <div className="h-4 bg-white/10 rounded w-5/6"></div>
                  </div>
                </div>
                
                <div className="flex-1 glass-card overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mb-4 animate-pulse flex items-center justify-center">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <p className="text-white text-lg mb-1">Analyzing wallet...</p>
                      <p className="text-gray-400 text-sm">This usually takes a few seconds</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="animate-pulse space-x-1 flex">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/dashboard">
            <Button 
              className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
            >
              Try It Yourself
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DemoPreview;
