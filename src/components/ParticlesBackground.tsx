
import React, { useEffect, useRef } from 'react';

const ParticlesBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Clear any existing particles
    container.innerHTML = '';
    
    // Create particles
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 6 + 2;
      const particle = document.createElement('div');
      
      particle.className = 'particle';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random positions
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random animations
      const animationDuration = Math.random() * 50 + 20;
      const animationDelay = Math.random() * 10;
      
      particle.style.animation = `particles ${animationDuration}s ease-in-out ${animationDelay}s infinite`;
      
      // Random blur and opacity
      particle.style.filter = `blur(${Math.random() * 2}px)`;
      particle.style.opacity = `${Math.random() * 0.3 + 0.1}`;
      
      container.appendChild(particle);
    }
  }, []);

  return <div ref={containerRef} className="particles-container" />;
};

export default ParticlesBackground;
