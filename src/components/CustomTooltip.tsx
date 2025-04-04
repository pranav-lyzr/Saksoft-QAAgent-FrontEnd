import { useState, ReactNode } from 'react';

interface CustomTooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

const CustomTooltip = ({ children, content, side = 'top', className = '' }: CustomTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionStyles = () => {
    switch (side) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute w-100 z-50 px-3 py-1.5 bg-white border rounded-md shadow-md text-sm text-gray-800 ${getPositionStyles()} ${className}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;
