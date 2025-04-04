import { useState, ReactNode, useRef, useEffect } from 'react';

interface CustomPopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

const CustomPopover = ({ trigger, content, align = 'center', side = 'bottom', className = '' }: CustomPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getPositionStyles = () => {
    const baseStyles = 'absolute z-50';
    
    let positionStyles = '';
    if (side === 'top') positionStyles += ' bottom-full mb-2';
    if (side === 'right') positionStyles += ' left-full ml-2';
    if (side === 'bottom') positionStyles += ' top-full mt-2';
    if (side === 'left') positionStyles += ' right-full mr-2';
    
    if (align === 'start') positionStyles += ' left-0';
    if (align === 'center') {
      if (side === 'top' || side === 'bottom') positionStyles += ' left-1/2 transform -translate-x-1/2';
      if (side === 'left' || side === 'right') positionStyles += ' top-1/2 transform -translate-y-1/2';
    }
    if (align === 'end') positionStyles += ' right-0';
    
    return `${baseStyles} ${positionStyles}`;
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={toggle} className="inline-block cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`${getPositionStyles()} w-72 p-4 bg-white border rounded-md shadow-md text-gray-800 ${className}`}>
          {content}
        </div>
      )}
    </div>
  );
};

export default CustomPopover;
