
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-md flex items-center gap-3">
      <AlertCircle className="h-5 w-5 text-red-400" />
      <p className="text-red-300">{error}</p>
    </div>
  );
};

export default ErrorDisplay;
