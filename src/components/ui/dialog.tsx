import React from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <div className={`dialog ${open ? 'open' : 'closed'}`}>
      {/* Example of how to use onOpenChange */}
      <button onClick={() => onOpenChange(!open)}>Toggle Dialog</button>
      {children}
    </div>
  );
};

export const DialogContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="dialog-content">{children}</div>;
};

export const DialogDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <p className="dialog-description">{children}</p>;
};

export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="dialog-header">{children}</div>;
};

export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <h2 className="dialog-title">{children}</h2>;
};

export const DialogTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ children }) => {
  return <div className="dialog-trigger">{children}</div>;
}; 