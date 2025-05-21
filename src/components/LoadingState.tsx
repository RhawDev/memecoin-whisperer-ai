
import React from 'react';
import { Spinner } from '@/components/ui/spinner';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="text-center">
        <Spinner className="mx-auto mb-4" />
        <p className="text-gray-400">Fetching token details...</p>
      </div>
    </div>
  );
};

export default LoadingState;
