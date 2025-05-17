
import React, { useEffect, useRef } from 'react';

type ArchetypeProps = {
  name: string;
  emoji: string;
  description: string;
  traits: string[];
  gradientClass: string;
  strengths: string;
  weaknesses: string;
  delay?: number;
};

const ArchetypeCard: React.FC<ArchetypeProps> = ({
  name,
  emoji,
  description,
  traits,
  gradientClass,
  strengths,
  weaknesses,
  delay = 0
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('active');
          }, delay);
        }
      }, 
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div ref={cardRef} className="reveal glass-card tilt-card">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-bold ${gradientClass}`}>{name}</h3>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
            {emoji}
          </div>
        </div>
        <p className="mt-2 text-gray-400">{description}</p>
      </div>
      
      <div className="p-6">
        <h4 className="text-white text-sm font-medium mb-2">KEY TRAITS</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {traits.map((trait, index) => (
            <span 
              key={index}
              className="inline-block px-3 py-1 rounded-full bg-white/10 text-sm text-gray-300"
            >
              {trait}
            </span>
          ))}
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-white text-sm font-medium mb-1">STRENGTHS</h4>
            <p className="text-gray-400 text-sm">{strengths}</p>
          </div>
          <div>
            <h4 className="text-white text-sm font-medium mb-1">WEAKNESSES</h4>
            <p className="text-gray-400 text-sm">{weaknesses}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TraderArchetypes = () => {
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

  const archetypes = [
    {
      name: "The Strategist",
      emoji: "🧠",
      description: "Calculated, research-driven, and methodical in approach. Values fundamentals even in memecoins.",
      traits: ["Patient", "Analytical", "Risk-aware"],
      strengths: "Makes informed decisions based on deep research and timing. Rarely FOMO buys.",
      weaknesses: "Sometimes misses explosive opportunities due to over-analysis.",
      gradientClass: "gradient-text"
    },
    {
      name: "The Sniper",
      emoji: "🎯",
      description: "Quick and decisive. Targets specific opportunities and executes with precision.",
      traits: ["Fast", "Decisive", "Focused"],
      strengths: "Excellent at capitalizing on short-term opportunities and timing market momentum.",
      weaknesses: "Can sometimes be too trigger-happy, buying without sufficient research.",
      gradientClass: "gradient-text-pink-orange"
    },
    {
      name: "The Degen",
      emoji: "🔥",
      description: "Lives for the thrill. Embraces high risk for potential astronomical returns.",
      traits: ["Risk-taker", "Momentum-chaser", "Community-focused"],
      strengths: "Not afraid to take big positions on early projects with huge potential.",
      weaknesses: "Often overleveraged and prone to emotional decisions during volatility.",
      gradientClass: "gradient-text-yellow-red"
    },
    {
      name: "The Oracle",
      emoji: "🔮",
      description: "Visionary who spots trends before they become mainstream. Thinks long-term.",
      traits: ["Visionary", "Trendsetter", "Patient"],
      strengths: "Ability to see the bigger picture and invest early in future winners.",
      weaknesses: "Sometimes too early to market, leading to opportunity cost while waiting.",
      gradientClass: "gradient-text-green-cyan"
    }
  ];

  return (
    <section id="archetypes" className="py-24 bg-gradient-to-b from-black/50 to-transparent">
      <div className="container mx-auto px-4">
        <div ref={sectionRef} className="reveal text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text-pink-orange">
            Trader Archetypes
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover which trading personality matches your behavior and learn how to leverage your strengths.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {archetypes.map((archetype, index) => (
            <ArchetypeCard
              key={index}
              name={archetype.name}
              emoji={archetype.emoji}
              description={archetype.description}
              traits={archetype.traits}
              gradientClass={archetype.gradientClass}
              strengths={archetype.strengths}
              weaknesses={archetype.weaknesses}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TraderArchetypes;
