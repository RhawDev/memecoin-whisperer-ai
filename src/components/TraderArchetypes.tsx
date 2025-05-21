
import React, { useEffect, useRef } from 'react';

type ArchetypeProps = {
  name: string;
  emoji: string;
  description: string;
  traits: string[];
  gradientClass: string;
  strengths: string;
  weaknesses: string;
  copyTradingRating?: string;
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
  copyTradingRating,
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
          {copyTradingRating && (
            <div>
              <h4 className="text-white text-sm font-medium mb-1">COPY TRADING</h4>
              <p className="text-gray-400 text-sm">{copyTradingRating}</p>
            </div>
          )}
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
      copyTradingRating: "High - Consistent returns with methodical approach make them reliable for copy trading.",
      gradientClass: "gradient-text"
    },
    {
      name: "The Sniper",
      emoji: "🎯",
      description: "Quick and decisive. Targets specific opportunities and executes with precision.",
      traits: ["Fast", "Decisive", "Focused"],
      strengths: "Excellent at capitalizing on short-term opportunities and timing market momentum.",
      weaknesses: "Can sometimes be too trigger-happy, buying without sufficient research.",
      copyTradingRating: "Medium - Good for quick gains, but requires active monitoring due to rapid trades.",
      gradientClass: "gradient-text-pink-orange"
    },
    {
      name: "The Diamond Hand",
      emoji: "💎",
      description: "The ultimate HODLer. Strong conviction in assets, unfazed by volatility and temporary dips.",
      traits: ["Patient", "Conviction", "Long-term"],
      strengths: "Able to weather market storms and benefit from long-term growth trends.",
      weaknesses: "May miss profit-taking opportunities, sometimes holding declining assets too long.",
      copyTradingRating: "Medium-High - Stable long-term gains, but requires patience during downturns.",
      gradientClass: "gradient-text-blue-purple"
    },
    {
      name: "The Degen",
      emoji: "🔥",
      description: "Lives for the thrill. Embraces high risk for potential astronomical returns.",
      traits: ["Risk-taker", "Momentum-chaser", "Community-focused"],
      strengths: "Not afraid to take big positions on early projects with huge potential.",
      weaknesses: "Often overleveraged and prone to emotional decisions during volatility.",
      copyTradingRating: "Low - High risk with extreme volatility makes copy trading unpredictable.",
      gradientClass: "gradient-text-yellow-red"
    },
    {
      name: "The Oracle",
      emoji: "🔮",
      description: "Visionary who spots trends before they become mainstream. Thinks long-term.",
      traits: ["Visionary", "Trendsetter", "Patient"],
      strengths: "Ability to see the bigger picture and invest early in future winners.",
      weaknesses: "Sometimes too early to market, leading to opportunity cost while waiting.",
      copyTradingRating: "High - Excellent at identifying early trends, but returns may take time to materialize.",
      gradientClass: "gradient-text-green-cyan"
    },
    {
      name: "The Newcomer",
      emoji: "🔎",
      description: "Fresh to the scene with fresh perspective. Still learning the ropes of crypto trading.",
      traits: ["Curious", "Adaptable", "Learning"],
      strengths: "Open to new strategies, no emotional baggage from past trades, eagerness to learn.",
      weaknesses: "Limited trading history, still developing risk management skills, uncertain position sizing.",
      copyTradingRating: "Low - Insufficient track record to evaluate consistency or strategy effectiveness.",
      gradientClass: "gradient-text-purple-blue"
    },
    {
      name: "The Observer",
      emoji: "👀",
      description: "Cautious and thoughtful. Takes time to research and understand before committing.",
      traits: ["Methodical", "Cautious", "Detail-oriented"],
      strengths: "Careful approach to investments, thorough research, avoids impulsive decisions.",
      weaknesses: "May miss opportunities due to hesitation, limited exposure to market patterns.",
      copyTradingRating: "Medium - Safe approach with moderate returns, but may miss some opportunities.",
      gradientClass: "gradient-text-cyan-blue"
    },
    {
      name: "The Swing Trader",
      emoji: "🌊",
      description: "Rides market waves with precision. Capitalizes on medium-term market movements.",
      traits: ["Technical", "Responsive", "Balanced"],
      strengths: "Excellent at identifying entry and exit points, balances risk and reward effectively.",
      weaknesses: "Requires active market monitoring, may struggle in choppy market conditions.",
      copyTradingRating: "High - Good balance of risk and reward with consistent trading patterns.",
      gradientClass: "gradient-text-blue-green"
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              copyTradingRating={archetype.copyTradingRating}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TraderArchetypes;
