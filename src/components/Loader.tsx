import { useState, useEffect } from 'react';

interface LoaderProps {
  message?: string;
}

const Loader = ({ message = "Processing your request..." }: LoaderProps) => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-xl max-w-md w-full animate-scale-in">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-t-2 border-purple-500/60 animate-spin" style={{ animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {message}
          </h3>
          <p className="text-sm text-gray-500">
            This may take a few minutes{dots}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;