
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WalletAnalyzer from '@/components/WalletAnalyzer';

const Dashboard = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <WalletAnalyzer />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
