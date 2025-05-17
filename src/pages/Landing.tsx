
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import TraderArchetypes from '@/components/TraderArchetypes';
import MarketInsights from '@/components/MarketInsights';
import DemoPreview from '@/components/DemoPreview';
import CTA from '@/components/CTA';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Landing = () => {
  // ScrollReveal effect
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add('active');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="bg-black text-white min-h-screen overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <TraderArchetypes />
        <MarketInsights />
        <DemoPreview />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
