import React, { useRef, useEffect } from 'react';

interface NotionPageDialogProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotionPageDialog = ({ 
  trigger, 
  title, 
  description, 
  children, 
  open,
  onOpenChange
}: NotionPageDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle click outside dialog to close
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node) && open) {
        onOpenChange(false);
      }
    };

    // Handle escape key press to close dialog
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  // Prevent scrolling of the body when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div>
      {/* Custom trigger */}
      <div onClick={() => onOpenChange(true)}>
        {trigger}
      </div>

      {/* Dialog overlay and content */}
      {open && (
        <div className="fixed inset-0 bg-white-200 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div 
            ref={dialogRef}
            className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button 
                onClick={() => onOpenChange(false)}
                className="h-6 w-6 inline-flex items-center justify-center rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                aria-label="Close"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" 
                  fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>

            {/* Dialog header */}
            <div className="px-6">
              <h2 id="dialog-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
              {description && (
                <p className="mt-2 text-sm text-gray-500 ">
                  {description}
                </p>
              )}
            </div>

            {/* Dialog content */}
            <div className="px-6 py-4 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotionPageDialog;