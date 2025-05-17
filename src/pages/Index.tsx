
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Dashboard from './Dashboard';
import NotFound from './NotFound';

const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Index;
