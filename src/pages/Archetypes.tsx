
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TraderArchetypes from '@/components/TraderArchetypes';

const Archetypes = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Trader Archetypes</h1>
          <TraderArchetypes />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Archetypes;
