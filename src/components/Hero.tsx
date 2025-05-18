import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ParticlesBackground from './ParticlesBackground';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const handleLaunchApp = async () => {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // If authenticated, go to dashboard
      navigate('/dashboard');
    } else {
      // If not authenticated, go to auth page
      navigate('/auth');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <ParticlesBackground />
      
      <div className="container mx-auto px-4 z-10">
        <div ref={sectionRef} className="reveal max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 md:text-8xl bg-[linear-gradient(90deg,_blue,_orange,_yellow,_white)] bg-clip-text text-transparent px-[11px] py-0 my-[10px] mx-px">
            Be the Alpha<br />
            Not Exit Liquidity
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Know your trading patterns. Track the meme market. Win more.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-16">
            <Button className="rounded-2xl px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold hover:scale-105 transition duration-300" onClick={handleLaunchApp}>
              Analyze My Wallet <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link to="/archetypes">
              <Button variant="outline" className="rounded-2xl px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 font-bold hover:scale-105 transition duration-300 bg-zinc-50 text-slate-50">
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
    </section>
  );
};

export default Hero;
