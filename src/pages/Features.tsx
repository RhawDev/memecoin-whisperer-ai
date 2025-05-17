
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Features from '@/components/Features';

const FeaturesPage = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Features</h1>
          <Features />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
