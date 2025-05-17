
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-black/50 to-transparent relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-screen filter blur-xl"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                i % 2 === 0
                  ? 'rgba(139, 92, 246, 0.15)'
                  : 'rgba(236, 72, 153, 0.15)'
              } 0%, transparent 70%)`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div ref={sectionRef} className="reveal glass-card p-8 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text-pink-orange">
            Ready to Know Your Inner Trader?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Connect your wallet to discover your trading personality, optimize your strategy,
            and get real-time insights into the meme token market.
          </p>
          
          <Link to="/dashboard">
            <Button 
              size="lg"
              className="text-lg px-10 py-7 h-auto bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
            >
              Connect Wallet <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
