
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Dashboard from './Dashboard';
import Features from './Features';
import Archetypes from './Archetypes';
import Market from './Market';
import NotFound from './NotFound';

const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/features" element={<Features />} />
      <Route path="/archetypes" element={<Archetypes />} />
      <Route path="/market" element={<Market />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Index;
