
import React, { useEffect, useRef } from 'react';

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  gradientClass: string;
  delay?: number;
}> = ({ title, description, icon, gradientClass, delay = 0 }) => {
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
    <div ref={cardRef} className="reveal glass-card tilt-card p-6">
      <div className="mb-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${gradientClass}`}>
          {icon}
        </div>
      </div>
      <h3 className={`text-xl font-bold mb-3 ${gradientClass}`}>{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

const Features = () => {
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
    <section className="py-24 bg-gradient-to-b from-transparent to-black/50">
      <div className="container mx-auto px-4">
        <div ref={sectionRef} className="reveal text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">What We Do</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Memetric.ai uses advanced AI to analyze wallet behavior and market trends,
            helping you make smarter decisions in the chaotic world of memecoins.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Wallet Behavior Analysis"
            description="Dive deep into your trading patterns and discover your strengths and weaknesses to optimize your strategy."
            icon="🔍"
            gradientClass="gradient-text"
            delay={0}
          />
          <FeatureCard
            title="Market Sentiment Tracker"
            description="Stay ahead of the curve with real-time analysis of meme token market sentiment and mood shifts."
            icon="📊"
            gradientClass="gradient-text-pink-orange"
            delay={200}
          />
          <FeatureCard
            title="Real-time Token Trend Explorer"
            description="Spot emerging trends before they go viral with our AI-powered social media and blockchain analytics."
            icon="🚀"
            gradientClass="gradient-text-green-cyan"
            delay={400}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
