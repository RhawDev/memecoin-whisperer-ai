import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ParticlesBackground from './ParticlesBackground';
const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    }, {
      threshold: 0.1
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  return <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <ParticlesBackground />
      
      <div className="container mx-auto px-4 z-10">
        <div ref={sectionRef} className="reveal max-w-4xl mx-auto text-center">
          <h1 className="<h1 class=\"text-4xl font-bold mb-6 md:text-8xl bg-[linear-gradient(90deg,_blue,_orange,_yellow,_white)] bg-clip-text text-transparent\"> Know Thy Memecoin Self </h1> text-8xl px-[11px] py-0 my-[10px] mx-px">Be the Alpha
Not Exit Liquidity</h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8"> Know your trading patterns. Track the meme market. Win more.</p>
          
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-16">
            <Link to="/dashboard">
              <Button className="<button class=\"rounded-2xl px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold hover:scale-105 transition duration-300\">\n  Analyze My Wallet\n</button>">
                Analyze My Wallet <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/archetypes">
              <Button variant="outline" className="<button class=\"rounded-2xl px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 font-bold hover:scale-105 transition duration-300\"> Analyze My Wallet </button> bg-zinc-50 text-slate-950">
                Explore Trader Archetypes
              </Button>
            </Link>
          </div>
          
          <div className="glass-card p-6 max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold gradient-text-pink-orange">The Strategist</h3>
                <p className="text-sm text-gray-400">Example Trader Profile</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white text-2xl">
                🧠
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-sm text-gray-300">
                  <span className="text-white font-medium">Trading Style:</span> Calculated moves, 
                  carefully planned entries and exits. Prefers fundamentally strong projects with meme potential.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-sm text-gray-300">
                  <span className="text-white font-medium">Strengths:</span> Patience, research-oriented, 
                  disciplined risk management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;